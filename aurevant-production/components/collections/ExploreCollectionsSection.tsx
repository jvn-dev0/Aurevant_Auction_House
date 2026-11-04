'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * AUREVANT AUCTION HOUSE — Explore Our Collections
 * 
 * Luxury Curatorial Catalogue Section:
 * - Direct continuation underneath the expanded collections video
 * - Warm Ivory Canvas (#F8F7F2) with Forest Green (#123D2C) & Antique Gold (#B99455)
 * - 4 Curated Auction Departments:
 *   1. Art & Paintings
 *   2. Rare Coins
 *   3. Fine Watches
 *   4. Rare Books
 * - High-resolution existing project photography with tactile hover interactions
 */

interface CollectionCategory {
  id: string;
  deptNumber: string;
  title: string;
  subtitle: string;
  description: string;
  lotsCount: string;
  image: string;
  href: string;
}

const COLLECTIONS: CollectionCategory[] = [
  {
    id: 'art-paintings',
    deptNumber: 'DEPT 01',
    title: 'Art & Paintings',
    subtitle: 'Old Masters & European Works',
    description: 'Museum-grade European paintings, landmark sculptures, and canonical modern compositions with verified institutional provenance.',
    lotsCount: '18 Lots Available',
    image: '/images/collections/art-paintings.jpg',
    href: '#art-paintings',
  },
  {
    id: 'rare-coins',
    deptNumber: 'DEPT 02',
    title: 'Rare Coins',
    subtitle: 'Ancient & Imperial Numismatics',
    description: 'Classical Greek tetradrachms, Roman imperial aurei, and historical gold currencies preserved to exceptional numismatic grades.',
    lotsCount: '24 Lots Available',
    image: '/images/collections/rare-coins.jpg',
    href: '#rare-coins',
  },
  {
    id: 'fine-watches',
    deptNumber: 'DEPT 03',
    title: 'Fine Watches',
    subtitle: 'Haute Horology & Complications',
    description: 'Important vintage references, perpetual calendars, and historic Swiss complications from premier horological manufactures.',
    lotsCount: '16 Lots Available',
    image: '/images/collections/fine-watches.jpg',
    href: '#fine-watches',
  },
  {
    id: 'rare-books',
    deptNumber: 'DEPT 04',
    title: 'Rare Books',
    subtitle: 'Manuscripts & First Editions',
    description: 'Landmark literary first folios, illuminated medieval codices, and historical manuscripts curated from distinguished private libraries.',
    lotsCount: '12 Lots Available',
    image: '/images/collections/rare-books.jpg',
    href: '#rare-books',
  },
];

export function ExploreCollectionsSection() {
  return (
    <section
      id="categories"
      className="relative w-full bg-[#F8F7F2] text-[#123D2C] z-10 pt-16 sm:pt-20 lg:pt-24 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16"
      aria-label="Explore Our Collections"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-[#B99455]/20">
          <div className="max-w-[720px]">
            {/* Curatorial Eyebrow */}
            <div className="flex items-center gap-3 mb-3">
              <span className="block w-6 sm:w-8 h-px bg-[#B99455]/60" />
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#B99455] font-mono font-medium">
                Curated Departments
              </p>
            </div>

            {/* Main Headline */}
            <h2
              className="font-serif font-normal text-[#123D2C] leading-[1.08] tracking-tight mb-3"
              style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.25rem)' }}
            >
              Explore Our Collections
            </h2>

            {/* Supporting Copy */}
            <p className="font-sans text-[14px] sm:text-[15px] lg:text-[16px] text-[#0B2B20]/75 leading-relaxed">
              Authenticated objects of historical resonance, academic significance, and exceptional market provenance.
            </p>
          </div>

          {/* Department Overview Metric */}
          <div className="mt-6 md:mt-0 flex items-center gap-6 text-xs font-mono text-[#0B2B20]/60">
            <span>4 CORE DIVISIONS</span>
            <span className="text-[#B99455]/40">•</span>
            <span>70 TOTAL LOTS</span>
          </div>
        </div>

        {/* ── 4-Department Curatorial Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {COLLECTIONS.map((cat) => (
            <a
              key={cat.id}
              href={cat.href}
              className="group flex flex-col bg-[#FAF8F5] border border-[#B99455]/25 rounded-md overflow-hidden transition-all duration-300 hover:border-[#B99455]/60 hover:shadow-[0_16px_36px_rgba(18,61,44,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B99455]"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-[#101113]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Subtle Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B20]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Corner Department Badge */}
                <div className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-[#101113]/70 backdrop-blur-md border border-[#F4F0E8]/15 text-[9.5px] font-mono tracking-widest text-[#F4F0E8] uppercase">
                  {cat.deptNumber}
                </div>

                {/* Lots Count Overlay */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono text-[#F4F0E8] drop-shadow-md">
                  <span>{cat.lotsCount}</span>
                  <span className="w-6 h-6 rounded-full bg-[#FAF8F5]/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#B99455] group-hover:text-[#101113] transition-colors duration-200">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#B99455] font-medium mb-1">
                    {cat.subtitle}
                  </p>
                  <h3 className="font-serif text-[22px] lg:text-[24px] text-[#123D2C] font-normal leading-snug mb-2.5 group-hover:text-[#B99455] transition-colors duration-200">
                    {cat.title}
                  </h3>
                  <p className="font-sans text-[12.5px] lg:text-[13px] text-[#0B2B20]/70 leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-[#B99455]/15 flex items-center justify-between text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#123D2C] group-hover:text-[#B99455] transition-colors duration-200">
                  <span>View Department</span>
                  <span className="text-[#B99455]">&rarr;</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
