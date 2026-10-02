# Setup guide

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the files in `supabase/migrations/` **in order**
   (`001_...` through `003_...`). This is the canonical schema/RLS history —
   prefer it over `database-setup.sql`, which is a legacy standalone script
   kept only for reference (see the note at its top).
3. Under **Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only — never expose this to the client)
4. Under **Authentication → Providers**, email is enabled by default; enable
   Google OAuth if you want it, with redirect URIs:
   - `https://<your-project>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (local dev)
   - `https://your-domain.com/auth/callback` (production)

## 2. Stripe

1. Create a product + recurring price for each paid app (Ascend, GeoIntel,
   WikiHole/"basic").
2. Add a webhook endpoint pointing at `/api/webhooks/stripe` listening for at
   least: `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `invoice.payment_failed`.
3. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## 3. Resend (optional — contact form + account-deletion email)

Create an API key at [resend.com](https://resend.com). If `RESEND_API_KEY` is
unset, the contact form and account-deletion flow just log instead of
sending email — the app still runs without it.

## 4. Environment variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # server-only, keep secret

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin access — comma-separated emails allowed into /admin and the
# internal blog-publish API. Server-only: do NOT prefix with NEXT_PUBLIC_.
ADMIN_EMAILS=you@example.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_BASIC=price_...     # WikiHole
NEXT_PUBLIC_STRIPE_PRICE_ASCEND=price_...
NEXT_PUBLIC_STRIPE_PRICE_GEOINTEL=price_...

# Resend (optional)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@your-domain.com
ADMIN_EMAIL=you@example.com   # contact-form notification recipient (distinct from ADMIN_EMAILS above)
```

> `NEXT_PUBLIC_*` values are inlined into the client bundle and are not
> secret. Everything else (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
> `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `ADMIN_EMAILS`) must stay
> server-only.

## 5. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Sign up at `/login`, then visit `/admin` with
an account whose email is in `ADMIN_EMAILS` to manage projects and blog
posts.

## 6. Deploy

1. Push to GitHub, import the repo in Vercel.
2. Set the same environment variables in the Vercel project settings
   (production values — a live Stripe webhook secret, production Supabase
   project, etc).
3. Add your production domain in **Settings → Domains**, and update the
   Supabase Auth redirect URL and Stripe webhook endpoint to match it.

## Troubleshooting

- **OAuth not working:** check the redirect URIs configured in Supabase
  match your actual deployment URL.
- **Projects/posts not showing publicly:** confirm `is_published` /
  `published` is `true` on the row — RLS only exposes published rows to
  anonymous readers.
- **Admin panel writes failing:** the `is_admin()` Postgres function (see
  `supabase/migrations/003_restrict_write_access_to_admin.sql`) gates writes
  to `projects`/`blog_posts` by JWT email — make sure the signed-in email is
  in that function's list (kept in sync with `ADMIN_EMAILS` by convention,
  not automatically).
- **Subscriptions not activating after checkout:** check the Stripe webhook
  is configured and reachable, and check `stripe_events` in Supabase for
  logged events.
