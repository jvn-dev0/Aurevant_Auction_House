'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PAST_AUCTION_LOTS, MARKETPLACE_CATEGORIES, PastAuctionLot, PastSaleOutcome } from '@/lib/data';
import { useChronoBid } from '@/lib/context';
import { MonogramCard } from '@/components/MonogramCard';
import {
  Calendar,
  Filter,
  Search,
  X,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Layers,
} from 'lucide-react';

export default function PastAuctionResultsPage() {
  const { formatPrice, currency } = useChronoBid();

  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedSession, setSelectedSession] = useState<string>('All Sessions');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('All Outcomes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('date-desc');

  const sessionOptions = [
    'All Sessions',
    'Session No. 18 (Sep 2026)',
    'Session No. 17 (Jul 2026)',
  ];

  const outcomeOptions = [
    { label: 'All Outcomes', value: 'All Outcomes' },
    { label: 'Sold at Hammer', value: 'sold' },
    { label: 'Bought In (Unsold)', value: 'bought_in' },
    { label: 'Withdrawn', value: 'withdrawn' },
  ];

  const filteredLots = useMemo(() => {
    return PAST_AUCTION_LOTS.filter((lot) => {
      // Category filter
      if (selectedCategory !== 'All Categories' && lot.marketplaceCategory !== selectedCategory) {
        return false;
      }
      // Session filter
      if (selectedSession !== 'All Sessions') {
        if (selectedSession.includes('18') && lot.sessionNumber !== 18) return false;
        if (selectedSession.includes('17') && lot.sessionNumber !== 17) return false;
      }
      // Outcome filter
      if (selectedOutcome !== 'All Outcomes' && lot.saleOutcome !== selectedOutcome) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = lot.title.toLowerCase().includes(q);
        const matchesMaker = lot.makerOrArtist.toLowerCase().includes(q);
        const matchesRef = lot.reference.toLowerCase().includes(q);
        const matchesCat = lot.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMaker && !matchesRef && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'date-desc') {
        return new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime();
      }
      if (sortOption === 'date-asc') {
        return new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime();
      }
      if (sortOption === 'price-desc') {
        return (b.realizedPriceUsd || 0) - (a.realizedPriceUsd || 0);
      }
      if (sortOption === 'price-asc') {
        return (a.realizedPriceUsd || 0) - (b.realizedPriceUsd || 0);
      }
      return 0;
    });
  }, [selectedCategory, selectedSession, selectedOutcome, searchQuery, sortOption]);

  const outcomeBadge = (outcome: PastSaleOutcome) => {
    switch (outcome) {
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Sold at Hammer</span>
          </span>
        );
      case 'bought_in':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-700" />
            <span>Bought In (Reserve Not Met)</span>
          </span>
        );
      case 'withdrawn':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-stone-200 text-stone-800 border border-stone-300">
            <XCircle className="w-3 h-3 text-stone-600" />
            <span>Withdrawn Prior to Sale</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-stone-hairline pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest/60">
              <Calendar className="w-3.5 h-3.5 text-forest/70" />
              <span>Historical Auction Records • Curatorial Archive</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest mt-1">
              Past Auction Results
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/auctions/upcoming"
              className="py-2 px-3.5 bg-paper border border-stone-hairline text-forest font-mono text-xs uppercase tracking-wider hover:border-forest transition-colors"
            >
              View Upcoming Catalog
            </Link>
            <Link
              href="/auctions/live"
              className="py-2 px-3.5 bg-forest text-paper font-mono text-xs uppercase tracking-wider font-semibold hover:bg-forest-hover transition-colors"
            >
              Live Saleroom
            </Link>
          </div>
        </div>

        <p className="font-sans text-sm sm:text-base text-forest/80 max-w-3xl leading-relaxed">
          Historical archive of realised hammer prices and sale outcomes across previous curatorial auction sessions.
          All listed prices reflect the hammer price plus official buyer&apos;s premium in USD.
        </p>

        {/* Mandatory Demo Data Notice */}
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-950 font-mono text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 uppercase text-[10px]">
              [DEMO DATA]
            </span>
            <span>
              All historical records, realized prices, and hammer statistics are demonstration fixtures for prototype testing. They do not represent actual historical market transactions.
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-3 pt-2">
          {/* Division Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Auction Category Filter">
            <span className="text-xs font-mono text-forest/60 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Division:</span>
            </span>
            {MARKETPLACE_CATEGORIES.map((category) => {
              const count =
                category === 'All Categories'
                  ? PAST_AUCTION_LOTS.length
                  : PAST_AUCTION_LOTS.filter((l) => l.marketplaceCategory === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                    selectedCategory === category
                      ? 'bg-forest text-paper border-forest font-semibold shadow-tactile'
                      : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest hover:text-forest'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded ${
                      selectedCategory === category ? 'bg-paper/20 text-paper' : 'bg-forest/10 text-forest/80'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters: Session, Outcome, Search, and Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* Search Input */}
            <div className="relative">
              <label htmlFor="past-search" className="sr-only">Search past results</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-forest/40" />
              </div>
              <input
                id="past-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search maker, title, reference..."
                className="w-full pl-9 pr-8 py-2 bg-paper text-forest text-xs font-mono border border-stone-hairline focus:border-forest focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-forest/40 hover:text-forest"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Session Selector */}
            <div>
              <label htmlFor="session-select" className="sr-only">Filter by Auction Session</label>
              <select
                id="session-select"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full py-2 px-3 bg-paper text-forest text-xs font-mono border border-stone-hairline focus:border-forest focus:outline-none"
              >
                {sessionOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Outcome Selector */}
            <div>
              <label htmlFor="outcome-select" className="sr-only">Filter by Sale Outcome</label>
              <select
                id="outcome-select"
                value={selectedOutcome}
                onChange={(e) => setSelectedOutcome(e.target.value)}
                className="w-full py-2 px-3 bg-paper text-forest text-xs font-mono border border-stone-hairline focus:border-forest focus:outline-none"
              >
                {outcomeOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div>
              <label htmlFor="sort-select" className="sr-only">Sort Results</label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full py-2 px-3 bg-paper text-forest text-xs font-mono border border-stone-hairline focus:border-forest focus:outline-none"
              >
                <option value="date-desc">Date: Newest First</option>
                <option value="date-asc">Date: Oldest First</option>
                <option value="price-desc">Realized Price: High to Low</option>
                <option value="price-asc">Realized Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-mono text-forest/70">
        <span>Displaying {filteredLots.length} archived {filteredLots.length === 1 ? 'lot' : 'lots'}</span>
        {(selectedCategory !== 'All Categories' || selectedSession !== 'All Sessions' || selectedOutcome !== 'All Outcomes' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All Categories');
              setSelectedSession('All Sessions');
              setSelectedOutcome('All Outcomes');
              setSearchQuery('');
            }}
            className="text-forest underline hover:text-lime-900"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Results Grid / Table */}
      {filteredLots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => (
            <div
              key={lot.id}
              className="bg-paper border border-stone-hairline shadow-tactile flex flex-col justify-between overflow-hidden hover:border-forest transition-colors"
            >
              <div>
                {/* Visual Monogram Card */}
                <MonogramCard
                  monogram={lot.monogram}
                  subtitle={lot.monogramSubtitle}
                  className="aspect-[4/3] w-full border-b border-stone-hairline"
                />

                <div className="p-5 space-y-3">
                  {/* Session & Status Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] text-forest/60 uppercase tracking-wider block">
                      Lot {lot.lotNumber} • {lot.marketplaceCategory}
                    </span>
                    {outcomeBadge(lot.saleOutcome)}
                  </div>

                  {/* Title & Reference */}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-forest leading-snug">
                      {lot.title}
                    </h3>
                    <span className="font-mono text-xs text-forest/70 block mt-0.5">
                      {lot.makerOrArtist} • {lot.reference} ({lot.year})
                    </span>
                  </div>

                  <p className="font-sans text-xs text-forest/70 line-clamp-2 leading-relaxed">
                    {lot.provenanceSummary}
                  </p>

                  {/* Pricing Matrix */}
                  <div className="pt-3 border-t border-stone-hairline grid grid-cols-2 gap-2 font-mono text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-forest/60 block">Catalogue Estimate</span>
                      <span className="text-forest font-medium">
                        {formatPrice(lot.estimateLowUsd)} – {formatPrice(lot.estimateHighUsd)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase text-forest/60 block">
                        {lot.saleOutcome === 'sold' ? 'Realized Price' : 'Closing Status'}
                      </span>
                      {lot.realizedPriceUsd ? (
                        <span className="text-forest font-bold text-sm block text-emerald-950">
                          {formatPrice(lot.realizedPriceUsd)} USD
                        </span>
                      ) : (
                        <span className="text-forest/60 italic block">
                          {lot.saleOutcome === 'bought_in' ? 'Unsold' : 'Withdrawn'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hammer & Bidder Telemetry if sold */}
                  {lot.saleOutcome === 'sold' && lot.hammerPriceUsd && (
                    <div className="bg-paper-dark p-2 border border-stone-hairline/60 font-mono text-[10px] text-forest/70 flex justify-between items-center">
                      <span>Hammer: ${lot.hammerPriceUsd.toLocaleString()} USD</span>
                      <span>Winning Paddle: {lot.winningPaddle || 'Confidential'}</span>
                      <span>{lot.bidsCount} Bids</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer with link if slug exists */}
              <div className="px-5 py-3 bg-paper-dark/50 border-t border-stone-hairline flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-forest/60">
                  {lot.sessionTitle.split('•')[0].trim()} • {lot.saleDate}
                </span>
                {lot.slug ? (
                  <Link
                    href={`/auctions/lots/${lot.slug}`}
                    className="text-forest hover:text-lime-900 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Inspect Dossier</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-forest/40 text-[10px]">Archived Dossier</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center border border-dashed border-stone-hairline p-8 space-y-3 bg-paper shadow-tactile">
          <p className="font-serif text-xl text-forest">No archived lots matched your search criteria</p>
          <p className="font-mono text-xs text-forest/60 max-w-md mx-auto">
            Try adjusting your category, session, or keyword filters to explore other historical sale records.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All Categories');
              setSelectedSession('All Sessions');
              setSelectedOutcome('All Outcomes');
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-2 bg-forest text-paper font-mono text-xs uppercase tracking-wider hover:bg-forest-hover transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
