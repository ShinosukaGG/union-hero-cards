// app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import Background from "@/components/Background";

export const metadata = {
  title: "Union Hero Cards",
  description: "Reveal your Union Hero Card — share, flex, repeat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload logo */}
        <link rel="preload" as="image" href="/union-logo.svg" />

        {/* Preload random user avatars (pfp1–pfp14) */}
        {Array.from({ length: 14 }, (_, i) => (
          <link key={i} rel="preload" as="image" href={`/pfp${i + 1}.png`} />
        ))}

        {/* Preload team avatar */}
        <link rel="preload" as="image" href="/pfp15.png" />
      </head>
      <body>
        <Header />
        <Background />
        <main style={{ paddingTop: 72 }}>{children}</main>
      </body>
    </html>
  );
}
