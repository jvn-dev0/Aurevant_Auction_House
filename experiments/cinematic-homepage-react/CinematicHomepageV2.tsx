'use client';

import React, { useState, useEffect } from 'react';
import { CuratorialDepartmentId } from './types';
import { CURATORIAL_SPECIMENS, INITIAL_LIVE_BIDS } from './data';
import { CinematicHero } from './components/CinematicHero';
import { AuctionCategoryExplorer } from './components/AuctionCategoryExplorer';
import { AuctionActivity } from './components/AuctionActivity';
import { MasterpieceInspection } from './components/MasterpieceInspection';
import { ProvenanceSection } from './components/ProvenanceSection';
import { ConsignmentSection } from './components/ConsignmentSection';
import { InstitutionalFooter } from './components/InstitutionalFooter';

export const CinematicHomepageV2: React.FC = () => {
  const [activeDept, setActiveDept] = useState<CuratorialDepartmentId>('art');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) {
        setReducedMotion(true);
      }
      const prevBg = document.body.style.backgroundColor;
      document.body.style.backgroundColor = '#111312';

      // Support instant hash scrolling for inspection and deep-links
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'auto' });
        }, 120);
      }

      return () => {
        document.body.style.backgroundColor = prevBg;
      };
    }
  }, []);

  const currentSpecimen = CURATORORIAL_SPECIMENS_LOCKED[activeDept] || CURATORIAL_SPECIMENS[activeDept];

  return (
    <div className={`cinematic-v2-container min-h-screen bg-[#111312] text-[#F4F0E8] font-sans ${reducedMotion ? 'reduced-motion' : ''}`}>
      {/* 1. Governance Sandbox Banner — Forest Green Ground */}
      <aside className="bg-[#183D30] border-b border-[#C5A059]/25 px-6 py-2 font-mono text-[11px] text-[#C5A059] flex justify-between items-center z-50 relative">
        <div>
          <strong className="text-[#F4F0E8]">[STANDALONE REACT DESIGN EXPERIMENT V2]</strong> ChronoBid Vault • Confirmed Brand Palette Locked • Phase 2.1 Prototype Preserved
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#A7A39A]">Base Currency: <strong className="text-[#F4F0E8]">USD</strong></span>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className="px-2.5 py-0.5 border border-[#C5A059] bg-[#C5A059]/15 hover:bg-[#C5A059] hover:text-[#111312] text-[#C5A059] text-[10px] uppercase font-mono transition-colors"
          >
            {reducedMotion ? 'Motion: Reduced' : 'Motion: Fluid'}
          </button>
        </div>
      </aside>

      {/* 2. Institutional Masthead — Charcoal Black Ground */}
      <header className="sticky top-0 z-40 bg-[#111312]/95 backdrop-blur-md border-b border-[#C5A059]/20 px-6 sm:px-12 py-4 flex justify-between items-center">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-2xl text-[#F4F0E8]">ChronoBid Vault</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#C5A059] border border-[#C5A059] px-1.5 py-0.5">
            Multi-Category Saleroom
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-6 font-mono text-xs text-[#A7A39A]">
          <button
            onClick={() => setActiveDept('art')}
            className={`hover:text-[#C5A059] transition-colors pb-1 border-b ${
              activeDept === 'art' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
            }`}
          >
            Fine Art
          </button>
          <button
            onClick={() => setActiveDept('coins')}
            className={`hover:text-[#C5A059] transition-colors pb-1 border-b ${
              activeDept === 'coins' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
            }`}
          >
            Coins
          </button>
          <button
            onClick={() => setActiveDept('books')}
            className={`hover:text-[#C5A059] transition-colors pb-1 border-b ${
              activeDept === 'books' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
            }`}
          >
            Rare Books
          </button>
          <button
            onClick={() => setActiveDept('horology')}
            className={`hover:text-[#C5A059] transition-colors pb-1 border-b ${
              activeDept === 'horology' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
            }`}
          >
            Horology
          </button>
          <button
            onClick={() => setActiveDept('jewelry')}
            className={`hover:text-[#C5A059] transition-colors pb-1 border-b ${
              activeDept === 'jewelry' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
            }`}
          >
            Jewellery
          </button>
          <button
            onClick={() => setActiveDept('antiquities')}
            className={`hover:text-[#C5A059] transition-colors pb-1 border-b ${
              activeDept === 'antiquities' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
            }`}
          >
            Antiquities
          </button>
        </nav>

        {/* Headroom Badge — Forest Green Background with Gold Border */}
        <div className="flex items-center gap-2 font-mono text-xs bg-[#183D30] border border-[#C5A059] px-3.5 py-1.5 rounded-sm">
          <span className="w-2 h-2 rounded-full bg-[#76DE5B] shadow-[0_0_8px_#76DE5B]"></span>
          <span className="text-[#A7A39A]">Vault Headroom: <strong className="text-[#F4F0E8]">$150,000 USD</strong></span>
        </div>
      </header>

      {/* 3. Section 1: Asymmetric Multi-Category Hero Triptych */}
      <CinematicHero activeDept={activeDept} onSelectDept={setActiveDept} />

      {/* 4. Section 2: The ChronoBid Institutional Standard (Three Pillars) */}
      <ProvenanceSection />

      {/* 5. Section 3: The Six Curatorial Disciplines Stage */}
      <AuctionCategoryExplorer
        activeDept={activeDept}
        onSelectDept={setActiveDept}
        specimens={CURATORIAL_SPECIMENS}
      />

      {/* 6. Section 4: Live Mixed-Category Saleroom Pulse with Anti-Sniping */}
      <AuctionActivity initialBids={INITIAL_LIVE_BIDS} />

      {/* 7. Section 5: Masterpiece Inspection & Hold-to-Bid Paddle */}
      <MasterpieceInspection specimen={currentSpecimen} />

      {/* 8. Section 6: Consignor Intake & Provenance Verification */}
      <ConsignmentSection />

      {/* 9. Section 7: Archival Institutional Footer */}
      <InstitutionalFooter />
    </div>
  );
};

// Aliased fallback in case of specimen registry reference
const CURATORORIAL_SPECIMENS_LOCKED = CURATORIAL_SPECIMENS;
