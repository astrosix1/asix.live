'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const GEOINTEL_URL = 'https://geointel.asix.live';

/**
 * Opens GeoIntel. Anyone can launch it — signed-out visitors get the plain URL
 * and use the free tier. Signed-in users get their access token in the URL
 * fragment (GeoIntel picks it up once and strips it) so premium features
 * unlock without a second login. Only the access token is sent: GeoIntel's
 * backend verifies it per request and never needs the refresh token.
 */
export function LaunchGeoIntelButton() {
  const [href, setHref] = useState(GEOINTEL_URL);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    const update = (accessToken: string | null | undefined) => {
      setHref(
        accessToken
          ? `${GEOINTEL_URL}#access_token=${encodeURIComponent(accessToken)}&token_type=bearer`
          : GEOINTEL_URL
      );
    };

    client.auth.getSession()
      .then(({ data: { session } }) => update(session?.access_token))
      .catch(() => {
        // Leave the plain URL if the session can't be read
      });

    // Access tokens are short-lived; keep the link current so a page left open
    // doesn't hand GeoIntel an expired token.
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      update(session?.access_token);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-8 py-4 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold text-lg hover:border-slate-500 hover:bg-slate-800 transition-colors"
    >
      Launch GeoIntel
      <ArrowRight size={20} />
    </a>
  );
}
