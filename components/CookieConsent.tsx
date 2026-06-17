'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'asix-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E293B] border-t border-slate-700 px-4 py-4 sm:py-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <p className="text-slate-300 text-sm flex-1">
          We use essential cookies for authentication and secure payments. No tracking or advertising
          cookies are used.{' '}
          <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline">
            Privacy Policy
          </Link>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={accept}
            className="rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
