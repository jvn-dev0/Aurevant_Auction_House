'use client';

import React from 'react';

export const InstitutionalFooter: React.FC = () => {
  return (
    <footer className="cinematic-section-footer px-6 sm:px-12 py-20 bg-[#111312] border-t border-[#C5A059]/20 text-xs text-[#A7A39A]" id="footer">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 pb-14 border-b border-[#C5A059]/15">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-baseline gap-2.5">
            <span className="font-serif text-3xl text-[#F4F0E8]">ChronoBid Vault</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#C5A059] border border-[#C5A059] px-2 py-0.5">
              Institution
            </span>
          </div>
          <p className="font-sans font-light text-sm sm:text-base leading-relaxed max-w-sm text-[#A7A39A]">
            A global multi-category auction institution engineered for the scholarly acquisition of paintings, ancient numismatics, rare folios, fine horology, haute joaillerie, and classical antiquities.
          </p>
        </div>

        <div>
          <h6 className="font-mono text-[11px] uppercase tracking-widest text-[#C5A059] mb-4">
            Departments
          </h6>
          <ul className="space-y-2.5 font-mono text-xs sm:text-sm">
            <li><a href="#departments" className="hover:text-[#C5A059] transition-colors">Fine Art &amp; Paintings</a></li>
            <li><a href="#departments" className="hover:text-[#C5A059] transition-colors">Historical Coins</a></li>
            <li><a href="#departments" className="hover:text-[#C5A059] transition-colors">Rare Books &amp; Folios</a></li>
            <li><a href="#departments" className="hover:text-[#C5A059] transition-colors">Fine Horology</a></li>
            <li><a href="#departments" className="hover:text-[#C5A059] transition-colors">Haute Joaillerie</a></li>
            <li><a href="#departments" className="hover:text-[#C5A059] transition-colors">Classical Antiquities</a></li>
          </ul>
        </div>

        <div>
          <h6 className="font-mono text-[11px] uppercase tracking-widest text-[#C5A059] mb-4">
            Governance
          </h6>
          <ul className="space-y-2.5 font-mono text-xs sm:text-sm">
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Pre-Funded Vault Invariant</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Anti-Sniping (ADR-012)</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Scientific XRF Assay</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Custodial Escrow Registry</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">FreePort Transit Terms</a></li>
          </ul>
        </div>

        <div>
          <h6 className="font-mono text-[11px] uppercase tracking-widest text-[#C5A059] mb-4">
            Consignment
          </h6>
          <ul className="space-y-2.5 font-mono text-xs sm:text-sm">
            <li><a href="/consign" className="hover:text-[#C5A059] transition-colors">Submit Collection</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">48-Hour Appraisal Desk</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Private Treaty Protocol</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Canonical USD Settle</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[11px] text-[#A7A39A]">
        <div>&copy; 2026 ChronoBid Vault SA • Geneva, Switzerland • [STANDALONE REACT DESIGN EXPERIMENT]</div>
        <div>Canonical Base Currency: USD • Prototype Only</div>
      </div>
    </footer>
  );
};
