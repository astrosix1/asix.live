'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatExpirationDate, isExpired, isExpiringSoon } from '@/lib/dashboard';

export interface AppCardProps {
  appName: string;
  appSlug: string;
  appIcon?: string;
  appColor?: string;
  plan: string;
  expiresAt: string | null;
  appUrl: string;
}

// Per-product accent tokens for the dashboard cards
const SLUG_THEME: Record<string, { topBorder: string; iconBg: string; btnClass: string }> = {
  ascend: {
    topBorder: 'border-t-2 border-t-amber-500',
    iconBg: 'bg-amber-900/40',
    btnClass: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  geointel: {
    topBorder: 'border-t-2 border-t-teal-500',
    iconBg: 'bg-teal-900/40',
    btnClass: 'bg-teal-600 hover:bg-teal-700 text-white',
  },
};

const DEFAULT_THEME = {
  topBorder: 'border-t-2 border-t-blue-500',
  iconBg: 'bg-blue-900/40',
  btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
};

export function AppCard({
  appName,
  appSlug,
  appIcon,
  plan,
  expiresAt,
  appUrl,
}: AppCardProps) {
  const [launchUrl, setLaunchUrl] = useState(appUrl);
  const [isLoading, setIsLoading] = useState(true);
  const theme = SLUG_THEME[appSlug] ?? DEFAULT_THEME;

  useEffect(() => {
    const buildLaunchUrl = async () => {
      if (!supabase) { setIsLoading(false); return; }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token && session?.refresh_token) {
          const hash =
            `#access_token=${encodeURIComponent(session.access_token)}` +
            `&refresh_token=${encodeURIComponent(session.refresh_token)}`;
          setLaunchUrl(`${appUrl}${hash}`);
        }
      } catch {
        // Leave as plain URL
      } finally {
        setIsLoading(false);
      }
    };
    buildLaunchUrl();
  }, [appUrl]);

  const expired = isExpired(expiresAt);
  const expiringSoon = isExpiringSoon(expiresAt);

  // Status indicator
  const statusDot = expired
    ? 'bg-red-500'
    : expiringSoon
    ? 'bg-amber-400'
    : 'bg-green-500';

  const statusLabel = expired ? 'Expired' : expiringSoon ? 'Expiring soon' : 'Active';
  const statusText = expired ? 'text-red-400' : expiringSoon ? 'text-amber-400' : 'text-green-400';

  return (
    <div className={`bg-[#1E293B] rounded-xl border border-slate-700/60 ${theme.topBorder} flex flex-col overflow-hidden hover:border-slate-600 transition-colors duration-200`}>
      <div className="p-6 flex-1 flex flex-col">
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-xl ${theme.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}>
            {appIcon || '📦'}
          </div>
          {/* Status badge */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${statusDot} flex-shrink-0`} />
            <span className={`text-xs font-semibold ${statusText}`}>{statusLabel}</span>
          </div>
        </div>

        {/* App name + plan */}
        <h3 className="text-lg font-bold text-white mb-1">{appName}</h3>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">{plan} plan</span>

        {/* Expiry */}
        <p className={`text-sm font-medium flex items-center gap-1.5 mt-auto ${
          expired ? 'text-red-400' : expiringSoon ? 'text-amber-400' : 'text-slate-400'
        }`}>
          {(expired || expiringSoon) && <AlertTriangle size={13} className="flex-shrink-0" />}
          {formatExpirationDate(expiresAt)}
        </p>
      </div>

      {/* Launch button */}
      <div className="px-6 pb-6">
        {expired ? (
          <a
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm"
          >
            <RefreshCw size={15} />
            Renew Subscription
          </a>
        ) : (
          <a
            href={launchUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={isLoading}
            onClick={(e) => { if (isLoading) e.preventDefault(); }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-colors text-sm ${theme.btnClass} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            Launch {appName}
            <ArrowRight size={15} />
          </a>
        )}
      </div>
    </div>
  );
}
