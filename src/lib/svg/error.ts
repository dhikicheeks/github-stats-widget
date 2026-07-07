export function renderError(message: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="90" viewBox="0 0 300 90">
  <defs>
    <clipPath id="clip-error">
      <rect width="300" height="90" rx="10" ry="10"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip-error)">
    <rect width="300" height="90" fill="#0d1117"/>
    <rect width="300" height="30" fill="#161b22"/>
    <circle cx="18" cy="15" r="5.5" fill="#ff5f57"/>
    <circle cx="36" cy="15" r="5.5" fill="#ffbd2e"/>
    <circle cx="54" cy="15" r="5.5" fill="#28c840"/>
    <text x="165" y="20" fill="#6e7681" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="11" text-anchor="middle">zsh</text>
    <line x1="0" y1="30" x2="300" y2="30" stroke="#30363d" stroke-width="1"/>
    <text x="16" y="62" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="13">
      <tspan fill="#28c840">></tspan><tspan fill="#6e7681"> ~ </tspan><tspan fill="#ff5f57">✕ </tspan><tspan fill="#e05c5c">${escapeXml(message)}</tspan>
    </text>
  </g>
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
