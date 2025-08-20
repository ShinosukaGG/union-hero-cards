// app/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** ────────────────────────────────────────────────────────────────────────
 *  Config (from your memory notes)
 *  - Using your exact REST URL + anon key
 *  - Table: leaderboard_full_0208
 *  - Lookup order: username (exact) → display_name (exact) → display_name (partial) → username (partial)
 *  - Avatar: prefer top-level `pfp`, else `jsonInput.pfp`
 *  ─────────────────────────────────────────────────────────────────────── */
const SUPABASE_URL = "https://bvvlqbtwqetltdcvioie.supabase.co/rest/v1";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2dmxxYnR3cWV0bHRkY3Zpb2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjM4MzMsImV4cCI6MjA2OTU5OTgzM30.d-leDFpzc6uxDvq47_FC0Fqh0ztaL11Oozm-z6T9N_M";
const TABLE = "leaderboard_full_0208";

/** Team-only special egg (aura) */
const TEAM = new Set(["0xkaiserkarel", "corcoder", "e_beriker", "luknyb", "eastwood_eth"]);

type LeaderboardRow = {
  username?: string | null;
  display_name?: string | null;
  pfp?: string | null;
  jsonInput?: any;
  level?: number | null;
  title?: string | null;
  rarity?: string | null; // if you ever add one
  wave?: number | null;   // if you ever add one
};

type FetchResult = {
  row: LeaderboardRow | null;
  avatar: string | null;
  handle: string | null; // the resolved username we matched on
};

/** Normalizes input -> lowercased, no leading @ */
const toHandle = (s: string) => String(s || "").trim().toLowerCase().replace(/^@/, "");

/** Build headers once */
const SB_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

/** Core lookup exactly as you described */
async function fetchUserByHandle(input: string): Promise<FetchResult> {
  const q = toHandle(input);
  if (!q) return { row: null, avatar: null, handle: null };

  // Helper to run a select
  const run = async (query: string) => {
    const res = await fetch(`${SUPABASE_URL}/${TABLE}?${query}&select=username,display_name,pfp,jsonInput,level,title,rarity,wave&limit=8`, {
      headers: SB_HEADERS,
      cache: "no-store",
    });
    if (!res.ok) return [] as LeaderboardRow[];
    return (await res.json()) as LeaderboardRow[];
  };

  // 1) username exact
  let results = await run(`username=eq.${encodeURIComponent(q)}`);
  let hit = results.find((r) => (r.username || "").toLowerCase() === q);
  if (!hit) {
    // 2) display_name exact (using ilike, then filter exact)
    results = await run(`display_name=ilike.${encodeURIComponent(q)}`);
    hit = results.find((r) => (r.display_name || "").toLowerCase() === q) || null as any;
  }
  if (!hit) {
    // 3) display_name partial
    results = await run(`display_name=ilike.%25${encodeURIComponent(q)}%25`);
    hit = results?.[0] || null;
  }
  if (!hit) {
    // 4) username partial
    results = await run(`username=ilike.%25${encodeURIComponent(q)}%25`);
    hit = results?.[0] || null;
  }

  if (!hit) return { row: null, avatar: null, handle: q };

  // avatar: pfp top-level, else jsonInput.pfp
  let avatar: string | null = hit.pfp || null;
  if (!avatar && hit.jsonInput) {
    try {
      const j = typeof hit.jsonInput === "string" ? JSON.parse(hit.jsonInput) : hit.jsonInput;
      avatar = j?.pfp || null;
    } catch {
      // ignore
    }
  }
  const resolved = toHandle(hit.username || hit.display_name || q);
  return { row: hit, avatar, handle: resolved };
}

