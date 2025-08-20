// app/layout.tsx
// Root layout: applies brand fonts, sticky header, and cosmic background

import "./globals.css";
import { fontVars } from "./fonts";
import Header from "@/components/Header";

export const metadata = {
  title: "Union Hero Cards",
  description: "Reveal your Union Hero Card",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVars}>
      <body className="bg-black text-white font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
      </body>
    </html>
  );
}
