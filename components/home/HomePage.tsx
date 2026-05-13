'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, easeInOut } from 'framer-motion';
import {
  CheckCircle, Globe, ArrowRight, Shield, TrendingUp,
} from 'lucide-react';
import { getFeaturedPosts } from '@/lib/blog';
import type { BlogListItem } from '@/types/blog';
import BlogCard from '@/components/blog/BlogCard';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Floating animation for animated elements
const float = {
  animate: {
    y: [0, -20, 0],
    transition: { duration: 4, repeat: Infinity, ease: easeInOut },
  },
};

const floatDelay = (delay: number) => ({
  animate: {
    y: [0, -20, 0],
    transition: { duration: 4, repeat: Infinity, ease: easeInOut, delay },
  },
});

export function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogListItem[]>([]);

  useEffect(() => {
    getFeaturedPosts(3).then(setFeaturedPosts).catch(() => {});
  }, []);

  const handleExploreScroll = () => {
    const element = document.getElementById('section-ascend');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ─── SECTION 0: PORTFOLIO HERO ─── */}
      <section className="bg-gradient-to-b from-[#1F2937] to-[#111827] py-24 lg:py-32 overflow-hidden relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-500 rounded-full mix-blend-screen blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-full text-sm font-semibold border border-slate-700">
                <span>✨</span>
                <span>Three Platforms, One Vision</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                  Where growth,
                  <br />
                  <span className="text-blue-400">strategy, and insight</span>
                  <br />
                  meet.
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
                  Build better habits with Ascend, navigate the world with GeoIntel, or stay productive with Essentials. Choose your path forward.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={handleExploreScroll}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-base shadow-sm"
                >
                  Explore Products
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>

            {/* Right — animated graphic */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center relative h-96"
            >
              {/* Center circle */}
              <motion.div
                variants={float}
                animate="animate"
                className="absolute w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border border-blue-400"
              >
                <span className="text-5xl">⚡</span>
              </motion.div>

              {/* Top-left circle */}
              <motion.div
                variants={floatDelay(0.5)}
                animate="animate"
                className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg border border-slate-500"
              >
                <span className="text-4xl">🌍</span>
              </motion.div>

              {/* Bottom-right circle */}
              <motion.div
                variants={floatDelay(1)}
                animate="animate"
                className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-600"
              >
                <span className="text-4xl">📦</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: ASCEND HERO ─── */}
      <section id="section-ascend" className="bg-gradient-to-b from-[#0F172A] to-[#111827] py-20 lg:py-28 overflow-hidden relative">
        {/* Amber glow accents */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-16 right-16 w-80 h-80 bg-amber-500 rounded-full mix-blend-screen blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-orange-600 rounded-full mix-blend-screen blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-amber-900/40 text-amber-300 px-4 py-2 rounded-full text-sm font-semibold border border-amber-800/60">
                <span>⚡</span>
                <span>Featured App — Ascend</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                  Break the cycle.
                  <br />
                  <span className="text-amber-400">Build a better you.</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
                  Ascend replaces destructive habits with meaningful ones — with tracking, community, and momentum that keeps you going.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/projects/ascend">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-7 py-3.5 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors text-base shadow-sm"
                  >
                    Explore Ascend
                    <ArrowRight size={18} />
                  </motion.button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-green-500" />
                  No commitment required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-green-500" />
                  Cancel anytime
                </span>
              </div>
            </motion.div>

            {/* Right — mock app preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl max-w-sm mx-auto ring-1 ring-amber-900/30">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white font-bold text-lg">Ascend</span>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 mb-4">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Current Streak</p>
                  <div className="flex items-end gap-2">
                    <span className="text-white text-4xl font-bold">47</span>
                    <span className="text-amber-400 text-lg mb-1">🔥 days</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Morning Run', done: true },
                    { label: 'No Social Media', done: true },
                    { label: 'Read 30 min', done: false },
                  ].map((habit) => (
                    <div key={habit.label} className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2.5">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${habit.done ? 'bg-green-500' : 'bg-slate-600'}`} />
                      <span className={`text-sm font-medium ${habit.done ? 'text-white' : 'text-slate-400'}`}>
                        {habit.label}
                      </span>
                      {habit.done && <CheckCircle size={14} className="text-green-400 ml-auto" />}
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-blue-600 rounded-lg px-4 py-2.5 text-center">
                  <span className="text-white text-sm font-semibold">🏆 #3 on Leaderboard</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: GEOINTEL SPOTLIGHT ─── */}
      <section className="bg-gradient-to-b from-[#0A0F1E] to-[#0F172A] py-24 overflow-hidden relative">
        {/* Teal/cyan glow for the intelligence/globe aesthetic */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500 rounded-full mix-blend-screen blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-700 rounded-full mix-blend-screen blur-3xl" />
        </div>

        {/* Decorative orbit rings */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none hidden lg:block">
          <div className="w-[500px] h-[500px] rounded-full border border-teal-400" />
          <div className="absolute inset-8 rounded-full border border-teal-400" />
          <div className="absolute inset-16 rounded-full border border-teal-400" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-teal-900/40 text-teal-300 px-4 py-2 rounded-full text-sm font-semibold border border-teal-800/60">
                <span>🌍</span>
                <span>Intelligence Platform — GeoIntel</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                For the ones who <br />
                <span className="text-teal-400">need to know.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                GeoIntel delivers real-time geopolitical intelligence on an interactive 3D globe. Built for analysts, researchers, and decision-makers who can&apos;t afford to be uninformed.
              </p>
              <Link href="/projects/geointel">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                >
                  Explore GeoIntel
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: <Globe size={22} className="text-teal-400" />,
                  title: 'Interactive 3D Globe',
                  desc: 'Visualize global events on a fully interactive globe with real-time data overlays.',
                },
                {
                  icon: <Shield size={22} className="text-cyan-400" />,
                  title: 'Intelligence Analysis',
                  desc: 'Deep-dive reports and trend analysis on geopolitical hotspots worldwide.',
                },
                {
                  icon: <TrendingUp size={22} className="text-blue-400" />,
                  title: 'Predictive Insights',
                  desc: 'Pattern recognition that surfaces emerging threats before they escalate.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-slate-700/60 hover:border-teal-800 transition-colors duration-200">
                  <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
              <p className="text-slate-600 text-sm text-center mt-2 italic">
                Trusted by analysts, researchers, and decision-makers worldwide.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION: LATEST FROM BLOG ─── */}
      {featuredPosts.length > 0 && (
        <section className="bg-[#0F172A] py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div
                variants={fadeUp}
                className="flex items-center justify-between mb-10"
              >
                <div>
                  <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">
                    From the Blog
                  </p>
                  <h2 className="text-3xl font-bold text-white">
                    Latest Writing
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  View all
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <motion.div key={post.id} variants={fadeUp}>
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── SECTION 5: FINAL CTA ─── */}
      <section className="bg-gradient-to-b from-[#111827] to-[#1F2937] py-24 overflow-hidden relative">
        {/* Warm blue glow for the final push */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-64 bg-blue-500 rounded-full mix-blend-screen blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-6"
          >
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-white">
              Pick what you need.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-slate-400">
              Three products. One portfolio. All built to make a real difference.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Browse All Products
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link href="/projects/ascend">
                <button className="px-8 py-4 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold text-lg hover:border-slate-500 hover:bg-slate-800 transition-colors">
                  Start with Ascend →
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
