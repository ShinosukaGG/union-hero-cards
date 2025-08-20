// app/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card, { type CardData } from "../components/Card";
import {
  attachKonami,
  toast,
  confettiBurst,
  normalizeHandle,
  isTeam as isTeamWhitelisted,
} from "./lib/easter-eggs";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [card, setCard] = useState<CardData | null>(null);

  // playful placeholder
  const placeholder = useMemo(
    () => (query.toLowerCase().includes("gm") ? "gm, fren ☕" : "@your_handle"),
    [query]
  );

  // Konami glow
  useEffect(() => {
    return attachKonami(() => {
      document.body.classList.add("uc-sunray");
      toast("Konami! Legendary glow ✨");
      confettiBurst();
    });
  }, []);

  const makeAvatarUrl = (h: string) => {
    const hh = normalizeHandle(h);
    // Unavatar (fast, caches well). Primary: X handle, fallback handled by <img onError> in Card.
    return `https://unavatar.io/x/${encodeURIComponent(hh)}`;
  };

  const onSubmit = useCallback(
    async (maybeHandle?: string) => {
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
        isTeam: isTeamWhitelisted(handle),
      };
      setCard(data);

      // Update shareable URL
      const u = new URL(location.href);
      u.searchParams.set("handle", handle);
      history.replaceState({}, "", u.toString());

      confettiBurst();
    },
    [query]
  );

  // Support deep-link: /?handle=...
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const h = p.get("handle");
    if (h) {
      setQuery(`@${normalizeHandle(h)}`);
      void onSubmit(h);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="uc-hero">
      <h1 className="uc-h1">Are you on the Union list?</h1>
      <p className="uc-sub">Enter your X handle to reveal your Union card.</p>

      {!submitted && (
        <form
          className="uc-form"
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
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
                toast("Link copied");
                confettiBurst();
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
