// app/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card, { type CardData } from "../components/Card";
import {
  attachKonami,
  toast,
  confettiBurst,
  normalizeHandle,
  isTeam as isTeamWhitelisted,
} from "./lib/easter-eggs";

/** ────────────────────────────────────────────────────────────────────────
 *  Supabase (use the exact constants you asked me to keep in memory)
 *  - REST endpoint (no SDK)
 *  - Table: leaderboard_full_0208
 *  - Headers: anon key in both `apikey` and `Authorization: Bearer ...`
 *  ─────────────────────────────────────────────────────────────────────── */
const SUPABASE_URL = "https://bvvlqbtwqetltdcvioie.supabase.co/rest/v1";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2dmxxYnR3cWV0bHRkY3Zpb2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjM4MzMsImV4cCI6MjA2OTU5OTgzM30.d-leDFpzc6uxDvq47_FC0Fqh0ztaL11Oozm-z6T9N_M";
const TABLE = "leaderboard_full_0208";

const SB_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

type LeaderboardRow = {
  username?: string | null;
  display_name?: string | null;
  pfp?: string | null;
  jsonInput?: any;
  level?: number | null;
  title?: string | null;
  rarity?: string | null;
  wave?: number | null;
};

type FetchResult = {
  row: LeaderboardRow | null;
  avatar: string | null;
  resolved: string | null; // normalized handle we matched
};

/** Multi-strategy lookup exactly like your script:
 *  1) username exact
 *  2) display_name exact (via ilike then filter)
 *  3) display_name partial
 *  4) username partial
 */
async function fetchUserByHandle(input: string): Promise<FetchResult> {
  const q = normalizeHandle(input);
  if (!q) return { row: null, avatar: null, resolved: null };

  const run = async (query: string) => {
    const url = `${SUPABASE_URL}/${TABLE}?${query}&select=username,display_name,pfp,jsonInput,level,title,rarity,wave&limit=8`;
    const res = await fetch(url, { headers: SB_HEADERS, cache: "no-store" });
    if (!res.ok) return [] as LeaderboardRow[];
    return (await res.json()) as LeaderboardRow[];
  };

  // 1) username exact
  let results = await run(`username=eq.${encodeURIComponent(q)}`);
  let hit = results.find((r) => normalizeHandle(r.username) === q) || null;

  // 2) display_name exact (case-insensitive)
  if (!hit) {
    results = await run(`display_name=ilike.${encodeURIComponent(q)}`);
    hit = results.find((r) => normalizeHandle(r.display_name) === q) || null;
  }

  // 3) display_name partial
  if (!hit) {
    results = await run(`display_name=ilike.%25${encodeURIComponent(q)}%25`);
    hit = results?.[0] || null;
  }

  // 4) username partial
  if (!hit) {
    results = await run(`username=ilike.%25${encodeURIComponent(q)}%25`);
    hit = results?.[0] || null;
  }

  if (!hit) return { row: null, avatar: null, resolved: q };

  // Resolve avatar: prefer top-level pfp, else jsonInput.pfp
  let avatar: string | null = hit.pfp || null;
  if (!avatar && hit.jsonInput) {
    try {
      const j = typeof hit.jsonInput === "string" ? JSON.parse(hit.jsonInput) : hit.jsonInput;
      avatar = j?.pfp || null;
    } catch {
      /* ignore JSON parse errors */
    }
  }

  const resolved = normalizeHandle(hit.username || hit.display_name || q);
  return { row: hit, avatar, resolved };
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [card, setCard] = useState<CardData | null>(null);
  const [notFound, setNotFound] = useState<string | null>(null);

  // Fun placeholder change (“gm” easter egg)
  const placeholder = useMemo(
    () => (query.toLowerCase().includes("gm") ? "gm, fren ☕" : "@your_handle"),
    [query]
  );

  // Global Konami: legendary glow
  useEffect(() => {
    return attachKonami(() => {
      document.body.classList.add("uc-sunray");
      toast("Konami! Legendary glow ✨");
      confettiBurst();
    });
  }, []);

  // Parallax grid (subtle)
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

  // Support deep-link: /?handle=...
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const h = p.get("handle");
    if (h) {
      setQuery(`@${normalizeHandle(h)}`);
      void onSubmit(h);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(
    async (maybeHandle?: string) => {
      const raw = maybeHandle ?? query;
      const q = normalizeHandle(raw);
      if (!q) return;

      setSubmitted(true);
      setLoading(true);
      setNotFound(null);
      setCard(null);

      try {
        const { row, avatar, resolved } = await fetchUserByHandle(q);
        if (!row || !avatar) {
          setNotFound(`@${q}`);
          return;
        }

        const data: CardData = {
          handle: resolved || q,
          displayName: row.display_name || null,
          avatar,
          rarity: row.rarity || "common",
          wave: row.wave ?? null,
          isTeam: isTeamWhitelisted(resolved || q),
        };
        setCard(data);

        // Update URL query param
        const u = new URL(location.href);
        u.searchParams.set("handle", data.handle);
        history.replaceState({}, "", u.toString());

        confettiBurst();
      } catch (e) {
        setNotFound("Error fetching data");
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  // Copy personal link CTA
  const copyLink = useCallback(() => {
    if (!card) return;
    const url = `${location.origin}/?handle=${encodeURIComponent(card.handle)}`;
    navigator.clipboard.writeText(url).then(() => {
      toast("Link copied");
      confettiBurst();
    });
  }, [card]);

  return (
    <section className="uc-hero">
      <h1 className="uc-h1">Are you on the Union list?</h1>
      <p className="uc-sub">
        Enter your X handle. If you’re on the allowlist, your card appears with your avatar.
      </p>

      {/* Search form — disappears after submit */}
      {!submitted && (
        <form
          className="uc-form"
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
          }}
        >
          <input
            id="handle"
            className="uc-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <button className="uc-btn" type="submit">
            Check
          </button>
        </form>
      )}

      <div className="uc-stage">
        {loading && <div className="uc-skeleton" />}

        {!loading && card && (
          <Card
            data={card}
            showCTAs
            onCopyLink={copyLink}
            onSearchAgain={() => {
              setSubmitted(false);
              setCard(null);
              setNotFound(null);
              setQuery("");
              const u = new URL(location.href);
              u.searchParams.delete("handle");
              history.replaceState({}, "", u.toString());
            }}
          />
        )}

        {!loading && notFound && (
          <div className="uc-nf">
            <div style={{ fontWeight: 800, marginBottom: 8 }}>{notFound}</div>
            <div>Not on the list (yet).</div>
          </div>
        )}
      </div>
    </section>
  );
}
