'use client';

import React from 'react';
import { CuratorialDepartmentId, CuratorialSpecimen } from '../types';
import { ArtworkShowcase } from './ArtworkShowcase';
import { HistoricalCoinShowcase } from './HistoricalCoinShowcase';
import { RareBookShowcase } from './RareBookShowcase';
import { WatchShowcase } from './WatchShowcase';
import { JewelleryShowcase } from './JewelleryShowcase';
import { AntiquityShowcase } from './AntiquityShowcase';
import { Compass, Sparkles } from 'lucide-react';

interface AuctionCategoryExplorerProps {
  activeDept: CuratorialDepartmentId;
  onSelectDept: (dept: CuratorialDepartmentId) => void;
  specimens: Record<string, CuratorialSpecimen>;
}

export const AuctionCategoryExplorer: React.FC<AuctionCategoryExplorerProps> = ({
  activeDept,
  onSelectDept,
  specimens,
}) => {
  const departments: { id: CuratorialDepartmentId; label: string; roman: string }[] = [
    { id: 'art', label: 'Fine Art & Paintings', roman: 'DEPT I' },
    { id: 'coins', label: 'Coins & Numismatics', roman: 'DEPT II' },
    { id: 'books', label: 'Rare Books & Folios', roman: 'DEPT III' },
    { id: 'horology', label: 'Fine Horology', roman: 'DEPT IV' },
    { id: 'jewelry', label: 'Haute Joaillerie', roman: 'DEPT V' },
    { id: 'antiquities', label: 'Classical Antiquities', roman: 'DEPT VI' },
  ];

  const currentSpecimen = specimens[activeDept];

  return (
    <section className="cinematic-section-departments px-6 sm:px-12 py-24 bg-[#111312] border-b border-[#C5A059]/20" id="departments">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#C5A059] mb-3">
            <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Curatorial Disciplines</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#F4F0E8] leading-tight mb-4">
            Explore the Six Vaults
          </h2>
          <p className="font-sans text-base font-light text-[#A7A39A] max-w-xl mx-auto leading-relaxed">
            Each curatorial department maintains dedicated scientific authentication standards, physical custody protocols, and scholarly cataloguing.
          </p>
        </div>

        {/* Responsive Department Selector — Horizontal Scroll Rail on Mobile */}
        <div className="overflow-x-auto pb-4 mb-12 no-scrollbar" role="tablist" aria-label="Curatorial Departments">
          <div className="flex sm:flex-wrap sm:justify-center gap-2.5 min-w-max sm:min-w-0">
            {departments.map((dept) => {
              const isActive = activeDept === dept.id;
              return (
                <button
                  key={dept.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectDept(dept.id)}
                  className={`group font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059] min-h-[48px] flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-[#C5A059] text-[#111312] border-[#C5A059] font-bold shadow-lg'
                      : 'bg-[#151817] text-[#A7A39A] border-[#C5A059]/25 hover:border-[#C5A059]/70 hover:text-[#F4F0E8]'
                  }`}
                >
                  <span className={`text-[11px] ${isActive ? 'text-[#111312]/70 font-semibold' : 'text-[#C5A059]'}`}>
                    {dept.roman}
                  </span>
                  <span>{dept.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bespoke Department Showcase */}
        <div>
          {activeDept === 'art' && <ArtworkShowcase specimen={currentSpecimen} />}
          {activeDept === 'coins' && <HistoricalCoinShowcase specimen={currentSpecimen} />}
          {activeDept === 'books' && <RareBookShowcase specimen={currentSpecimen} />}
          {activeDept === 'horology' && <WatchShowcase specimen={currentSpecimen} />}
          {activeDept === 'jewelry' && <JewelleryShowcase specimen={currentSpecimen} />}
          {activeDept === 'antiquities' && <AntiquityShowcase specimen={currentSpecimen} />}
        </div>

        {/* Layered Architectural Chapter Seam § 03 */}
        <div className="mt-20 pt-6 border-t border-[#C5A059]/30 flex items-center justify-between text-xs font-mono text-[#A7A39A]">
          <span className="text-[#C5A059] tracking-widest uppercase">§ 03 • Synchronized Saleroom Pulse</span>
          <span className="hidden sm:inline">Anti-Sniping Engine (ADR-012)</span>
        </div>
      </div>
    </section>
  );
};
