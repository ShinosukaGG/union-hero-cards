// app/layout.tsx
// Minimal layout that does NOT use local fonts (so missing files won't break build)

import "./globals.css";
import Header from "../components/Header";
import Background from "../components/Background";

export const metadata = {
  title: "Union Hero Cards",
  description:
    "Reveal your Union Hero Card — a glowing proof of participation for Union heroes.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Union Hero Cards",
    description:
      "Reveal your Union Hero Card — a glowing proof of participation for Union heroes.",
    url: "https://union-hero-cards.vercel.app",
    siteName: "Union Hero Cards",
    images: [{ url: "/pfp.png", width: 512, height: 512, alt: "Union Hero Cards" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Union Hero Cards",
    description:
      "Reveal your Union Hero Card — a glowing proof of participation for Union heroes.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://unavatar.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://unavatar.io" />
        <link rel="preconnect" href="https://api.dicebear.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://api.dicebear.com" />
        {/* Fallback CSS variables so fonts missing won't break styles */}
        <style>{`:root{--font-supermolot: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; --font-jetbrains: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace}`}</style>
      </head>
      <body className="min-h-screen bg-black text-white antialiased" style={{ position: "relative" }}>
        <Background />
        <Header />
        <main className="relative z-10 pt-16">{children}</main>
      </body>
    </html>
  );
}
