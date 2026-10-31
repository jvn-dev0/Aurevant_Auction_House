import type { Metadata } from 'next';
import { Instrument_Serif, Manrope, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { ChronoBidProvider } from '@/lib/context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastContainer } from '@/components/ToastContainer';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ChronoBid Vault | Curated Fine Horology & Rare Timepiece Auction System',
  description:
    'Editorial-first horological auction institution. Curated rare vintage timepieces, live transparent anti-sniping bidding, and forensic provenance inspection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${manrope.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-paper text-forest font-sans min-h-screen flex flex-col selection:bg-lime selection:text-forest">
        <ChronoBidProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </ChronoBidProvider>
      </body>
    </html>
  );
}
