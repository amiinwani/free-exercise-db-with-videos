import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, TAGLINE, DESCRIPTION } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Free Exercise API with Demo Videos`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    'exercise api', 'free exercise api', 'exercise database', 'exercise video api',
    'workout api', 'fitness api', 'exercise gif', 'open source exercise database',
    'gym exercises api', 'exercise json',
  ],
  authors: [{ name: 'Arham Wani' }],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: `${SITE_NAME} — Free Exercise API with Demo Videos`,
    description: TAGLINE,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Free Exercise API with Demo Videos`,
    description: TAGLINE,
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
