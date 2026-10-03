'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NetworkBackground } from './NetworkBackground';
import { SCREENSHOTS } from '@/lib/app-previews';
import { useLaunchHref } from '@/lib/use-launch-href';

type AppSlug = 'ascend' | 'geointel' | 'wikihole';

interface LauncherApp {
  slug: AppSlug;
  name: string;
  icon: string;
  blurb: string;
  url: string;
  host: string;
  // Ascend and WikiHole install the session with setSession() and need both
  // tokens; GeoIntel verifies the access token per request.
  includeRefreshToken: boolean;
  highlights: string[];
}

const APPS: LauncherApp[] = [
  {
    slug: 'ascend',
    name: 'Ascend',
    icon: '⚡',
    blurb: 'Replace bad habits with better ones and keep your streak alive.',
    url: 'https://ascend.asix.live',
    host: 'ascend.asix.live',
    includeRefreshToken: true,
    highlights: [],
  },
  {
    slug: 'geointel',
    name: 'GeoIntel',
    icon: '🌍',
    blurb: 'Follow live world events on an interactive 3D globe.',
    url: 'https://geointel.asix.live',
    host: 'geointel.asix.live',
    includeRefreshToken: false,
    highlights: [],
  },
  {
    slug: 'wikihole',
    name: 'WikiHole',
    icon: '🕳️',
    blurb: 'Fall down Wikipedia rabbit holes and actually remember them.',
    url: 'https://wikihole.asix.live',
    host: 'wikihole.asix.live',
    includeRefreshToken: true,
    highlights: ['Curated rabbit holes to dive into', 'Quizzes that turn reading into memory', 'Pick up your trail where you left off'],
  },
];

export function HomePage() {
  // Whichever app was last hovered/focused/tapped stays on screen, so the
  // preview never flickers empty when the cursor moves between cards.
  const [active, setActive] = useState<AppSlug>('ascend');
  const activeApp = APPS.find((a) => a.slug === active) ?? APPS[0];

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-[#070B14] text-white">
      <NetworkBackground />
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <h1 className="sr-only">Asix apps: Ascend, GeoIntel and WikiHole</h1>
      <div className="relative mx-auto grid max-w-7xl items-center gap-x-14 gap-y-8 px-4 py-12 sm:px-6 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:px-8 lg:py-16">
        {/* App cards and upgrade */}
        <div className="order-2 lg:order-none lg:col-start-1">
          <ul className="space-y-3">
            {APPS.map((app) => (
              <AppRow
                key={app.slug}
                app={app}
                isActive={app.slug === active}
                onSelect={() => setActive(app.slug)}
              />
            ))}
          </ul>

          <Link
            href="/checkout"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-blue-600/90 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-500"
          >
            Access more
            <ArrowRight size={18} />
          </Link>
          <p className="mt-2 text-center text-xs text-slate-400">Premium membership for all apps</p>
        </div>

        {/* Live preview of the app under the cursor */}
        <div className="order-first lg:order-none lg:col-start-2">
          <Preview key={activeApp.slug} app={activeApp} />
        </div>
      </div>
    </div>
  );
}

function AppRow({
  app,
  isActive,
  onSelect,
}: {
  app: LauncherApp;
  isActive: boolean;
  onSelect: () => void;
}) {
  const href = useLaunchHref(app.url, app.includeRefreshToken);

  // The card itself isn't a link — only Launch is — so hover/focus/tap just
  // choose which preview to show and nothing is nested inside another control.
  return (
    <li
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-sm transition-colors ${
        isActive
          ? 'border-blue-400/60 bg-white/10'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xl" aria-hidden="true">
        {app.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold leading-tight text-white">{app.name}</h2>
        <p className="mt-0.5 text-sm leading-snug text-slate-400">{app.blurb}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Launch ${app.name}`}
        className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
      >
        Launch
      </a>
    </li>
  );
}

function Preview({ app }: { app: LauncherApp }) {
  const slides = SCREENSHOTS[app.slug];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 2400);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-2xl shadow-black/50" aria-live="polite">
        {slides.length > 0 ? (
          slides.map((slide, i) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={i === index ? `${slide.alt} screenshot` : ''}
              aria-hidden={i !== index}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className={`object-contain transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            />
          ))
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="text-6xl" aria-hidden="true">{app.icon}</span>
            <p className="text-xl font-semibold">{app.name}</p>
            <ul className="space-y-1.5 text-sm text-slate-300">
              {app.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1} of ${slides.length}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-blue-400' : 'w-1.5 bg-white/25 hover:bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
