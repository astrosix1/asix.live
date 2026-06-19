'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Trophy, TrendingUp, Users, Star, Cloud, Globe, Zap, Shield, Database, Bell, BookOpen, Brain } from 'lucide-react';
import { AccessBanner } from './AccessBanner';

interface ProjectTemplateProps {
  project: {
    name: string;
    tagline: string;
    longDescription: string;
    image?: string;
    category?: string;
    color?: string;
    features: string[];
    externalUrl?: string;
  };
  projectSlug: 'ascend' | 'geointel' | 'wikihole';
  launchButtonComponent?: React.ReactNode;
  userHasAccess?: boolean;
  isLoggedIn?: boolean;
}

// Price and checkout-plan per product
const CHECKOUT_INFO = {
  ascend:   { plan: 'ascend',   priceLabel: '7 days free', priceNote: 'Then $4.99/month. Cancel anytime.' },
  geointel: { plan: 'geointel', priceLabel: '$19/month',   priceNote: '' },
  wikihole: { plan: 'basic',    priceLabel: '$4.99/month', priceNote: 'Included in the Essentials plan' },
} as const;

// Per-product theme tokens
const THEMES = {
  ascend: {
    heroBg: 'from-[#0F172A] to-[#111827]',
    sectionA: 'bg-[#111827]',
    sectionB: 'bg-[#0F172A]',
    glow1: 'bg-amber-500',
    glow2: 'bg-orange-600',
    badgeBg: 'bg-amber-900/40',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-800/60',
    accent: 'text-amber-400',
    stepAccent: 'text-amber-500',
    btnPrimary: 'bg-amber-500 hover:bg-amber-600 text-white',
    cardHover: 'hover:border-amber-900/50',
    icon: '⚡',
    label: 'Featured App',
  },
  geointel: {
    heroBg: 'from-[#0A0F1E] to-[#0F172A]',
    sectionA: 'bg-[#0F172A]',
    sectionB: 'bg-[#0A0F1E]',
    glow1: 'bg-teal-500',
    glow2: 'bg-blue-700',
    badgeBg: 'bg-teal-900/40',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-800/60',
    accent: 'text-teal-400',
    stepAccent: 'text-teal-400',
    btnPrimary: 'bg-teal-600 hover:bg-teal-700 text-white',
    cardHover: 'hover:border-teal-900/50',
    icon: '🌍',
    label: 'Intelligence Platform',
  },
  wikihole: {
    heroBg: 'from-[#0F172A] to-[#1A1209]',
    sectionA: 'bg-[#111827]',
    sectionB: 'bg-[#0F172A]',
    glow1: 'bg-orange-500',
    glow2: 'bg-amber-700',
    badgeBg: 'bg-orange-900/40',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-800/60',
    accent: 'text-orange-400',
    stepAccent: 'text-orange-400',
    btnPrimary: 'bg-orange-500 hover:bg-orange-600 text-white',
    cardHover: 'hover:border-orange-900/50',
    icon: '🕳️',
    label: 'Learning & Discovery',
  },
} as const;