/** Tiny toast */
function toast(msg: string) {
  const t = document.getElementById("uc-toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1500);
}

/** CSS confetti (matches globals.css .uc-burst rules) */
function confettiBurst() {
  const el = document.createElement("div");
  el.className = "uc-burst";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

/** Konami sequence listener */
function useKonami(handler: () => void) {
  useEffect(() => {
    const seq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.keyCode === seq[idx]) {
        idx++;
        if (idx === seq.length) {
          idx = 0;
          handler();
        }
      } else idx = 0;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler]);
}

export default function HomePage() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState<LeaderboardRow | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [resolvedHandle, setResolvedHandle] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<string | null>(null);

  // Placeholder easter egg: "gm"
  const placeholder = useMemo(
    () => (input.toLowerCase().includes("gm") ? "gm, fren ☕" : "@your_handle"),
    [input]
  );

  // Grid parallax
  useEffect(() => {
    const grid = document.getElementById("uc-grid");
    const move = (e: MouseEvent) => {
      const x = (e.clientX / innerWidth - 0.5) * 8;
      const y = (e.clientY / innerHeight - 0.5) * 8;
      if (grid) (grid as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Time-based theme
  useEffect(() => {
    const h = new Date().getHours();
    if (h <= 3) document.body.classList.add("uc-starlight");
    if (h >= 9 && h <= 11) document.body.classList.add("uc-sunray");
  }, []);

  // Tab title tease
  useEffect(() => {
    let t: any;
    const onVis = () => {
      if (document.hidden) t = setTimeout(() => (document.title = "psst… your card awaits 👀"), 30000);
      else {
        clearTimeout(t);
        document.title = "Union Cards";
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Konami → legendary glow
  useKonami(() => {
    document.body.classList.add("uc-sunray");
    toast("Konami! Legendary glow ✨");
    confettiBurst();
  });

  // Caps-lock wiggle on input
  useEffect(() => {
    const el = document.getElementById("handle") as HTMLInputElement | null;
    const fn = (e: KeyboardEvent) => {
      // @ts-ignore
      if (e.getModifierState?.("CapsLock")) el?.classList.add("uc-wiggle");
      setTimeout(() => el?.classList.remove("uc-wiggle"), 180);
    };
    el?.addEventListener("keyup", fn);
    return () => el?.removeEventListener("keyup", fn);
  }, []);

  // Hydrate from ?handle=
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const h = p.get("handle");
    if (h) {
      setInput(`@${toHandle(h)}`);
      void onSubmit(h);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(
    async (h?: string) => {
      const q = toHandle(h ?? input);
      if (!q) return;

      setLoading(true);
      setSubmitted(true);
      setRow(null);
      setAvatar(null);
      setNotFound(null);

      try {
        const { row: r, avatar: a, handle } = await fetchUserByHandle(q);
        if (!r || !a) {
          setNotFound(`@${q}`);
          return;
        }
        setRow(r);
        setAvatar(a);
        setResolvedHandle(handle);
        // update URL ?handle=
        const u = new URL(location.href);
        u.searchParams.set("handle", q);
        history.replaceState({}, "", u.toString());
        confettiBurst();
      } catch (e) {
        setNotFound("Error fetching data");
      } finally {
        setLoading(false);
      }
    },
    [input]
  );

  const isTeam = resolvedHandle ? TEAM.has(resolvedHandle) : false;
  const rarityClass = String(row?.rarity || "common").toLowerCase();

  return (
    <>
      <section className="uc-hero">
        <h1 className="uc-h1">Are you on the Union list?</h1>
        <p className="uc-sub">Enter your X handle. If you’re on the allowlist, your card appears with your avatar.</p>

        <AnimatePresence initial={false}>
          {!submitted && (
            <motion.form
              className="uc-form"
              onSubmit={(e) => { e.preventDefault(); void onSubmit(); }}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.92, transition: { duration: 0.18 } }}
            >
              <input
                id="handle"
                className="uc-input"
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                inputMode="text"
                autoComplete="off"
              />
              <button className="uc-btn" type="submit">Check</button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="uc-stage">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loading" className="uc-skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            )}

            {!loading && avatar && row && (
              <motion.div key="card" className="uc-cardWrap" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="uc-cardOuter">
                  <div id="uc-card" className={`uc-card ${rarityClass} ${isTeam ? "team uc-teamAura" : ""}`}>
                    <div className="uc-shine" />
                    <div className="uc-headerRow">
                      <div className="uc-handle">@{resolvedHandle}</div>
                      <div className="uc-badge">{isTeam ? "Union Team" : row?.wave ? `Wave ${row.wave}` : "Union"}</div>
                    </div>
                    <div className="uc-heroImg">
                      {/* avatar in center */}
                      <img src={avatar} alt={`${row.display_name || resolvedHandle} avatar`} onError={(e: any) => (e.currentTarget.style.opacity = 0.0)} />
                    </div>
                    <div className="uc-body">
                      <div className="uc-ogRow">
                        <div className="uc-og">{isTeam ? "CORE" : "OG"}</div>
                        <div className="uc-desc">
                          {isTeam ? "Union core contributor." : `${rarityClass[0].toUpperCase()}${rarityClass.slice(1)} on the allowlist.`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="uc-ctaRow">
                  <button
                    className="uc-copy"
                    onClick={() => {
                      const link = `${location.origin}/?handle=${encodeURIComponent(resolvedHandle || "")}`;
                      navigator.clipboard.writeText(link).then(() => { toast("Link copied"); confettiBurst(); });
                    }}
                  >
                    Copy personal link
                  </button>
                  <button
                    className="uc-copy"
                    onClick={() => {
                      setSubmitted(false);
                      setRow(null);
                      setAvatar(null);
                      setResolvedHandle(null);
                      setInput("");
                      const u = new URL(location.href);
                      u.searchParams.delete("handle");
                      history.replaceState({}, "", u.toString());
                    }}
                  >
                    Search again
                  </button>
                </div>
              </motion.div>
            )}

            {!loading && notFound && (
              <motion.div key="nf" className="uc-nf" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>{notFound}</div>
                <div>Not on the list (yet).</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div id="uc-toast" className="uc-toast">Copied</div>
    </>
  );
  }
