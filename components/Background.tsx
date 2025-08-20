// components/Background.tsx
"use client";

/**
 * Cosmic background for the whole site.
 * - Layered radial/linear gradients for deep-space look
 * - Optional drifting starfield via <Particles /> (respects reduced motion)
 * - Sits behind all content (z-index 0) with pointer-events: none
 *
 * Usage (in app/layout.tsx):
 *   <body> 
 *     <Background />
 *     <Header />
 *     <main>…</main>
 *   </body>
 */

import React from "react";
import dynamic from "next/dynamic";

// Lazy-load the starfield so first paint is instant
const Particles = dynamic(() => import("./Particles"), { ssr: false, loading: () => null });

export default function Background() {
  return (
    <>
      {/* Base cosmic gradient */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            // Outer deep space
            "radial-gradient(1200px 800px at 80% -10%, rgba(168,236,253,0.08) 0%, transparent 60%), " +
            // Soft vertical depth
            "linear-gradient(180deg, #0B0F16 0%, #0D1117 35%, #0D1117 100%)",
        }}
      />

      {/* Subtle vignettes for depth */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            // Left haze
            "radial-gradient(700px 500px at 10% 40%, rgba(168,236,253,0.05), transparent 60%), " +
            // Bottom-right haze
            "radial-gradient(900px 600px at 95% 85%, rgba(168,236,253,0.04), transparent 70%)",
          mixBlendMode: "screen",
          opacity: 0.9,
        }}
      />

      {/* Subtle grid (barely visible, adds structure) */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px, 60px 60px",
          backgroundPosition: "0 0, 0 0",
          maskImage:
            "radial-gradient(1000px 700px at 50% 20%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.2) 100%)",
          opacity: 0.25,
        }}
      />

      {/* Diagonal aurora sweep (very soft, loops via CSS keyframe) */}
      <div
        aria-hidden
        className="uc-aurora"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      {/* Drifting particles (canvas) */}
      <Particles />
      <style jsx global>{`
        /* Aurora sweep animation — subtle, long loop */
        @keyframes ucAuroraSweep {
          0% {
            transform: translate3d(-15%, -10%, 0) rotate(12deg);
            opacity: 0.25;
          }
          50% {
            transform: translate3d(5%, 0%, 0) rotate(12deg);
            opacity: 0.35;
          }
          100% {
            transform: translate3d(-15%, -10%, 0) rotate(12deg);
            opacity: 0.25;
          }
        }
        .uc-aurora::before {
          content: "";
          position: absolute;
          inset: -40%;
          background: radial-gradient(
              60% 50% at 40% 50%,
              rgba(168, 236, 253, 0.11) 0%,
              transparent 70%
            ),
            radial-gradient(
              60% 50% at 60% 50%,
              rgba(168, 236, 253, 0.08) 0%,
              transparent 70%
            );
          filter: blur(12px);
          animation: ucAuroraSweep 16s ease-in-out infinite;
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .uc-aurora::before {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
