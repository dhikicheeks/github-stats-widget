export function renderVisitor(count: number, label: string): string {
  const labelWidth = Math.ceil(label.length * 6.5 + 16);
  const countStr = count.toLocaleString();
  const countWidth = Math.ceil(countStr.length * 7.5 + 16);
  const totalWidth = labelWidth + countWidth;
  const height = 20;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}">
  <defs>
    <linearGradient id="grad-label" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#555" stop-opacity="0.1"/>
      <stop offset="1" stop-color="#555" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="grad-count" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0e75b6" stop-opacity="0.1"/>
      <stop offset="1" stop-color="#0e75b6" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="clip-badge">
      <rect width="${totalWidth}" height="${height}" rx="3" ry="3"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip-badge)">
    <rect width="${labelWidth}" height="${height}" fill="#555"/>
    <rect x="${labelWidth}" width="${countWidth}" height="${height}" fill="#0e75b6"/>
    <rect width="${labelWidth}" height="${height}" fill="url(#grad-label)"/>
    <rect x="${labelWidth}" width="${countWidth}" height="${height}" fill="url(#grad-count)"/>
  </g>
  <g fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,Sans-Serif" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity="0.3" text-anchor="middle">${escapeXml(label)}</text>
    <text x="${labelWidth / 2}" y="14" text-anchor="middle">${escapeXml(label)}</text>
    <text x="${labelWidth + countWidth / 2}" y="15" fill="#010101" fill-opacity="0.3" text-anchor="middle">${escapeXml(countStr)}</text>
    <text x="${labelWidth + countWidth / 2}" y="14" text-anchor="middle">${escapeXml(countStr)}</text>
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
