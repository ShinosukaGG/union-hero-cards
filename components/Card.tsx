// components/Card.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type CardProps = {
  handle: string;
  isTeam?: boolean;
};

export default function Card({ handle, isTeam }: CardProps) {
  const avatarUrl = `https://unavatar.io/x/${handle}`;
  const description = isTeam
    ? `Congratulations ${handle}, you are a core Union builder. Your vision and leadership drive the Union mission forward — shaping the future of interoperability.`
    : `Congratulations ${handle}, you are a chosen Union Hero. Your contributions, interactions, and energy strengthen the Union ecosystem. Keep building with us.`;

  return (
    <motion.div
      className={`relative w-[280px] md:w-[340px] aspect-[3/5] rounded-2xl shadow-lg p-4 flex flex-col items-center justify-between ${
        isTeam
          ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-4 border-yellow-300"
          : "bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-dark)] to-black border border-[var(--color-accent)]"
      }`}
      whileTap={{ scale: 0.95, rotate: 1 }}
      animate={{ boxShadow: ["0 0 20px rgba(168,236,253,0.7)", "0 0 40px rgba(168,236,253,0.9)"] }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    >
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-accent)] mb-4">
        <Image
          src={avatarUrl}
          alt={`${handle} avatar`}
          width={96}
          height={96}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/pfp.png";
          }}
        />
      </div>

      {/* Title */}
      <h2
        className={`text-xl font-bold mb-2 ${
          isTeam ? "text-black" : "text-[var(--color-text)]"
        }`}
      >
        Union Hero’s Card
      </h2>

      {/* Description */}
      <p
        className={`text-center text-sm leading-snug px-2 ${
          isTeam ? "text-black" : "text-[var(--color-muted)]"
        }`}
      >
        {description}
      </p>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full mt-4">
        <motion.a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Just revealed my Union Hero Cards! 🎉

This is my proof of participation on @union_build 🐳

You can reveal yours at: union-hero-cards.vercel.app

Every Transaction, Tweet, and Contribution matters at Union 💪`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center py-2 rounded-lg font-bold text-white bg-[var(--color-accent)]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Share on X
        </motion.a>

        <button
          className="w-full text-center py-2 rounded-lg font-medium bg-[var(--color-muted)] text-black"
          onClick={() =>
            navigator.clipboard.writeText(
              `${window.location.origin}/${handle}`
            )
          }
        >
          Copy Your Card Link
        </button>
      </div>
    </motion.div>
  );
}
