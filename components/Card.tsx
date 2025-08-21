// components/Card.tsx
"use client";

import Image from "next/image";
import { useMemo } from "react";

interface CardProps {
  name: string;
  role?: string;
  isTeam?: boolean;
}

export default function Card({ name, role, isTeam }: CardProps) {
  // Randomize avatar only once per render
  const avatarSrc = useMemo(() => {
    if (isTeam) return "/pfp15.png";
    const rand = Math.floor(Math.random() * 14) + 1; // 1–14
    return `/pfp${rand}.png`;
  }, [isTeam]);

  return (
    <div className="relative w-[320px] h-[420px] rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      {/* Background solid */}
      <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800" />

      {/* Avatar */}
      <div className="relative flex justify-center mt-6">
        <Image
          src={avatarSrc}
          alt="profile"
          width={120}
          height={120}
          className="rounded-full border-4 border-white dark:border-neutral-900 shadow-md"
        />
      </div>

      {/* Name & Role */}
      <div className="text-center mt-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{name}</h2>
        {role && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{role}</p>
        )}
      </div>

      {/* Logo */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <Image
          src="/union-logo.svg"
          alt="Union Logo"
          width={80}
          height={80}
          className="opacity-80"
        />
      </div>
    </div>
  );
}
