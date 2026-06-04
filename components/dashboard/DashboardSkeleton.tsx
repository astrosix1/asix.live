'use client';

// ── Pulse animation helper ───────────────────────────────────────────────────
function Pulse({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-700/60 rounded ${className}`} />
  );
}

// ── Single subscription row skeleton ────────────────────────────────────────
function SubscriptionRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-5">
      <div className="flex items-center gap-3">
        <Pulse className="w-4 h-4 rounded-full" />
        <div>
          <Pulse className="w-32 h-4 mb-1.5" />
          <Pulse className="w-24 h-3" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Pulse className="w-16 h-6 rounded-full" />
        <Pulse className="w-20 h-7 rounded-lg" />
        <Pulse className="w-16 h-7 rounded-lg" />
      </div>
    </div>
  );
}

// ── App card skeleton ────────────────────────────────────────────────────────
function AppCardSkeleton() {
  return (
    <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <Pulse className="w-10 h-10 rounded-lg" />
        <div>
          <Pulse className="w-24 h-4 mb-1.5" />
          <Pulse className="w-16 h-3" />
        </div>
      </div>
      <Pulse className="w-full h-8 rounded-lg mt-2" />
    </div>
  );
}

// ── Subscriptions section skeleton ──────────────────────────────────────────
export function SubscriptionsSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="bg-[#1E293B] rounded-xl border border-slate-700/60 overflow-hidden">
      <div className="divide-y divide-slate-700/60">
        {Array.from({ length: rows }).map((_, i) => (
          <SubscriptionRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ── Apps grid skeleton ───────────────────────────────────────────────────────
export function AppGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <AppCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Full dashboard skeleton (header + apps + subscriptions) ─────────────────
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header skeleton */}
      <div className="bg-[#111827] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Pulse className="w-20 h-3 mb-2" />
              <Pulse className="w-40 h-8 mb-2" />
              <Pulse className="w-48 h-3" />
            </div>
            <Pulse className="w-24 h-9 rounded-lg mt-1" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Apps section */}
        <section>
          <Pulse className="w-32 h-6 mb-2" />
          <Pulse className="w-48 h-4 mb-6" />
          <AppGridSkeleton count={2} />
        </section>

        {/* Subscriptions section */}
        <section>
          <Pulse className="w-28 h-6 mb-2" />
          <Pulse className="w-52 h-4 mb-6" />
          <SubscriptionsSkeleton rows={2} />
        </section>
      </div>
    </div>
  );
}
