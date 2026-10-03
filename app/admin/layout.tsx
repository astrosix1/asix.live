import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase-server';

// Server-only var (no NEXT_PUBLIC_ prefix): this is read only in a Server
// Component/API routes, so there's no reason to ship the admin allowlist to
// every visitor's JS bundle. Falls back to the old NEXT_PUBLIC_ name so a
// deploy made before the variable is renamed doesn't lock the admin out; drop
// the fallback once ADMIN_EMAILS is set everywhere.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/admin');

  const email = (user.email ?? '').toLowerCase();
  // Fail closed: an empty/missing allowlist admits nobody (it used to admit everyone).
  if (!ADMIN_EMAILS.includes(email)) redirect('/');

  return <>{children}</>;
}
