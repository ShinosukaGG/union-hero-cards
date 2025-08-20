// components/Buttons.tsx
"use client";

import { motion } from "framer-motion";
import * as React from "react";

type ButtonsProps = {
  /** normalized handle without '@' */
  handle: string;
  /** optional explicit URL to copy; defaults to current page or /{handle} */
  cardUrl?: string;
  /** called after copy succeeds */
  onCopied?: () => void;
};

/**
 * Two primary CTAs for the card page:
 * - Share on X (heartbeat glow, opens tweet intent)
 * - Copy Your Card Link (lighter, copies URL)
 *
 * Branding:
 *  - Accent: #A8ECFD
 *  - Neutrals: greys on dark
 * Fonts:
 *  - Title buttons in Supermolot (var(--font-supermolot))
 */
export default function Buttons({ handle, cardUrl, onCopied }: ButtonsProps) {
  const url =
    cardUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/${encodeURIComponent(handle)}`
      : `/${encodeURIComponent(handle)}`);

  const tweetText = `Just revealed my Union Hero Cards! 🎉 

This is my proof of participation on @union_build 🐳

You can reveal yours at: union-hero-cards.vercel.app

Every Transaction, Tweet, and Contribution matters at Union 💪`;

  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;

  return (
    <div className="w-full flex flex-col gap-3 items-center">
      {/* Share on X — heartbeat / glow */}
      <motion.a
        href={tweetHref}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-xs text-center rounded-xl py-3 font-bold focus:outline-none"
        style={{
          background: "linear-gradient(90deg, #1C2B3F, #152333)",
          color: "#A8ECFD",
          fontFamily: "var(--font-supermolot)",
          letterSpacing: ".02em",
          boxShadow:
            "0 0 20px rgba(168,236,253,0.25), inset 0 0 0 1px rgba(168,236,253,0.25)",
          border: "1px solid rgba(168,236,253,0.25)",
        }}
        animate={{ scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        Share on X
      </motion.a>

      {/* Copy link — lighter grey */}
      <button
        onClick={() => {
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
              // haptic tap if supported
              try {
                (navigator as any).vibrate?.(20);
              } catch {}
              onCopied?.();
            });
          }
        }}
        className="w-full max-w-xs text-center rounded-xl py-3 font-bold focus:outline-none"
        style={{
          background: "#1A2435",
          color: "#9FB1C6",
          fontFamily: "var(--font-supermolot)",
          letterSpacing: ".02em",
          border: "1px solid rgba(159,177,198,0.25)",
        }}
      >
        Copy Your Card Link
      </button>
    </div>
  );
}
