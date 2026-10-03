'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number; // depth: ~0.2 (far, small, dim, slow) to 1 (near, large, bright, fast)
  r: number;
  color: number; // index into PALETTE
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  z: number;
  color: number;
}

const PALETTE = ['96,165,250', '45,212,191', '251,191,36', '167,139,250']; // blue, teal, amber, violet
const DOT_COLORS = [0, 0, 0, 1, 1, 2, 3];
const LINK_DISTANCE = 150;
const MOUSE_DISTANCE = 190;
const PARALLAX = 38; // px of shift between the nearest layer and the screen centre

/** A soft radial glow, pre-rendered once per color so drawing it each frame is cheap. */
function makeGlow(rgb: string): HTMLCanvasElement {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, `rgba(${rgb},0.9)`);
    grad.addColorStop(0.25, `rgba(${rgb},0.35)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return c;
}

/**
 * Layered, depth-faked dot network. Dots sit at different depths: near ones
 * are larger, brighter and glow, far ones are small and dim, and the layers
 * drift at different speeds and shift against each other as the cursor moves
 * (parallax), with big soft light orbs behind for atmosphere. The cursor also
 * links to nearby dots and nudges them aside.
 *
 * Decorative only: pointer-events-none and aria-hidden, paused while the tab
 * is hidden, and drawn once (no animation) for people who prefer reduced motion.
 */
export function NetworkBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const glows = PALETTE.map(makeGlow);
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let orbs: Orb[] = [];
    let raf = 0;
    let last = performance.now();
    const mouse = { x: -9999, y: -9999 };
    // Eased cursor position (-0.5..0.5 across the screen) that drives parallax.
    const look = { x: 0, y: 0, tx: 0, ty: 0 };

    const seed = () => {
      const count = Math.round(Math.min(170, Math.max(60, (width * height) / 9000)));
      dots = Array.from({ length: count }, () => {
        const z = 0.2 + Math.pow(Math.random(), 1.5) * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.12 + Math.random() * 0.3) * (0.4 + z);
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          z,
          r: 0.7 + z * 2.6,
          color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)],
        };
      });
      // Far layers first so nearer dots paint over them.
      dots.sort((a, b) => a.z - b.z);

      orbs = Array.from({ length: 6 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 140 + Math.random() * 180,
        z: 0.15 + Math.random() * 0.25,
        color: i % PALETTE.length,
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

      // Atmosphere: large soft light orbs, deepest layer.
      ctx.globalCompositeOperation = 'lighter';
      for (const o of orbs) {
        const px = o.x + look.x * PARALLAX * o.z;
        const py = o.y + look.y * PARALLAX * o.z;
        ctx.globalAlpha = 0.16;
        ctx.drawImage(glows[o.color], px - o.r, py - o.r, o.r * 2, o.r * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      // Project each dot with its own parallax shift.
      const px: number[] = new Array(dots.length);
      const py: number[] = new Array(dots.length);
      for (let i = 0; i < dots.length; i++) {
        px[i] = dots[i].x + look.x * PARALLAX * dots[i].z;
        py[i] = dots[i].y + look.y * PARALLAX * dots[i].z;
      }

      // Links: stronger and thicker the nearer both ends are.
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const d = Math.hypot(px[i] - px[j], py[i] - py[j]);
          if (d < LINK_DISTANCE) {
            const depth = Math.min(a.z, b.z);
            ctx.strokeStyle = `rgba(96,165,250,${(1 - d / LINK_DISTANCE) * (0.1 + depth * 0.5)})`;
            ctx.lineWidth = 0.4 + depth * 1.2;
            ctx.beginPath();
            ctx.moveTo(px[i], py[i]);
            ctx.lineTo(px[j], py[j]);
            ctx.stroke();
          }
        }
        const md = Math.hypot(px[i] - mouse.x, py[i] - mouse.y);
        if (md < MOUSE_DISTANCE) {
          ctx.strokeStyle = `rgba(${PALETTE[a.color]},${(1 - md / MOUSE_DISTANCE) * (0.3 + a.z * 0.5)})`;
          ctx.lineWidth = 0.6 + a.z;
          ctx.beginPath();
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Dots: nearer ones get a glow halo and a bright core.
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if (dot.z > 0.45) {
          const gr = dot.r * (4 + dot.z * 4);
          ctx.globalAlpha = 0.25 + dot.z * 0.4;
          ctx.drawImage(glows[dot.color], px[i] - gr, py[i] - gr, gr * 2, gr * 2);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = `rgba(${PALETTE[dot.color]},${0.3 + dot.z * 0.65})`;
        ctx.beginPath();
        ctx.arc(px[i], py[i], dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (now: number) => {
      // Normalize to ~60fps so speed doesn't depend on the display's refresh rate.
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;

      look.x += (look.tx - look.x) * 0.05 * dt;
      look.y += (look.ty - look.y) * 0.05 * dt;

      for (const dot of dots) {
        const mx = dot.x + look.x * PARALLAX * dot.z - mouse.x;
        const my = dot.y + look.y * PARALLAX * dot.z - mouse.y;
        const md = Math.hypot(mx, my);
        if (md < MOUSE_DISTANCE && md > 0.01) {
          const push = ((1 - md / MOUSE_DISTANCE) * 0.6) / md;
          dot.vx += mx * push * 0.05 * dt;
          dot.vy += my * push * 0.05 * dt;
        }
        // Ease back toward a gentle drift so pushed dots don't fly off forever.
        if (Math.hypot(dot.vx, dot.vy) > 0.7) {
          dot.vx *= 0.96;
          dot.vy *= 0.96;
        }
        dot.x += dot.vx * dt;
        dot.y += dot.vy * dt;
        if (dot.x < -20) dot.x = width + 20;
        else if (dot.x > width + 20) dot.x = -20;
        if (dot.y < -20) dot.y = height + 20;
        else if (dot.y > height + 20) dot.y = -20;
      }
      for (const o of orbs) {
        o.x += o.vx * dt;
        o.y += o.vy * dt;
        if (o.x < -o.r) o.x = width + o.r;
        else if (o.x > width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = height + o.r;
        else if (o.y > height + o.r) o.y = -o.r;
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
      look.tx = (mouse.x / Math.max(width, 1) - 0.5) * -1;
      look.ty = (mouse.y / Math.max(height, 1) - 0.5) * -1;
    };
    const onPointerLeave = () => {
      mouse.x = mouse.y = -9999;
      look.tx = look.ty = 0;
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
