import type { StreakData } from '@/types';
import { FALLBACK_STREAK } from '@/lib/fallback';

const WIDTH = 480;
const HEIGHT = 175;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function renderStreak(data: StreakData | null, username: string): string {
  const d = data ?? FALLBACK_STREAK;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <clipPath id="clip-streak">
      <rect width="${WIDTH}" height="${HEIGHT}" rx="10" ry="10"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip-streak)">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="#0d1117"/>
    <rect width="${WIDTH}" height="30" fill="#161b22"/>
    <circle cx="18" cy="15" r="5.5" fill="#ff5f57"/>
    <circle cx="36" cy="15" r="5.5" fill="#ffbd2e"/>
    <circle cx="54" cy="15" r="5.5" fill="#28c840"/>
    <text x="72" y="20" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="11">@${username} — zsh</text>
    <line x1="0" y1="30" x2="${WIDTH}" y2="30" stroke="#30363d" stroke-width="1"/>

    <line x1="155" y1="30" x2="155" y2="${HEIGHT}" stroke="#30363d" stroke-width="1" stroke-dasharray="3,3"/>
    <line x1="325" y1="30" x2="325" y2="${HEIGHT}" stroke="#30363d" stroke-width="1" stroke-dasharray="3,3"/>

    <text x="77" y="47" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="9" text-anchor="middle">$ cat total_commits</text>
    <text x="240" y="47" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="9" text-anchor="middle">$ cat current_streak</text>
    <text x="402" y="47" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="9" text-anchor="middle">$ cat longest_streak</text>

    <text x="77" y="90" fill="#28c840" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="28" font-weight="700" text-anchor="middle">${d.totalContributions}</text>
    <text x="77" y="108" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="10" text-anchor="middle">${formatDate(d.firstContribution)}</text>
    <text x="77" y="121" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="10" text-anchor="middle">– ${formatDate(d.lastContribution)}</text>

    <circle cx="240" cy="97" r="32" fill="none" stroke="#30363d" stroke-width="5"
      stroke-dasharray="8 4" transform="rotate(-90 240 97)"/>
    <text x="240" y="97" fill="#28c840" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="22" font-weight="700" text-anchor="middle">${d.currentStreak}</text>
    <text x="240" y="110" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="9" text-anchor="middle">weeks</text>
    <text x="240" y="162" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="10" text-anchor="middle">week streak</text>

    <text x="402" y="90" fill="#28c840" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="28" font-weight="700" text-anchor="middle">${d.longestStreak}</text>
    <text x="402" y="108" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="10" text-anchor="middle">${formatDate(d.firstContribution)}</text>
    <text x="402" y="121" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="10" text-anchor="middle">– ${formatDate(d.lastContribution)}</text>
  </g>
</svg>`;
}
