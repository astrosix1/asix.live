'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * URL for launching an app on its subdomain. Signed-out visitors get the plain
 * URL (the apps are free to use). Signed-in users get their session in the URL
 * fragment — never sent to a server — so the app recognizes them without a
 * second login. Kept current as the session refreshes, since access tokens are
 * short-lived.
 *
 * `includeRefreshToken`: Ascend and WikiHole install the session with
 * setSession() and need both tokens; GeoIntel verifies the access token per
 * request and needs only that.
 */
export function useLaunchHref(baseUrl: string, includeRefreshToken: boolean): string {
  const [href, setHref] = useState(baseUrl);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    const update = (
      session: { access_token?: string; refresh_token?: string } | null | undefined
    ) => {
      if (!session?.access_token || (includeRefreshToken && !session.refresh_token)) {
        setHref(baseUrl);
        return;
      }
      let fragment = `access_token=${encodeURIComponent(session.access_token)}`;
      fragment += includeRefreshToken
        ? `&refresh_token=${encodeURIComponent(session.refresh_token as string)}`
        : '&token_type=bearer';
      setHref(`${baseUrl}#${fragment}`);
    };

    client.auth.getSession()
      .then(({ data: { session } }) => update(session))
      .catch(() => {
        // Keep the plain URL if the session can't be read
      });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => update(session));
    return () => subscription.unsubscribe();
  }, [baseUrl, includeRefreshToken]);

  return href;
}
