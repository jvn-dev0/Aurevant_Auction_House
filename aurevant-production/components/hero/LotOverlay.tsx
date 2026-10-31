import React from 'react';

export function LotOverlay() {
  return (
    <div
      className="absolute right-6 sm:right-10 lg:right-16 bottom-0 hidden sm:block z-20 text-left lot-overlay pointer-events-auto"
      aria-label="Hero Lot Information"
    >
      <div className="max-w-sm bg-[#101113]/80 backdrop-blur-md border border-[#F4F0E8]/15 border-l-2 border-l-[#C5A059] px-5 py-3.5 shadow-2xl transition-all duration-200">
        <p className="font-serif text-[17px] sm:text-[19px] lg:text-[20px] text-[#F4F0E8] font-normal leading-tight tracking-[0.01em] drop-shadow-sm">
          A European Marble Figure
        </p>
        <p className="font-mono text-[12px] sm:text-[13px] text-[#D8D0C2] mt-1.5 tracking-wide">
          Circa 1780
        </p>
        <p className="font-mono text-[13px] sm:text-[14px] text-[#E7C477] mt-1.5 font-medium tracking-wide">
          Estimate: 120,000 &ndash; 180,000 USD
        </p>
        <div className="mt-2.5 pt-2 border-t border-[#F4F0E8]/10 flex items-center justify-between">
          <span className="font-mono text-[11px] sm:text-[11.5px] tracking-[0.22em] uppercase text-[#C5A059] font-semibold">
            [DEMO LOT]
          </span>
          <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[#D8D0C2]/80">
            LOT #01
          </span>
        </div>
      </div>
    </div>
  );
}