// ── How It Works content ─────────────────────────────────────────────────────
const HOW_IT_WORKS = {
  ascend: [
    {
      step: '01', emoji: '🎯',
      title: 'Identify Your Habit',
      desc: 'Pinpoint exactly what you want to change. Ascend helps you name the trigger, the routine, and the reward.',
    },
    {
      step: '02', emoji: '🔄',
      title: 'Replace With Purpose',
      desc: 'Swap the destructive habit for something that builds you up. Choose from challenges or create your own.',
    },
    {
      step: '03', emoji: '🏆',
      title: 'Track & Win',
      desc: 'Watch your streak grow, hit milestones, and compete with friends on the leaderboard.',
    },
  ],
  geointel: [
    {
      step: '01', emoji: '🌐',
      title: 'Monitor the Globe',
      desc: 'Real-time feeds surface emerging events the moment they occur, anywhere in the world — no delays, no gaps.',
    },
    {
      step: '02', emoji: '🔍',
      title: 'Analyze the Intelligence',
      desc: 'Drill into event details, regional context, and geopolitical patterns with expert-grade analysis tools.',
    },
    {
      step: '03', emoji: '📊',
      title: 'Predict & Act',
      desc: 'Pattern recognition surfaces what\'s coming before it makes headlines. Stay ahead of the curve.',
    },
  ],
  wikihole: [
    {
      step: '01', emoji: '🕳️',
      title: 'Fall Down a Rabbit Hole',
      desc: 'Pick any mystery, cryptid, or paranormal topic from our curated seed library — all 60+ articles load instantly, no waiting.',
    },
    {
      step: '02', emoji: '🔗',
      title: 'Follow the Links',
      desc: 'Every article surfaces three related rabbit holes. Dive as deep as you want — your full trail is saved and resumable.',
    },
    {
      step: '03', emoji: '🧠',
      title: 'Quiz What You Learned',
      desc: 'Claude reads every article you visit and generates spaced-repetition flash cards. Revisit them on schedule and actually retain what you explored.',
    },
  ],
};

// ── Feature grids ────────────────────────────────────────────────────────────
const FEATURES = {
  ascend: {
    heading: 'Everything you need to succeed',
    sub: 'Built for real change, not just good intentions',
    items: [
      { icon: <BarChart3 size={24} className="text-blue-400" />, title: 'Habit Tracking', desc: 'Log your habits daily. Build unbreakable streaks with visual progress indicators.' },
      { icon: <Trophy size={24} className="text-amber-400" />, title: 'Leaderboards', desc: 'Compete with friends and the community. Rise through the rankings week by week.' },
      { icon: <TrendingUp size={24} className="text-green-400" />, title: 'Progress Analytics', desc: 'Visual charts showing your improvement week over week, month over month.' },
      { icon: <Users size={24} className="text-purple-400" />, title: 'Social Challenges', desc: 'Team up with others for group accountability challenges with shared goals.' },
      { icon: <Star size={24} className="text-rose-400" />, title: 'Milestones & Badges', desc: 'Celebrate every win. Unlock unique badges as you hit new personal records.' },
      { icon: <Cloud size={24} className="text-sky-400" />, title: 'Cloud Sync', desc: 'Access your full progress history from any device, anytime, anywhere.' },
    ],
  },
  geointel: {
    heading: 'Everything you need to predict',
    sub: 'Professional-grade intelligence for those who can\'t afford to be wrong',
    items: [
      { icon: <Globe size={24} className="text-teal-400" />, title: 'Interactive 3D Globe', desc: 'Pinpoint events on a live, navigable globe with real-time data overlays and geographic context.' },
      { icon: <Zap size={24} className="text-yellow-400" />, title: 'Real-Time Event Feeds', desc: 'Global incidents surface the moment they occur — no delays, no editorial filters.' },
      { icon: <Shield size={24} className="text-cyan-400" />, title: 'Threat Assessment', desc: 'Quantified risk scores for regions, actors, and escalating situations worldwide.' },
      { icon: <TrendingUp size={24} className="text-blue-400" />, title: 'Predictive Analytics', desc: 'Pattern recognition that identifies emerging trends before they become headlines.' },
      { icon: <Database size={24} className="text-indigo-400" />, title: 'Data Export & API', desc: 'Pull intelligence directly into your own systems, dashboards, and workflows.' },
      { icon: <Bell size={24} className="text-amber-400" />, title: 'Custom Alerts', desc: 'Get notified the moment situations in your watchlist change or escalate.' },
    ],
  },
  wikihole: {
    heading: 'Exploration that actually sticks',
    sub: 'Wikipedia rabbit holes, now with memory',
    items: [
      { icon: <BookOpen size={24} className="text-orange-400" />, title: 'Curated Rabbit Holes', desc: '60+ seed articles spanning mysteries, cryptids, paranormal phenomena, and sea creatures — all instant load.' },
      { icon: <Zap size={24} className="text-amber-400" />, title: 'AI Quiz Generation', desc: 'Claude reads every article you explore and auto-generates multiple-choice questions tailored to what you just learned.' },
      { icon: <TrendingUp size={24} className="text-orange-300" />, title: 'Spaced Repetition', desc: 'A full SM-2 algorithm schedules each card so you see it again just before you forget it.' },
      { icon: <Database size={24} className="text-yellow-400" />, title: 'Trail History', desc: 'Every rabbit hole session is saved. Resume exactly where you left off — days or weeks later.' },
      { icon: <Cloud size={24} className="text-sky-400" />, title: 'Offline Support', desc: 'Visited articles are cached locally. Keep reading even without a connection.' },
      { icon: <Brain size={24} className="text-amber-400" />, title: 'Mastery Tracking', desc: 'See your knowledge score per rabbit hole trail. Unlock mastery when you ace all the cards.' },
    ],
  },
};

