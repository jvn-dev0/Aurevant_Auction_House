'use client';

import React, { useState, useRef } from 'react';
import { CuratorialSpecimen, formatUsdAmount } from '../types';
import { ANCHOR_MASTERPIECE_SPECIMEN } from '../data';
import { ShieldCheck, Eye, Lock, ZoomIn } from 'lucide-react';

interface MasterpieceInspectionProps {
  specimen?: CuratorialSpecimen;
}

export const MasterpieceInspection: React.FC<MasterpieceInspectionProps> = ({ specimen: passedSpecimen }) => {
  // Exclusively anchors on the evening sale apex masterpiece Lot 13
  const specimen = passedSpecimen && passedSpecimen.lotNumber === 13 ? passedSpecimen : ANCHOR_MASTERPIECE_SPECIMEN;

  const [isCharging, setIsCharging] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const nextAsk = specimen.currentAskUsd + 10000;
  const [buttonLabel, setButtonLabel] = useState(`Press & Hold to Bid $${formatUsdAmount(nextAsk)} USD`);
  const [loupeVisible, setLoupeVisible] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0, relX: 50, relY: 50 });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPlaced) return;
    setIsCharging(true);
    setButtonLabel('Holding to Commit Funds...');

    timerRef.current = setTimeout(() => {
      setIsCharging(false);
      setIsPlaced(true);
      setButtonLabel(`Bid Placed: $${formatUsdAmount(nextAsk)} USD [Vault Held]`);
    }, 350);
  };

  const cancelHold = () => {
    if (!isCharging) return;
    setIsCharging(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isPlaced) {
      setButtonLabel(`Press & Hold to Bid $${formatUsdAmount(nextAsk)} USD`);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const relX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const relY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setLoupePos({ x: x - 70, y: y - 70, relX, relY });
  };

  const masterpieceImage = specimen.imageUrl || '/experiments/cinematic-v2/images/rembrandt-scholar-portrait.jpg';

  return (
    <section className="cinematic-section-inspection px-6 sm:px-12 py-24 sm:py-32 bg-[#111312] border-b border-[#C5A059]/20" id="inspection">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#C5A059]/20">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2">
              <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Scientific Curatorial Examination Bench</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F4F0E8] leading-tight">
              4K Surface Loupe Inspection
            </h2>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-xs text-[#A7A39A]">
            <span>Apex Lot: </span>
            <strong className="text-[#F4F0E8]">Lot {specimen.lotNumber}</strong>
            <span className="mx-2">•</span>
            <span className="text-[#C5A059]">2.5x Optical Simulation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-start">
          {/* Interactive Loupe Canvas Viewport (Strictly Bounded Frame) */}
          <div
            ref={viewportRef}
            onMouseEnter={() => setLoupeVisible(true)}
            onMouseLeave={() => setLoupeVisible(false)}
            onMouseMove={handleMouseMove}
            className="relative w-full max-w-[560px] aspect-[4/5] max-h-[480px] bg-[#0c0d0e] border-2 border-[#C5A059]/50 rounded-sm overflow-hidden cursor-crosshair flex items-center justify-center group shadow-[0_25px_60px_rgba(0,0,0,0.9)] mx-auto lg:mx-0"
          >
            {/* Real Painting Photography (Substrate Base) */}
            <img
              src={masterpieceImage}
              alt={specimen.title}
              className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.08] select-none pointer-events-none"
            />

            {/* Museum Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111312]/90 via-transparent to-[#111312]/30 pointer-events-none" />

            {/* 2.5x Magnifying Loupe Follower */}
            {loupeVisible && (
              <div
                style={{
                  transform: `translate3d(${loupePos.x}px, ${loupePos.y}px, 0)`,
                  backgroundImage: `url(${masterpieceImage})`,
                  backgroundPosition: `${loupePos.relX}% ${loupePos.relY}%`,
                  backgroundSize: '250%',
                  backgroundRepeat: 'no-repeat',
                }}
                className="absolute top-0 left-0 w-36 h-36 rounded-full border-2 border-[#C5A059] pointer-events-none shadow-[0_0_35px_rgba(0,0,0,0.95),inset_0_0_15px_rgba(197,160,89,0.5)] transition-transform duration-75 z-20"
              >
                {/* Loupe Crosshair Reticle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-full h-[1px] bg-[#C5A059]" />
                  <div className="h-full w-[1px] bg-[#C5A059] absolute" />
                </div>
              </div>
            )}

            {/* Curatorial Identification Plaque */}
            <div className="absolute top-3 left-3 font-mono text-[11px] uppercase tracking-widest bg-[#111312]/90 border border-[#C5A059] px-3 py-1 text-[#C5A059] backdrop-blur-sm z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
              <span>Lot {specimen.lotNumber} • {specimen.mediumOrMaterial}</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 bg-[#111312]/95 border border-[#C5A059]/30 p-3 font-mono text-[11px] text-[#A7A39A] backdrop-blur-md flex items-center justify-between z-10">
              <span className="truncate text-[#F4F0E8]">{specimen.documentedCitation || 'Hofstede de Groot #312; Royal Castle Warsaw CC0'}</span>
              <span className="text-[#C5A059] flex items-center gap-1.5 ml-3 shrink-0">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>2.5x craquelure zoom</span>
              </span>
            </div>
          </div>

          {/* Masterpiece Dossier & Mechanical Bidding Paddle */}
          <div className="bg-[#151817] border-2 border-[#C5A059]/30 p-8 sm:p-10 rounded-sm shadow-xl flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">
                {specimen.departmentRoman} • Evening Sale Apex Masterpiece
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#F4F0E8] leading-tight mb-4">
                {specimen.title}
              </h3>
              <p className="font-sans text-sm sm:text-base font-light text-[#A7A39A] leading-relaxed mb-6">
                Cleaned and stabilized under the supervision of the Swiss National Conservation Institute in 2021. Features verified 17th-century Baltic oak substrate with dendrochronological dating confirming felling circa 1635. Documented provenance tracing back through the Collection of Count Lanckoroński and the 8th Duke of Hamilton.
              </p>

              {/* Technical Conservation Grid */}
              <div className="grid grid-cols-2 gap-4 border-y border-[#C5A059]/20 py-5 mb-8">
                <div className="font-mono">
                  <div className="text-[11px] uppercase text-[#A7A39A] tracking-wider">Substrate &amp; Medium</div>
                  <div className="text-xs sm:text-sm text-[#F4F0E8] font-medium mt-1">{specimen.mediumOrMaterial}</div>
                </div>
                <div className="font-mono">
                  <div className="text-[11px] uppercase text-[#A7A39A] tracking-wider">Dimensions</div>
                  <div className="text-xs sm:text-sm text-[#F4F0E8] font-medium mt-1">{specimen.dimensions}</div>
                </div>
                <div className="font-mono">
                  <div className="text-[11px] uppercase text-[#A7A39A] tracking-wider">Custody Status</div>
                  <div className="text-xs sm:text-sm text-[#76DE5B] font-medium mt-1">FreePort Bonded Vault 2</div>
                </div>
                <div className="font-mono">
                  <div className="text-[11px] uppercase text-[#A7A39A] tracking-wider">Title Registry</div>
                  <div className="text-xs sm:text-sm text-[#C5A059] font-medium mt-1">Clear (Art Loss Register)</div>
                </div>
              </div>
            </div>

            {/* Mechanical Hold-to-Bid Interactive Paddle */}
            <div className="bg-[#111312] border border-[#C5A059]/40 p-6 rounded-sm">
              <div className="flex justify-between items-baseline font-mono text-xs mb-3 text-[#A7A39A]">
                <span className="text-[11px] uppercase tracking-wider">Next Minimum Saleroom Ask:</span>
                <span className="text-xl sm:text-2xl text-[#C5A059] font-semibold">${formatUsdAmount(nextAsk)} USD</span>
              </div>
              <div className="flex justify-between items-center font-mono text-xs mb-4 text-[#A7A39A] pb-3 border-b border-[#C5A059]/15">
                <span>Paddle: <strong className="text-[#F4F0E8]">#4102</strong></span>
                <span>Pre-Funded Vault: <strong className="text-[#76DE5B]">$150,000 USD</strong></span>
              </div>

              <button
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                className={`relative w-full h-14 font-mono text-xs font-semibold uppercase tracking-wider rounded-sm overflow-hidden flex items-center justify-center border transition-all duration-200 select-none min-h-[48px] ${
                  isPlaced
                    ? 'bg-[#183D30] text-[#F4F0E8] border-[#C5A059]'
                    : 'bg-[#C5A059]/15 border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059]/25'
                }`}
              >
                {/* Progress Charging Fill */}
                <div
                  style={{ width: isCharging ? '100%' : '0%' }}
                  className="absolute top-0 left-0 h-full bg-[#C5A059] opacity-35 transition-[width] duration-350 ease-linear pointer-events-none"
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{buttonLabel}</span>
                </span>
              </button>
              <div className="font-mono text-[11px] text-[#A7A39A] text-center mt-3">
                • 350ms intentional mechanical dwell • Releasing before completion cancels bid
              </div>
            </div>
          </div>
        </div>

        {/* Layered Architectural Chapter Seam § 04 */}
        <div className="mt-20 pt-6 border-t border-[#C5A059]/30 flex items-center justify-between text-xs font-mono text-[#A7A39A]">
          <span className="text-[#C5A059] tracking-widest uppercase">§ 04 • Private Consignor Advisory</span>
          <span className="hidden sm:inline">48-Hour Curatorial Appraisal SLA</span>
        </div>
      </div>
    </section>
  );
};
