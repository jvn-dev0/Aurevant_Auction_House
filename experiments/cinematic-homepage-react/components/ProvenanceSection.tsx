'use client';

import React from 'react';
import { ShieldCheck, Lock, Award, ArrowUpRight } from 'lucide-react';

export const ProvenanceSection: React.FC = () => {
  return (
    <section className="cinematic-section-provenance px-6 sm:px-12 py-24 sm:py-32 bg-[#183D30] border-b border-[#C5A059]/30 text-[#F4F0E8]" id="provenance">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-[#C5A059] mb-4">
            <span className="w-6 h-[1px] bg-[#C5A059]"></span>
            <span>Institutional Governance</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-[#F4F0E8]">
            Trust Engineered for <em className="italic text-[#C5A059]">Historic</em> Acquisitions.
          </h2>
          <p className="font-sans text-base sm:text-lg font-light text-[#F4F0E8]/80 mt-6 leading-relaxed">
            Every transaction within ChronoBid Vault is governed by cryptographic fund reservation, physical laboratory verification, and bonded Swiss freeport custody. Speculative bidding and post-hammer default are mathematically eliminated.
          </p>
        </div>

        {/* Asymmetrical 3-Pillar Editorial Flow (No Boxed Repetitive Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 pt-10 border-t border-[#C5A059]/25">
          {/* Pillar 01 */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-serif text-4xl sm:text-5xl text-[#C5A059] italic font-bold">
                  01
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#F4F0E8]/60">
                  Settlement Lock
                </span>
              </div>
              <h3 className="font-serif text-2xl text-[#F4F0E8] font-medium mb-3">
                Pre-Funded Vault Headroom
              </h3>
              <p className="font-sans text-sm sm:text-base font-light text-[#F4F0E8]/75 leading-relaxed">
                Every bidder operates against verified collateral or liquid escrow deposits. Submitted bids automatically place cryptographic reservation locks against the collector's available vault balance, preventing over-commitment across simultaneous lots.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#C5A059]/20 flex items-center gap-2 font-mono text-[11px] text-[#C5A059]">
              <Lock className="w-3.5 h-3.5" />
              <span>Cryptographic Invariant</span>
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-serif text-4xl sm:text-5xl text-[#C5A059] italic font-bold">
                  02
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#F4F0E8]/60">
                  Laboratory Proof
                </span>
              </div>
              <h3 className="font-serif text-2xl text-[#F4F0E8] font-medium mb-3">
                Multi-Point Forensic Assay
              </h3>
              <p className="font-sans text-sm sm:text-base font-light text-[#F4F0E8]/75 leading-relaxed">
                Before cataloguing, independent laboratories conduct XRF metallurgical scans for ancient gold and silver alloy ratios, multispectral craquelure diagnostics on oil panels, and radiocarbon thermoluminescence dating on classical marble.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#C5A059]/20 flex items-center gap-2 font-mono text-[11px] text-[#C5A059]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Scientific Certification</span>
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-serif text-4xl sm:text-5xl text-[#C5A059] italic font-bold">
                  03
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#F4F0E8]/60">
                  Custody &amp; Transit
                </span>
              </div>
              <h3 className="font-serif text-2xl text-[#F4F0E8] font-medium mb-3">
                Bonded FreePort Escrow
              </h3>
              <p className="font-sans text-sm sm:text-base font-light text-[#F4F0E8]/75 leading-relaxed">
                Purchased lots remain within climate-monitored high-security vaults in the Geneva and Zurich FreePorts until financial settlement completes, followed by armed hand-to-hand insured courier transit underwritten by Lloyd's of London.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#C5A059]/20 flex items-center gap-2 font-mono text-[11px] text-[#C5A059]">
              <Award className="w-3.5 h-3.5" />
              <span>Swiss Bonded Protocol</span>
            </div>
          </div>
        </div>

        {/* Layered Architectural Chapter Seam § 02 */}
        <div className="mt-20 pt-6 border-t border-[#C5A059]/30 flex items-center justify-between text-xs font-mono text-[#F4F0E8]/60">
          <span className="text-[#C5A059] tracking-widest uppercase">§ 02 • Curatorial Department Salons</span>
          <span className="hidden sm:inline">Six Sovereign Cultural Disciplines</span>
        </div>
      </div>
    </section>
  );
};
