// components/Card.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Buttons from "./Buttons";
import { resolveAvatar, initialAvatarURL } from "@/lib/avatar";
import {
  BRAND,
  FONTS,
  TIMING,
  TEAM_WHITELIST,
  getHeroDescription,
} from "@/lib/constants";

type CardProps = { handle: string };
const normalize = (s: string) => String(s ?? "").trim().replace(/^@/, "").toLowerCase();

export default function Card({ handle }: CardProps) {
  const h = normalize(handle);
  const isTeam = TEAM_WHITELIST.has(h);

  // fast avatar path (compositor-friendly crossfade)
  const [avatar, setAvatar] = useState<string>(() => initialAvatarURL(h));
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let alive = true;
    resolveAvatar(h, { timeoutMs: TIMING.AVATAR_TIMEOUT_MS, preload: true }).then((url) => {
      if (!alive) return;
      setAvatar(url);
      setResolved(true);
    });
    return () => {
      alive = false;
    };
  }, [h]);

  const description = useMemo(() => getHeroDescription(h, isTeam), [h, isTeam]);

  const onTap = () => {
    try {
      (navigator as any).vibrate?.(18);
    } catch {}
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.article
        aria-label={`Union Hero Card for @${h}`}
        className="uc-card gpu"
        style={{
          width: "min(380px, 86vw)",
          aspectRatio: "3 / 5",
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          // SOLID base (not hollow)
          background: isTeam
            ? "radial-gradient(120% 80% at 90% -10%, rgba(255,215,0,0.10), transparent 60%), linear-gradient(180deg, #111726, #0D1320 70%, #0A0F19)"
            : "radial-gradient(120% 80% at 90% -10%, rgba(168,236,253,0.10), transparent 60%), linear-gradient(180deg, #101726, #0D1422 70%, #0A111C)",
          border: isTeam ? "1.5px solid rgba(255,215,0,0.65)" : `1px solid ${BRAND.BORDER_HARD}`,
          // no animated box-shadows → use overlay glow instead (see .uc-card__glow)
          transform: "translateZ(0)",
          willChange: "transform",
        }}
        whileTap={{ scale: 0.985, rotate: 0.25 }}
        onTap={onTap}
      >
        {/* glow overlay (compositor-only) */}
        <motion.div
          aria-hidden
          className="uc-card__glow"
          style={{
            position: "absolute",
            inset: "-10%",
            pointerEvents: "none",
            background: isTeam
              ? "radial-gradient(50% 50% at 50% 20%, rgba(255,215,0,0.25), transparent 70%), radial-gradient(80% 60% at 50% 120%, rgba(255,215,0,0.18), transparent 70%)"
              : "radial-gradient(50% 50% at 50% 20%, rgba(168,236,253,0.22), transparent 70%), radial-gradient(80% 60% at 50% 120%, rgba(168,236,253,0.16), transparent 70%)",
            mixBlendMode: "screen",
            transform: "translateZ(0)",
            willChange: "opacity, transform",
          }}
          animate={{ opacity: [0.55, 0.95, 0.55], y: [0, -4, 0] }}
          transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* shine sweep (transform-only) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-[46%] gpu"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 50%, transparent 100%)",
            transform: "rotate(35deg)",
            willChange: "transform, opacity",
          }}
          animate={{ x: ["-60%", "120%"], opacity: [0.0, 0.18, 0.0] }}
          transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.6 }}
        />

        {/* header row */}
        <div className="flex items-center justify-between px-4 pt-3">
          <div
            style={{
              fontFamily: FONTS.HEADING,
              color: isTeam ? BRAND.GOLD : BRAND.ACCENT,
              letterSpacing: ".02em",
              fontWeight: 700,
              fontSize: 14,
              opacity: 0.95,
              transform: "translateZ(0)",
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
              background: "rgba(0,0,0,0.28)",
              transform: "translateZ(0)",
            }}
          >
            {isTeam ? "UNION TEAM" : "UNION"}
          </div>
        </div>

        {/* avatar block */}
        <div
          className="mx-auto mt-4 rounded-xl overflow-hidden gpu"
          style={{
            width: "84%",
            aspectRatio: "1 / 1",
            border: `1px solid ${isTeam ? "rgba(255,215,0,0.55)" : BRAND.BORDER_HARD}`,
            background: "#0F141C",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
        >
          <motion.img
            key={avatar}
            src={avatar}
            alt={`@${h} avatar`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/pfp.png";
            }}
            className="w-full h-full object-cover"
            initial={{ opacity: 0.0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1.0 }}
            transition={{ duration: resolved ? 0.18 : 0.36, ease: "easeOut" }}
            style={{ transform: "translateZ(0)", willChange: "opacity, transform" }}
          />
        </div>

        {/* title */}
        <h2
          className="text-center mt-3"
          style={{
            fontFamily: FONTS.HEADING,
            fontWeight: 700,
            fontSize: 20,
            color: isTeam ? BRAND.GOLD : BRAND.ACCENT,
            letterSpacing: ".02em",
            transform: "translateZ(0)",
          }}
        >
          Union Hero’s Card
        </h2>

        {/* description */}
        <p
          className="px-4 mt-2 text-center"
          style={{
            fontFamily: FONTS.BODY,
            color: BRAND.TEXT,
            fontSize: 14.5,
            lineHeight: 1.55,
            transform: "translateZ(0)",
          }}
        >
          {description}
        </p>
      </motion.article>

      <Buttons handle={h} />
    </div>
  );
              }
