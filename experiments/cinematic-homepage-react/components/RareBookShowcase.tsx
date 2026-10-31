'use client';

import React, { useState } from 'react';
import { CuratorialSpecimen, formatUsdAmount } from '../types';
import { BookOpen, ArrowRight, Bookmark } from 'lucide-react';

interface RareBookShowcaseProps {
  specimen: CuratorialSpecimen;
}

export const RareBookShowcase: React.FC<RareBookShowcaseProps> = ({ specimen }) => {
  return (
    <div className="bg-[#F4F0E8] border-2 border-[#C5A059]/50 rounded-sm grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-0 overflow-hidden shadow-2xl text-[#183D30]">
      {/* Visual Archival Folio Display with Real High-Resolution Book Photography */}
      <div className="relative min-h-[420px] sm:min-h-[480px] bg-[#EBE5D8] flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-[#C5A059]/30 group">
        <div className="absolute top-4 left-4 font-mono text-[11px] uppercase tracking-widest bg-[#183D30] text-[#F4F0E8] border border-[#C5A059] px-3 py-1 shadow-sm">
          Lot {specimen.lotNumber} • London, 1623 • First Folio
        </div>

        {/* Real Archival Book Folio Frame — Bounded */}
        <div className="relative w-64 sm:w-72 aspect-[3/4] max-h-[460px] overflow-hidden rounded-sm border-2 border-[#A61935]/60 shadow-[0_20px_50px_rgba(24,61,48,0.25)] bg-[#FAF5EB] p-2 my-2">
          <div className="w-full h-full overflow-hidden border border-[#C5A059]/40">
            <img
              src={specimen.imageUrl || '/experiments/cinematic-v2/images/shakespeare-first-folio-1623.jpg'}
              alt={specimen.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-[1.08] sepia-[0.1]"
            />
          </div>
          {/* Crimson Morocco Leather Ribbon Accent */}
          <div className="absolute top-0 right-6 w-3.5 h-12 bg-[#A61935] shadow-sm flex items-center justify-center">
            <Bookmark className="w-3 h-3 text-[#F4F0E8]" />
          </div>
        </div>

        {/* Folio Inspection Provenance Caption */}
        <div className="mt-4 text-center font-mono text-[11px] text-[#183D30]/80">
          {specimen.imageProvenance || 'British Library / Folger Shakespeare Library Public Domain Archive'}
        </div>
      </div>

      {/* Bibliographical Curatorial Dossier (Warm Ivory Ground with Deep Forest Typography) */}
      <div className="p-8 sm:p-12 flex flex-col justify-between bg-[#F4F0E8]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#A61935] mb-3">
            <span>{specimen.departmentRoman} • {specimen.departmentName}</span>
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl text-[#183D30] leading-tight mb-4">
            {specimen.title}
          </h3>

          <p className="font-sans text-sm sm:text-base font-normal text-[#183D30]/85 leading-relaxed mb-6">
            {specimen.provenanceSummary}
          </p>

          {/* Bibliographical Collation Grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-[#C5A059]/30 pt-5 mb-8">
            {specimen.specificAttributes.map((attr, idx) => (
              <div key={idx} className="font-mono">
                <div className="text-[11px] uppercase text-[#183D30]/70 tracking-wider">{attr.label}</div>
                <div className="text-xs sm:text-sm text-[#183D30] font-semibold mt-1">{attr.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ask & Action HUD */}
        <div className="border-t border-[#C5A059]/30 pt-6">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="block font-mono text-[11px] uppercase text-[#183D30]/70 tracking-wider">Current Saleroom Ask</span>
              <span className="font-mono text-2xl text-[#A61935] font-semibold">${formatUsdAmount(specimen.currentAskUsd)} USD</span>
            </div>
            <div className="text-right">
              <span className="block font-mono text-[11px] uppercase text-[#183D30]/70 tracking-wider">Catalogue Estimate</span>
              <span className="font-mono text-xs sm:text-sm text-[#183D30] font-medium">
                ${formatUsdAmount(specimen.estimateLowUsd)} – ${formatUsdAmount(specimen.estimateHighUsd)} USD
              </span>
            </div>
          </div>

          <a
            href="#saleroom"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#183D30] text-[#F4F0E8] font-mono text-xs font-semibold uppercase tracking-wider hover:bg-[#112d23] transition-colors focus:outline-none focus:ring-2 focus:ring-[#183D30] min-h-[48px]"
          >
            <span>Track Lot in Active Evening Saleroom</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </a>
        </div>
      </div>
    </div>
  );
};
