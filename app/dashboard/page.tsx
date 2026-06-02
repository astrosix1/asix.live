'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, LogOut, Package } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { AppCard } from '@/components/dashboard/AppCard';
import { SubscriptionManager } from '@/components/dashboard/SubscriptionManager';
import { signOut } from '@/lib/auth';

interface DashboardSubscription {
  id: string;
  projectSlug: string;
  projectName: string;
  appIcon?: string;
  appColor?: string;
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
  externalUrl: string | null;
}

// Available products — used to build the Explore section
const ALL_PRODUCTS = [
  { slug: 'ascend',   name: 'Ascend',   icon: '⚡', tagline: 'Replace addictions with hobbies', accent: 'text-amber-400', border: 'hover:border-amber-800/60' },
  { slug: 'geointel', name: 'GeoIntel', icon: '🌍', tagline: 'Live world events on a 3D globe',  accent: 'text-teal-400',   border: 'hover:border-teal-800/60'   },
  { slug: 'wikihole', name: 'WikiHole', icon: '🕳️', tagline: 'The rabbit hole that sticks',      accent: 'text-orange-400', border: 'hover:border-orange-800/60' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Welcome back';
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<DashboardSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) redirect('/login?redirect=/dashboard');
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    const fetch_ = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/dashboard/subscriptions');
        if (!res.ok) throw new Error('Failed to fetch subscriptions');
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
      } catch {
        setError('Failed to load subscriptions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch_();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // signOut failure is non-fatal — proceed with redirect regardless
    }
    redirect('/');
  };

  if (loading || (!user && !loading)) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const activeSubscriptions  = subscriptions.filter((s) => s.status === 'active');
  const subscribedSlugs      = new Set(subscriptions.map((s) => s.projectSlug));
  const exploreProducts      = ALL_PRODUCTS.filter((p) => !subscribedSlugs.has(p.slug));
  const displayName          = user.user_metadata?.first_name || user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#0F172A]">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#111827] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{getGreeting()}</p>
              <h1 className="text-3xl font-bold text-white">{displayName}</h1>
              <p className="text-slate-500 text-sm mt-1">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-medium transition-colors flex-shrink-0 mt-1"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-800/60 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ── YOUR APPS ──────────────────────────────────────────────────── */}
        {(isLoading || activeSubscriptions.length > 0) && (
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Your Apps</h2>
              <p className="text-slate-400 text-sm mt-1">Quick access to your subscribed products</p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-[#1E293B] rounded-xl border border-slate-700/60 h-48 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeSubscriptions.map((sub) => (
                  <AppCard
                    key={sub.id}
                    appName={sub.projectName}
                    appSlug={sub.projectSlug}
                    appIcon={sub.appIcon}
                    appColor={sub.appColor}
                    plan={sub.plan}
                    expiresAt={sub.currentPeriodEnd}
                    appUrl={sub.externalUrl || `https://${sub.projectSlug}.asix.live`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── SUBSCRIPTIONS ──────────────────────────────────────────────── */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Subscriptions</h2>
            <p className="text-slate-400 text-sm mt-1">Manage your plans and billing</p>
          </div>
          <SubscriptionManager
            subscriptions={subscriptions.map((s) => ({
              id: s.id,
              plan: s.plan,
              status: s.status,
              projectName: s.projectName,
              projectSlug: s.projectSlug,
              currentPeriodEnd: s.currentPeriodEnd,
            }))}
            isLoading={isLoading}
          />
        </section>

        {/* ── EXPLORE ────────────────────────────────────────────────────── */}
        {!isLoading && exploreProducts.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Explore</h2>
              <p className="text-slate-400 text-sm mt-1">More products from asix.live</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {exploreProducts.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`}>
                  <div className={`bg-[#1E293B] rounded-xl border border-slate-700/60 p-6 flex items-center gap-5 ${p.border} hover:bg-[#243044] transition-all duration-200 cursor-pointer group`}>
                    <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center text-2xl flex-shrink-0">
                      {p.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold ${p.accent}`}>{p.name}</p>
                      <p className="text-slate-400 text-sm truncate">{p.tagline}</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── ACCOUNT ────────────────────────────────────────────────────── */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Account</h2>
            <p className="text-slate-400 text-sm mt-1">Manage your account settings</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/60 divide-y divide-slate-700/60">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-white">Email address</p>
                <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
              </div>
              <Link href="/account/email">
                <button className="text-xs font-semibold px-3 py-1.5 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-colors">
                  Change
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-white">Password</p>
                <p className="text-sm text-slate-400 mt-0.5">••••••••••••</p>
              </div>
              <Link href="/account/password">
                <button className="text-xs font-semibold px-3 py-1.5 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-colors">
                  Change
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-white">Sign out of your account</p>
                <p className="text-sm text-slate-400 mt-0.5">You'll need to sign in again to access your apps</p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs font-semibold px-3 py-1.5 border border-red-900/60 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </section>

        {/* ── EMPTY STATE ────────────────────────────────────────────────── */}
        {!isLoading && subscriptions.length === 0 && (
          <section className="bg-[#1E293B] rounded-xl border border-slate-700/60 p-12 text-center">
            <Package size={40} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No subscriptions yet</h3>
            <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
              Browse our collection of apps and subscribe to get started.
            </p>
            <Link href="/projects">
              <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold hover:border-slate-500 hover:bg-slate-800 transition-colors">
                Browse Products
                <ArrowRight size={16} />
              </button>
            </Link>
          </section>
        )}

      </div>
    </div>
  );
}
