// components/Particles.tsx
"use client";

/**
 * Cosmic background: ultra-light canvas starfield.
 * - ~48 drifting particles, GPU-friendly.
 * - Respects prefers-reduced-motion (renders static).
 * - Fills the viewport behind content (pointer-events: none).
 */

import React, { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; vx: number; vy: number; a: number };

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const reducedRef = useRef<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = media.matches;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // DPR-aware sizing
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Init stars
    const COUNT = 48;
    const STARS: Star[] = [];
    for (let i = 0; i < COUNT; i++) {
      STARS.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        a: Math.random() * 0.6 + 0.2,
      });
    }
    starsRef.current = STARS;

    const tick = () => {
      if (!ctx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Soft space haze
      const grd = ctx.createRadialGradient(w * 0.8, h * 0.1, 0, w * 0.8, h * 0.1, Math.max(w, h));
      grd.addColorStop(0, "rgba(168,236,253,0.06)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (const s of starsRef.current) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,236,253,${s.a})`;
        ctx.fill();

        if (!reducedRef.current) {
          s.x += s.vx;
          s.y += s.vy;

          // Slow drift wrap
          if (s.x < -5) s.x = w + 5;
          if (s.x > w + 5) s.x = -5;
          if (s.y < -5) s.y = h + 5;
          if (s.y > h + 5) s.y = -5;

          // Gentle twinkle
          s.a += (Math.random() - 0.5) * 0.01;
          s.a = Math.min(0.8, Math.max(0.15, s.a));
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // Static frame if reduced motion
    if (reducedRef.current) {
      tick();
      return () => {
        window.removeEventListener("resize", resize);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.65,
        mixBlendMode: "screen",
      }}
    />
  );
        }
