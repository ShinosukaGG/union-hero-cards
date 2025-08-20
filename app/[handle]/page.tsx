// app/[handle]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Card from "@/components/Card";

export default function HandlePage() {
  const params = useParams();
  const handle = (params?.handle as string) ?? "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
      <Card handle={handle} />
    </main>
  );
}
