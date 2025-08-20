// app/[handle]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Card from "@/components/Card";

const TEAM_WHITELIST = [
  "0xkaiserkarel",
  "corcoder",
  "e_beriker",
  "luknyb",
  "eastwood_eth",
];

export default function HandlePage() {
  const params = useParams();
  const handle = params?.handle as string;
  const isTeam = TEAM_WHITELIST.includes(handle?.toLowerCase());

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
      <Card handle={handle} isTeam={isTeam} />
    </main>
  );
}
