'use client';

import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { CuratorialDepartmentId } from '../types';

interface CinematicHeroProps {
  activeDept: CuratorialDepartmentId;
  onSelectDept: (dept: CuratorialDepartmentId) => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  activeDept,
  onSelectDept,
}) => {
  return (
    <section className="cinematic-section-hero relative min-h-[82vh] max-h-[920px] px-6 sm:px-12 pt-16 pb-20 border-b border-[#C5A059]/25 bg-[#111312] overflow-hidden" id="hero">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_1.35fr] items-center gap-12 lg:gap-16">
        {/* Left Column: Editorial Authority & Marketplace Breadth */}
        <div className="max-w-xl">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.22em] text-[#C5A059] mb-6">
            <span className="inline-block w-8 h-[1px] bg-[#C5A059]"></span>
            <span>The October Global Evening Sale • Genève 2026</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.04] tracking-tight text-[#F4F0E8] mb-6">
            The Architecture of <em className="italic text-[#C5A059]">Exceptional</em> Things.
          </h1>

          <p className="font-sans text-base sm:text-lg font-light text-[#A7A39A] leading-relaxed mb-8">
            A global multi-category auction house uniting paintings, ancient numismatics, rare folios, fine horology, haute joaillerie, and classical antiquities. Bound by pre-funded custodial escrow and physical forensic assay.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a
              href="#departments"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C5A059] hover:bg-[#D8B26A] text-[#111312] font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            >
              <span>Explore 6 Curatorial Disciplines</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#saleroom"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#A7A39A]/40 hover:border-[#C5A059] text-[#F4F0E8] hover:text-[#C5A059] font-mono text-xs uppercase tracking-wider transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            >
              <span>Live Saleroom Pulse</span>
            </a>
          </div>

          {/* Minimal Discipline Selector Bar */}
          <div className="pt-6 border-t border-[#C5A059]/20">
            <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[#A7A39A] mb-3">
              Active Saleroom Offerings by Discipline
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {[
                { id: 'art', label: 'Fine Art' },
                { id: 'coins', label: 'Numismatics' },
                { id: 'books', label: 'Rare Books' },
                { id: 'horology', label: 'Horology' },
                { id: 'jewelry', label: 'Jewellery' },
                { id: 'antiquities', label: 'Antiquities' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => onSelectDept(d.id as CuratorialDepartmentId)}
                  className={`px-3 py-1.5 rounded-sm border transition-all duration-150 ${
                    activeDept === d.id
                      ? 'bg-[#C5A059] text-[#111312] border-[#C5A059] font-semibold'
                      : 'bg-[#183D30]/30 text-[#A7A39A] border-[#C5A059]/20 hover:border-[#C5A059]/60 hover:text-[#F4F0E8]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Discipline Curatorial Assemblage (Strictly Bounded) */}
        <div className="flex flex-col gap-4 max-w-[480px] w-full mx-auto lg:mx-0">
          {/* Primary Dominant Masterpiece Frame — Strictly Bounded Max Height */}
          <div
            onClick={() => onSelectDept('art')}
            className="relative bg-[#111312] border-2 border-[#C5A059]/40 rounded-sm overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] cursor-pointer group transition-all duration-300 hover:border-[#C5A059]"
          >
            {/* Locked Aspect Ratio Container to prevent vertical blowout */}
            <div className="relative w-full aspect-[4/5] max-h-[460px] overflow-hidden bg-[#0c0d0d]">
              <img
                src="/experiments/cinematic-v2/images/rembrandt-self-portrait-1660.jpg"
                alt="Rembrandt van Rijn: Self-Portrait (1660)"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.92] contrast-[1.05]"
              />
              {/* Atmospheric Museum Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111312] via-[#111312]/20 to-transparent pointer-events-none" />

              {/* Curatorial Lot Tag */}
              <div className="absolute top-3 left-3 font-mono text-[11px] tracking-widest uppercase bg-[#111312]/90 border border-[#C5A059] px-3 py-1 text-[#C5A059] backdrop-blur-sm">
                Featured Lot 14 • Department I: Fine Art
              </div>

              {/* Scientific Assay Badge */}
              <div className="absolute top-3 right-3 font-mono text-[11px] tracking-wider text-[#F4F0E8] bg-[#183D30]/90 border border-[#C5A059]/40 px-2.5 py-1 backdrop-blur-sm flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Museum Conserved</span>
              </div>

              {/* Brass Identification Plaque at Image Base */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#111312]/95 border border-[#C5A059]/30 p-3.5 rounded-sm flex justify-between items-center gap-3 backdrop-blur-md">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl text-[#F4F0E8] leading-tight">
                    Rembrandt van Rijn: Self-Portrait
                  </h3>
                  <p className="font-sans text-xs text-[#A7A39A] font-light mt-0.5">
                    1660 • Oil on Canvas • Ex-Marquand Collection
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="block font-mono text-[11px] uppercase tracking-wider text-[#A7A39A]">Current Saleroom Ask</span>
                  <span className="font-mono text-base sm:text-lg text-[#C5A059] font-semibold">$310,000 USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Curatorial Previews Filmstrip (Cross-Discipline Breadth) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Preview Lot 1: Classical Athenian Tetradrachm */}
            <div
              onClick={() => onSelectDept('coins')}
              className={`flex items-center gap-3 p-3 bg-[#151817] border rounded-sm cursor-pointer transition-all duration-200 group ${
                activeDept === 'coins' ? 'border-[#C5A059]' : 'border-[#C5A059]/20 hover:border-[#C5A059]/60'
              }`}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border border-[#C5A059]/40 bg-[#111312] flex-shrink-0">
                <img
                  src="/experiments/cinematic-v2/images/athenian-tetradrachm-reverse.png"
                  alt="Classical Athenian Silver Owl Tetradrachm"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-wider text-[#C5A059]">Dept II • Coins</span>
                <h4 className="font-serif text-sm text-[#F4F0E8] truncate">Athenian Silver Owl</h4>
                <span className="font-mono text-xs text-[#C5A059] font-medium">$105,000 USD</span>
              </div>
            </div>

            {/* Preview Lot 2: Shakespeare First Folio */}
            <div
              onClick={() => onSelectDept('books')}
              className={`flex items-center gap-3 p-3 bg-[#151817] border rounded-sm cursor-pointer transition-all duration-200 group ${
                activeDept === 'books' ? 'border-[#C5A059]' : 'border-[#C5A059]/20 hover:border-[#C5A059]/60'
              }`}
            >
              <div className="w-14 h-14 rounded-sm overflow-hidden border border-[#C5A059]/40 bg-[#1C1410] flex-shrink-0">
                <img
                  src="/experiments/cinematic-v2/images/shakespeare-first-folio-1623.jpg"
                  alt="Shakespeare: The First Folio 1623"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-wider text-[#C5A059]">Dept III • Folios</span>
                <h4 className="font-serif text-sm text-[#F4F0E8] truncate">Shakespeare First Folio</h4>
                <span className="font-mono text-xs text-[#C5A059] font-medium">$420,000 USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layered Architectural Chapter Seam § 01 */}
      <div className="max-w-6xl mx-auto mt-14 pt-6 border-t border-[#C5A059]/30 flex items-center justify-between text-xs font-mono text-[#A7A39A]">
        <span className="text-[#C5A059] tracking-widest uppercase">§ 01 • Institutional Custodial Governance</span>
        <span className="hidden sm:inline">Geneva FreePort Bonded Transit Registry</span>
      </div>
    </section>
  );
};
