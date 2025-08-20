// app/fonts.ts
// Loads brand fonts locally with next/font/local.
// Usage: in app/layout.tsx wrap <html className={`${supermolot.variable} ${jetbrains.variable}`}> …
// Then use font-family: var(--font-supermolot) for headings and var(--font-jetbrains) for body.

import localFont from "next/font/local";

export const supermolot = localFont({
  src: [
    {
      path: "/fonts/Supermolot-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "/fonts/Supermolot-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-supermolot",
  display: "swap",
  preload: true,
});

export const jetbrains = localFont({
  src: [
    {
      path: "/fonts/JetBrainsMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "/fonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains",
  display: "swap",
  preload: true,
});

// Optional helper: class string for <html> element
export const fontVars = `${supermolot.variable} ${jetbrains.variable}`;
