// app/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/** Local, self-contained unrevealed card (3:5) that spins slowly with a big “?” */
function UnrevealedCard() {
  return (
    <motion.div
      aria-label="Unrevealed Union Card"
      className="relative rounded-2xl border border-[#1E2633] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      style={{ width: "min(360px, 86vw)", aspectRatio: "3 / 5" }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: 24 }}
    >
      {/* holo-ish background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 80% -10%, rgba(168,236,253,0.08), transparent 60%), linear-gradient(180deg, #131723, #0C1018)",
        }}
      />
      {/* border glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(40,60,80,0.7), 0 0 40px rgba(168,236,253,0.08)",
        }}
      />
      {/* big question mark */}
      <div className="absolute inset-0 grid place-items-center">
        <span
          className="select-none"
          style={{
            fontFamily: "var(--font-supermolot)",
            fontWeight: 700,
            fontSize: "clamp(72px, 16vw, 140px)",
            color: "#A8ECFD",
            textShadow: "0 0 24px rgba(168,236,253,0.45), 0 0 60px rgba(168,236,253,0.25)",
            letterSpacing: "0.02em",
          }}
        >
          ?
        </span>
      </div>
      {/* subtle diagonal shine pass */}
      <motion.div
        className="absolute -inset-[40%] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
          transform: "rotate(35deg)",
        }}
        animate={{ x: ["-60%", "120%"] }}
        transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.6 }}
      />
    </motion.div>
  );
}

export default function Landing() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [typed, setTyped] = useState(false);

  const placeholder = useMemo(
    () => (value.toLowerCase().includes("gm") ? "gm, hero ☕" : "@your_handle"),
    [value]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = value.trim().replace(/^@/, "").toLowerCase();
    if (!h) return;
    router.push(`/${encodeURIComponent(h)}`);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
        {/* Copy */}
        <div className="space-y-5">
          <h1
            className="leading-[1.05] m-0"
            style={{
              fontFamily: "var(--font-supermolot)",
              fontWeight: 700,
              fontSize: "clamp(28px, 4.2vw, 56px)",
              letterSpacing: ".01em",
            }}
          >
            Reveal your <span style={{ color: "#A8ECFD" }}>Union Hero Card</span>
          </h1>
          <p
            className="text-[#C7D3E3]"
            style={{
              fontFamily: "var(--font-jetbrains)",
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            This isn’t a waitlist — it’s your on-chain identity’s badge of honor.
            Enter your X handle to reveal a glowing Union Hero card, tailored to you.
          </p>

          {/* Search */}
          <form onSubmit={handleSubmit} className="mt-4">
            <motion.div
              className="rounded-xl border overflow-hidden bg-[#0E141E]"
              style={{ borderColor: "#253041" }}
              animate={
                typed
                  ? {
                      boxShadow: [
                        "0 0 0 0 rgba(168,236,253,0.0)",
                        "0 0 0 6px rgba(168,236,253,0.10)",
                        "0 0 0 0 rgba(168,236,253,0.0)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="flex items-center">
                <input
                  aria-label="Enter your X handle"
                  className="w-full bg-transparent outline-none px-4 md:px-5 py-3.5 md:py-4 text-[15px] md:text-[16px]"
                  style={{
                    color: "#E8ECF1",
                    fontFamily: "var(--font-jetbrains)",
                  }}
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (!typed) setTyped(true);
                  }}
                  onBlur={() => setTyped(false)}
                  autoComplete="off"
                />
                <motion.button
                  type="submit"
                  className="px-4 md:px-5 py-3.5 md:py-4 font-bold"
                  style={{
                    fontFamily: "var(--font-supermolot)",
                    background:
                      "linear-gradient(180deg, #172333, #101826)",
                    color: "#A8ECFD",
                    borderLeft: "1px solid #243043",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reveal
                </motion.button>
              </div>
            </motion.div>
            <div
              className="mt-2 text-xs"
              style={{ color: "#9FB1C6", fontFamily: "var(--font-jetbrains)" }}
            >
              Tip: start typing to wake up the glow.
            </div>
          </form>
        </div>

        {/* Spinning unrevealed card */}
        <div className="flex justify-center lg:justify-end">
          <AnimatePresence>
            <UnrevealedCard />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
