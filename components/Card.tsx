// components/Card.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Buttons from "./Buttons";
import { resolveAvatar, initialAvatarURL } from "@/app/lib/avatar";
import { BRAND, FONTS, TIMING, TEAM_WHITELIST, getHeroDescription } from "@/app/lib/constants";

type CardProps = {
  /** X handle without @ (can include @; we normalize anyway) */
  handle: string;
};

const normalize = (s: string) => String(s ?? "").trim().replace(/^@/, "").toLowerCase();

/**
 * Union Hero Card
 * - 3:5 aspect, glowing border, centered avatar
 * - Title: “Union Hero’s Card”
 * - Description: 4–5 lines (team gets special golden variant)
 * - On tap/click: light haptic + tiny shake
 * - Avatar: fast optimistic URL, then resilient multi-fallback (→ /pfp.png)
 */
export default function Card({ handle }: CardProps) {
  const h = normalize(handle);
  const isTeam = TEAM_WHITELIST.has(h);

  // Avatar pipeline: start with optimistic URL to paint ASAP, then resolve and crossfade
  const [avatar, setAvatar] = useState<string>(() => initialAvatarURL(h));
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let alive = true;
    // Race-based resolver with timeout & preload
    resolveAvatar(h, { timeoutMs: TIMING.AVATAR_TIMEOUT_MS, preload: true }).then((url) => {
      if (!alive) return;
      setAvatar(url);
      setResolved(true);
    });
    return () => {
      alive = false;
    };
  }, [h]);

  // Description text (strict to brand fonts/colors from constants)
  const description = useMemo(() => getHeroDescription(h, isTeam), [h, isTeam]);

  // Haptic + little shake on click
  const onTap = () => {
    try {
      (navigator as any).vibrate?.(20);
    } catch {}
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card */}
      <motion.article
        aria-label={`Union Hero Card for @${h}`}
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: "min(360px, 86vw)",
          aspectRatio: "3 / 5",
          background: isTeam
            ? "linear-gradient(165deg, rgba(255,215,0,0.22), rgba(0,0,0,0.35)), radial-gradient(120% 80% at 90% -10%, rgba(255,215,0,0.18), transparent 60%), #101826"
            : "linear-gradient(165deg, rgba(168,236,253,0.10), rgba(0,0,0,0.35)), radial-gradient(120% 80% at 90% -10%, rgba(168,236,253,0.12), transparent 60%), #101826",
          border: isTeam ? "2px solid rgba(255,215,0,0.7)" : `1px solid ${BRAND.BORDER_HARD}`,
          boxShadow: isTeam
            ? "0 0 60px rgba(255,215,0,0.35), inset 0 0 0 1px rgba(255,215,0,0.35)"
            : "0 0 50px rgba(168,236,253,0.18), inset 0 0 0 1px rgba(168,236,253,0.22)",
        }}
        whileTap={{ scale: 0.98, rotate: 0.3 }}
        onTap={onTap}
        animate={{
          boxShadow: isTeam
            ? [
                "0 0 24px rgba(255,215,0,0.25), inset 0 0 0 1px rgba(255,215,0,0.35)",
                "0 0 60px rgba(255,215,0,0.45), inset 0 0 0 1px rgba(255,215,0,0.35)",
                "0 0 24px rgba(255,215,0,0.25), inset 0 0 0 1px rgba(255,215,0,0.35)",
              ]
            : [
                "0 0 20px rgba(168,236,253,0.18), inset 0 0 0 1px rgba(168,236,253,0.22)",
                "0 0 44px rgba(168,236,253,0.30), inset 0 0 0 1px rgba(168,236,253,0.22)",
                "0 0 20px rgba(168,236,253,0.18), inset 0 0 0 1px rgba(168,236,253,0.22)",
              ],
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Diagonal shine sweep */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-[46%]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
            transform: "rotate(35deg)",
          }}
          animate={{ x: ["-60%", "120%"] }}
          transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.6 }}
        />

        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-3">
          <div
            style={{
              fontFamily: FONTS.HEADING,
              color: isTeam ? BRAND.GOLD : BRAND.ACCENT,
              letterSpacing: ".02em",
              fontWeight: 700,
              fontSize: 14,
              opacity: 0.95,
            }}
          >
            @{h}
          </div>
          <div
            className="px-2 py-1 rounded-md"
            style={{
              fontFamily: FONTS.BODY,
              border: `1px solid ${isTeam ? "rgba(255,215,0,0.45)" : BRAND.BORDER_SOFT}`,
              color: isTeam ? BRAND.GOLD : BRAND.TEXT,
              fontSize: 12,
              background: "rgba(0,0,0,0.2)",
            }}
          >
            {isTeam ? "UNION TEAM" : "UNION"}
          </div>
        </div>

        {/* Avatar well */}
        <div
          className="mx-auto mt-4 rounded-xl overflow-hidden"
          style={{
            width: "84%",
            aspectRatio: "1 / 1",
            border: `1px solid ${isTeam ? "rgba(255,215,0,0.55)" : BRAND.BORDER_HARD}`,
            background: "#0F141C",
            boxShadow: isTeam
              ? "inset 0 0 40px rgba(255,215,0,0.15)"
              : "inset 0 0 40px rgba(168,236,253,0.12)",
          }}
        >
          {/* Blur placeholder behind image */}
          <div
            aria-hidden
            className="w-full h-full"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(40% 40% at 50% 50%, rgba(168,236,253,0.08), transparent 70%)",
              filter: "blur(18px)",
            }}
          />
          {/* Actual avatar */}
          <motion.img
            key={avatar} // force crossfade when URL changes
            src={avatar}
            alt={`@${h} avatar`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onError={(e) => {
              // final safety net; avatar.ts already falls back to /pfp.png
              (e.currentTarget as HTMLImageElement).src = "/pfp.png";
            }}
            className="w-full h-full object-cover"
            initial={{ opacity: 0.0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1.0 }}
            transition={{ duration: resolved ? 0.18 : 0.36, ease: "easeOut" }}
          />
        </div>

        {/* Title */}
        <h2
          className="text-center mt-3"
          style={{
            fontFamily: FONTS.HEADING,
            fontWeight: 700,
            fontSize: 20,
            color: isTeam ? BRAND.GOLD : BRAND.ACCENT,
            letterSpacing: ".02em",
          }}
        >
          Union Hero’s Card
        </h2>

        {/* Description */}
        <p
          className="px-4 mt-2 text-center"
          style={{
            fontFamily: FONTS.BODY,
            color: BRAND.TEXT,
            fontSize: 14.5,
            lineHeight: 1.55,
          }}
        >
          {description}
        </p>
      </motion.article>

      {/* CTAs */}
      <Buttons handle={h} />
    </div>
  );
}
