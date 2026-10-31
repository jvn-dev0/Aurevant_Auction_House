import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Manrope, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
});

const manrope = Manrope({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  fallback: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
});

export const metadata: Metadata = {
  title: 'AUREVANT AUCTION HOUSE | Fine Art, Horology, Rare Books & Historic Objects',
  description:
    'Objects with a history. Auctions with a future. Discover exceptional art, horology, rare books, jewellery and historic objects at AUREVANT AUCTION HOUSE.',
  keywords: [
    'AUREVANT',
    'Auction House',
    'Fine Art',
    'Horology',
    'Rare Books',
    'Jewellery',
    'Historic Objects',
    'Sculpture',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#101113',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${manrope.variable} ${ibmPlexMono.variable} dark`}
    >
      <body className="bg-museum text-ivory font-sans min-h-screen flex flex-col antialiased selection:bg-gold selection:text-museum-dark overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
