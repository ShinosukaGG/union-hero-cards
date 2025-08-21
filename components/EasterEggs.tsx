// components/EasterEggs.tsx
"use client";

import { useEffect, useState } from "react";
import { BRAND, TIMING } from "@/lib/constants";

const WORDS = ["UNION", "ZK", "GM", "🪄", "⚡", "🥚"];

type Egg = {
  id: number;
  text: string;
  x: number;
  y: number;
};

export default function EasterEggs() {
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // respect reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = () => setPrefersReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // periodically spawn floating words/emojis
  useEffect(() => {
    if (prefersReduced) return;

    const interval = setInterval(() => {
      const id = Math.random();
      const text = WORDS[Math.floor(Math.random() * WORDS.length)];
      const x = Math.random() * 90 + 5; // safe margins
      const y = Math.random() * 80 + 10;

      setEggs((prev) => [...prev, { id, text, x, y }]);

      // remove after animation ends (~3s)
      setTimeout(() => {
        setEggs((prev) => prev.filter((egg) => egg.id !== id));
      }, 3000);
    }, TIMING.CARD_PULSE_MS);

    return () => clearInterval(interval);
  }, [prefersReduced]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {eggs.map((egg) => (
        <span
          key={egg.id}
          className="uc-egg"
          style={{
            left: `${egg.x}%`,
            top: `${egg.y}%`,
            color: BRAND.ACCENT,
          }}
        >
          {egg.text}
        </span>
      ))}
    </div>
  );
}
