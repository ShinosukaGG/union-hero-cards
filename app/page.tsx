// app/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card, { type CardData } from "../components/Card";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [card, setCard] = useState<CardData | null>(null);

  // Placeholder text changes playfully
  const placeholder = useMemo(
    () => (query.toLowerCase().includes("gm") ? "gm, fren ☕" : "@your_handle"),
    [query]
  );

  // Normalize @handle input
  const normalizeHandle = (s: string) => s.trim().replace(/^@/, "").toLowerCase();

  // Avatar from Unavatar CDN
  const makeAvatarUrl = (h: string) =>
    `https://unavatar.io/x/${encodeURIComponent(normalizeHandle(h))}`;

  const onSubmit = useCallback(
    (maybeHandle?: string) => {
      const raw = maybeHandle ?? query;
      const handle = normalizeHandle(raw);
      if (!handle) return;

      setSubmitted(true);

      const data: CardData = {
        handle,
        displayName: handle,
        avatar: makeAvatarUrl(handle),
        rarity: "common",
        wave: null,
        isTeam: false,
      };
      setCard(data);

      // Update URL so it's shareable
      const u = new URL(location.href);
      u.searchParams.set("handle", handle);
      history.replaceState({}, "", u.toString());
    },
    [query]
  );

  // Deep link support: ?handle=...
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const h = p.get("handle");
    if (h) {
      setQuery(`@${normalizeHandle(h)}`);
      onSubmit(h);
    }
  }, [onSubmit]);

  return (
    <section className="uc-hero">
      <h1 className="uc-h1">Are you on the Union list?</h1>
      <p className="uc-sub">Enter your X handle to reveal your Union card.</p>

      {!submitted && (
        <form
          className="uc-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <input
            id="handle"
            className="uc-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <button className="uc-btn" type="submit">
            Check
          </button>
        </form>
      )}

      <div className="uc-stage">
        {card && (
          <Card
            data={card}
            showCTAs
            onCopyLink={() => {
              const url = `${location.origin}/?handle=${encodeURIComponent(card.handle)}`;
              navigator.clipboard.writeText(url).then(() => {
                alert("Link copied ✅");
              });
            }}
            onSearchAgain={() => {
              setSubmitted(false);
              setCard(null);
              setQuery("");
              const u = new URL(location.href);
              u.searchParams.delete("handle");
              history.replaceState({}, "", u.toString());
            }}
          />
        )}
      </div>
    </section>
  );
}
