import type { TrophyData, TrophyTier } from '@/types';
import { FALLBACK_TROPHY } from '@/lib/fallback';

interface Trophy {
  icon: string;
  label: string;
  value: number;
  tier: TrophyTier;
  color: string;
}

const TIER_COLORS: Record<TrophyTier, string> = {
  S: '#FFD700',
  AAA: '#4fc3f7',
  AA: '#81d4fa',
  A: '#b3e5fc',
  B: '#ce93d8',
  C: '#80cbc4',
  '': '#546e7a',
};

function getTier(value: number, thresholds: [number, number, number, number, number]): TrophyTier {
  const [t1, t2, t3, t4, t5] = thresholds;
  if (value < t1) return '';
  if (value < t2) return 'C';
  if (value < t3) return 'B';
  if (value < t4) return 'A';
  if (value < t5) return 'AA';
  return 'S';
}

function buildTrophies(data: TrophyData): Trophy[] {
  return [
    {
      icon: '⭐',
      label: 'Stars',
      value: data.totalStars,
      tier: getTier(data.totalStars, [1, 10, 50, 200, 500]),
      color: TIER_COLORS[getTier(data.totalStars, [1, 10, 50, 200, 500])],
    },
    {
      icon: '👥',
      label: 'Followers',
      value: data.followers,
      tier: getTier(data.followers, [1, 10, 50, 200, 1000]),
      color: TIER_COLORS[getTier(data.followers, [1, 10, 50, 200, 1000])],
    },
    {
      icon: '💾',
      label: 'Commits',
      value: data.commits,
      tier: getTier(data.commits, [1, 10, 100, 500, 1000]),
      color: TIER_COLORS[getTier(data.commits, [1, 10, 100, 500, 1000])],
    },
    {
      icon: '🔀',
      label: 'PRs',
      value: data.prs,
      tier: getTier(data.prs, [1, 5, 10, 50, 100]),
      color: TIER_COLORS[getTier(data.prs, [1, 5, 10, 50, 100])],
    },
    {
      icon: '🐛',
      label: 'Issues',
      value: data.issues,
      tier: getTier(data.issues, [1, 5, 10, 50, 100]),
      color: TIER_COLORS[getTier(data.issues, [1, 5, 10, 50, 100])],
    },
  ];
}

export function renderTrophy(data: TrophyData | null, username: string): string {
  const d = data ?? FALLBACK_TROPHY;
  const trophies = buildTrophies(d);
  const width = 470;
  const height = 143;
  const cardW = 80;
  const gap = 14;
  const startX = (width - (trophies.length * cardW + (trophies.length - 1) * gap)) / 2;

  const cards = trophies
    .map((t, i) => {
      const x = startX + i * (cardW + gap);
      const tierLabel = t.tier || '?';
      const cup = `(${tierLabel})`;
      return `
    <rect x="${x}" y="52" width="${cardW}" height="76" rx="6" fill="#161b22" stroke="${t.color}" stroke-width="1"/>
    <text x="${x + cardW / 2}" y="75" fill="${t.color}" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="14" font-weight="700" text-anchor="middle">${cup}</text>
    <text x="${x + cardW / 2}" y="85" fill="${t.color}" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="9" text-anchor="middle">─────</text>
    <text x="${x + cardW / 2}" y="99" fill="#c9d1d9" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="12" font-weight="600" text-anchor="middle">${t.value.toLocaleString()}</text>
    <text x="${x + cardW / 2}" y="114" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="9" text-anchor="middle">${t.label.toLowerCase()}</text>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <clipPath id="clip-trophy">
      <rect width="${width}" height="${height}" rx="10" ry="10"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip-trophy)">
    <rect width="${width}" height="${height}" fill="#0d1117"/>
    <rect width="${width}" height="30" fill="#161b22"/>
    <circle cx="18" cy="15" r="5.5" fill="#ff5f57"/>
    <circle cx="36" cy="15" r="5.5" fill="#ffbd2e"/>
    <circle cx="54" cy="15" r="5.5" fill="#28c840"/>
    <text x="72" y="20" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="11">@${username} — zsh</text>
    <line x1="0" y1="30" x2="${width}" y2="30" stroke="#30363d" stroke-width="1"/>
    <text x="16" y="44" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="9">$ cat achievements</text>
    ${cards}
  </g>
</svg>`;
}
