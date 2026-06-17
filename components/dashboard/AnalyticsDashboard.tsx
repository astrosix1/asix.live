'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Zap, Database } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Analytics {
  period: string;
  subscriptions: {
    total: number;
    active: number;
    canceled: number;
  };
  usage: {
    ascend: { apiCalls: number; activeUsers: number; totalSessions: number };
    geointel: { apiCalls: number; activeUsers: number; dataQueries: number };
    wikihole: { articles: number; activeUsers: number; cardsReviewed: number };
    portfolio: { dashboard: number; checksoutSessions: number; activeListings: number };
  };
  uptime: {
    ascend: string;
    geointel: string;
    wikihole: string;
    portfolio: string;
  };
  storage: {
    used: number;
    limit: number;
  };
}

function StatCard({ icon: Icon, title, value, unit, trend }: any) {
  return (
    <div className="bg-[#1E293B] rounded-lg border border-slate-700/60 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value.toLocaleString()}{unit && <span className="text-sm ml-1">{unit}</span>}</p>
        </div>
        <Icon size={20} className="text-blue-400 flex-shrink-0" />
      </div>
      {trend && (
        <p className="text-xs text-green-400 flex items-center gap-1">
          <TrendingUp size={14} /> {trend}
        </p>
      )}
    </div>
  );
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase!.auth.getSession();
        const token = session?.access_token;
        const res = await fetch('/api/dashboard/analytics', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-slate-800/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-red-900/20 border border-red-800/60 rounded-lg p-4 text-red-400 text-sm">
        {error || 'Failed to load analytics'}
      </div>
    );
  }

  const storagePercent = Math.round((analytics.storage.used / analytics.storage.limit) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
          <BarChart3 size={24} className="text-blue-400" />
          Usage Analytics
        </h2>
        <p className="text-slate-400 text-sm">{analytics.period}</p>
      </div>

      {/* Subscription Overview */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/60 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Subscription Status</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Total Subscriptions</p>
            <p className="text-3xl font-bold text-white">{analytics.subscriptions.total}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Active</p>
            <p className="text-3xl font-bold text-green-400">{analytics.subscriptions.active}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Canceled</p>
            <p className="text-3xl font-bold text-red-400">{analytics.subscriptions.canceled}</p>
          </div>
        </div>
      </div>

      {/* Per-App Usage */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">App Usage</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Ascend */}
          <div className="bg-[#1E293B] rounded-lg border border-slate-700/60 p-4">
            <p className="text-amber-400 font-semibold mb-3">⚡ Ascend</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">API Calls</span>
                <span className="text-white">{analytics.usage.ascend.apiCalls.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Active Users</span>
                <span className="text-white">{analytics.usage.ascend.activeUsers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Uptime</span>
                <span className="text-green-400 font-medium">{analytics.uptime.ascend}</span>
              </div>
            </div>
          </div>

          {/* GeoIntel */}
          <div className="bg-[#1E293B] rounded-lg border border-slate-700/60 p-4">
            <p className="text-teal-400 font-semibold mb-3">🌍 GeoIntel</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">API Calls</span>
                <span className="text-white">{analytics.usage.geointel.apiCalls.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Data Queries</span>
                <span className="text-white">{analytics.usage.geointel.dataQueries.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Uptime</span>
                <span className="text-green-400 font-medium">{analytics.uptime.geointel}</span>
              </div>
            </div>
          </div>

          {/* WikiHole */}
          <div className="bg-[#1E293B] rounded-lg border border-slate-700/60 p-4">
            <p className="text-orange-400 font-semibold mb-3">🕳️ WikiHole</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Articles Cached</span>
                <span className="text-white">{analytics.usage.wikihole.articles}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Cards Reviewed</span>
                <span className="text-white">{analytics.usage.wikihole.cardsReviewed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Uptime</span>
                <span className="text-green-400 font-medium">{analytics.uptime.wikihole}</span>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-[#1E293B] rounded-lg border border-slate-700/60 p-4">
            <p className="text-blue-400 font-semibold mb-3">💼 Portfolio</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Dashboard Views</span>
                <span className="text-white">{analytics.usage.portfolio.dashboard.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Checkout Sessions</span>
                <span className="text-white">{analytics.usage.portfolio.checksoutSessions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Uptime</span>
                <span className="text-green-400 font-medium">{analytics.uptime.portfolio}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database size={20} className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Storage Usage</h3>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-slate-400">{analytics.storage.used.toLocaleString()} MB / {(analytics.storage.limit / 1024).toFixed(0)} GB</span>
            <span className="text-white font-semibold">{storagePercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-700/60 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${storagePercent > 80 ? 'bg-red-500' : storagePercent > 60 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${storagePercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
