// app/[handle]/page.tsx
/**
 * Personal URL page: /<handle>
 * No fetching — everyone is eligible.
 * Avatar uses Unavatar (X handle) for fast loads.
 */

type PageProps = { params: { handle: string } };

const TEAM = new Set(["0xkaiserkarel", "corcoder", "e_beriker", "luknyb", "eastwood_eth"]);

const normalize = (s?: string | null) => String(s ?? "").trim().toLowerCase().replace(/^@/, "");
const makeAvatarUrl = (h: string) => `https://unavatar.io/x/${encodeURIComponent(normalize(h))}`;

export default function HandlePage({ params }: PageProps) {
  const h = normalize(params.handle);
  const isTeam = TEAM.has(h);
  const rarityClass = "common";
  const avatar = makeAvatarUrl(h);

  return (
    <section className="uc-hero">
      <h1 className="uc-h1" style={{ marginBottom: 8 }}>
        {h}
      </h1>

      <div className="uc-cardWrap">
        <div className="uc-cardOuter">
          <div className={`uc-card ${rarityClass} ${isTeam ? "team uc-teamAura" : ""}`}>
            <div className="uc-shine" />

            <div className="uc-headerRow">
              <div className="uc-handle">@{h}</div>
              <div className="uc-badge">{isTeam ? "Union Team" : "Union"}</div>
            </div>

            <div className="uc-heroImg">
              <img
                src={avatar}
                alt={`${h} avatar`}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={(e: any) => {
                  // fallback to generic unavatar (non-x)
                  e.currentTarget.src = `https://unavatar.io/${encodeURIComponent(h)}`;
                }}
              />
            </div>

            <div className="uc-body">
              <div className="uc-ogRow">
                <div className="uc-og">{isTeam ? "CORE" : "OG"}</div>
                <div className="uc-desc">
                  {isTeam ? "Union core contributor." : "Common on the allowlist."}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="uc-ctaRow">
          <a className="uc-copy" href={`/?handle=${encodeURIComponent(h)}`}>
            Open on Home
          </a>
        </div>
      </div>
    </section>
  );
}
