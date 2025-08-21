// components/ZkgmEasterEgg.tsx
"use client";

import { useEffect, useState } from "react";
import { BRAND, TIMING } from "@/lib/constants";

type Popup = {
  id: number;
  x: number;
  y: number;
};

export default function ZkgmEasterEgg() {
  const [popups, setPopups] = useState<Popup[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Math.random();
      const x = Math.random() * 80 + 10; // keep inside safe area
      const y = Math.random() * 80 + 10;

      setPopups((prev) => [...prev, { id, x, y }]);

      // remove after ~2.5s
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 2500);
    }, TIMING.ZKGM_POP_MS); // ✅ use existing constant

    return () => clearInterval(interval);
  }, []);

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
          className="uc-zkgm-popup"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: BRAND.ACCENT,
          }}
        >
          zkGM ✨
        </span>
      ))}
    </div>
  );
}
