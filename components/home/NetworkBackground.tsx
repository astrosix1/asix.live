'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

const COLORS = ['96,165,250', '96,165,250', '96,165,250', '45,212,191', '251,191,36']; // blue, teal, amber
const LINK_DISTANCE = 140;
const MOUSE_DISTANCE = 170;

/**
 * Drifting dots joined by lines when close. The cursor links to nearby dots
 * and gently pushes them aside, so the field reacts to the visitor. Decorative
 * only: pointer-events-none and aria-hidden, paused while the tab is hidden,
 * and drawn once (no animation) for people who prefer reduced motion.
 */
export function NetworkBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let raf = 0;
    let last = performance.now();
    const mouse = { x: -9999, y: -9999 };

    const seed = () => {
      const count = Math.round(Math.min(110, Math.max(36, (width * height) / 14000)));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 1 + Math.random() * 1.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(96,165,250,${(1 - d / LINK_DISTANCE) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < MOUSE_DISTANCE) {
          ctx.strokeStyle = `rgba(${a.color},${(1 - md / MOUSE_DISTANCE) * 0.6})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (const dot of dots) {
        ctx.fillStyle = `rgba(${dot.color},0.85)`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (now: number) => {
      // Normalize to ~60fps so speed doesn't depend on the display's refresh rate.
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;

      for (const dot of dots) {
        const mx = dot.x - mouse.x;
        const my = dot.y - mouse.y;
        const md = Math.hypot(mx, my);
        if (md < MOUSE_DISTANCE && md > 0.01) {
          const push = ((1 - md / MOUSE_DISTANCE) * 0.6) / md;
          dot.vx += mx * push * 0.05 * dt;
          dot.vy += my * push * 0.05 * dt;
        }
        // Ease back toward a gentle drift so pushed dots don't fly off forever.
        const speed = Math.hypot(dot.vx, dot.vy);
        if (speed > 0.6) {
          dot.vx *= 0.96;
          dot.vy *= 0.96;
        }
        dot.x += dot.vx * dt;
        dot.y += dot.vy * dt;
        if (dot.x < -10) dot.x = width + 10;
        else if (dot.x > width + 10) dot.x = -10;
        if (dot.y < -10) dot.y = height + 10;
        else if (dot.y > height + 10) dot.y = -10;
      }

      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (reduceMotion || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    start();

    window.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
