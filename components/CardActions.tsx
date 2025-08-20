// components/CardActions.tsx
"use client";

import { useState } from "react";

interface CardActionsProps {
  username: string;
}

export default function CardActions({ username }: CardActionsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = encodeURIComponent(
    `Just revealed my Union Hero Cards! 🎉

This is my proof of participation on @union_build 🐳

You can reveal yours at: union-hero-cards.vercel.app/${username}

Every Transaction, Tweet, and Contribution matters at Union 💪`
  );

  const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://union-hero-cards.vercel.app/${username}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 flex flex-col items-center space-y-4">
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 w-64 text-center rounded-lg text-white font-bold bg-blue-500 animate-pulse hover:scale-105 transition-transform"
      >
        Share on X
      </a>
      <button
        onClick={copyLink}
        className="px-6 py-3 w-64 text-center rounded-lg text-gray-300 font-semibold bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        {copied ? "Copied!" : "Copy Your Card Link"}
      </button>
    </div>
  );
}
