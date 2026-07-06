import type { TopLanguage } from '@/types';
import { FALLBACK_TOP_LANGUAGES } from '@/lib/fallback';
import { renderError } from './error';

export function renderTopLanguages(data: TopLanguage[], username: string): string {
  const langs = data.length > 0 ? data : FALLBACK_TOP_LANGUAGES;

  if (langs.length === 0) {
    return renderError('No language data available');
  }

  const width = 300;
  const paddingTop = 40;
  const rowHeight = 22;
  const paddingBottom = 16;
  const height = paddingTop + langs.length * rowHeight + paddingBottom;

  const rows = langs
    .map((lang, i) => {
      const y = paddingTop + i * rowHeight;
      const barWidth = Math.max(1, Math.floor((lang.percentage / 100) * 200));
      return `
    <circle cx="16" cy="${y + 6}" r="5" fill="${lang.color}"/>
    <text x="26" y="${y + 10}" fill="#e0e0f0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="11">${escapeXml(lang.name)}</text>
    <text x="${width - 8}" y="${y + 10}" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="10" text-anchor="end">${lang.percentage.toFixed(1)}%</text>
    <rect x="16" y="${y + 14}" width="${barWidth}" height="4" rx="2" fill="${lang.color}" opacity="0.85"/>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <clipPath id="clip-tl">
      <rect width="${width}" height="${height}" rx="12" ry="12"/>
    </clipPath>
  </defs>
  <rect width="${width}" height="${height}" rx="12" ry="12" fill="#1a1b27" clip-path="url(#clip-tl)"/>
  <text x="16" y="22" fill="#e0e0f0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="14" font-weight="600">Most Used Languages</text>
  <text x="${width - 8}" y="22" fill="#a0a0b0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="11" text-anchor="end">@${escapeXml(username)}</text>
  ${rows}
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
