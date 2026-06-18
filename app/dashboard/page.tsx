'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, LogOut, Package, X } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { AppCard } from '@/components/dashboard/AppCard';
import { SubscriptionManager } from '@/components/dashboard/SubscriptionManager';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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

// Admin email list — these users see all products as active regardless of DB subscriptions
const ADMIN_EMAILS = ['collins.nick999@gmail.com'];

// Available products — used to build the Explore section
const ALL_PRODUCTS = [
  { slug: 'ascend',   name: 'Ascend',   icon: '⚡', tagline: 'Replace addictions with hobbies', accent: 'text-amber-400', border: 'hover:border-amber-800/60', externalUrl: 'https://ascend.asix.live/'   },
  { slug: 'geointel', name: 'GeoIntel', icon: '🌍', tagline: 'Live world events on a 3D globe',  accent: 'text-teal-400',   border: 'hover:border-teal-800/60',   externalUrl: 'https://geointel.asix.live/' },
  { slug: 'wikihole', name: 'WikiHole', icon: '🕳️', tagline: 'The rabbit hole that sticks',      accent: 'text-orange-400', border: 'hover:border-orange-800/60', externalUrl: 'https://wikihole.asix.live/' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Welcome back';
}

export default function DashboardPage() {
  const { user, loading, session } = useAuth();
  const [subscriptions, setSubscriptions] = useState<DashboardSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<DashboardSubscription | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  // Build auth headers with a FRESH access token. getSession() refreshes an
  // expired token, so we don't send a stale one (which the server rejects = 401).
  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    let token = session?.access_token;
    if (supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.access_token) token = data.session.access_token;
      } catch { /* fall back to context token */ }
    }
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!loading && !user) redirect('/login?redirect=/dashboard');
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    const fetch_ = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/dashboard/subscriptions', {
          headers: await getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`Failed to fetch subscriptions (HTTP ${res.status})`);
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
      } catch (err) {
        console.error('[Dashboard] subscriptions load failed:', err);
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

  const handleCancelSubscription = async (sub: DashboardSubscription) => {
    try {
      setCancellingId(sub.id);
      const res = await fetch('/api/checkout/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await getAuthHeaders()),
        },
        body: JSON.stringify({ subscriptionId: sub.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');
      // Update local state to reflect pending cancellation
      setSubscriptions(prev => prev.map(s =>
        s.id === sub.id ? { ...s, cancelAtPeriodEnd: true } as any : s
      ));
      setCancelSuccess(`${sub.projectName} will be cancelled at the end of your billing period.`);
      setCancelConfirm(null);
      setTimeout(() => setCancelSuccess(null), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setCancellingId(null);
    }
  };

  const handleReactivate = async (sub: DashboardSubscription) => {
    try {
      setCancellingId(sub.id);
      const res = await fetch('/api/checkout/cancel-subscription', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(await getAuthHeaders()),
        },
        body: JSON.stringify({ subscriptionId: sub.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reactivate');
      setSubscriptions(prev => prev.map(s =>
        s.id === sub.id ? { ...s, cancelAtPeriodEnd: false } as any : s
      ));
      setCancelSuccess(`${sub.projectName} subscription reactivated!`);
      setTimeout(() => setCancelSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate subscription');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading || (!user && !loading)) {
    return <DashboardSkeleton />;
  }

  if (!user) return null;

  // Admin override — build synthetic "active" entries for every product so the
  // admin always sees the full suite in "Your Apps", regardless of DB rows.
  const isAdmin = ADMIN_EMAILS.includes(user.email ?? '');
  const adminSubscriptions: DashboardSubscription[] = ALL_PRODUCTS.map((p) => ({
    id: `admin-${p.slug}`,
    projectSlug: p.slug,
    projectName: p.name,
    appIcon: p.icon,
    appColor: undefined,
    plan: 'Admin',
    status: 'active',
    currentPeriodEnd: null,
    externalUrl: p.externalUrl,
  }));

  const displaySubscriptions = isAdmin ? adminSubscriptions : subscriptions;
  const activeSubscriptions  = displaySubscriptions.filter((s) => s.status === 'active');
  const subscribedSlugs      = new Set(displaySubscriptions.map((s) => s.projectSlug));
  const exploreProducts      = ALL_PRODUCTS.filter((p) => !subscribedSlugs.has(p.slug));
  const displayName          = user.user_metadata?.first_name || user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#0F172A]">

      {/* ── CANCEL CONFIRMATION MODAL ──────────────────────────────────────── */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Cancel Subscription?</h3>
              <button onClick={() => setCancelConfirm(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <p className="text-slate-300 text-sm mb-2">
              You&apos;re about to cancel <strong className="text-white">{cancelConfirm.projectName}</strong>.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              You&apos;ll keep access until the end of your current billing period. No charges after that. You can reactivate anytime before then.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-slate-600 text-slate-300 rounded-lg text-sm font-medium hover:border-slate-500 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => handleCancelSubscription(cancelConfirm)}
                disabled={cancellingId === cancelConfirm.id}
                className="flex-1 px-4 py-2.5 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                {cancellingId === cancelConfirm.id ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS BANNER ─────────────────────────────────────────────────── */}
      {cancelSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm px-6 py-3 rounded-xl shadow-xl backdrop-blur-sm">
          ✓ {cancelSuccess}
        </div>
      )}

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
            subscriptions={displaySubscriptions.map((s) => ({
              id: s.id,
              plan: s.plan,
              status: s.status,
              projectName: s.projectName,
              projectSlug: s.projectSlug,
              currentPeriodEnd: s.currentPeriodEnd,
            }))}
            isLoading={isLoading}
          />

          {/* Cancel / Reactivate controls — hidden for admin synthetic entries */}
          {!isLoading && !isAdmin && subscriptions.length > 0 && (
            <div className="mt-6 space-y-3">
              {subscriptions.filter(s => s.status === 'active').map(sub => {
                const isPendingCancel = (sub as any).cancelAtPeriodEnd;
                return (
                  <div key={sub.id} className="flex items-center justify-between p-4 bg-[#1E293B] border border-slate-700 rounded-xl">
                    <div>
                      <p className="text-white text-sm font-medium">{sub.projectName}</p>
                      {isPendingCancel ? (
                        <p className="text-amber-400 text-xs mt-0.5">Cancels at end of billing period</p>
                      ) : (
                        <p className="text-slate-400 text-xs mt-0.5">Active · renews {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : '—'}</p>
                      )}
                    </div>
                    {isPendingCancel ? (
                      <button
                        onClick={() => handleReactivate(sub)}
                        disabled={cancellingId === sub.id}
                        className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                      >
                        {cancellingId === sub.id ? 'Reactivating…' : 'Reactivate'}
                      </button>
                    ) : (
                      <button
                        onClick={() => setCancelConfirm(sub)}
                        disabled={cancellingId === sub.id}
                        className="px-3 py-1.5 text-slate-400 border border-slate-600 rounded-lg text-xs font-medium hover:text-red-400 hover:border-red-500/50 transition-colors disabled:opacity-50"
                      >
                        Cancel plan
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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

        {/* ── ANALYTICS ───────────────────────────────────────────────────── */}
        {!isLoading && displaySubscriptions.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Analytics</h2>
              <p className="text-slate-400 text-sm mt-1">View usage metrics across your apps</p>
            </div>
            <AnalyticsDashboard />
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
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-white">Delete account</p>
                <p className="text-sm text-slate-400 mt-0.5">Permanently remove your account and all data</p>
              </div>
              <Link href="/account/delete">
                <button className="text-xs font-semibold px-3 py-1.5 border border-red-900/60 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors">
                  Delete
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── EMPTY STATE ────────────────────────────────────────────────── */}
        {!isLoading && displaySubscriptions.length === 0 && (
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
