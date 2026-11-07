'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ArrowUpRight, ShieldCheck, Gavel } from 'lucide-react';

/**
 * AUREVANT AUCTION HOUSE — Closing Soon | LIVE AUCTIONS
 * 
 * Luxury Curatorial Auction Catalogue:
 * - Appears naturally immediately beneath the second-hero expanded video
 * - Warm Ivory Canvas (#F8F7F2) with Deep Forest Green (#183D30) & Antique Gold (#C5A059)
 * - 4 Premier Live Auction Lots with synchronized countdown timers, estimates,
 *   current bids, provenance metadata, and quick-bid actions
 * - Complies with AGENTS.md curatorial transparency standards ([DEMO LOT])
 */

interface AuctionLot {
  id: string;
  lotNumber: string;
  title: string;
  department: string;
  period: string;
  provenance: string;
  estimateMin: number;
  estimateMax: number;
  currentBid: number;
  totalBids: number;
  initialSeconds: number;
  image: string;
}

const LIVE_LOTS: AuctionLot[] = [
  {
    id: 'lot-01',
    lotNumber: 'LOT #01',
    title: 'A European Marble Figure',
    department: 'Old Masters & Classical Works',
    period: 'Circa 1780 • Continental Europe',
    provenance: 'Distinguished Private Collection, Zurich',
    estimateMin: 120000,
    estimateMax: 180000,
    currentBid: 145000,
    totalBids: 14,
    initialSeconds: 8072, // ~02h 14m 32s
    image: '/images/collections/art-paintings.jpg',
  },
  {
    id: 'lot-02',
    lotNumber: 'LOT #02',
    title: 'Patek Philippe Perpetual Calendar',
    department: 'Haute Horology',
    period: 'Ref. 3970J • 18k Yellow Gold • 1992',
    provenance: 'Single-Owner Estate, Geneva',
    estimateMin: 110000,
    estimateMax: 160000,
    currentBid: 128000,
    totalBids: 22,
    initialSeconds: 13690, // ~03h 48m 10s
    image: '/images/collections/fine-watches.jpg',
  },
  {
    id: 'lot-03',
    lotNumber: 'LOT #03',
    title: 'Classical Athenian Owl Tetradrachm',
    department: 'Ancient Numismatics',
    period: 'Circa 440 BC • Attica, Athens • Mint State',
    provenance: 'Ex-European Institutional Cabinet',
    estimateMin: 45000,
    estimateMax: 65000,
    currentBid: 52000,
    totalBids: 19,
    initialSeconds: 3919, // ~01h 05m 19s
    image: '/images/collections/rare-coins.jpg',
  },
  {
    id: 'lot-04',
    lotNumber: 'LOT #04',
    title: 'First Folio Edition (Rare Fragment)',
    department: 'Manuscripts & First Editions',
    period: 'London, 1623 • Shakespeare Comedies',
    provenance: 'Acquired from British Aristocratic Library',
    estimateMin: 220000,
    estimateMax: 300000,
    currentBid: 260000,
    totalBids: 31,
    initialSeconds: 15765, // ~04h 22m 45s
    image: '/images/collections/rare-books.jpg',
  },
];

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
}

