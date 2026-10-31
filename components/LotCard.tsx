'use client';

import React from 'react';
import Link from 'next/link';
import { MarketplaceLot } from '@/lib/data';
import { MonogramCard } from './MonogramCard';
import { useChronoBid } from '@/lib/context';
import { Heart, ArrowUpRight } from 'lucide-react';

interface LotCardProps {
  lot: MarketplaceLot;
  priority?: boolean;
}

export function LotCard({ lot }: LotCardProps) {
  const { currency, formatPrice, isWatchlisted, toggleWatchlist } = useChronoBid();
  const watchlisted = isWatchlisted(lot.id);

  const creator = lot.makerOrArtist || lot.manufacturer || 'Master Artisan';

  return (
    <div className="group bg-paper border border-stone-hairline flex flex-col justify-between hover:border-forest/40 transition-all duration-300">
      {/* Visual Header / Monogram Fallback */}
      <div className="relative">
        <Link href={`/auctions/lots/${lot.slug}`} tabIndex={-1} aria-hidden="true">
          <MonogramCard
            monogram={lot.monogram}
            referenceLabel={lot.monogramSubtitle}
            subtext={lot.provisionalNotice}
            showBadges={true}
          />
        </Link>

        {/* Watchlist Quick Toggle Button */}
        <button
          type="button"
          onClick={() => toggleWatchlist(lot.id)}
          aria-label={watchlisted ? `Remove ${lot.title} from watchlist` : `Save ${lot.title} to watchlist`}
          className="absolute top-3 right-3 p-2 bg-paper/90 hover:bg-paper border border-stone-hairline text-forest transition-colors shadow-tactile z-20"
        >
          <Heart className={`w-4 h-4 ${watchlisted ? 'fill-forest text-forest' : 'text-forest/60'}`} />
        </button>

        {/* Status Indicator */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5">
          {lot.status === 'live' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-lime text-forest text-[10px] font-mono font-bold uppercase tracking-wider shadow-tactile">
              <span className="w-1.5 h-1.5 rounded-full bg-forest animate-ping"></span>
              Live Saleroom
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-paper/90 text-forest text-[10px] font-mono uppercase tracking-wider border border-stone-hairline shadow-tactile">
              Upcoming Lot #{lot.lotNumber}
            </span>
          )}
          {lot.marketplaceCategory && (
            <span className="px-2 py-1 bg-forest text-paper text-[10px] font-mono uppercase tracking-wider shadow-tactile">
              {lot.marketplaceCategory}
            </span>
          )}
        </div>
      </div>

      {/* Lot Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-forest/60">
            {creator} • {lot.year ? `Circa ${lot.year}` : 'Historical'}
          </div>
          <h3 className="font-serif text-lg font-bold text-forest leading-snug group-hover:text-forest-hover">
            <Link href={`/auctions/lots/${lot.slug}`}>
              {lot.title}
            </Link>
          </h3>
          <p className="text-xs font-sans text-forest/70 line-clamp-2 leading-relaxed">
            {lot.dialDescription || lot.provenanceSummary}
          </p>
        </div>

        {/* Financial Estimates & Current Ask (Dual-Currency Display ADR-026) */}
        <div className="pt-3 border-t border-stone-hairline/80 space-y-2">
          <div className="space-y-0.5">
            <div className="flex justify-between items-baseline text-xs font-mono">
              <span className="text-forest/60">Estimate:</span>
              <span className="text-forest/80 font-medium">
                {formatPrice(lot.estimateLowUsd)} – {formatPrice(lot.estimateHighUsd)}
              </span>
            </div>
            {currency !== 'USD' && (
              <div className="text-right text-[10px] font-mono text-forest/50">
                (${lot.estimateLowUsd.toLocaleString()} – ${lot.estimateHighUsd.toLocaleString()} USD base)
              </div>
            )}
          </div>

          <div className="space-y-0.5 pt-1 border-t border-stone-hairline/40">
            <div className="flex justify-between items-baseline">
              <span className="text-[11px] font-mono uppercase tracking-wider text-forest/60">
                {lot.status === 'live' ? 'Current High Bid:' : 'Opening Ask:'}
              </span>
              <span className="font-mono text-base font-bold text-forest">
                {formatPrice(lot.currentBidUsd)}
              </span>
            </div>
            {currency !== 'USD' && (
              <div className="text-right text-[10px] font-mono text-forest/50">
                (${lot.currentBidUsd.toLocaleString()} USD base)
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/auctions/lots/${lot.slug}`}
          className="w-full py-2.5 px-3 bg-paper-dark hover:bg-forest hover:text-paper text-forest font-mono text-xs uppercase tracking-wider text-center border border-stone-hairline transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Inspect Specimen</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
