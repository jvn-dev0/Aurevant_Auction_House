'use client';

import React from 'react';
import { CuratorialSpecimen, formatUsdAmount } from '../types';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface AntiquityShowcaseProps {
  specimen: CuratorialSpecimen;
}

export const AntiquityShowcase: React.FC<AntiquityShowcaseProps> = ({ specimen }) => {
  return (
    <div className="bg-[#111312] border-2 border-[#C5A059]/40 rounded-sm grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-0 overflow-hidden shadow-2xl">
      {/* Visual Plinth with Real Museum Antiquity Photography */}
      <div className="relative min-h-[420px] sm:min-h-[480px] bg-[#0c0d0f] flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-[#C5A059]/20 group">
        <div className="absolute top-4 left-4 font-mono text-[11px] uppercase tracking-widest bg-[#111312]/90 border border-[#C5A059] px-3 py-1 text-[#C5A059] backdrop-blur-sm">
          Lot {specimen.lotNumber} • Cyclades, c. 2700 BC • Antiquities
        </div>

        {/* Real Museum Marble Figure Photograph — Bounded */}
        <div className="relative w-64 sm:w-72 aspect-[3/4] max-h-[460px] rounded-sm overflow-hidden border-2 border-[#C5A059]/50 shadow-[0_20px_50px_rgba(0,0,0,0.95)] bg-[#131518] p-2 flex items-center justify-center my-4">
          <img
            src={specimen.imageUrl || '/experiments/cinematic-v2/images/cycladic-marble-figure.jpg'}
            alt={specimen.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 filter contrast-[1.05] brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111312]/50 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="mt-3 text-center font-mono text-[11px] text-[#A7A39A]">
          {specimen.imageProvenance || 'The Metropolitan Museum of Art Open Access (CC0 Public Domain, Acc. #DT5195)'}
        </div>
      </div>

      {/* Archaeological Curatorial Dossier */}
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

          {/* Archaeological Attribute Matrix */}
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
            href="#saleroom"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C5A059] text-[#111312] font-mono text-xs font-semibold uppercase tracking-wider hover:bg-[#D8B26A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059] min-h-[48px]"
          >
            <span>Track Antiquities Lot in Saleroom</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
