// components/Header.tsx
"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-sm"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.18) 60%, rgba(0,0,0,0))",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Union Hero Cards – Home"
        >
          <img
            src="/union-logo.svg"
            alt="Union"
            className="uc-logo gpu"
            style={{
              height: "44px", // ⬅️ bigger logo
              width: "auto",
              transform: "translateZ(0)",
              willChange: "transform, filter",
              filter: "drop-shadow(0 0 10px rgba(168,236,253,0.08))",
            }}
          />
        </Link>

        <div
          className="font-semibold tracking-wide"
          style={{ fontSize: 14, opacity: 0.9 }}
        >
          Union Hero Cards
        </div>
      </div>
    </header>
  );
}
