// app/lib/constants.ts
// Central place for brand tokens, intervals, and whitelists (no UI code here).

/** ──────────────────────────────────────────────────────────────────────────
 * BRAND (strict: only use these)
 * You can import these into components or reference them in inline styles.
 * Keep this in sync with your CSS custom properties in app/globals.css.
 * ──────────────────────────────────────────────────────────────────────────
 */

// Colors
export const BRAND = {
  BG_DARK: "#0D1117",        // page background
  BG_CARD: "#101826",        // card surface
  ACCENT: "#A8ECFD",         // primary accent/glow
  GOLD: "#FFD700",           // team/golden card accent
  TEXT: "#C7D3E3",           // default body text
  TEXT_MUTED: "#9FB1C6",     // secondary text
  BORDER_SOFT: "rgba(168,236,253,0.25)",
  BORDER_HARD: "rgba(168,236,253,0.40)",
} as const;

// Fonts (class names come from app/fonts.ts -> CSS vars)
export const FONTS = {
  HEADING: "var(--font-supermolot)", // Supermolot
  BODY: "var(--font-jetbrains)",     // JetBrains Mono
} as const;

/** ──────────────────────────────────────────────────────────────────────────
 * INTERVALS / ANIMATION TIMING
 * ──────────────────────────────────────────────────────────────────────────
 */
export const TIMING = {
  LOGO_FLIP_MS: 5000,   // union-logo.svg quick flip every 5s
  ZKGM_POP_MS: 3000,    // ZKGM easter egg spawn interval
  CARD_PULSE_MS: 4000,  // gentle glow pulse loop
  SHINE_SWEEP_MS: 5200, // diagonal shine pass across card
  AVATAR_TIMEOUT_MS: 650, // avatar network soft timeout before fallback
} as const;

/** ──────────────────────────────────────────────────────────────────────────
 * TEAM WHITELIST — golden card + special copy
 * ──────────────────────────────────────────────────────────────────────────
 */
export const TEAM_WHITELIST = new Set<string>([
  "0xkaiserkarel",
  "corcoder",
  "e_beriker",
  "luknyb",
  "eastwood_eth",
]);

/** ──────────────────────────────────────────────────────────────────────────
 * COPY — default and team variants
 * ──────────────────────────────────────────────────────────────────────────
 */
export function getHeroDescription(handle: string, isTeam: boolean): string {
  if (isTeam) {
    return (
      `Welcome back, @${handle}. ` +
      `You are not just a Hero — you are the backbone of Union. ` +
      `This golden card marks your place in the team shaping the future. ` +
      `Lead, innovate, and keep building forward.`
    );
  }
  return (
    `Congrats, @${handle} — you are a chosen Union Hero. ` +
    `Your contributions help shape the Union community. ` +
    `Every tweet, every action, every transaction matters. ` +
    `This card is your proof of participation in the movement.`
  );
}

/** Tweet intent payload used by “Share on X” */
export const TWEET_TEXT = `Just revealed my Union Hero Cards! 🎉 

This is my proof of participation on @union_build 🐳

You can reveal yours at: union-hero-cards.vercel.app

Every Transaction, Tweet, and Contribution matters at Union 💪`;
