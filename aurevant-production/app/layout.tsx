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
  metadataBase: new URL('https://aurevant.com'),
  title: 'AUREVANT | Exceptional Objects, Curated Auctions',
  description:
    'Discover exceptional art, rare books, fine jewellery, horology and historic collectibles at AUREVANT Auction House.',
  keywords: [
    'AUREVANT',
    'Auction House',
    'Curated Auctions',
    'Fine Art',
    'Horology',
    'Rare Books',
    'Jewellery',
    'Antiquities',
    'Numismatics',
    'Historic Objects',
  ],
  authors: [{ name: 'AUREVANT Auction House' }],
  creator: 'AUREVANT',
  publisher: 'AUREVANT',
  alternates: {
    canonical: 'https://aurevant.com',
  },
  openGraph: {
    title: 'AUREVANT | Exceptional Objects, Curated Auctions',
    description:
      'Discover exceptional art, rare books, fine jewellery, horology and historic collectibles at AUREVANT Auction House.',
    url: 'https://aurevant.com',
    siteName: 'AUREVANT',
    images: [
      {
        url: '/images/Hero-background.png',
        width: 1920,
        height: 1080,
        alt: 'AUREVANT Auction House Saleroom',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AUREVANT | Exceptional Objects, Curated Auctions',
    description:
      'Discover exceptional art, rare books, fine jewellery, horology and historic collectibles at AUREVANT Auction House.',
    images: ['/images/Hero-background.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#101113',
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://aurevant.com/#website',
      url: 'https://aurevant.com',
      name: 'AUREVANT AUCTION HOUSE',
      description:
        'Discover exceptional art, rare books, fine jewellery, horology and historic collectibles at AUREVANT Auction House.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://aurevant.com/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': ['Organization', 'AuctionHouse'],
      '@id': 'https://aurevant.com/#organization',
      name: 'AUREVANT AUCTION HOUSE',
      url: 'https://aurevant.com',
      logo: 'https://aurevant.com/icon.svg',
      description:
        'International auction house curating rare books, fine horology, classical antiquities, numismatics, fine art and high jewellery. Curatorial demonstration experience.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        addressCountry: 'GB',
      },
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="bg-museum text-ivory font-sans min-h-screen flex flex-col antialiased selection:bg-gold selection:text-museum-dark overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