// ── Screenshot galleries ────────────────────────────────────────────────────
const SCREENSHOTS = {
  ascend: [
    { src: '/images/projects/ascend-dashboard.png', alt: 'Ascend Dashboard' },
    { src: '/images/projects/ascend-events.png', alt: 'Ascend Discover Events' },
    { src: '/images/projects/ascend-graphs.png', alt: 'Ascend Progress Graphs' },
    { src: '/images/projects/ascend-timer.png', alt: 'Ascend Pomodoro Timer' },
  ],
  geointel: [
    { src: '/images/projects/geointel-dashboard.png', alt: 'GeoIntel Dashboard' },
    { src: '/images/projects/geointel-brief.png', alt: 'GeoIntel Brief' },
    { src: '/images/projects/geointel-forecast.png', alt: 'GeoIntel Forecast' },
    { src: '/images/projects/geointel-relationships.png', alt: 'GeoIntel Relationships' },
    { src: '/images/projects/geointel-trend.png', alt: 'GeoIntel Trend' },
  ],
  wikihole: [],
};

// ── About copy ───────────────────────────────────────────────────────────────
const ABOUT_EXTRA = {
  ascend: 'Whether you\'re looking to kick a habit or build a positive one, Ascend provides the tools, community, and motivation to succeed. Track your progress, compete with friends, and celebrate milestones along the way.',
  geointel: 'Trusted by analysts, researchers, and decision-makers worldwide. GeoIntel turns raw global data into actionable foresight — so you\'re never caught off guard by what happens next.',
  wikihole: 'Whether you spend 20 minutes or 3 hours going down a rabbit hole, WikiHole turns every session into a spaced learning loop. Included free in the Essentials plan — no extra charge on top of your subscription.',
};

