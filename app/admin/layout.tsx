import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase-server';

// Server-only var (no NEXT_PUBLIC_ prefix): this is read only in a Server
// Component/API routes, so there's no reason to ship the admin allowlist to
// every visitor's JS bundle.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/admin');

  const email = (user.email ?? '').toLowerCase();
  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(email)) redirect('/');

  return <>{children}</>;
}
