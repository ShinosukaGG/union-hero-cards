// components/Card.tsx
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Buttons from "./Buttons";
import { BRAND, FONTS, TEAM_WHITELIST } from "@/lib/constants";

type CardProps = { handle: string };

// normalize to lowercase, strip leading @
const norm = (s: string) => String(s ?? "").trim().replace(/^@/, "").toLowerCase();

function pickAvatar(handle: string, isTeam: boolean) {
  if (isTeam) return "/pfp15.png";
  // deterministic pick 1–14 per handle (no flicker on re-render)
  const seed = Array.from(handle).reduce((a, c) => a + c.charCodeAt(0), 0);
  const idx = (seed % 14) + 1; // 1..14
  return `/pfp${idx}.png`;
}

const USER_QUOTES = [
  "Building the money-lego layer of DeFi.",
  "Proofs faster than a blink 👁️",
  "Where Bitcoin meets Ethereum in 200ms.",
  "Union is community, not just code.",
  "Stake to vote, vote to build.",
  "Cross-chain without compromise.",
  "Scaling trust with ZK.",
  "Your keys, your future, our Union.",
  "One network to unite them all.",
  "DeFi’s backbone, powered by Union.",
  "Interoperability is destiny.",
  "From testnet to mainnet, with you.",
  "Union turns yaps into actions.",
  "Decentralized power, community driven.",
];

const TEAM_QUOTE = "We don’t just build Union, we are Union.";

export default function Card({ handle }: CardProps) {
  const h = norm(handle);
  const isTeam = TEAM_WHITELIST.has(h);

  const avatar = useMemo(() => pickAvatar(h, isTeam), [h, isTeam]);

  const quote = useMemo(() => {
    if (isTeam) return TEAM_QUOTE;
    // deterministic quote selection per handle
    const seed = Array.from(h).reduce((a, c) => a + (c.charCodeAt(0) * 7), 0);
    return USER_QUOTES[seed % USER_QUOTES.length];
  }, [h, isTeam]);

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
          background: isTeam
            ? "radial-gradient(120% 80% at 90% -10%, rgba(255,215,0,0.10), transparent 60%), linear-gradient(180deg, #111726, #0D1320 70%, #0A0F19)"
            : "radial-gradient(120% 80% at 90% -10%, rgba(168,236,253,0.10), transparent 60%), linear-gradient(180deg, #101726, #0D1422 70%, #0A111C)",
          border: isTeam ? "1.5px solid rgba(255,215,0,0.65)" : `1px solid ${BRAND.BORDER_HARD}`,
          transform: "translateZ(0)",
          willChange: "transform",
        }}
        whileTap={{ scale: 0.985, rotate: 0.25 }}
        onTap={onTap}
      >
        {/* soft glow overlay (transform/opacity only) */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-10%",
            pointerEvents: "none",
            background: isTeam
              ? "radial-gradient(50% 50% at 50% 20%, rgba(255,215,0,0.25), transparent 70%), radial-gradient(80% 60% at 50% 120%, rgba(255,215,0,0.18), transparent 70%)"
              : "radial-gradient(50% 50% at 50% 20%, rgba(168,236,253,0.22), transparent 70%), radial-gradient(80% 60% at 50% 120%, rgba(168,236,253,0.16), transparent 70%)",
            mixBlendMode: "screen",
          }}
          animate={{ opacity: [0.55, 0.95, 0.55], y: [0, -4, 0] }}
          transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* header */}
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
              background: "rgba(0,0,0,0.28)",
            }}
          >
            {isTeam ? "UNION TEAM" : "UNION"}
          </div>
        </div>

        {/* avatar */}
        <div
          className="mx-auto mt-4 rounded-xl overflow-hidden"
          style={{
            width: "84%",
            aspectRatio: "1 / 1",
            border: `1px solid ${isTeam ? "rgba(255,215,0,0.55)" : BRAND.BORDER_HARD}`,
            background: "#0F141C",
          }}
        >
          <img src={avatar} alt={`@${h} avatar`} className="w-full h-full object-cover" />
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
          }}
        >
          Union Hero’s Card
        </h2>

        {/* quote */}
        <p
          className="px-4 mt-2 text-center"
          style={{
            fontFamily: FONTS.BODY,
            color: BRAND.TEXT,
            fontSize: 14.5,
            lineHeight: 1.55,
          }}
        >
          “{quote}”
        </p>
      </motion.article>

      <Buttons handle={h} />
    </div>
  );
}
