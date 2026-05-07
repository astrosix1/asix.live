import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Custom cookie storage that sets domain to .asix.live for cross-subdomain sharing
class CrossDomainCookieStorage {
  getItem(key: string): string | null {
    if (typeof document === 'undefined') return null;
    const name = `${key}=`;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name)) return decodeURIComponent(cookie.substring(name.length));
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (typeof document === 'undefined') return;
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    const domain = window.location.hostname.includes('localhost') ? '' : '.asix.live';
    const domainAttr = domain ? `; domain=${domain}` : '';
    document.cookie = `${key}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/${domainAttr}; samesite=Lax`;
  }

  removeItem(key: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${key}=; max-age=0; path=/`;
  }
}

// Initialize Supabase with auth-helpers for proper cookie handling
// Using custom cookie storage to set .asix.live domain for cross-subdomain sharing
export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: new CrossDomainCookieStorage(),
      },
      db: {
        schema: 'public',
      },
    })
  : null;
