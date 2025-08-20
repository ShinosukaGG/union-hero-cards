// app/components/EasterEggs.tsx
"use client";

import { useEffect, useState } from "react";
import { TIMING } from "@/lib/constants";

/**
 * EasterEggs component:
 * - ZKGM pop-ups appear at random spots every TIMING.ZKGM_POP_MS ms
 * - They fade out after a short time
 * - You can drop in more eggs later (like confetti or particle bursts)
 */
export default function EasterEggs() {
  const [eggs, setEggs] = useState<{ id: number; x: number; y: number }[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // random spot in viewport
      const x = Math.random() * 80 + 10; // % (10%–90%)
      const y = Math.random() * 70 + 15; // % (15%–85%)
      const id = counter;

      setEggs((prev) => [...prev, { id, x, y }]);
      setCounter((c) => c + 1);

      // remove after 2.5s
      setTimeout(() => {
        setEggs((prev) => prev.filter((e) => e.id !== id));
      }, 2500);
    }, TIMING.ZKGM_POP_MS);

    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {eggs.map((egg) => (
        <span
          key={egg.id}
          className="absolute text-accent font-bold text-sm animate-egg-fade"
          style={{
            left: `${egg.x}%`,
            top: `${egg.y}%`,
            fontFamily: "var(--font-jetbrains)",
          }}
        >
          ZKGM
        </span>
      ))}
    </div>
  );
}
