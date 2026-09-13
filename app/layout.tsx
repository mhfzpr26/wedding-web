import type { Metadata, Viewport } from 'next';
import type React from 'react';
import './styles/global.css';
import './styles/invitation.css';

export const metadata: Metadata = {
  title: 'Destia & Rakafansa | The Wedding',
  description:
    'Undangan Pernikahan Destia Dwi Ramadhani & Rakafansa Saputra - 14 November 2026',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'The Wedding of Destia & Rakafansa',
    description:
      'Sabtu, 14 November 2026 - Kami mengundang Anda untuk merayakan hari bahagia kami.',
    url: 'https://wedding.destia-rakafansa.com',
    siteName: 'Destia & Rakafansa Wedding',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Destia & Rakafansa Wedding',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#141414',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
