import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { getUseCase, getAllUseCaseSlugs } from '@/lib/use-cases';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return getAllUseCaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) return {};
  return {
    title: uc.metadata.title,
    description: uc.metadata.description,
    openGraph: {
      title: uc.metadata.title,
      description: uc.metadata.description,
      url: `https://asix.live/use-cases/${uc.slug}`,
      siteName: 'asix.live',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: uc.metadata.title,
      description: uc.metadata.description,
    },
    alternates: { canonical: `https://asix.live/use-cases/${uc.slug}` },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) notFound();

  return (
    <div className="bg-[#0F172A] text-white min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0F1E] to-[#0F172A] pt-24 pb-20 px-4">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block mb-5 rounded-full border border-amber-800/60 bg-amber-900/40 px-4 py-1.5 text-sm font-medium text-amber-300">
            {uc.badge}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            {uc.headline}
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            {uc.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/checkout?plan=${uc.checkoutPlan}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-7 py-3.5 text-base font-semibold text-white transition-colors"
            >
              Get Started — {uc.price} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 hover:border-slate-500 px-7 py-3.5 text-base font-medium text-slate-300 hover:text-white transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────────────── */}
      <section className="bg-[#111827] py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{uc.problemTitle}</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">{uc.problemIntro}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {uc.painPoints.map((pt) => (
              <div
                key={pt.headline}
                className="rounded-xl border border-slate-800 bg-[#0F172A] p-6 hover:border-amber-900/50 transition-colors"
              >
                <div className="mb-3 h-8 w-8 rounded-full bg-red-900/40 flex items-center justify-center text-red-400 text-lg font-bold">✕</div>
                <h3 className="font-semibold text-white mb-2">{pt.headline}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{pt.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution ─────────────────────────────────────────────────── */}
      <section className="bg-[#0F172A] py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{uc.solutionTitle}</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">{uc.solutionBody}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {uc.features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-slate-800 bg-[#111827] p-6 hover:border-amber-900/50 transition-colors"
              >
                <div className="mb-4 text-3xl">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-[#111827] py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14">{uc.stepsTitle}</h2>

          <div className="space-y-10">
            {uc.steps.map((step, i) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-400 font-bold text-sm">
                    {step.number}
                  </div>
                  {i < uc.steps.length - 1 && (
                    <div className="mt-2 flex-1 w-px bg-slate-700" />
                  )}
                </div>
                <div className="pb-10">
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ─────────────────────────────────────────────── */}
      <section className="bg-[#0F172A] py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Everything you need to make it stick</h2>
          <p className="text-slate-400 mb-10">One subscription unlocks the full Ascend app.</p>
          <div className="grid sm:grid-cols-2 gap-4 text-left mb-10">
            {[
              'Unlimited habits to track',
              'Streak calendar and history',
              'Habit replacement pairing',
              'Recovery timeline milestones',
              'Daily check-in reminders',
              'Cloud sync across devices',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#111827] to-[#0A0F1E] py-24 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{uc.ctaHeadline}</h2>
          <p className="text-slate-400 text-lg mb-8">{uc.ctaBody}</p>
          <Link
            href={`/checkout?plan=${uc.checkoutPlan}`}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-8 py-4 text-base font-semibold text-white transition-colors"
          >
            Start for {uc.price} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-sm text-slate-500">Cancel anytime. No hidden fees.</p>
        </div>
      </section>

    </div>
  );
}
