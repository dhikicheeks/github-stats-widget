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
  const height = 140;
  const cardW = 80;
  const gap = 14;
  const startX = (width - (trophies.length * cardW + (trophies.length - 1) * gap)) / 2;

  const cards = trophies
    .map((t, i) => {
      const x = startX + i * (cardW + gap);
      const tierLabel = t.tier || 'N/A';
      return `
    <rect x="${x}" y="36" width="${cardW}" height="88" rx="8" fill="#0d0e1a" stroke="${t.color}" stroke-width="1.5" opacity="0.9"/>
    <text x="${x + cardW / 2}" y="60" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="18" text-anchor="middle">${t.icon}</text>
    <text x="${x + cardW / 2}" y="78" fill="${t.color}" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="13" font-weight="700" text-anchor="middle">${tierLabel}</text>
    <text x="${x + cardW / 2}" y="94" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="9" text-anchor="middle">${t.label}</text>
    <text x="${x + cardW / 2}" y="110" fill="#e0e0f0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="11" font-weight="600" text-anchor="middle">${t.value.toLocaleString()}</text>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <clipPath id="clip-trophy">
      <rect width="${width}" height="${height}" rx="12" ry="12"/>
    </clipPath>
  </defs>
  <rect width="${width}" height="${height}" rx="12" ry="12" fill="#1a1b27" clip-path="url(#clip-trophy)"/>
  <text x="16" y="22" fill="#e0e0f0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="13" font-weight="600">GitHub Trophies</text>
  <text x="${width - 8}" y="22" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="11" text-anchor="end">@${username}</text>
  ${cards}
</svg>`;
}
