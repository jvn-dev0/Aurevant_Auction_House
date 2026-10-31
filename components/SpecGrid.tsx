'use client';

import React from 'react';
import { MarketplaceLot } from '@/lib/data';
import { Activity, ShieldCheck, Compass, Award, Sparkles, Palette } from 'lucide-react';

interface SpecGridProps {
  lot: MarketplaceLot;
}

export function SpecGrid({ lot }: SpecGridProps) {
  // Category 1: Fine Horology SpecGrid
  if (lot.marketplaceCategory === 'Fine Horology') {
    return (
      <div className="border border-stone-hairline bg-paper divide-y divide-stone-hairline">
        {/* Header */}
        <div className="p-4 bg-paper-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-forest font-semibold">
              Horological Specification & Calibre Audit
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-paper border border-stone-hairline text-forest font-medium">
            {lot.conditionGrade}
          </span>
        </div>

        {/* Main Spec Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-hairline text-xs font-mono">
          <div className="p-4 space-y-3">
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Manufacturer</span>
              <span className="font-semibold text-forest">{lot.manufacturer}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Reference</span>
              <span className="font-semibold text-forest">{lot.reference}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Production Period</span>
              <span className="font-semibold text-forest">{lot.year}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Case Material</span>
              <span className="font-semibold text-forest">{lot.caseMaterial || 'Precious Metal'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest/60">Dimensions</span>
              <span className="font-semibold text-forest">{lot.dimensions}</span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Calibre</span>
              <span className="font-semibold text-forest text-right max-w-[240px] truncate">{lot.calibre || 'Mechanical Calibre'}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Dial Architecture</span>
              <span className="font-semibold text-forest text-right max-w-[240px] truncate">{lot.dialDescription || 'Authentic Dial'}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Complications</span>
              <span className="font-semibold text-forest">{lot.complications ? lot.complications.join(', ') : 'Standard Timekeeping'}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Reserve Verification</span>
              <span className="font-semibold text-forest text-lime-800 bg-lime/30 px-1.5 py-0.5">{lot.reserveStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest/60">Heritage Status</span>
              <span className="font-semibold text-forest">Archival Extract Pending</span>
            </div>
          </div>
        </div>

        {/* Timegrapher Acoustic Audit */}
        {lot.timegrapherReading && (
          <div className="p-4 bg-paper-dark/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-forest font-semibold">
              <Activity className="w-4 h-4 text-forest" />
              <span>Timegrapher Acoustic Audit:</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-forest/90">
              <div>
                <span className="text-forest/60 mr-1.5">Daily Rate:</span>
                <span className="font-semibold bg-paper px-2 py-0.5 border border-stone-hairline">{lot.timegrapherReading.rate}</span>
              </div>
              <div>
                <span className="text-forest/60 mr-1.5">Amplitude:</span>
                <span className="font-semibold bg-paper px-2 py-0.5 border border-stone-hairline">{lot.timegrapherReading.amplitude}</span>
              </div>
              <div>
                <span className="text-forest/60 mr-1.5">Beat Error:</span>
                <span className="font-semibold bg-paper px-2 py-0.5 border border-stone-hairline">{lot.timegrapherReading.beatError}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Category 2: Rare Coins & Numismatics SpecGrid
  if (lot.marketplaceCategory === 'Rare Coins & Numismatics' && lot.coinAttributes) {
    const c = lot.coinAttributes;
    return (
      <div className="border border-stone-hairline bg-paper divide-y divide-stone-hairline">
        <div className="p-4 bg-paper-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-forest font-semibold">
              Numismatic Specification & Sovereign Die Audit
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-paper border border-stone-hairline text-forest font-medium">
            {c.gradingService} {c.grade}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-hairline text-xs font-mono">
          <div className="p-4 space-y-3">
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Issuing Authority</span>
              <span className="font-semibold text-forest">{c.issuingAuthority}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Denomination</span>
              <span className="font-semibold text-forest">{c.denomination}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Strike Period</span>
              <span className="font-semibold text-forest">{lot.year}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Metal Composition</span>
              <span className="font-semibold text-forest">{c.metalComposition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest/60">Dimensions / Flann</span>
              <span className="font-semibold text-forest">{lot.dimensions}</span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Weight</span>
              <span className="font-semibold text-forest">{c.weightGrams.toFixed(2)} grams</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Grading Service</span>
              <span className="font-semibold text-forest">{c.gradingService} Certified</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Die Alignment</span>
              <span className="font-semibold text-forest">{c.dieAxis}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Catalog Reference</span>
              <span className="font-semibold text-forest text-right max-w-[200px] truncate">{lot.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest/60">Reserve Verification</span>
              <span className="font-semibold text-forest text-lime-800 bg-lime/30 px-1.5 py-0.5">{lot.reserveStatus}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-paper-dark/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-forest font-semibold">
            <ShieldCheck className="w-4 h-4 text-forest" />
            <span>Forensic Die & Surface Assessment:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-forest/90">
            <div>
              <span className="text-forest/60 mr-1.5">Strike Quality:</span>
              <span className="font-semibold bg-paper px-2 py-0.5 border border-stone-hairline">{c.strikeScore}</span>
            </div>
            <div>
              <span className="text-forest/60 mr-1.5">Surface Integrity:</span>
              <span className="font-semibold bg-paper px-2 py-0.5 border border-stone-hairline">{c.surfaceScore}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Category 3: Haute Joaillerie SpecGrid
  if (lot.marketplaceCategory === 'Haute Joaillerie' && lot.jewelryAttributes) {
    const j = lot.jewelryAttributes;
    return (
      <div className="border border-stone-hairline bg-paper divide-y divide-stone-hairline">
        <div className="p-4 bg-paper-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-forest font-semibold">
              Haute Joaillerie Gemmology & Assay Audit
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-paper border border-stone-hairline text-forest font-medium">
            {j.certificationLab} Certified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-hairline text-xs font-mono">
          <div className="p-4 space-y-3">
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Maison / Atelier</span>
              <span className="font-semibold text-forest">{j.maison}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Period / Year</span>
              <span className="font-semibold text-forest">{lot.year}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Total Weight</span>
              <span className="font-semibold text-forest">{j.totalCaratWeight}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Mounting Metal</span>
              <span className="font-semibold text-forest">{j.mountingMetal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest/60">Dimensions</span>
              <span className="font-semibold text-forest">{lot.dimensions}</span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Geographic Origin</span>
              <span className="font-semibold text-forest text-right max-w-[200px] truncate">{j.gemstoneOrigin}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Treatment Status</span>
              <span className="font-semibold text-forest text-right max-w-[200px] truncate">{j.treatmentStatus}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Assay Marks</span>
              <span className="font-semibold text-forest text-right max-w-[200px] truncate">{j.hallmarks}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Lab Report</span>
              <span className="font-semibold text-forest">{j.certificationLab} #{j.certificateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest/60">Reserve Verification</span>
              <span className="font-semibold text-forest text-lime-800 bg-lime/30 px-1.5 py-0.5">{lot.reserveStatus}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-paper-dark/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-forest font-semibold">
            <ShieldCheck className="w-4 h-4 text-forest" />
            <span>Principal Stones Breakdown:</span>
          </div>
          <div className="text-forest/90 font-sans text-xs">
            {j.principalStones}
          </div>
        </div>
      </div>
    );
  }

  // Category 4: Fine Art SpecGrid
  if (lot.marketplaceCategory === 'Fine Art' && lot.artAttributes) {
    const a = lot.artAttributes;
    return (
      <div className="border border-stone-hairline bg-paper divide-y divide-stone-hairline">
        <div className="p-4 bg-paper-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-forest font-semibold">
              Fine Art Conservation & Archival Provenance Audit
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-paper border border-stone-hairline text-forest font-medium">
            {lot.conditionGrade}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-hairline text-xs font-mono">
          <div className="p-4 space-y-3">
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Artist / School</span>
              <span className="font-semibold text-forest">{a.artist}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Execution Period</span>
              <span className="font-semibold text-forest">{a.executionYear}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Medium & Support</span>
              <span className="font-semibold text-forest text-right max-w-[220px] truncate">{a.mediumAndSupport}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Dimensions</span>
              <span className="font-semibold text-forest">{lot.dimensions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest/60">Framing</span>
              <span className="font-semibold text-forest text-right max-w-[220px] truncate">{a.framingStatus}</span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Signature / Inscription</span>
              <span className="font-semibold text-forest text-right max-w-[220px] truncate">{a.signatureLocation}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Catalogue Raisonné</span>
              <span className="font-semibold text-forest text-right max-w-[220px] truncate">{a.catalogueRaisonneRef}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Exhibition History</span>
              <span className="font-semibold text-forest text-right max-w-[220px] truncate">{a.exhibitionHistory}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline/60 pb-1.5">
              <span className="text-forest/60">Conservation Status</span>
              <span className="font-semibold text-forest text-right max-w-[220px] truncate">{a.conservationNotes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest/60">Reserve Verification</span>
              <span className="font-semibold text-forest text-lime-800 bg-lime/30 px-1.5 py-0.5">{lot.reserveStatus}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-paper-dark/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-forest font-semibold">
            <ShieldCheck className="w-4 h-4 text-forest" />
            <span>Catalogue Raisonné & Archival Ledger:</span>
          </div>
          <div className="text-forest/90 font-mono text-xs">
            {a.catalogueRaisonneRef}
          </div>
        </div>
      </div>
    );
  }

  // Fallback SpecGrid
  return (
    <div className="border border-stone-hairline bg-paper p-4 font-mono text-xs space-y-2">
      <div className="font-semibold text-forest">{lot.title}</div>
      <div className="text-forest/70">{lot.provenanceSummary}</div>
    </div>
  );
}
