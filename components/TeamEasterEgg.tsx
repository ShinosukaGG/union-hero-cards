// components/TeamEasterEgg.tsx
"use client";

import { motion } from "framer-motion";

interface TeamEasterEggProps {
  username: string;
}

/**
 * TeamEasterEgg
 * - Special golden card frame + description if user is in whitelist
 * - Shows a glowing golden border effect
 */
export default function TeamEasterEgg({ username }: TeamEasterEggProps) {
  const teamWhitelist = [
    "0xkaiserkarel",
    "corcoder",
    "e_beriker",
    "luknyb",
    "eastwood_eth",
  ];

  const isTeam = teamWhitelist.includes(username.toLowerCase());

  if (!isTeam) return null;

  return (
    <motion.div
      className="absolute inset-0 rounded-xl border-4 border-yellow-400"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.3, 1, 0.3],
        boxShadow: [
          "0 0 10px #FFD700",
          "0 0 30px #FFD700",
          "0 0 10px #FFD700",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ pointerEvents: "none" }}
    />
  );
}

/**
 * Example Usage inside HeroCard:
 * 
 * <div className="relative">
 *   <HeroCard username={username} />
 *   <TeamEasterEgg username={username} />
 * </div>
 */
