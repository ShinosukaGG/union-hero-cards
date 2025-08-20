// app/layout.tsx
// Root layout: brand fonts, sticky header, cosmic background, and meta tags

import "./globals.css";
import { fontVars } from "./fonts";
import Header from "@/components/Header";
import Background from "@/components/Background";

export const metadata = {
  title: "Union Hero Cards",
  description:
    "Reveal your Union Hero Card — a glowing proof of participation for Union heroes.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Union Hero Cards",
    description:
      "Reveal your Union Hero Card — a glowing proof of participation for Union heroes.",
    url: "https://union-hero-cards.vercel.app",
    siteName: "Union Hero Cards",
    images: [
      {
        url: "/pfp.png",
        width: 512,
        height: 512,
        alt: "Union Hero Cards",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Union Hero Cards",
    description:
      "Reveal your Union Hero Card — a glowing proof of participation for Union heroes.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVars}>
      <head>
        {/* Speed up avatar loads */}
        <link rel="preconnect" href="https://unavatar.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://unavatar.io" />
      </head>
      <body
        className="min-h-screen bg-black text-white antialiased"
        style={{ position: "relative" }}
      >
        {/* Cosmic background sits behind everything */}
        <Background />

        {/* Sticky header */}
        <Header />

        {/* Main content (offset for fixed header height ~64px) */}
        <main className="relative z-10 pt-16">{children}</main>
      </body>
    </html>
  );
}
