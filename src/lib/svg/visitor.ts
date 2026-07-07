export function renderVisitor(count: number, label: string): string {
  const countStr = count.toLocaleString();
  const text = `> ${escapeXml(label)}: ${escapeXml(countStr)}`;
  const totalWidth = Math.ceil(text.replace(/&[^;]+;/g, ' ').length * 7.5 + 24);
  const height = 24;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}">
  <defs>
    <clipPath id="clip-badge">
      <rect width="${totalWidth}" height="${height}" rx="4" ry="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip-badge)">
    <rect width="${totalWidth}" height="${height}" fill="#0d1117"/>
    <line x1="0" y1="0" x2="${totalWidth}" y2="0" stroke="#30363d" stroke-width="1"/>
    <line x1="0" y1="${height - 1}" x2="${totalWidth}" y2="${height - 1}" stroke="#30363d" stroke-width="1"/>
  </g>
  <text x="12" y="16" font-family="Consolas, Menlo, 'Courier New', monospace" font-size="11">
    <tspan fill="#28c840">&gt;</tspan><tspan fill="#6e7681"> ${escapeXml(label)}: </tspan><tspan fill="#c9d1d9">${escapeXml(countStr)}</tspan>
  </text>
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
