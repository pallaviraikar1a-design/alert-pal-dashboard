-- ============================================================================
-- Expiry Manager Pro — MySQL schema export
-- Mirrors the Lovable Cloud (Postgres) schema, adapted for MySQL 8.0+.
--
-- Notes:
--   * uuid       -> CHAR(36) with UUID() default
--   * timestamptz-> TIMESTAMP (UTC; store UTC in app)
--   * enums      -> native MySQL ENUM
--   * RLS        -> NOT supported in MySQL. Enforce per-user isolation
--                   in your API layer by always filtering WHERE user_id = ?
--   * auth.users -> MySQL has no built-in auth. Create your own `users`
--                   table (included below) and manage passwords/JWT in API.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS expiry_manager
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE expiry_manager;

-- ----------------------------------------------------------------------------
-- users  (replaces Supabase auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
  id            CHAR(36)     NOT NULL DEFAULT (UUID()),
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
  id            CHAR(36)  NOT NULL DEFAULT (UUID()),
  user_id       CHAR(36)  NOT NULL,
  display_name  VARCHAR(255) NULL,
  store_name    VARCHAR(255) NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_profiles_user (user_id),
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- user_roles
-- ----------------------------------------------------------------------------
CREATE TABLE user_roles (
  id         CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id    CHAR(36) NOT NULL,
  role       ENUM('owner','staff') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_roles (user_id, role),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
  id         CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id    CHAR(36) NOT NULL,
  name       VARCHAR(255) NOT NULL,
  color      VARCHAR(16)  NOT NULL DEFAULT '#a78bfa',
  warn_days  INT          NOT NULL DEFAULT 7,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_categories_user (user_id),
  CONSTRAINT fk_categories_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- suppliers
-- ----------------------------------------------------------------------------
CREATE TABLE suppliers (
  id            CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id       CHAR(36) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NULL,
  phone         VARCHAR(64)  NULL,
  notes         TEXT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_suppliers_user (user_id),
  CONSTRAINT fk_suppliers_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- products
-- ----------------------------------------------------------------------------
CREATE TABLE products (
  id                  CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id             CHAR(36) NOT NULL,
  name                VARCHAR(255) NOT NULL,
  sku                 VARCHAR(128) NULL,
  category_id         CHAR(36) NULL,
  supplier_id         CHAR(36) NULL,
  unit_price          DECIMAL(12,2) NOT NULL DEFAULT 0,
  low_stock_threshold INT           NOT NULL DEFAULT 5,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_user (user_id),
  KEY idx_products_category (category_id),
  KEY idx_products_supplier (supplier_id),
  CONSTRAINT fk_products_user     FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- batches  (stock lots with expiry dates)
-- ----------------------------------------------------------------------------
CREATE TABLE batches (
  id          CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id     CHAR(36) NOT NULL,
  product_id  CHAR(36) NOT NULL,
  quantity    INT      NOT NULL DEFAULT 0,
  expiry_date DATE     NOT NULL,
  received_at DATE     NOT NULL DEFAULT (CURRENT_DATE),
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_batches_user (user_id),
  KEY idx_batches_product (product_id),
  KEY idx_batches_expiry (expiry_date),
  CONSTRAINT fk_batches_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_batches_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
