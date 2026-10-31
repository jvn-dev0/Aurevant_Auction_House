'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useChronoBid } from '@/lib/context';
import { MonogramCard } from '@/components/MonogramCard';
import { CountdownClock } from '@/components/CountdownClock';
import { BidConsole } from '@/components/BidConsole';
import { SpecGrid } from '@/components/SpecGrid';
import { WATCH_LOTS } from '@/lib/data';
import {
  Clock,
  Eye,
  Radio,
  Share2,
  Heart,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

export default function LiveSaleroomPage() {
  const {
    liveLot,
    remainingSeconds,
    extensionCount,
    isSoftCloseActive,
    isSaleroomClosed,
    bidHistory,
    user,
    formatPrice,
    isWatchlisted,
    toggleWatchlist,
  } = useChronoBid();

  const [activeAngle, setActiveAngle] = useState<'dial' | 'calibre' | 'caseback' | 'profile'>('dial');

  const nextLot = WATCH_LOTS[1];
  const watchlisted = isWatchlisted(liveLot.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Saleroom Breadcrumb & Live Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest/60">
            <Link href="/" className="hover:text-forest">Saleroom</Link>
            <span>/</span>
            <span className="text-forest">Live Session No. 18</span>
            <span>/</span>
            <span className="text-forest font-semibold">Lot #{liveLot.lotNumber}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest mt-1">
            {liveLot.title}
          </h1>
        </div>

        {/* Live Saleroom Telemetry Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-paper-dark border border-stone-hairline flex items-center gap-2 text-xs font-mono text-forest">
            <Radio className="w-3.5 h-3.5 text-lime fill-lime" />
            <span>Geneva Floor Online</span>
            <span className="text-forest/50">•</span>
            <span>48 Bidders Connected</span>
          </div>

          <button
            type="button"
            onClick={() => toggleWatchlist(liveLot.id)}
            aria-label={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
            className="p-2 border border-stone-hairline bg-paper hover:bg-paper-dark text-forest transition-colors"
          >
            <Heart className={`w-4 h-4 ${watchlisted ? 'fill-forest text-forest' : 'text-forest/60'}`} />
          </button>
        </div>
      </div>

      {/* Main Saleroom Layout: Left Stage (Visual & Spec) / Right Console (Clock, Bidding, Log) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Visual Fallback Card & Angles */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative">
            <MonogramCard
              monogram={
                activeAngle === 'dial'
                  ? liveLot.monogram
                  : activeAngle === 'calibre'
                  ? 'CAL. 175'
                  : activeAngle === 'caseback'
                  ? '750'
                  : '32.5mm'
              }
              referenceLabel={
                activeAngle === 'dial'
                  ? liveLot.monogramSubtitle
                  : activeAngle === 'calibre'
                  ? '18 JEWELS • 21,600 VPH'
                  : activeAngle === 'caseback'
                  ? '18K YELLOW GOLD HALLMARKS'
                  : '5.5MM ULTRA-THIN PROFILE'
              }
              subtext={liveLot.provisionalNotice}
              showBadges={true}
            />

            {/* Angle Switcher Tabs */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveAngle('dial')}
                className={`px-3 py-1.5 border uppercase tracking-wider transition-all ${
                  activeAngle === 'dial'
                    ? 'bg-forest text-paper border-forest font-semibold'
                    : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest'
                }`}
              >
                1. Dial Architecture
              </button>
              <button
                type="button"
                onClick={() => setActiveAngle('calibre')}
                className={`px-3 py-1.5 border uppercase tracking-wider transition-all ${
                  activeAngle === 'calibre'
                    ? 'bg-forest text-paper border-forest font-semibold'
                    : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest'
                }`}
              >
                2. Calibre 175 Macro
              </button>
              <button
                type="button"
                onClick={() => setActiveAngle('caseback')}
                className={`px-3 py-1.5 border uppercase tracking-wider transition-all ${
                  activeAngle === 'caseback'
                    ? 'bg-forest text-paper border-forest font-semibold'
                    : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest'
                }`}
              >
                3. Hallmarks & Caseback
              </button>
              <button
                type="button"
                onClick={() => setActiveAngle('profile')}
                className={`px-3 py-1.5 border uppercase tracking-wider transition-all ${
                  activeAngle === 'profile'
                    ? 'bg-forest text-paper border-forest font-semibold'
                    : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest'
                }`}
              >
                4. Profile / Crown
              </button>
            </div>
          </div>

          {/* Calibre & Spec Audit */}
          <SpecGrid lot={liveLot} />

          {/* Link to Full Timepiece Dossier */}
          <div className="p-4 bg-paper-dark border border-stone-hairline flex items-center justify-between">
            <span className="text-xs font-mono text-forest/80">
              Complete historical provenance extract, Timegrapher plots, and high-magnification report.
            </span>
            <Link
              href={`/auctions/lots/${liveLot.slug}`}
              className="text-xs font-mono uppercase tracking-wider font-bold text-forest hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View Lot Dossier</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Clock, Console, & Live Floor Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Synchronized Live Countdown Clock */}
          <CountdownClock
            remainingSeconds={remainingSeconds}
            extensionCount={extensionCount}
            isSoftCloseActive={isSoftCloseActive}
          />

          {/* Interactive Bidding Console */}
          <BidConsole />

          {/* Saleroom Floor Activity Log (ADR-012 Evidence Feed) */}
          <div className="border border-stone-hairline bg-paper">
            <div className="p-3.5 bg-paper-dark border-b border-stone-hairline flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-forest font-bold">
                Saleroom Bid History
              </span>
              <span className="text-[10px] font-mono text-forest/60">
                {bidHistory.length} Total Bids
              </span>
            </div>

            <div className="divide-y divide-stone-hairline/60 max-h-72 overflow-y-auto text-xs font-mono">
              {bidHistory.map((b, index) => (
                <div
                  key={b.id}
                  className={`p-3 flex items-center justify-between transition-colors ${
                    index === 0
                      ? 'bg-lime/20 font-semibold'
                      : b.isUser
                      ? 'bg-paper-dark/40'
                      : 'hover:bg-paper-dark/20'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-forest">
                        {formatPrice(b.amountUsd)}
                      </span>
                      {b.isUser && (
                        <span className="text-[10px] bg-forest text-paper px-1.5 py-0.2">
                          Your Paddle
                        </span>
                      )}
                      {b.isExtensionTrigger && (
                        <span className="text-[10px] bg-lime text-forest font-bold px-1.5 py-0.2 border border-forest/10">
                          Soft-Close Trigger (+120s #{b.extensionNumber})
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-forest/60">
                      Paddle #{b.bidderPaddle}
                    </span>
                  </div>

                  <span className="text-[11px] text-forest/50">
                    {b.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Up Next in Catalog Preview */}
          <div className="p-4 border border-stone-hairline bg-paper-dark flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-forest/60">
                Up Next • Lot #{nextLot.lotNumber}
              </span>
              <h4 className="font-serif text-sm font-bold text-forest">
                {nextLot.title}
              </h4>
            </div>
            <Link
              href={`/auctions/lots/${nextLot.slug}`}
              className="p-2 bg-paper border border-stone-hairline text-forest hover:bg-forest hover:text-paper transition-colors"
              aria-label={`Preview Lot #${nextLot.lotNumber}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
