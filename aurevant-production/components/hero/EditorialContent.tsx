import React from 'react';

interface EditorialContentProps {
  className?: string;
}

export function EditorialContent({ className = '' }: EditorialContentProps) {
  return (
    <div className={`space-y-4 sm:space-y-5 lg:space-y-6 z-10 editorial-content ${className}`}>
      {/* Eyebrow */}
      <p className="text-[8px] sm:text-[8.5px] lg:text-[9px] uppercase tracking-[0.28em] text-[#C5A059] font-mono font-medium eyebrow">
        AUREVANT AUCTION HOUSE
      </p>

      {/* Main Heading */}
      <h1 className="text-[clamp(2.25rem,3.4vw,3.125rem)] font-serif leading-[1.08] text-[#F4F0E8] font-normal main-heading tracking-tight drop-shadow-md">
        <span className="block font-normal">Objects with a history.</span>
        <span className="block italic text-[#E7C477] heading-line-gold font-normal mt-0.5 sm:mt-1 [text-shadow:_0_2px_12px_rgba(0,0,0,0.85),_0_1px_3px_rgba(0,0,0,0.95)]">
          Auctions with a future.
        </span>
      </h1>

      {/* Supporting Curatorial Description */}
      <p className="text-[13px] sm:text-[14px] lg:text-[14.5px] text-[#EDE7DC] max-w-[440px] font-sans leading-[1.5] supporting-text font-normal [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
        Discover exceptional art, horology, rare books, jewellery and historic objects.
      </p>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-[14px] cta-group">
        <a
          href="#auctions"
          className="primary-cta inline-flex items-center justify-center px-5 h-[38px] bg-[#C5A059] text-[#101113] font-sans font-semibold tracking-[0.14em] uppercase text-[10px] lg:text-[11px] text-center hover:bg-[#D8B26A] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4F0E8] shadow-md"
        >
          Explore auctions &rarr;
        </a>
        <a
          href="#sell"
          className="secondary-cta inline-flex items-center justify-center px-5 h-[38px] border border-[#E7C477]/60 bg-[#101113]/40 text-[#F4F0E8] font-sans font-medium tracking-[0.14em] uppercase text-[10px] lg:text-[11px] text-center hover:border-[#E7C477] hover:text-[#E7C477] hover:bg-[#E7C477]/15 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E7C477] backdrop-blur-sm shadow-sm"
        >
          Consign an object
        </a>
      </div>
    </div>
  );
}
