// app/lib/avatar.ts
// Robust PFP pipeline: Unavatar (X) → Unavatar (generic) → mirror → local /pfp.png
// - Normalizes handle (strip @, lowercase)
// - Races network with a timeout so something appears instantly
// - Optionally preloads the chosen URL to speed up first paint
// - Small in-memory cache to avoid re-resolving within a session

type ResolveOptions = {
  /** ms to wait before falling back to next source (soft timeout) */
  timeoutMs?: number;
  /** also insert <link rel="preload" as="image"> for the resolved URL */
  preload?: boolean;
};

const CACHE = new Map<string, string>(); // handle -> final URL

const normalize = (s: string) => s.trim().replace(/^@/, "").toLowerCase();

const srcsFor = (handle: string) => {
  const h = encodeURIComponent(normalize(handle));
  return [
    `https://unavatar.io/x/${h}`,            // primary: X provider
    `https://unavatar.io/${h}`,              // generic
    `https://unavatar.vercel.app/x/${h}`,    // mirror
  ];
};

const LOCAL_FALLBACK = "/pfp.png";

// --- Preload helper -------------------------------------------------------
function ensurePreload(url: string) {
  if (typeof document === "undefined") return;
  // Avoid duplicating the same preload tag
  const existing = document.querySelector<HTMLLinkElement>(
    `link[rel="preload"][as="image"][href="${url}"]`
  );
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = url;
  document.head.appendChild(link);
}

// --- Fetch with a soft timeout (race) ------------------------------------
function fetchWithTimeout(url: string, timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const img = new Image();
    img.onload = () => {
      if (settled) return;
      settled = true;
      resolve(url);
    };
    img.onerror = () => {
      if (settled) return;
      settled = true;
      reject(new Error("Image load failed"));
    };
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.src = url;

    const t = setTimeout(() => {
      if (settled) return;
      // We don’t reject here; just time out and let caller fall back quickly.
      settled = true;
      reject(new Error("timeout"));
    }, timeoutMs);

    // In case onload/onerror fires: clear timer (just hygiene; promise is settled)
    const clear = () => clearTimeout(t);
    img.onload = ((orig) => () => {
      clear();
      orig();
    })(img.onload as any);
    img.onerror = ((orig) => () => {
      clear();
      orig(new Event("error"));
    })(img.onerror as any);
  });
}

// --- Public API -----------------------------------------------------------
/**
 * Resolves an avatar URL for a given handle using a multi-source strategy.
 * Returns a URL that is guaranteed to load (falls back to /pfp.png).
 */
export async function resolveAvatar(
  handle: string,
  opts: ResolveOptions = {}
): Promise<string> {
  const timeoutMs = Math.max(200, opts.timeoutMs ?? 650);
  const key = normalize(handle);

  // In-memory cache hit
  const cached = CACHE.get(key);
  if (cached) {
    if (opts.preload) ensurePreload(cached);
    return cached;
  }

  // Try each source with a soft timeout. First success wins.
  const sources = srcsFor(key);

  for (let i = 0; i < sources.length; i++) {
    const url = sources[i];
    try {
      const ok = await fetchWithTimeout(url, timeoutMs);
      CACHE.set(key, ok);
      if (opts.preload) ensurePreload(ok);
      return ok;
    } catch {
      // timeout or error → continue to next source
    }
  }

  // All remote sources failed or timed out → local fallback
  CACHE.set(key, LOCAL_FALLBACK);
  if (opts.preload) ensurePreload(LOCAL_FALLBACK);
  return LOCAL_FALLBACK;
}

/**
 * Synchronous best-guess URL (no network). Useful for initial render.
 * You can pair this with resolveAvatar(..., { preload: true }) to swap in later.
 */
export function initialAvatarURL(handle: string): string {
  // Start optimistic with primary Unavatar source
  return srcsFor(handle)[0] ?? LOCAL_FALLBACK;
    }
