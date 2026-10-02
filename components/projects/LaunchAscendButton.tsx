'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function LaunchAscendButton() {
  const [href, setHref] = useState('https://ascend.asix.live');

  useEffect(() => {
    const buildUrl = async () => {
      if (!supabase) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token && session?.refresh_token) {
          // Pass tokens in hash so Ascend can call setSession() directly.
          // Hash is never sent to servers — safe to include tokens here.
          const hash =
            `#access_token=${encodeURIComponent(session.access_token)}` +
            `&refresh_token=${encodeURIComponent(session.refresh_token)}`;
          setHref(`https://ascend.asix.live${hash}`);
        }
      } catch {
        // Leave href as plain ascend.asix.live if session can't be read
      }
    };
    buildUrl();
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-8 py-4 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold text-lg hover:border-slate-500 hover:bg-slate-800 transition-colors"
    >
      Launch Ascend
      <ArrowRight size={20} />
    </a>
  );
}
