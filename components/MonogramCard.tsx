'use client';

import React from 'react';

interface MonogramCardProps {
  monogram: string;
  referenceLabel: string;
  subtext?: string;
  className?: string;
  showBadges?: boolean;
}

/**
 * Approved Stone Surface (#EDE7DC) Monogram Fallback Card.
 * Complies strictly with Phase 1 Spec §8.1 & PROTOTYPE_ASSET_READINESS.md.
 * Used for all provisional horological inventory until photographic licensing is verified.
 * Aspect ratio locked to 4:5 to guarantee CLS < 0.02.
 */
export function MonogramCard({
  monogram,
  referenceLabel,
  subtext = 'Archival specimen photograph currently undergoing provenance rights review.',
  className = '',
  showBadges = true,
}: MonogramCardProps) {
  return (
    <div
      className={`relative w-full aspect-4/5 bg-paper-dark border border-stone-hairline flex flex-col items-center justify-between p-6 select-none overflow-hidden transition-all duration-300 ${className}`}
      style={{ backgroundColor: '#EDE7DC' }}
    >
      {/* Top Bar Badges */}
      {showBadges && (
        <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-widest text-forest/70 uppercase">
          <span className="bg-paper px-2 py-0.5 border border-stone-hairline">
            Provisional Specimen
          </span>
          <span className="bg-lime text-forest font-semibold px-2 py-0.5">
            Demo Data
          </span>
        </div>
      )}

      {/* Decorative Guilloché Concentric Ring Elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-48 h-48 rounded-full border border-forest/40"></div>
        <div className="absolute w-36 h-36 rounded-full border border-forest/30 border-dashed"></div>
        <div className="absolute w-24 h-24 rounded-full border border-forest/20"></div>
      </div>

      {/* Centered Editorial Monogram */}
      <div className="my-auto flex flex-col items-center text-center z-10 px-4">
        <span className="font-serif italic text-5xl md:text-6xl text-forest tracking-tight mb-2">
          {monogram}
        </span>
        <span className="font-mono text-xs tracking-widest text-forest font-semibold uppercase px-3 py-1 bg-paper/60 border border-stone-hairline/80">
          {referenceLabel}
        </span>
      </div>

      {/* Bottom Archival Rights Notice */}
      <div className="w-full text-center z-10">
        <p className="text-[10px] font-mono text-forest/60 max-w-xs mx-auto leading-relaxed">
          {subtext}
        </p>
      </div>
    </div>
  );
}
