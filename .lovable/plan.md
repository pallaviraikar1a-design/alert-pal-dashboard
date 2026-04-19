
The user wants to replace Lovable Cloud (Supabase Postgres + Auth + RLS) with MySQL. I need to be honest about what's actually feasible here.

## The hard truth

Lovable projects are **client-side React apps** running in the browser. There's no persistent server in this sandbox to host MySQL or a Node/Express API. MySQL also can't be queried directly from a browser — it needs a backend in front of it.

The Lovable Cloud backend currently powers:
- Authentication (signup/login/sessions)
- 6 tables: `profiles`, `user_roles`, `categories`, `suppliers`, `products`, `batches`
- Row-Level Security (per-user data isolation)
- Auto profile creation trigger on signup

Replacing this with MySQL requires a backend server that Lovable cannot host.

## Your realistic options

**Option A — Keep Lovable Cloud (recommended)**
It already gives you a managed Postgres database, auth, and RLS for free with zero ops. MySQL wouldn't add functionality, only complexity.

**Option B — You host MySQL + a Node/Express API yourself**
- You run MySQL somewhere (PlanetScale, Railway, AWS RDS, your own server)
- You build & deploy a REST API (Node/Express, with JWT auth, bcrypt, mysql2 driver) that mirrors the 6 tables
- I refactor the Lovable app to call your API instead of Supabase
- You manage hosting, scaling, backups, security patches, SSL certs

**Option C — Export schema only**
I generate MySQL `CREATE TABLE` + seed SQL scripts so you can stand up the schema elsewhere. The Lovable app keeps using Lovable Cloud.

## What I'd build for Option B

1. **MySQL schema file** (`mysql/schema.sql`) — converts the 6 Postgres tables (uuid → CHAR(36), enums → ENUM, RLS → enforced in API layer).
2. **Express API skeleton** (`server/`) — routes for auth (`/auth/signup`, `/auth/login`), and CRUD for each resource, with JWT middleware that scopes every query by `user_id`.
3. **Frontend refactor** — replace `supabase.from(...)` calls in `Dashboard.tsx`, `Inventory.tsx`, `Alerts.tsx`, `Categories.tsx`, `Suppliers.tsx`, `Settings.tsx`, `Auth.tsx`, and `useAuth.tsx` with `fetch('/api/...')` calls to your API. Replace Supabase session with JWT in localStorage.
4. **Config** — `VITE_API_URL` env var pointing to wherever you deploy the API.
5. **README** with deploy instructions for the API + MySQL.

**You still need to**: provision MySQL, deploy the Express API somewhere (Render, Railway, Fly.io, VPS), and set `VITE_API_URL`.

## Trade-offs vs Lovable Cloud

| | Lovable Cloud | MySQL + custom API |
|---|---|---|
| Setup | Already done | You provision + deploy |
| Auth | Built-in | You maintain JWT/bcrypt code |
| Per-user isolation | RLS in DB | Enforced in API code (bug-prone) |
| Realtime | Built-in | You'd add WebSockets |
| Cost | Included | Hosting fees |
| Ops | Zero | Yours |

## Pick one to proceed

Tell me which path:
- **A** — Stay on Lovable Cloud (no changes)
- **B** — Generate MySQL schema + Express API + refactor frontend (you host)
- **C** — Just export MySQL schema files