export function ProjectTemplate({
  project,
  projectSlug,
  launchButtonComponent,
  userHasAccess = false,
  isLoggedIn = false,
}: ProjectTemplateProps) {
  const t = THEMES[projectSlug];
  const howItWorks = HOW_IT_WORKS[projectSlug];
  const features = FEATURES[projectSlug];
  const aboutExtra = ABOUT_EXTRA[projectSlug];
  const screenshots = SCREENSHOTS[projectSlug];

  return (
    <div className="min-h-screen bg-[#0F172A]">

      {/* Access Banner */}
      {userHasAccess && <AccessBanner projectName={project.name} />}

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className={`bg-gradient-to-b ${t.heroBg} py-24 lg:py-32 overflow-hidden relative`}>
        {/* Glow blobs */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className={`absolute top-16 right-16 w-80 h-80 ${t.glow1} rounded-full mix-blend-screen blur-3xl`} />
          <div className={`absolute bottom-10 left-10 w-64 h-64 ${t.glow2} rounded-full mix-blend-screen blur-3xl`} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 ${t.badgeBg} ${t.badgeText} px-4 py-2 rounded-full text-sm font-semibold border ${t.badgeBorder} mb-8`}>
            <span>{t.icon}</span>
            <span>{t.label} — {project.name}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
            {project.tagline.split(' ').slice(0, Math.ceil(project.tagline.split(' ').length / 2)).join(' ')}
            <br />
            <span className={t.accent}>
              {project.tagline.split(' ').slice(Math.ceil(project.tagline.split(' ').length / 2)).join(' ')}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {project.longDescription}
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className={`${t.sectionA} py-24 border-t border-slate-800`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-400 text-lg">
              {projectSlug === 'ascend' ? 'Three steps to a better habit loop' : projectSlug === 'geointel' ? 'Three steps to sharper intelligence' : 'Three steps to lasting knowledge'}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="bg-slate-800/60 rounded-xl border border-slate-700/60 p-8 h-full hover:border-slate-600 transition-colors duration-200">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <div className={`${t.stepAccent} text-xs font-bold uppercase tracking-widest mb-2`}>{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENSHOTS ────────────────────────────────────────────────────── */}
      {screenshots.length > 0 && (
        <section className={`${t.sectionB} py-24 border-t border-slate-800`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">See It In Action</h2>
              <p className="text-slate-400 text-lg">Explore {project.name} with these real app screenshots</p>
            </div>
            <div className="space-y-6">
              {screenshots.map((screenshot) => (
                <div key={screenshot.src} className="group overflow-hidden rounded-lg">
                  <img
                    src={screenshot.src}
                    alt={screenshot.alt}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURE GRID ───────────────────────────────────────────────────── */}
      <section className={`${t.sectionB} py-24 border-t border-slate-800`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{features.heading}</h2>
            <p className="text-slate-400 text-lg">{features.sub}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.items.map((feature) => (
              <div key={feature.title} className={`bg-slate-800/50 rounded-xl border border-slate-700/60 p-6 h-full ${t.cardHover} hover:bg-slate-800/80 transition-all duration-200`}>
                <div className="mb-3">{feature.icon}</div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────────────────── */}
      <section className={`${t.sectionA} py-24 border-t border-slate-800`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">About {project.name}</h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-4">{project.longDescription}</p>
          <p className="text-lg text-slate-400 leading-relaxed">{aboutExtra}</p>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className={`bg-gradient-to-b ${t.heroBg} py-24 border-t border-slate-800 overflow-hidden relative`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-64 ${t.glow1} rounded-full mix-blend-screen blur-3xl`} />
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-slate-400 mb-10">
            {projectSlug === 'ascend'
              ? 'Try Ascend free for 7 days. No card required until your trial ends.'
              : projectSlug === 'geointel'
              ? 'Unlock geopolitical intelligence and stay ahead of global events.'
              : 'Start exploring rabbit holes — included free in the Essentials plan.'}
          </p>

          {/* Price — shown only to visitors who are not signed in */}
          {!isLoggedIn && (
            <div className="mb-8">
              <p className="text-5xl font-bold text-white mb-1">
                {CHECKOUT_INFO[projectSlug].priceLabel}
              </p>
              {CHECKOUT_INFO[projectSlug].priceNote && (
                <p className="text-slate-400 text-sm mt-1">
                  {CHECKOUT_INFO[projectSlug].priceNote}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isLoggedIn ? (
              /* Logged-out visitor: Subscribe Now / Start Free Trial */
              <Link href={`/checkout?plan=${CHECKOUT_INFO[projectSlug].plan}`}>
                <button className={`flex items-center gap-2 px-8 py-4 ${t.btnPrimary} rounded-lg font-semibold text-lg`}>
                  {projectSlug === 'ascend' ? 'Start Free Trial' : 'Subscribe Now'}
                  <ArrowRight size={20} />
                </button>
              </Link>
            ) : launchButtonComponent ? (
              /* Logged-in subscriber: open the app */
              launchButtonComponent
            ) : null}
            <Link href="/contact">
              <button className="flex items-center gap-2 px-8 py-4 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold text-lg hover:border-slate-500 hover:bg-slate-800 transition-colors">
                Get in Touch
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>

          {!isLoggedIn && projectSlug !== 'ascend' && (
            <p className="text-sm text-slate-500 mt-6">Cancel anytime. No hidden fees.</p>
          )}
        </div>
      </section>

    </div>
  );
}
