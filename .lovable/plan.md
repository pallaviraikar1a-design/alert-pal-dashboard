
The app is currently frontend-only (localStorage via `src/lib/store.ts`). Lovable Cloud is still attached to the project (Supabase Postgres + Auth + 5 tables already exist: `profiles`, `user_roles`, `categories`, `suppliers`, `products`, `batches`, plus `handle_new_user` trigger and `has_role` function).

Easiest path: re-wire the app to use the existing Lovable Cloud backend instead of the local store. No new infra needed.

## Plan

**1. Auth**
- Create `src/hooks/useAuth.tsx` — session + `onAuthStateChange` listener.
- Create `src/pages/Auth.tsx` — sign up / sign in (email + password). Email verification stays enforced (already configured).
- Add `/auth` route in `App.tsx`.
- Guard `/app/*` routes in `AppLayout.tsx` — redirect to `/auth` if not signed in.

**2. Data layer**
- Replace `src/lib/store.ts` with React Query hooks that call `supabase.from(...)` for: categories, suppliers, products, batches, profile.
- All queries scoped by `auth.uid()` via existing RLS.

**3. Refactor pages**
- `Dashboard.tsx`, `Inventory.tsx`, `Alerts.tsx`, `Categories.tsx`, `Suppliers.tsx`, `Settings.tsx` — swap `useStore` calls for the new query hooks. Use mutations + `queryClient.invalidateQueries` for add/delete.

**4. Settings**
- Load/save profile from `profiles` table (already auto-created on signup by `handle_new_user` trigger).
- Add "Sign out" button.
- Remove "Reset demo data" (not applicable to real DB).

**5. Navbar**
- Show "Sign in" when logged out, "Dashboard" + "Sign out" when logged in.

## Notes
- All 6 tables and RLS policies already exist — no migration needed.
- Email verification + HIBP password check already enabled.
- Demo seed data (Dairy/Bakery/Produce, sample products) will NOT auto-populate for new users — they start with an empty inventory. I can optionally seed a few demo rows on first login if you want.
