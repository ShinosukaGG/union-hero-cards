// components/ZkgmEasterEgg.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIMING } from "@/lib/constants";

/**
 * ZkgmEasterEgg
 * - Every few seconds, spawns a small "ZKGM" pop-up in random positions
 * - They animate in and out smoothly
 * - Uses AnimatePresence for clean mount/unmount
 *
 * Usage:
 *   <ZkgmEasterEgg />
 */
export default function ZkgmEasterEgg() {
  const [popups, setPopups] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    let idCounter = 0;
    const interval = setInterval(() => {
      const id = idCounter++;
      const x = Math.random() * 80 + 10; // vw %
      const y = Math.random() * 80 + 10; // vh %
      setPopups((prev) => [...prev, { id, x, y }]);

      // remove after 2.5s
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 2500);
    }, TIMING.ZKGM_POPUP_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {popups.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: `${p.y}vh`,
              left: `${p.x}vw`,
              fontSize: "1rem",
              fontFamily: "var(--font-brand, sans-serif)",
              fontWeight: 700,
              color: "var(--color-accent)",
              textShadow: "0 0 8px rgba(255,255,255,0.8)",
              userSelect: "none",
            }}
          >
            ZKGM
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
