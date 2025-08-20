// components/EasterEggs.tsx
"use client";

import { useEffect, useState } from "react";

const ZKGM_EGG_INTERVAL = 3000; // every 3 seconds

export default function EasterEggs() {
  const [eggs, setEggs] = useState<
    { id: number; top: string; left: string }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const top = `${Math.random() * 80 + 10}%`;
      const left = `${Math.random() * 80 + 10}%`;
      setEggs((prev) => [...prev, { id, top, left }]);

      setTimeout(() => {
        setEggs((prev) => prev.filter((egg) => egg.id !== id));
      }, 2000); // disappear after 2s
    }, ZKGM_EGG_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {eggs.map((egg) => (
        <span
          key={egg.id}
          style={{ top: egg.top, left: egg.left }}
          className="absolute text-sm text-teal-400 animate-ping"
        >
          zkgm
        </span>
      ))}
    </>
  );
}
