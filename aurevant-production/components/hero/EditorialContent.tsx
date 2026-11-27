import React from 'react';

interface EditorialContentProps {
  className?: string;
}

export function EditorialContent({ className = '' }: EditorialContentProps) {
  return (
    <div className={`space-y-4 sm:space-y-5 lg:space-y-6 z-10 editorial-content ${className}`}>
      {/* Eyebrow */}
      <p className="text-[10px] sm:text-[11px] lg:text-[11.5px] uppercase tracking-[0.24em] text-[#C5A059] font-mono font-medium eyebrow">
        AUREVANT AUCTION HOUSE
      </p>

      {/* Main Heading — Responsive 48–68px on desktop, ~1.05 line height, authentic editorial serif */}
      <h1 className="text-[clamp(2.5rem,4.4vw,4.25rem)] font-serif leading-[1.05] text-[#F4F0E8] font-normal main-heading tracking-tight drop-shadow-sm">
        <span className="block font-normal">Objects with a history.</span>
        <span className="block italic text-[#E7C477] heading-line-gold font-normal mt-1 sm:mt-1.5 [text-shadow:_0_2px_10px_rgba(0,0,0,0.75)]">
          Auctions with a future.
        </span>
      </h1>

      {/* Supporting Curatorial Description — 15–16px comfortable line spacing */}
      <p className="text-[15px] sm:text-[15.5px] lg:text-[16px] text-[#EDE7DC]/90 max-w-[480px] font-sans leading-[1.6] supporting-text font-normal [text-shadow:_0_1px_6px_rgba(0,0,0,0.8)]">
        Discover exceptional art, horology, rare books, jewellery and historic objects.
      </p>

      {/* Action Buttons — Understated, refined luxury scale */}
      <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3.5 cta-group">
        <a
          href="#auctions"
          className="primary-cta inline-flex items-center justify-center px-6 h-[42px] bg-[#C5A059] text-[#101113] font-sans font-semibold tracking-[0.14em] uppercase text-[11px] lg:text-[11.5px] text-center hover:bg-[#D8B26A] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4F0E8] shadow-sm"
        >
          Explore auctions &rarr;
        </a>
        <a
          href="#sell"
          className="secondary-cta inline-flex items-center justify-center px-6 h-[42px] border border-[#E7C477]/50 bg-[#101113]/35 text-[#F4F0E8] font-sans font-medium tracking-[0.14em] uppercase text-[11px] lg:text-[11.5px] text-center hover:border-[#E7C477] hover:text-[#E7C477] hover:bg-[#E7C477]/15 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E7C477] backdrop-blur-sm"
        >
          Consign an object
        </a>
      </div>
    </div>
  );
}
