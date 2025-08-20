// components/EasterEggs.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * EasterEggs:
 *  - ZKGM text randomly pops around screen every 3s
 *  - Team handles trigger golden card (handled separately in Card)
 */
export default function EasterEggs() {
  const [eggs, setEggs] = useState<
    { id: number; x: number; y: number; size: number }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const x = Math.random() * 80 + 10; // % left
      const y = Math.random() * 70 + 10; // % top
      const size = Math.random() * 1.2 + 0.8; // scale

      setEggs((prev) => [...prev, { id, x, y, size }]);
      setTimeout(() => {
        setEggs((prev) => prev.filter((egg) => egg.id !== id));
      }, 2000); // vanish after 2s
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {eggs.map((egg) => (
          <motion.div
            key={egg.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: egg.size, y: -10 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.6 }}
            className="absolute text-[var(--color-accent)] font-[var(--font-supermolot)] select-none"
            style={{
              left: `${egg.x}%`,
              top: `${egg.y}%`,
              fontSize: "clamp(10px, 2vw, 22px)",
              textShadow: "0 0 6px rgba(168,236,253,0.7)",
            }}
          >
            ZKGM
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
