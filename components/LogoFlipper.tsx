// components/LogoFlipper.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { TIMING } from "@/lib/constants";

/**
 * LogoFlipper
 * - Renders /union-logo.svg
 * - Performs a quick flip every TIMING.LOGO_FLIP_MS (default 5s)
 * - Keeps things performant: short burst, then idle
 *
 * Usage in Header.tsx:
 *   <LogoFlipper size={40} />
 */
export default function LogoFlipper({ size = 40 }: { size?: number }) {
  const controls = useAnimationControls();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let raf: number | null = null;
    let timer: number | null = null;

    const run = async () => {
      // quick flip sequence
      await controls.start({
        rotateY: [0, 360, 0],
        transition: { duration: 0.9, ease: "easeInOut" },
      });
      // settle back at 0
      await controls.start({ rotateY: 0, transition: { duration: 0.1 } });

      // schedule next
      timer = window.setTimeout(() => {
        raf = requestAnimationFrame(run);
      }, TIMING.LOGO_FLIP_MS);
    };

    // kick off after tiny delay to avoid building during layout shift
    timer = window.setTimeout(() => {
      raf = requestAnimationFrame(run);
    }, 800);

    return () => {
      if (timer) clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [controls]);

  return (
    <motion.div
      aria-label="Union logo"
      animate={controls}
      style={{
        width: size,
        height: size,
        willChange: "transform",
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Use next/image for priority decode; keep brand asset untouched */}
      <Image
        src="/union-logo.svg"
        alt="Union"
        width={size}
        height={size}
        priority={mounted}
        draggable={false}
      />
    </motion.div>
  );
}
