import type { TopLanguage } from '@/types';
import { FALLBACK_TOP_LANGUAGES } from '@/lib/fallback';
import { renderError } from './error';

export function renderTopLanguages(data: TopLanguage[], username: string): string {
  const langs = data.length > 0 ? data : FALLBACK_TOP_LANGUAGES;

  if (langs.length === 0) {
    return renderError('No language data available');
  }

  const width = 300;
  const paddingTop = 50;
  const rowHeight = 20;
  const paddingBottom = 16;
  const height = paddingTop + langs.length * rowHeight + paddingBottom;

  const rows = langs
    .map((lang, i) => {
      const y = paddingTop + i * rowHeight;
      const filled = Math.round((lang.percentage / 100) * 10);
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
      return `
    <circle cx="16" cy="${y + 8}" r="4" fill="${lang.color}"/>
    <text x="26" y="${y + 12}" fill="#c9d1d9" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="11">${escapeXml(lang.name)}</text>
    <text x="140" y="${y + 12}" fill="#c9d1d9" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="11">${bar}</text>
    <text x="${width - 8}" y="${y + 12}" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="10" text-anchor="end">${lang.percentage.toFixed(1)}%</text>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <clipPath id="clip-tl">
      <rect width="${width}" height="${height}" rx="10" ry="10"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip-tl)">
    <rect width="${width}" height="${height}" fill="#0d1117"/>
    <rect width="${width}" height="30" fill="#161b22"/>
    <circle cx="18" cy="15" r="5.5" fill="#ff5f57"/>
    <circle cx="36" cy="15" r="5.5" fill="#ffbd2e"/>
    <circle cx="54" cy="15" r="5.5" fill="#28c840"/>
    <text x="72" y="20" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="11">@${escapeXml(username)} — zsh</text>
    <line x1="0" y1="30" x2="${width}" y2="30" stroke="#30363d" stroke-width="1"/>
    <text x="16" y="44" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="9">$ ls top_languages</text>
    ${rows}
  </g>
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
