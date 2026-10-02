import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// NOTE: this comment previously asserted createBrowserClient stores the
// session in cookies, while supabase-server.ts's getSupabaseFromRequest()
// asserted the opposite (localStorage) in its own comment — the two directly
// contradicted each other. Left un-asserted here rather than guessing which
// was right: this codebase actually has THREE different session-storage
// paths that all coexist — (1) whatever @supabase/auth-helpers-nextjs's
// createBrowserClient does by default, (2) custom `sb-access-token` /
// `sb-refresh-token` cookies set manually by app/api/auth/signin and
// app/api/auth/set-session (a different cookie shape than what
// createServerClient's own cookie adapter expects to read), and (3) the
// Bearer-header fallback in getSupabaseFromRequest(). Whether (2) is
// actually readable by getSupabaseServer() hasn't been verified — trace it
// live (log what cookies.getAll() sees after a real sign-in) before
// changing any of this, since auth session handling here is fragile (see
// the recent git history of transient-lock-error and dynamic-import fixes
// in AuthProvider.tsx) and worth confirming empirically rather than by
// reading the source alone.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null;
