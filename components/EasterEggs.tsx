// components/ZkgmEasterEgg.tsx
"use client";

import { useEffect, useState } from "react";
import { BRAND, TIMING } from "@/lib/constants";

/**
 * ZKGM Easter egg:
 * - Spawns tiny "ZKGM" pop-ups at random viewport positions every TIMING.ZKGM_POP_MS
 * - Each popup fades and floats up, then is removed
 * - Respects reduced motion by not animating if user prefers reduced motion
 */
type Popup = { id: number; x: number; y: number };

export default function ZkgmEasterEgg() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = () => setPrefersReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    const interval = setInterval(() => {
      const id = Math.random();
      const x = Math.random() * 92 + 2; // 2% to 94% to avoid edges
      const y = Math.random() * 80 + 10; // 10% to 90% vertically

      // Add new popup
      setPopups((prev) => [...prev, { id, x, y }]);

      // Auto-remove after ~2.5s (matches CSS animation)
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 2500);
    }, TIMING.ZKGM_POP_MS); // ✅ use the correct constant name

    return () => clearInterval(interval);
  }, [prefersReduced]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      {popups.map((p) => (
        <span
          key={p.id}
          className="uc-egg"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: BRAND.ACCENT,
          }}
        >
          ZKGM
        </span>
      ))}
    </div>
  );
}
