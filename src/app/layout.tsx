import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GitHub Stats Widget',
  description:
    'Self-hosted GitHub stats widgets served as SVG via Next.js API routes. Embed in any GitHub README with an <img> tag.',
  openGraph: {
    title: 'GitHub Stats Widget',
    description: 'Self-hosted GitHub stats as embeddable SVG widgets.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
