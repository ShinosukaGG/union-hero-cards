// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Union Cards",
  description: "Enter your X handle to see your Union Card.",
  metadataBase: new URL("https://your-deployed-domain.com"), // ← replace after first deploy
  openGraph: {
    title: "Union Cards",
    description: "Check if you’re on the allowlist and see your Union Card.",
    type: "website",
    url: "https://your-deployed-domain.com",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Union Cards" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@union_build",
    title: "Union Cards",
    description: "Check if you’re on the allowlist and see your Union Card.",
    images: ["/api/og"],
  },
  icons: {
    icon: "/union-logo.svg",
    shortcut: "/union-logo.svg",
    apple: "/union-logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Site header with your official brand mark (logo + UNION text) */}
        <header className="uc-header" role="banner">
          <a href="/" className="uc-logoLink" aria-label="Union Cards home">
            <img
              src="/union-logo.svg"
              alt="UNION"
              className="uc-logo"
              width={180}
              height={40}
              decoding="async"
              fetchPriority="high"
            />
          </a>
        </header>

        {/* Background grid / effects (styled in globals.css) */}
        <div id="uc-grid" aria-hidden="true" />

        {/* Main content */}
        <main className="uc-main" role="main">
          {children}
        </main>

        {/* Minimal footer (optional) */}
        <footer className="uc-footer" role="contentinfo">
          <span>© {new Date().getFullYear()} UNION</span>
        </footer>
      </body>
    </html>
  );
}
