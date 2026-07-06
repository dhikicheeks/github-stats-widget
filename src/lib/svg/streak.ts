import type { StreakData } from '@/types';
import { FALLBACK_STREAK } from '@/lib/fallback';

const WIDTH = 480;
const HEIGHT = 150;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function renderStreak(data: StreakData | null, username: string): string {
  const d = data ?? FALLBACK_STREAK;
  const circumference = 2 * Math.PI * 32;
  const pct = d.longestStreak > 0 ? Math.min(d.currentStreak / d.longestStreak, 1) : 0;
  const dashOffset = circumference * (1 - pct);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <clipPath id="clip-streak">
      <rect width="${WIDTH}" height="${HEIGHT}" rx="12" ry="12"/>
    </clipPath>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="12" ry="12" fill="#1a1b27" clip-path="url(#clip-streak)"/>

  <!-- title -->
  <text x="16" y="22" fill="#e0e0f0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="13" font-weight="600">GitHub Streak</text>
  <text x="${WIDTH - 8}" y="22" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="11" text-anchor="end">@${username}</text>

  <!-- dividers -->
  <line x1="155" y1="36" x2="155" y2="${HEIGHT - 12}" stroke="#2d2e3f" stroke-width="1"/>
  <line x1="325" y1="36" x2="325" y2="${HEIGHT - 12}" stroke="#2d2e3f" stroke-width="1"/>

  <!-- total contributions -->
  <text x="77" y="68" fill="#e05cc0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="28" font-weight="700" text-anchor="middle">${d.totalContributions}</text>
  <text x="77" y="88" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="11" text-anchor="middle">Total Contributions</text>
  <text x="77" y="106" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="10" text-anchor="middle">${formatDate(d.firstContribution)}</text>
  <text x="77" y="120" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="10" text-anchor="middle">– ${formatDate(d.lastContribution)}</text>

  <!-- ring progress for current streak -->
  <circle cx="240" cy="88" r="32" fill="none" stroke="#2d2e3f" stroke-width="5"/>
  <circle cx="240" cy="88" r="32" fill="none" stroke="#e05cc0" stroke-width="5"
    stroke-dasharray="${circumference.toFixed(2)}" stroke-dashoffset="${dashOffset.toFixed(2)}"
    stroke-linecap="round" transform="rotate(-90 240 88)"/>
  <text x="240" y="84" fill="#e05cc0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="22" font-weight="700" text-anchor="middle">${d.currentStreak}</text>
  <text x="240" y="97" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="9" text-anchor="middle">weeks</text>
  <text x="240" y="138" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="11" text-anchor="middle">Week Streak</text>

  <!-- longest streak -->
  <text x="402" y="68" fill="#e05cc0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="28" font-weight="700" text-anchor="middle">${d.longestStreak}</text>
  <text x="402" y="88" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="11" text-anchor="middle">Longest Streak</text>
  <text x="402" y="106" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="10" text-anchor="middle">${formatDate(d.firstContribution)}</text>
  <text x="402" y="120" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="10" text-anchor="middle">– ${formatDate(d.lastContribution)}</text>
</svg>`;
}
