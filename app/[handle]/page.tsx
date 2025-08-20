// app/[handle]/page.tsx
/**
 * Personal URL page: /<handle>
 * - Server Component (SSR) that fetches from Supabase REST using your anon key.
 * - Lookup order (same as your script):
 *     1) username exact
 *     2) display_name exact (via ilike, then exact-match in JS)
 *     3) display_name partial
 *     4) username partial
 * - Avatar: prefer top-level `pfp`, else `jsonInput.pfp`
 * - Team aura for whitelisted handles
 */

import type { Metadata } from "next";

// ── Supabase constants (your saved values) ──────────────────────────────────
const SUPABASE_URL = "https://bvvlqbtwqetltdcvioie.supabase.co/rest/v1";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2dmxxYnR3cWV0bHRkY3Zpb2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjM4MzMsImV4cCI6MjA2OTU5OTgzM30.d-leDFpzc6uxDvq47_FC0Fqh0ztaL11Oozm-z6T9N_M";

// ⚠️ Set the active table here (leaderboard_XXXX)
const TABLE = "leaderboard_full_0208";

const SB_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

// Team whitelist for special aura/label
const TEAM = new Set(["0xkaiserkarel", "corcoder", "e_beriker", "luknyb", "eastwood_eth"]);

// ── Types ───────────────────────────────────────────────────────────────────
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
  resolvedHandle: string | null;
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const normalize = (s?: string | null) => String(s ?? "").trim().toLowerCase().replace(/^@/, "");

async function run(query: string): Promise<LeaderboardRow[]> {
  const res = await fetch(
    `${SUPABASE_URL}/${TABLE}?${query}&select=username,display_name,pfp,jsonInput,level,title,rarity,wave&limit=8`,
    { headers: SB_HEADERS, cache: "no-store" }
  );
  if (!res.ok) return [];
  return (await res.json()) as LeaderboardRow[];
}

async function fetchUserByHandleSSR(input: string): Promise<FetchResult> {
  const q = normalize(input);
  if (!q) return { row: null, avatar: null, resolvedHandle: null };

  // 1) username exact
  let rows = await run(`username=eq.${encodeURIComponent(q)}`);
  let hit = rows.find((r) => normalize(r.username) === q) || null;

  // 2) display_name exact (via ilike, then filter)
  if (!hit) {
    rows = await run(`display_name=ilike.${encodeURIComponent(q)}`);
    hit = rows.find((r) => normalize(r.display_name) === q) || null;
  }

  // 3) display_name partial
  if (!hit) {
    rows = await run(`display_name=ilike.%25${encodeURIComponent(q)}%25`);
    hit = rows?.[0] || null;
  }

  // 4) username partial
  if (!hit) {
    rows = await run(`username=ilike.%25${encodeURIComponent(q)}%25`);
    hit = rows?.[0] || null;
  }

  if (!hit) return { row: null, avatar: null, resolvedHandle: q };

  // Resolve avatar (pfp first, else jsonInput.pfp)
  let avatar: string | null = hit.pfp || null;
  if (!avatar && hit.jsonInput) {
    try {
      const j = typeof hit.jsonInput === "string" ? JSON.parse(hit.jsonInput) : hit.jsonInput;
      avatar = j?.pfp || null;
    } catch {
      // ignore JSON parse failures
    }
  }

  const resolvedHandle = normalize(hit.username || hit.display_name || q);
  return { row: hit, avatar, resolvedHandle };
}

// ── Metadata (SEO/share) ───────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const h = normalize(params.handle);
  const { row, avatar, resolvedHandle } = await fetchUserByHandleSSR(h);

  const title = row ? `${row.display_name || resolvedHandle} • Union Card` : `@${h} • Union Card`;
  const description = row ? "View this Union Card." : "Handle not found on the allowlist.";
  const ogImage = avatar || "/union-logo.svg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ── Page (SSR) ─────────────────────────────────────────────────────────────
export default async function HandlePage({ params }: { params: { handle: string } }) {
  const h = normalize(params.handle);
  const { row, avatar, resolvedHandle } = await fetchUserByHandleSSR(h);

  if (!row || !avatar) {
    return (
      <section className="uc-hero">
        <div className="uc-nf">
          <div style={{ fontWeight: 800, marginBottom: 8 }}>@{h}</div>
          <div>Not on the list (yet).</div>
        </div>
      </section>
    );
  }

  const rarityClass = String(row.rarity || "common").toLowerCase();
  const isTeam = resolvedHandle ? TEAM.has(resolvedHandle) : false;

  return (
    <section className="uc-hero">
      <h1 className="uc-h1" style={{ marginBottom: 8 }}>
        {row.display_name || resolvedHandle}
      </h1>

      <div className="uc-cardWrap">
        <div className="uc-cardOuter">
          <div className={`uc-card ${rarityClass} ${isTeam ? "team uc-teamAura" : ""}`}>
            <div className="uc-shine" />

            <div className="uc-headerRow">
              <div className="uc-handle">@{resolvedHandle}</div>
              <div className="uc-badge">{isTeam ? "Union Team" : row?.wave ? `Wave ${row.wave}` : "Union"}</div>
            </div>

            <div className="uc-heroImg">
              <img
                src={avatar}
                alt={`${row.display_name || resolvedHandle} avatar`}
                onError={(e: any) => (e.currentTarget.style.opacity = 0)}
              />
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
          <a className="uc-copy" href={`/?handle=${encodeURIComponent(resolvedHandle || h)}`}>
            Open on Home
          </a>
        </div>
      </div>
    </section>
  );
        }
