export function renderError(message: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="60" viewBox="0 0 300 60">
  <defs>
    <clipPath id="clip-error">
      <rect width="300" height="60" rx="12" ry="12"/>
    </clipPath>
  </defs>
  <rect width="300" height="60" rx="12" ry="12" fill="#1a1b27" clip-path="url(#clip-error)"/>
  <text x="150" y="35" fill="#e05c5c" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="13" text-anchor="middle">${escapeXml(message)}</text>
</svg>`;
}

export function renderRateLimit(): string {
  return renderError('Rate limit exceeded. Try again later.');
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
