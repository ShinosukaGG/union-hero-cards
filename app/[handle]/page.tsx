// app/[handle]/page.tsx
"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function HeroCardPage() {
  const params = useParams();
  const handle = (params?.handle as string)?.replace(/^@/, "").toLowerCase();

  const isTeam =
    handle === "unionteam" || handle === "union_build" || handle === "union";

  const description = useMemo(() => {
    if (isTeam) {
      return `Congrats @${handle}, you’re part of the Union Core Team. 
      This golden Union Hero Card signifies your leadership in building the 
      zk-powered money lego future.`;
    }
    return `Congrats @${handle}, you are a chosen Union Hero. 
    Your participation and contributions in the Union ecosystem prove your place 
    in shaping the future of decentralized coordination.`;
  }, [handle, isTeam]);

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="flex flex-col items-center space-y-8 w-full max-w-lg">
        {/* Hero Card */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            width: "min(360px, 86vw)",
            aspectRatio: "3 / 5",
            background: isTeam
              ? "linear-gradient(160deg, #FFD700, #C9A635)"
              : "linear-gradient(160deg, #1A2435, #101826)",
            boxShadow: isTeam
              ? "0 0 60px rgba(255,215,0,0.35)"
              : "0 0 60px rgba(168,236,253,0.2)",
            border: isTeam
              ? "2px solid rgba(255,215,0,0.7)"
              : "2px solid rgba(168,236,253,0.4)",
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          whileTap={{ scale: 0.96 }}
        >
          {/* Avatar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2">
            <img
              src={`https://unavatar.io/x/${handle}`}
              alt={`${handle}'s avatar`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/pfp.png";
              }}
              className="rounded-full border-2 border-[#A8ECFD] shadow-lg"
              style={{
                width: 96,
                height: 96,
                objectFit: "cover",
                background: "#0F141C",
              }}
            />
          </div>

          {/* Title */}
          <div className="absolute top-[calc(96px+4.5rem)] w-full text-center">
            <h2
              style={{
                fontFamily: "var(--font-supermolot)",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: isTeam ? "#FFD700" : "#A8ECFD",
                letterSpacing: "0.02em",
              }}
            >
              Union Hero’s Card
            </h2>
          </div>

          {/* Description */}
          <div className="absolute bottom-24 px-6 text-center">
            <p
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "#C7D3E3",
              }}
            >
              {description}
            </p>
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Just revealed my Union Hero Cards! 🎉 

This is my proof of participation on @union_build 🐳

You can reveal yours at: union-hero-cards.vercel.app

Every Transaction, Tweet, and Contribution matters at Union 💪`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs text-center rounded-xl py-3 font-bold"
          style={{
            background: "linear-gradient(90deg, #1C2B3F, #152333)",
            color: "#A8ECFD",
            fontFamily: "var(--font-supermolot)",
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          whileTap={{ scale: 0.95 }}
        >
          Share on X
        </motion.a>

        {/* Copy Link Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/${handle}`
            );
            alert("Card link copied!");
          }}
          className="w-full max-w-xs text-center rounded-xl py-3 font-bold"
          style={{
            background: "#1A2435",
            color: "#9FB1C6",
            fontFamily: "var(--font-supermolot)",
          }}
        >
          Copy Your Card Link
        </button>
      </div>
    </section>
  );
}
