// app/lib/easter-eggs.ts
/**
 * Union Cards — Easter Eggs & Team Whitelist helpers
 *
 * Drop-in helpers you can use from any Client Component (page.tsx, Card.tsx, etc.)
 * No external deps; uses the CSS already defined in app/globals.css.
 *
 * Usage examples:
 *   import { TEAM_WHITELIST, isTeam, getCardClasses, attachKonami, toast, confettiBurst } from "../lib/easter-eggs";
 *
 *   // 1) Team aura classes for a card:
 *   const classes = getCardClasses(resolvedHandle, rarityClass); // => "uc-card <rarity> team uc-teamAura"
 *
 *   // 2) Check if handle is team:
 *   const team = isTeam(resolvedHandle);
 *
 *   // 3) Konami code trigger:
 *   useEffect(() => attachKonami(() => { toast("Konami! Legendary glow ✨"); confettiBurst(); }), []);
 *
 *   // 4) Copy link & toast:
 *   await navigator.clipboard.writeText(url); toast("Link copied");
 *
 * Notes:
 * - Requires elements with IDs/classes that globals.css styles:
 *     #uc-toast         → toast bubble
 *     .uc-burst         → created dynamically by confettiBurst()
 * - Rarity classes: "common" | "rare" | "epic" | "legend" (falls back to "common")
 */

// ────────────────────────────────────────────────────────────────────────────
// TEAM WHITELIST
// ────────────────────────────────────────────────────────────────────────────
export const TEAM_WHITELIST = [
  "0xkaiserkarel",
  "corcoder",
  "e_beriker",
  "luknyb",
  "eastwood_eth",
] as const;

export function normalizeHandle(h?: string | null): string {
  return String(h ?? "").trim().toLowerCase().replace(/^@/, "");
}

export function isTeam(handle?: string | null): boolean {
  const h = normalizeHandle(handle);
  return TEAM_WHITELIST.includes(h as (typeof TEAM_WHITELIST)[number]);
}

// Returns full class string for a card root node based on rarity + team status
export function getCardClasses(handle: string | null | undefined, rarity?: string | null): string {
  const r = (String(rarity ?? "common") || "common").toLowerCase();
  return `uc-card ${r} ${isTeam(handle) ? "team uc-teamAura" : ""}`.trim();
}

// ────────────────────────────────────────────────────────────────────────────
// TOAST & CONFETTI
// ────────────────────────────────────────────────────────────────────────────
export function toast(message: string, timeoutMs = 1500) {
  if (typeof document === "undefined") return;
  const t = document.getElementById("uc-toast");
  if (!t) return;
  t.textContent = message;
  t.classList.add("show");
  window.setTimeout(() => t.classList.remove("show"), timeoutMs);
}

export function confettiBurst() {
  if (typeof document === "undefined") return;
  const el = document.createElement("div");
  el.className = "uc-burst";
  // style inline for safety; CSS optional
  el.style.position = "fixed";
  el.style.left = "0";
  el.style.top = "0";
  el.style.right = "0";
  el.style.bottom = "0";
  el.style.pointerEvents = "none";
  el.style.background =
    "radial-gradient(6px 6px at 20% 30%, rgba(168,236,253,.9) 0%, transparent 60%), " +
    "radial-gradient(6px 6px at 60% 50%, rgba(20,210,197,.9) 0%, transparent 60%), " +
    "radial-gradient(6px 6px at 80% 20%, rgba(255,255,255,.9) 0%, transparent 60%)";
  el.style.animation = "fadeOut .9s ease forwards";
  // quick fade keyframe
  const style = document.createElement("style");
  style.textContent = `@keyframes fadeOut { from {opacity:1} to {opacity:0} }`;
  document.head.appendChild(style);

  document.body.appendChild(el);
  window.setTimeout(() => {
    el.remove();
    style.remove();
  }, 900);
}

// ────────────────────────────────────────────────────────────────────────────
// KONAMI CODE LISTENER
// ────────────────────────────────────────────────────────────────────────────
export function attachKonami(onTrigger: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const seq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right b a
  let idx = 0;
  const onKey = (e: KeyboardEvent) => {
    if (e.keyCode === seq[idx]) {
      idx++;
      if (idx === seq.length) {
        idx = 0;
        try {
          onTrigger();
        } catch {
          /* ignore */
        }
      }
    } else {
      idx = 0;
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}

// ────────────────────────────────────────────────────────────────────────────
// HANDLE-BASED MICRO EGGS
//  - Small visual tweaks applied based on the text of the handle.
//  - Keep these subtle and reversible (cleanup function returns to baseline).
// ────────────────────────────────────────────────────────────────────────────
export function applyHandleMicroEggs(handle?: string | null): () => void {
  const h = normalizeHandle(handle);

  // zk* → quick hue-rotate micro-glitch on the card (if #uc-card exists)
  let glitchId: number | null = null;
  if (typeof document !== "undefined" && h.includes("zk")) {
    const el = document.getElementById("uc-card") as HTMLElement | null;
    if (el) {
      let t = 0;
      glitchId = window.setInterval(() => {
        t++;
        el.style.filter = `contrast(1) hue-rotate(${(Math.random() * 10 - 5).toFixed(1)}deg)`;
        if (t > 12) {
          window.clearInterval(glitchId!);
          glitchId = null;
          el.style.filter = "";
        }
      }, 60);
    }
  }

  // *dev* → crosshair cursor globally
  const resetCursor = () => {
    if (typeof document !== "undefined") document.body.style.cursor = "";
  };
  if (typeof document !== "undefined" && h.includes("dev")) {
    document.body.style.cursor = "crosshair";
  }

  // Cleanup
  return () => {
    if (glitchId) {
      window.clearInterval(glitchId);
      const el = document.getElementById("uc-card") as HTMLElement | null;
      if (el) el.style.filter = "";
    }
    resetCursor();
  };
}
