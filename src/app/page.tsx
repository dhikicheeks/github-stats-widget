const COLORS = {
  bg: '#0d1117',
  surface: '#161b22',
  border: '#30363d',
  text: '#c9d1d9',
  muted: '#6e7681',
  green: '#28c840',
  red: '#ff5f57',
  yellow: '#ffbd2e',
} as const;

const widgets = [
  {
    id: 'streak',
    label: 'streak',
    cmd: '$ curl /api/github-stats/streak',
    description: 'Contribution streak — total commits, current streak, and longest streak.',
  },
  {
    id: 'trophy',
    label: 'trophy',
    cmd: '$ curl /api/github-stats/trophy',
    description: 'Achievement trophies — stars, followers, commits, PRs, and issues.',
  },
  {
    id: 'top-langs',
    label: 'top-langs',
    cmd: '$ curl /api/github-stats/top-langs',
    description: 'Top programming languages by repository usage.',
  },
  {
    id: 'visitor',
    label: 'visitor',
    cmd: '$ curl /api/github-stats/visitor',
    description: 'Profile visitor counter with persistent tracking.',
  },
];

export default function Home() {
  const username = process.env.GITHUB_OWNER_USERNAME ?? 'dhikicheeks';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem 1rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
      }}
    >
      {/* Terminal window */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          border: `1px solid ${COLORS.border}`,
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: COLORS.surface,
            borderBottom: `1px solid ${COLORS.border}`,
            padding: '0 16px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              background: COLORS.red,
            }}
          />
          <span
            style={{
              display: 'inline-block',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              background: COLORS.yellow,
            }}
          />
          <span
            style={{
              display: 'inline-block',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              background: COLORS.green,
            }}
          />
          <span
            style={{
              marginLeft: '8px',
              fontSize: '12px',
              color: COLORS.muted,
            }}
          >
            github-stats-widget — zsh
          </span>
        </div>

        {/* Terminal body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* whoami */}
          <div>
            <p style={{ fontSize: '13px', color: COLORS.muted }}>$ whoami</p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: COLORS.green, marginTop: '4px' }}>
              github-stats-widget
            </p>
          </div>

          {/* description */}
          <div>
            <p style={{ fontSize: '13px', color: COLORS.muted }}>$ cat README.md</p>
            <p
              style={{ fontSize: '13px', color: COLORS.text, marginTop: '6px', lineHeight: '1.7' }}
            >
              Self-hosted GitHub stats served as SVG via Next.js API routes.
              <br />
              Deploy to Vercel, embed in any README with an{' '}
              <code
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  padding: '1px 5px',
                  fontSize: '12px',
                  color: COLORS.green,
                }}
              >
                &lt;img&gt;
              </code>{' '}
              tag.
            </p>
          </div>

          {/* available widgets */}
          <div>
            <p style={{ fontSize: '13px', color: COLORS.muted }}>$ ls src/api/</p>
            <p style={{ fontSize: '13px', color: COLORS.text, marginTop: '6px' }}>
              {widgets.map((w, i) => (
                <span key={w.id}>
                  <span style={{ color: COLORS.green }}>{w.label}/</span>
                  {i < widgets.length - 1 ? (
                    <span style={{ color: COLORS.muted }}>{'  '}</span>
                  ) : null}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* Widget cards */}
      {widgets.map((w) => {
        const src = `/api/github-stats/${w.id}?username=${username}`;
        const embedSrc = siteUrl
          ? `${siteUrl}/api/github-stats/${w.id}?username=${username}`
          : `/api/github-stats/${w.id}?username=${username}`;
        const embedCode = `<img src="${embedSrc}" alt="GitHub ${w.label}" />`;

        return (
          <div
            key={w.id}
            style={{
              width: '100%',
              maxWidth: '640px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {/* Card title bar */}
            <div
              style={{
                background: COLORS.surface,
                borderBottom: `1px solid ${COLORS.border}`,
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '12px', color: COLORS.muted }}>{w.cmd}</span>
              <span
                style={{
                  fontSize: '10px',
                  color: COLORS.green,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  padding: '1px 6px',
                }}
              >
                SVG
              </span>
            </div>

            {/* Preview */}
            <div
              style={{
                padding: '20px 20px 8px',
                background: COLORS.bg,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`GitHub ${w.label} widget`}
                style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            {/* Description + embed */}
            <div
              style={{
                padding: '12px 20px 20px',
                background: COLORS.bg,
                borderTop: `1px solid ${COLORS.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <p style={{ fontSize: '12px', color: COLORS.muted }}>{w.description}</p>
              <div
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '11px',
                  color: COLORS.text,
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: COLORS.muted, userSelect: 'none' }}>embed › </span>
                {embedCode}
              </div>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '12px', color: COLORS.muted }}>
          <span style={{ color: COLORS.green }}>@{username}</span> — github-stats-widget
        </span>
        <a
          href="https://yoixo.my.id"
          style={{
            fontSize: '12px',
            color: COLORS.muted,
            textDecoration: 'none',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '4px',
            padding: '3px 10px',
          }}
        >
          ← portfolio
        </a>
      </div>
    </main>
  );
}
