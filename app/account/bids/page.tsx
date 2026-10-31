'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useChronoBid } from '@/lib/context';
import { WATCH_LOTS } from '@/lib/data';
import { MonogramCard } from '@/components/MonogramCard';
import { AccountSubnav } from '@/components/AccountSubnav';
import {
  Clock,
  Heart,
  FileText,
  ShieldAlert,
  ArrowRight,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function AccountBidsPage() {
  const {
    user,
    currentBidUsd,
    highestBidderPaddle,
    remainingSeconds,
    formatPrice,
    currency,
    availableToBidUsd,
    reservedFundsUsd,
    watchlist,
    toggleWatchlist,
    addToast,
  } = useChronoBid();

  const [activeTab, setActiveTab] = useState<'bids' | 'watchlist' | 'invoices'>('bids');
  const [paidDemoInvoice, setPaidDemoInvoice] = useState(false);

  const isUserWinning = highestBidderPaddle === user.paddleNumber;
  const watchlistedLots = WATCH_LOTS.filter((l) => watchlist.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Universal Secondary Account Subnav */}
      <AccountSubnav />

      {/* Account Top Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-hairline gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-forest/60">
            Unified Collector Profile • Paddle #{user.paddleNumber}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest mt-1">
            Saleroom Bids & Private Watchlist
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 p-1 bg-paper-dark border border-stone-hairline font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('bids')}
            className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${
              activeTab === 'bids' ? 'bg-forest text-paper font-semibold' : 'text-forest/70 hover:text-forest'
            }`}
          >
            Active Bids
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('watchlist')}
            className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${
              activeTab === 'watchlist' ? 'bg-forest text-paper font-semibold' : 'text-forest/70 hover:text-forest'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${
              activeTab === 'invoices' ? 'bg-forest text-paper font-semibold' : 'text-forest/70 hover:text-forest'
            }`}
          >
            Simulated Invoices
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE BIDS */}
      {activeTab === 'bids' && (
        <div className="space-y-6">
          <div className="p-6 bg-paper border border-stone-hairline shadow-tactile space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-hairline gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime animate-ping"></span>
                <h3 className="font-serif text-xl font-bold text-forest">
                  Live Saleroom: Lot 01 • 1968 Patek Philippe Calatrava Ref. 3520D
                </h3>
              </div>
              <span
                className={`font-mono text-xs px-2.5 py-1 border font-semibold ${
                  isUserWinning
                    ? 'bg-lime text-forest border-lime'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {isUserWinning ? 'Winning High Bid' : 'Outbid by Floor Bidder'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="space-y-0.5">
                <span className="text-forest/60 block">Current High Ask:</span>
                <span className="text-xl font-bold text-forest">{formatPrice(currentBidUsd)}</span>
                {currency !== 'USD' && (
                  <span className="text-[10px] text-forest/50 block">(${currentBidUsd.toLocaleString()} USD base)</span>
                )}
              </div>
              <div>
                <span className="text-forest/60 block">Holding Paddle:</span>
                <span className="text-base font-semibold text-forest">
                  {isUserWinning ? `Your Paddle #${user.paddleNumber}` : `Floor Paddle #${highestBidderPaddle}`}
                </span>
                <span className="text-[10px] text-forest/50 block">
                  {isUserWinning ? `Reserved in Vault: ${formatPrice(currentBidUsd)}` : 'No funds currently committed'}
                </span>
              </div>
              <div>
                <span className="text-forest/60 block">Saleroom Countdown:</span>
                <span className="text-base font-semibold text-forest">
                  {Math.floor(remainingSeconds / 60)}m {remainingSeconds % 60}s
                </span>
                <span className="text-[10px] text-forest/50 block">
                  Available Vault: {formatPrice(availableToBidUsd)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-hairline/60">
              <span className="text-[11px] font-mono text-forest/70">
                Anti-sniping soft-close resets to 00:02:00 if bid placed under 120 seconds.
              </span>
              <Link
                href="/auctions/live"
                className="py-2.5 px-4 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Go to Active Saleroom</span>
                <ArrowRight className="w-3.5 h-3.5 text-lime" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WATCHLIST */}
      {activeTab === 'watchlist' && (
        <div className="space-y-6">
          {watchlistedLots.length === 0 ? (
            <div className="p-12 text-center border border-stone-hairline bg-paper space-y-3">
              <Heart className="w-8 h-8 text-forest/30 mx-auto" />
              <p className="font-serif text-lg text-forest">Your watchlist is currently empty.</p>
              <Link
                href="/auctions/upcoming"
                className="inline-block py-2 px-4 bg-forest text-paper font-mono text-xs uppercase"
              >
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlistedLots.map((lot) => (
                <div key={lot.id} className="border border-stone-hairline bg-paper p-4 space-y-4 shadow-tactile">
                  <div className="relative">
                    <MonogramCard
                      monogram={lot.monogram}
                      referenceLabel={lot.monogramSubtitle}
                      subtext={lot.provisionalNotice}
                      showBadges={false}
                    />
                    <button
                      type="button"
                      onClick={() => toggleWatchlist(lot.id)}
                      className="absolute top-2 right-2 p-1.5 bg-paper/90 border border-stone-hairline text-forest"
                      aria-label="Remove from watchlist"
                    >
                      <Heart className="w-3.5 h-3.5 fill-forest" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-forest/60">
                      Lot #{lot.lotNumber} • {lot.manufacturer}
                    </span>
                    <h4 className="font-serif text-base font-bold text-forest">
                      {lot.title}
                    </h4>
                    <div className="flex justify-between items-baseline pt-2 border-t border-stone-hairline font-mono text-xs">
                      <span className="text-forest/60">Estimate:</span>
                      <span className="font-semibold text-forest">{formatPrice(lot.estimateLowUsd)}</span>
                    </div>
                  </div>
                  <Link
                    href={`/auctions/lots/${lot.slug}`}
                    className="block w-full py-2 bg-paper-dark hover:bg-forest hover:text-paper text-forest font-mono text-xs uppercase text-center transition-colors"
                  >
                    View Dossier
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SIMULATED INVOICES (TC-R08) */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="p-6 bg-paper border border-stone-hairline shadow-tactile space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-hairline gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-forest/60 block">
                  Invoice #CBV-INV-2026-0814
                </span>
                <h3 className="font-serif text-xl font-bold text-forest">
                  Hammer Settlement: 1965 Rolex Daytona 6239
                </h3>
              </div>
              <span
                className={`font-mono text-xs px-2.5 py-1 border font-semibold ${
                  paidDemoInvoice
                    ? 'bg-lime text-forest border-lime'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {paidDemoInvoice ? 'Simulated Paid' : 'Awaiting Settlement'}
              </span>
            </div>

            <div className="p-4 bg-paper-dark border border-stone-hairline font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-stone-hairline pb-1.5">
                <span className="text-forest/60">Hammer Price:</span>
                <span className="font-bold text-forest">$210,000 USD</span>
              </div>
              <div className="flex justify-between border-b border-stone-hairline pb-1.5">
                <span className="text-forest/60">Buyer’s Premium (15%):</span>
                <span className="text-forest">$31,500 USD</span>
              </div>
              <div className="flex justify-between border-b border-stone-hairline pb-1.5">
                <span className="text-forest/60">Total Settlement Due:</span>
                <span className="font-bold text-forest text-sm">$241,500 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest/60">Designated Escrow Account:</span>
                <span className="text-forest">Pictet & Cie (Geneva) [SIMULATED ACCOUNT]</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-forest/60">
                [SANDBOX SIMULATION — NOT REAL PAYMENT]
              </span>
              <button
                type="button"
                onClick={() => {
                  setPaidDemoInvoice(!paidDemoInvoice);
                  addToast(paidDemoInvoice ? 'Invoice marked unpaid.' : 'Simulated payment completed.', 'info');
                }}
                className="py-2.5 px-5 bg-lime hover:bg-lime-hover text-forest font-mono text-xs uppercase tracking-wider font-bold transition-all border border-forest/10 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-forest" />
                <span>{paidDemoInvoice ? 'Revert to Pending' : 'Simulate Settlement [DEMO PAYMENT LINK]'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
