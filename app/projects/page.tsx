'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── Product definitions ────────────────────────────────────────────────────
const PRODUCTS = [
  {
    slug: 'ascend',
    name: 'Ascend',
    icon: '⚡',
    tagline: 'Replace addictions with hobbies.',
    description: 'A social habit-replacement app with competitive leaderboards, streak tracking, and community challenges. Built for people who are serious about change.',
    category: 'Social & Wellness',
    topBorder: 'border-t-2 border-t-amber-500',
    accent: 'text-amber-400',
    tagBg: 'bg-amber-900/30 text-amber-300 border-amber-800/50',
    available: true,
  },
  {
    slug: 'geointel',
    name: 'GeoIntel',
    icon: '🌍',
    tagline: 'For the ones who need to know.',
    description: 'Professional-grade geopolitical intelligence on an interactive 3D globe. Real-time event tracking, predictive analytics, and threat assessment — for analysts who can\'t afford to be wrong.',
    category: 'Intelligence & Analytics',
    topBorder: 'border-t-2 border-t-teal-500',
    accent: 'text-teal-400',
    tagBg: 'bg-teal-900/30 text-teal-300 border-teal-800/50',
    available: true,
  },
  {
    slug: 'wikihole',
    name: 'WikiHole',
    icon: '🕳️',
    tagline: 'The rabbit hole that sticks.',
    description: 'Start with mysteries, cryptids, and paranormal phenomena. Follow curated rabbit hole links as deep as you want. Every article you read gets turned into spaced-repetition quiz questions via Claude — so casual exploration actually builds lasting knowledge.',
    category: 'Learning & Discovery',
    topBorder: 'border-t-2 border-t-orange-500',
    accent: 'text-orange-400',
    tagBg: 'bg-orange-900/30 text-orange-300 border-orange-800/50',
    available: true,
    badge: 'Included in Essentials',
  },
  {
    slug: 'heavy-pocket',
    name: 'Heavy Pocket',
    icon: '💼',
    tagline: 'Your CFO replacement.',
    description: 'Enterprise-grade financial analysis for personal and business finances. Budgeting, forecasting, and CFO-level insights — coming soon.',
    category: 'Finance',
    topBorder: 'border-t-2 border-t-slate-600',
    accent: 'text-slate-400',
    tagBg: 'bg-slate-700/50 text-slate-400 border-slate-600/50',
    available: false,
  },
];

// ── Pricing definitions ────────────────────────────────────────────────────
const PRICING = [
  {
    name: 'Essentials',
    price: '$4.99',
    description: 'A collection of lightweight, everyday tools for productivity and growth.',
    features: ['WikiHole access', 'Basic analytics', 'Up to 3 tools', 'Email support', 'Community access'],
    cta: 'Get Essentials',
    href: '/checkout',
    highlight: false,
    accent: 'border-slate-700/60',
    btnClass: 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800',
  },
  {
    name: 'Ascend',
    price: '$4.99',
    description: 'Break destructive habits and build positive ones with tracking, community, and accountability.',
    features: ['Habit tracking & streaks', 'Leaderboards & competitions', 'Progress analytics', 'Social challenges', 'Milestones & badges', 'Cloud sync'],
    cta: 'Start Ascend',
    href: '/checkout',
    highlight: true,
    accent: 'border-amber-800/60',
    btnClass: 'bg-amber-500 hover:bg-amber-600 text-white border-transparent',
  },
  {
    name: 'GeoIntel',
    price: '$19',
    description: 'Professional-grade geopolitical intelligence for analysts and decision-makers.',
    features: ['Real-time event tracking', 'Interactive 3D globe', 'Threat assessment', 'Predictive analytics', 'Data export & API', 'Custom alerts'],
    cta: 'Explore GeoIntel',
    href: '/checkout',
    highlight: false,
    accent: 'border-teal-800/60',
    btnClass: 'border-teal-700 text-teal-300 hover:border-teal-600 hover:bg-teal-900/20',
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <section className="bg-[#111827] border-b border-slate-800 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">asix.live</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Products</h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Four independent platforms. Each built to solve a real problem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── PRODUCT CARDS ───────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {PRODUCTS.map((p) => (
              <motion.div key={p.slug} variants={fadeUp}>
                <div className={`bg-[#1E293B] rounded-xl border border-slate-700/60 ${p.topBorder} flex flex-col h-full`}>
                  <div className="p-7 flex-1 flex flex-col">
                    {/* Icon + name */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{p.icon}</span>
                      <div>
                        <h2 className={`text-xl font-bold text-white`}>{p.name}</h2>
                        <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border mt-1 ${p.tagBg}`}>
                          {p.category}
                        </span>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className={`font-semibold ${p.accent} mb-3`}>{p.tagline}</p>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed flex-1">{p.description}</p>
                  </div>

                  {/* CTA */}
                  <div className="px-7 pb-7">
                    {p.available ? (
                      <Link href={`/projects/${p.slug}`}>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold text-sm hover:border-slate-500 hover:bg-slate-800 transition-colors group">
                          View Product
                          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </Link>
                    ) : (
                      <div>
                        <div className="w-full py-2.5 border-2 border-slate-700 text-slate-600 rounded-lg font-semibold text-sm text-center cursor-not-allowed">
                          Coming Soon
                        </div>
                        {'badge' in p && p.badge && (
                          <p className="text-center text-xs text-slate-500 mt-2">{p.badge}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section className="bg-[#111827] border-t border-slate-800 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Simple, transparent pricing</h2>
            <p className="text-slate-400 text-lg">No hidden fees. Cancel anytime.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6 items-start"
          >
            {PRICING.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={`bg-[#1E293B] rounded-xl border ${plan.accent} p-8 h-full flex flex-col ${plan.highlight ? 'ring-1 ring-amber-500/30' : ''}`}>
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-500 ml-1">/mo</span>
                  </div>
                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-slate-300 text-sm">
                        <CheckCircle size={15} className="text-slate-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className="mt-auto">
                    <button className={`w-full py-2.5 border-2 rounded-lg font-semibold transition-colors text-sm ${plan.btnClass}`}>
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex items-center justify-center gap-8 mt-10 flex-wrap"
          >
            {['Cancel anytime', 'No hidden fees', 'Instant access after payment'].map((text) => (
              <span key={text} className="flex items-center gap-2 text-slate-500 text-sm">
                <CheckCircle size={14} className="text-slate-600" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
