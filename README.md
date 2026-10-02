# Asix.live

Personal portfolio and micro-SaaS platform for asix.live: a project gallery and
blog, plus a subscription layer (Supabase Auth + Stripe) that gates access to
three side projects — Ascend, GeoIntel, and WikiHole — each embedded via
iframe on its own `*.asix.live` subdomain.

## Tech stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth + database:** Supabase (Postgres + Auth)
- **Payments:** Stripe (subscriptions)
- **Email:** Resend

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). See [SETUP.md](./SETUP.md)
for environment variables, database setup, and deployment.

## Project structure

| Path | Purpose |
|---|---|
| `app/` | Routes (App Router) — marketing pages, `admin/`, `dashboard/`, `account/`, and `api/` route handlers |
| `components/` | React components, grouped by feature (`blog/`, `dashboard/`, `projects/`, `ui/`, ...) |
| `lib/` | Server/client utilities — Supabase clients, Stripe price mapping, validation, etc. |
| `supabase/migrations/` | The applied database migration history (source of truth for schema/RLS) |
| `database-setup.sql` | Legacy single-file bootstrap script, kept for standalone new setups — see the note at its top |

## Scripts

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm start       # Start production server
npm run lint    # Lint
```

## Notes

- No automated test suite exists yet.
- The RLS policies in `supabase/migrations/` are the actual security boundary
  for `projects`/`blog_posts`/`subscriptions` — the app's own admin-email
  checks only protect the Next.js UI and API routes, not direct calls to the
  Supabase REST API.
