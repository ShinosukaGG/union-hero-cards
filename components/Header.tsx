// components/Header.tsx
// Sticky header with Union logo (left) and title (right)

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-black border-b border-[#1a1a1a] flex items-center justify-between px-6 z-50">
      {/* Animated logo with flip every 5s */}
      <motion.div
        animate={{ rotateY: [0, 360, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="w-10 h-10"
      >
        <Link href="/">
          <Image
            src="/union-logo.svg"
            alt="Union"
            width={40}
            height={40}
            priority
          />
        </Link>
      </motion.div>

      <h1 className="text-[#A8ECFD] font-bold text-lg tracking-wide">
        Union Hero Cards
      </h1>
    </header>
  );
}
