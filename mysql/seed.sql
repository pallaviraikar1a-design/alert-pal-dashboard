-- ============================================================================
-- Sample seed data for Expiry Manager Pro (MySQL)
-- Run AFTER schema.sql.
-- Replace the password_hash below with a real bcrypt hash from your API.
-- ============================================================================
USE expiry_manager;

SET @user_id    = UUID();
SET @cat_dairy  = UUID();
SET @cat_bakery = UUID();
SET @sup_id     = UUID();
SET @prod_milk  = UUID();
SET @prod_bread = UUID();

-- Demo user (password: "password" — replace hash in real use)
INSERT INTO users (id, email, password_hash) VALUES
  (@user_id, 'demo@example.com',
   '$2b$10$abcdefghijklmnopqrstuvCHANGE_ME_BCRYPT_HASH_HERE........');

INSERT INTO profiles (user_id, display_name, store_name) VALUES
  (@user_id, 'Demo Owner', 'Demo Store');

INSERT INTO user_roles (user_id, role) VALUES
  (@user_id, 'owner');

INSERT INTO categories (id, user_id, name, color, warn_days) VALUES
  (@cat_dairy,  @user_id, 'Dairy',  '#60a5fa', 5),
  (@cat_bakery, @user_id, 'Bakery', '#f59e0b', 3);

INSERT INTO suppliers (id, user_id, name, contact_email, phone) VALUES
  (@sup_id, @user_id, 'Local Farms Co.', 'orders@localfarms.test', '+1-555-0100');

INSERT INTO products (id, user_id, name, sku, category_id, supplier_id, unit_price, low_stock_threshold) VALUES
  (@prod_milk,  @user_id, 'Whole Milk 1L', 'MILK-1L', @cat_dairy,  @sup_id, 2.49, 10),
  (@prod_bread, @user_id, 'Sourdough Loaf', 'BRD-SD',  @cat_bakery, @sup_id, 4.99, 6);

INSERT INTO batches (user_id, product_id, quantity, expiry_date, received_at) VALUES
  (@user_id, @prod_milk,  24, DATE_ADD(CURRENT_DATE, INTERVAL 4  DAY), CURRENT_DATE),
  (@user_id, @prod_milk,  12, DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), CURRENT_DATE),
  (@user_id, @prod_bread,  8, DATE_ADD(CURRENT_DATE, INTERVAL 2  DAY), CURRENT_DATE),
  (@user_id, @prod_bread,  3, DATE_SUB(CURRENT_DATE, INTERVAL 1  DAY), CURRENT_DATE);
