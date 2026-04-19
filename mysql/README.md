# MySQL schema export

These files mirror the Lovable Cloud (Postgres) schema for use in MySQL 8.0+.
The Lovable app itself **continues to use Lovable Cloud** — these scripts are
for standing up the same data model in an external MySQL database.

## Files

- `schema.sql` — `CREATE DATABASE` + all tables, indexes, foreign keys.
- `seed.sql`   — optional sample data (one user, 2 categories, 2 products, batches).

## Apply

```bash
mysql -u root -p < mysql/schema.sql
mysql -u root -p < mysql/seed.sql   # optional
```

## Differences vs Lovable Cloud (Postgres)

| Feature              | Postgres (Lovable Cloud) | MySQL export                          |
|----------------------|--------------------------|---------------------------------------|
| UUIDs                | `uuid` + `gen_random_uuid()` | `CHAR(36)` + `DEFAULT (UUID())`   |
| Enum                 | `CREATE TYPE app_role`   | `ENUM('owner','staff')` inline        |
| Auth users           | `auth.users` (managed)   | Custom `users` table (you manage)     |
| Row-Level Security   | `ENABLE ROW LEVEL SECURITY` policies | **Not supported** — enforce in API |
| `updated_at` trigger | PL/pgSQL trigger         | `ON UPDATE CURRENT_TIMESTAMP` column  |
| `has_role()` fn      | SECURITY DEFINER fn      | Plain `SELECT` against `user_roles`   |

## Per-user isolation

MySQL has no RLS. Your API layer **must** scope every query with
`WHERE user_id = ?` using the authenticated user's id from a JWT.
Failing to do so will leak data across tenants.
