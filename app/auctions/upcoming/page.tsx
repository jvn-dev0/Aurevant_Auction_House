'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ALL_AUCTION_LOTS, MARKETPLACE_CATEGORIES, MarketplaceCategory } from '@/lib/data';
import { LotCard } from '@/components/LotCard';
import { Calendar, Filter, ArrowRight, Search, X } from 'lucide-react';

export default function UpcomingCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLots = useMemo(() => {
    return ALL_AUCTION_LOTS.filter((lot) => {
      const matchesCategory =
        selectedCategory === 'All Categories' || lot.marketplaceCategory === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      const titleMatch = lot.title.toLowerCase().includes(query);
      const makerMatch = lot.makerOrArtist.toLowerCase().includes(query);
      const refMatch = lot.reference.toLowerCase().includes(query);
      const catMatch = lot.category.toLowerCase().includes(query);
      return titleMatch || makerMatch || refMatch || catMatch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="border-b border-stone-hairline pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest/60">
              <Calendar className="w-3.5 h-3.5 text-forest/70" />
              <span>Session No. 19 • Curated Marketplace Catalog</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest mt-1">
              Curated Auction Catalog
            </h1>
          </div>

          <Link
            href="/auctions/live"
            className="py-2.5 px-4 bg-lime hover:bg-lime-hover text-forest font-mono text-xs uppercase tracking-wider font-bold transition-all border border-forest/10 flex items-center gap-1.5 shadow-tactile"
          >
            <span className="w-2 h-2 rounded-full bg-forest animate-ping"></span>
            <span>Switch to Active Live Room</span>
          </Link>
        </div>

        <p className="font-sans text-sm sm:text-base text-forest/80 max-w-3xl leading-relaxed">
          Preview curated debut offerings across our premier asset divisions: Fine Horology, Rare Coins & Numismatics,
          Haute Joaillerie, and Fine Art. All specimens are subject to specialist physical audit and provenance verification.
        </p>

        {/* Multi-Category Filter Tabs (Phase 2.1) */}
        <div className="pt-2 flex flex-wrap items-center gap-2" role="tablist" aria-label="Catalog Categories">
          <span className="text-xs font-mono text-forest/60 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Division:</span>
          </span>
          {MARKETPLACE_CATEGORIES.map((category) => {
            const count =
              category === 'All Categories'
                ? ALL_AUCTION_LOTS.length
                : ALL_AUCTION_LOTS.filter((l) => l.marketplaceCategory === category).length;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                  selectedCategory === category
                    ? 'bg-forest text-paper border-forest font-semibold'
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

        {/* Search Input Bar (P2 Enhancement) */}
        <div className="pt-2 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <label htmlFor="catalog-search" className="sr-only">Search catalog by maker, reference, title, or category</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-forest/40" />
            </div>
            <input
              id="catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by maker, model, title, or reference..."
              className="w-full pl-9 pr-8 py-2 bg-paper text-forest text-xs font-mono border border-stone-hairline focus:border-forest focus:outline-none transition-colors rounded-none placeholder:text-forest/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-forest/40 hover:text-forest"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <span className="text-xs font-mono text-forest/60">
              Found {filteredLots.length} lot{filteredLots.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>

      {/* Lot Grid */}
      {filteredLots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-stone-hairline p-8 space-y-3 bg-paper">
          <p className="font-serif text-xl text-forest">No collectible lots matched your query</p>
          <p className="font-mono text-xs text-forest/60">
            No active lots in division &quot;{selectedCategory}&quot; match &quot;{searchQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All Categories');
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-2 bg-forest text-paper font-mono text-xs uppercase tracking-wider hover:bg-forest-hover transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Catalog Bottom Information Notice */}
      <div className="p-6 bg-paper-dark border border-stone-hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-serif text-lg font-bold text-forest">
            Bidding Eligibility & Paddle Registration
          </h4>
          <p className="text-xs font-sans text-forest/70 max-w-2xl leading-relaxed">
            All registered collectors are assigned a virtual paddle with simulated verification.
            Early absentee and telephone bidding facilities can be pre-arranged with the saleroom concierge.
          </p>
        </div>
        <Link
          href="/auth/register"
          className="py-2.5 px-5 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Register Virtual Paddle</span>
          <ArrowRight className="w-3.5 h-3.5 text-lime" />
        </Link>
      </div>
    </div>
  );
}
