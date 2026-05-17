# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                # start dev server at http://localhost:3000
npm run build              # production build
npm run lint               # ESLint
npm run format             # Prettier (writes files)
npx tsx scripts/seed.ts    # seed admin user (admin/admin) and example categories
```

No test suite exists in this project.

## Environment Variables

Copy `.env.local.example` and fill in the values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (browser-safe publishable key, starts with `sb_publishable_`)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only JWT, never exposed to the client)

Before running the seed script, apply `supabase/schema.sql` in the Supabase SQL Editor.

## Architecture

### Auth

Custom session auth — **not** Supabase Auth. Two parallel state mechanisms must stay in sync:

1. **`gk-auth` HttpOnly cookie** — set by `/api/auth/login`, cleared by `/api/auth/logout`. Read by `src/middleware.ts` to protect `/admin/*` server-side.
2. **`gk-user` localStorage key** — managed by `AuthContext` for client-side UI state via `useAuthContext()`.

Login behavior: entering a name that doesn't exist auto-creates a new user (no password required on first sign-in). Existing users with a `password_hash` must supply the correct password.

### Supabase clients

Two clients defined in `src/lib/supabase.ts`:

- `supabase` — module-level singleton using the publishable key; safe for client components and hooks.
- `createServerClient()` — creates a fresh instance with the service role key; call this only inside API route handlers (`src/app/api/**`).

RLS is **disabled** on all tables. All access control is enforced in API route handlers.

### Data flow

Pages use domain hooks (`useProducts`, `useCategories`, `useOrders`, `useAuth`, `useAdmin`) which call internal API routes, which call Supabase via `createServerClient()`. The exception is `CartContext` — entirely client-side, persisted to `localStorage` under `gk-cart` with no API involvement.

### Excel import

`/api/import` uses SheetJS to parse `.xlsx` files. Required columns: `Name`, `Preis`, `Einheit`. Optional: `Kategorie`, `Verfügbar` (`ja`/`nein`). `Gemüse_KW16.xlsx` in the repo root is a usable template.
