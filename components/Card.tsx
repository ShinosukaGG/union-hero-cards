// components/Card.tsx
"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

export type CardData = {
  handle: string;                 // normalized (lowercase, no leading @)
  displayName?: string | null;    // optional nice name
  avatar?: string | null;         // URL to avatar image
  rarity?: string | null;         // "common" | "rare" | "epic" | "legend" | ...
  wave?: number | null;           // optional wave/batch number
  isTeam?: boolean;               // apply Union team aura + label
};

export type CardProps = {
  data: CardData;
  className?: string;
  /**
   * Show the small CTA row beneath the card.
   * If provided, `onCopyLink` will be used by the "Copy personal link" button.
   */
  showCTAs?: boolean;
  onCopyLink?: () => void;
  onSearchAgain?: () => void;
};

/** Capitalize rarity label nicely */
function rarityLabel(rarity?: string | null) {
  const r = String(rarity || "common");
  return r.slice(0, 1).toUpperCase() + r.slice(1).toLowerCase();
}

export default function Card({
  data,
  className,
  showCTAs,
  onCopyLink,
  onSearchAgain,
}: CardProps) {
  const handle = String(data.handle || "").toLowerCase().replace(/^@/, "");
  const rarityClass = String(data.rarity || "common").toLowerCase();
  const titleText = data.displayName || handle;

  // Subtle one-shot glitch for zk* handles (mini Easter egg)
  useEffect(() => {
    const el = document.getElementById("uc-card");
    if (!el) return;
    if (!handle.includes("zk")) return;
    let t = 0;
    const id = setInterval(() => {
      t++;
      (el as HTMLElement).style.filter = `contrast(1) hue-rotate(${(Math.random() * 10 - 5).toFixed(
        1
      )}deg)`;
      if (t > 14) {
        clearInterval(id);
        (el as HTMLElement).style.filter = "";
      }
    }, 60);
    return () => clearInterval(id);
  }, [handle]);

  // Crosshair cursor for *dev* handles (another Easter egg)
  useEffect(() => {
    if (handle.includes("dev")) document.body.style.cursor = "crosshair";
    return () => {
      if (handle.includes("dev")) document.body.style.cursor = "";
    };
  }, [handle]);

  return (
    <div className={`uc-cardWrap ${className ?? ""}`}>
      <div className="uc-cardOuter">
        <motion.div
          id="uc-card"
          className={`uc-card ${rarityClass} ${data.isTeam ? "team uc-teamAura" : ""}`}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="uc-shine" />

          <div className="uc-headerRow">
            <div className="uc-handle">@{handle}</div>
            <div className="uc-badge">
              {data.isTeam ? "Union Team" : data.wave ? `Wave ${data.wave}` : "Union"}
            </div>
          </div>

          <div className="uc-heroImg">
            {data.avatar ? (
              <img
                src={data.avatar}
                alt={`${titleText} avatar`}
                onError={(e: any) => (e.currentTarget.style.opacity = 0)}
              />
            ) : (
              <span style={{ opacity: 0.7 }}>No avatar</span>
            )}
          </div>

          <div className="uc-body">
            <div className="uc-ogRow">
              <div className="uc-og">{data.isTeam ? "CORE" : "OG"}</div>
              <div className="uc-desc">
                {data.isTeam
                  ? "Union core contributor."
                  : `${rarityLabel(data.rarity)} on the allowlist.`}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showCTAs ? (
        <div className="uc-ctaRow">
          {onCopyLink ? (
            <button
              className="uc-copy"
              onClick={() => {
                onCopyLink();
              }}
            >
              Copy personal link
            </button>
          ) : null}
          {onSearchAgain ? (
            <button className="uc-copy" onClick={onSearchAgain}>
              Search again
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