function formatCountdown(totalSecs: number): string {
  if (totalSecs <= 0) return '00h 00m 00s';
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export function ClosingSoonSection() {
  const [secondsLeft, setSecondsLeft] = useState<number[]>(
    LIVE_LOTS.map((lot) => lot.initialSeconds)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) =>
        prev.map((sec) => (sec > 0 ? sec - 1 : 0))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="closing-soon"
      className="relative w-full bg-[#F8F7F2] text-[#183D30] z-10 pt-16 sm:pt-20 lg:pt-24 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16 selection:bg-[#C5A059]/30 selection:text-[#0B2B20]"
      aria-label="Closing Soon Live Auctions"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-[#C5A059]/25">
          <div className="max-w-[760px]">
            {/* Live Status Eyebrow */}
            <div className="flex items-center gap-3 mb-3.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#183D30] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#183D30]" />
              </span>
              <p className="text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.28em] text-[#C5A059] font-mono font-semibold">
                Closing Soon &bull; LIVE AUCTIONS
              </p>
            </div>

            {/* Main Headline */}
            <h2
              className="font-serif font-normal text-[#183D30] leading-[1.08] tracking-tight mb-3"
              style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.4rem)' }}
            >
              Closing Soon
            </h2>

            {/* Supporting Description */}
            <p className="font-sans text-[#183D30]/80 leading-relaxed text-[14px] sm:text-[15.5px] lg:text-[16px] max-w-[640px]">
              Time-sensitive live bidding across premier global lots. Authenticated provenance with real-time saleroom updates.
            </p>
          </div>

          {/* Right Header Status Badges */}
          <div className="mt-6 md:mt-0 flex items-center gap-3 sm:gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#183D30]/6 border border-[#183D30]/15 rounded-none text-[#183D30] font-medium tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#183D30]" />
              <span>4 Live Lots</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#C5A059]/15 border border-[#C5A059]/35 rounded-none text-[#183D30] font-medium tracking-wider uppercase">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Saleroom Active</span>
            </div>
          </div>
        </div>

        {/* ── 4 Live Lot Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {LIVE_LOTS.map((lot, idx) => (
            <article
              key={lot.id}
              className="group relative bg-[#F4F0E8] border border-[#C5A059]/25 hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl"
            >
              {/* Image & Overlay Badges */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#111312]">
                <img
                  src={lot.image}
                  alt={lot.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                />

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111312]/70 via-transparent to-[#111312]/20 pointer-events-none" />

                {/* Top Overlay Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  {/* Live Status Pill */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#183D30]/90 backdrop-blur-md border border-[#F4F0E8]/20 text-[#F4F0E8] font-mono text-[10px] uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E7C477] animate-pulse" />
                    Live
                  </span>

                  {/* Lot Number */}
                  <span className="px-2.5 py-1 bg-[#111312]/85 backdrop-blur-md border border-[#F4F0E8]/15 text-[#C5A059] font-mono text-[10.5px] uppercase tracking-wider font-medium">
                    {lot.lotNumber}
                  </span>
                </div>

                {/* Bottom Countdown Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111312]/85 backdrop-blur-md border border-[#F4F0E8]/15 text-[#F4F0E8] font-mono text-[11px] tracking-wider font-medium">
                    <Clock className="w-3 h-3 text-[#E7C477]" />
                    <span>{formatCountdown(secondsLeft[idx])}</span>
                  </div>
                  <span className="font-mono text-[10.5px] tracking-wider text-[#F4F0E8]/80 bg-[#111312]/85 backdrop-blur-md px-2 py-1 border border-[#F4F0E8]/10">
                    {lot.totalBids} Bids
                  </span>
                </div>
              </div>

              {/* Lot Card Content */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                <div>
                  {/* Department */}
                  <p className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.24em] text-[#C5A059] font-mono font-medium mb-1.5">
                    {lot.department}
                  </p>

                  {/* Lot Title */}
                  <h3 className="font-serif text-[18px] sm:text-[19px] lg:text-[20px] text-[#183D30] font-normal leading-snug group-hover:text-[#C5A059] transition-colors duration-200 line-clamp-1">
                    {lot.title}
                  </h3>

                  {/* Period & Provenance */}
                  <p className="font-sans text-[12px] sm:text-[12.5px] text-[#183D30]/70 mt-1 line-clamp-1">
                    {lot.period}
                  </p>
                </div>

                {/* Pricing & Bidding Action */}
                <div className="mt-5 pt-4 border-t border-[#C5A059]/20">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#183D30]/60">
                      Estimate
                    </span>
                    <span className="font-mono text-[11px] text-[#183D30]/75">
                      {formatCurrency(lot.estimateMin)} &ndash; {formatCurrency(lot.estimateMax)}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#183D30] font-semibold">
                      Current Bid
                    </span>
                    <span className="font-mono text-[15px] sm:text-[16px] text-[#183D30] font-bold tracking-tight">
                      {formatCurrency(lot.currentBid)}
                    </span>
                  </div>

                  {/* Action CTA Button */}
                  <a
                    href="#closing-soon"
                    className="w-full py-2.5 px-4 bg-[#183D30] hover:bg-[#0B2B20] active:scale-[0.99] text-[#F4F0E8] font-mono text-[11px] uppercase tracking-[0.16em] font-semibold transition-all duration-200 border border-[#183D30] flex items-center justify-center gap-2 group-hover:border-[#C5A059] shadow-sm"
                  >
                    <span>Place Bid</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {/* Simulated Demo Disclaimer */}
                  <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono text-[#183D30]/45 uppercase tracking-wider">
                    <span>[DEMO LOT]</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
