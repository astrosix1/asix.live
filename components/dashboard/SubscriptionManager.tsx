'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { formatExpirationDate } from '@/lib/dashboard';

export interface SubscriptionManagerProps {
  subscriptions: Array<{
    id: string;
    plan: string;
    status: string;
    projectName: string;
    projectSlug: string;
    currentPeriodEnd: string | null;
    price?: number;
  }>;
  onCancel?: (subscriptionId: string) => void;
  isLoading?: boolean;
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'active') return <CheckCircle size={16} className="text-green-400 flex-shrink-0" />;
  if (status === 'canceled') return <XCircle size={16} className="text-red-400 flex-shrink-0" />;
  return <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />;
}

function statusLabel(status: string) {
  const map: Record<string, { text: string; cls: string }> = {
    active:   { text: 'Active',   cls: 'text-green-400 bg-green-900/30 border-green-800/60' },
    canceled: { text: 'Canceled', cls: 'text-red-400 bg-red-900/30 border-red-800/60' },
    past_due: { text: 'Past Due', cls: 'text-amber-400 bg-amber-900/30 border-amber-800/60' },
    trialing: { text: 'Trial',    cls: 'text-blue-400 bg-blue-900/30 border-blue-800/60' },
  };
  return map[status] ?? { text: status, cls: 'text-slate-400 bg-slate-800 border-slate-700' };
}

export function SubscriptionManager({
  subscriptions,
  onCancel,
  isLoading = false,
}: SubscriptionManagerProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/60 p-10 text-center">
        <p className="text-slate-400 mb-6">You don&apos;t have any subscriptions yet.</p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold hover:border-slate-500 hover:bg-slate-800 transition-colors"
        >
          Browse Products
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] rounded-xl border border-slate-700/60 overflow-hidden">
      <div className="divide-y divide-slate-700/60">
        {subscriptions.map((sub) => {
          const { text, cls } = statusLabel(sub.status);
          return (
            <div key={sub.id} className="flex items-center justify-between gap-4 px-6 py-5">
              <div className="flex items-center gap-3 min-w-0">
                <StatusIcon status={sub.status} />
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{sub.projectName}</p>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {sub.price !== undefined && sub.price > 0
                      ? `$${(sub.price / 100).toFixed(2)}/mo · `
                      : ''}
                    {formatExpirationDate(sub.currentPeriodEnd)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${cls}`}>
                  {text}
                </span>
                <Link
                  href={`/checkout?app=${sub.projectSlug}`}
                  className="text-xs font-semibold px-3 py-1.5 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-colors"
                >
                  Change Plan
                </Link>
                <button
                  className="text-xs font-semibold px-3 py-1.5 border border-red-900/60 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors disabled:opacity-40"
                  onClick={() => onCancel?.(sub.id)}
                  disabled={isLoading || sub.status === 'canceled'}
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
