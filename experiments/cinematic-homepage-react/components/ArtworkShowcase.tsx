'use client';

import React from 'react';
import { CuratorialSpecimen, formatUsdAmount } from '../types';
import { Eye, ArrowRight, ShieldCheck } from 'lucide-react';

interface ArtworkShowcaseProps {
  specimen: CuratorialSpecimen;
}

export const ArtworkShowcase: React.FC<ArtworkShowcaseProps> = ({ specimen }) => {
  return (
    <div className="bg-[#111312] border-2 border-[#C5A059]/40 rounded-sm grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-0 overflow-hidden shadow-2xl">
      {/* Visual Museum Frame with Real High-Resolution Painting Photography */}
      <div className="relative min-h-[420px] sm:min-h-[480px] bg-[#0c0d0e] flex items-center justify-center p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#C5A059]/20 group">
        <div className="relative w-full max-w-[440px] aspect-[4/5] max-h-[460px] overflow-hidden rounded-sm border-2 border-[#C5A059]/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <img
            src={specimen.imageUrl || '/experiments/cinematic-v2/images/rembrandt-self-portrait-1660.jpg'}
            alt={specimen.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter brightness-[0.95] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111312]/80 via-transparent to-transparent pointer-events-none" />

          {/* Museum Label Overlay */}
          <div className="absolute top-3 left-3 font-mono text-[11px] uppercase tracking-widest bg-[#111312]/90 border border-[#C5A059] px-3 py-1 text-[#C5A059] backdrop-blur-sm">
            Lot {specimen.lotNumber} • Oil on Canvas
          </div>

          <div className="absolute bottom-3 left-3 right-3 bg-[#111312]/90 border border-[#C5A059]/20 p-3 font-mono text-[11px] text-[#A7A39A] backdrop-blur-sm flex items-center justify-between">
            <span className="truncate">{specimen.imageProvenance || 'The Metropolitan Museum of Art Open Access (CC0)'}</span>
            <span className="text-[#C5A059] flex items-center gap-1.5 shrink-0 ml-2">
              <Eye className="w-3.5 h-3.5" />
              <span>4K Surface</span>
            </span>
          </div>
        </div>
      </div>

      {/* Curatorial Scholarly Dossier */}
      <div className="p-8 sm:p-12 flex flex-col justify-between bg-[#151817]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">
            <span>{specimen.departmentRoman} • {specimen.departmentName}</span>
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl text-[#F4F0E8] leading-tight mb-4">
            {specimen.title}
          </h3>

          <p className="font-sans text-sm sm:text-base font-light text-[#A7A39A] leading-relaxed mb-6">
            {specimen.provenanceSummary}
          </p>

          {/* Curatorial Spec Grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-[#C5A059]/20 pt-5 mb-8">
            {specimen.specificAttributes.map((attr, idx) => (
              <div key={idx} className="font-mono">
                <div className="text-[11px] uppercase text-[#A7A39A] tracking-wider">{attr.label}</div>
                <div className="text-xs sm:text-sm text-[#F4F0E8] font-medium mt-1">{attr.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ask & Action HUD */}
        <div className="border-t border-[#C5A059]/20 pt-6">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="block font-mono text-[11px] uppercase text-[#A7A39A] tracking-wider">Current Saleroom Ask</span>
              <span className="font-mono text-2xl text-[#C5A059] font-semibold">${formatUsdAmount(specimen.currentAskUsd)} USD</span>
            </div>
            <div className="text-right">
              <span className="block font-mono text-[11px] uppercase text-[#A7A39A] tracking-wider">Catalogue Estimate</span>
              <span className="font-mono text-xs sm:text-sm text-[#F4F0E8] font-medium">
                ${formatUsdAmount(specimen.estimateLowUsd)} – ${formatUsdAmount(specimen.estimateHighUsd)} USD
              </span>
            </div>
          </div>

          <a
            href="#inspection"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C5A059] text-[#111312] font-mono text-xs font-semibold uppercase tracking-wider hover:bg-[#D8B26A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059] min-h-[48px]"
          >
            <span>Proceed to Lot 13 Masterpiece Surface Loupe</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
