'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Interactive3DViewer, AuctionObject3D } from './Interactive3DViewer';

/**
 * AUREVANT AUCTION HOUSE — Closing Soon | Interactive 3D Auction Showcase
 * 
 * Refined Single-Row Editorial Catalogue:
 * - 4 Featured Auction Objects displayed in ONE horizontal row on desktop.
 * - Matching preview assets: each thumbnail faithfully represents the exact 3D model.
 * - Clean object images without visible INTERACT 3D buttons or obscuring badges.
 * - Mechanical departure-board rolling countdown digits (HRS MIN SEC).
 * - Side-by-side object image and curatorial metadata layout.
 * - Full 360° interactive 3D inspection modal on image/title selection.
 */

const CLOSING_SOON_OBJECTS: AuctionObject3D[] = [
  {
    id: 'slot-12',
    slotNumber: 'Slot 12',
    title: 'Antique Book with Quill & Key',
    collection: 'Historical Literary Collection',
    period: 'Circa 1623 • Shakespeare First Folio Binding & Calligraphic Implements',
    provenance: 'Acquired from British Aristocratic Family Library, Oxfordshire',
    estimateMin: 35000,
    estimateMax: 50000,
    currentBid: 42000,
    totalBids: 14,
    initialSeconds: 8072, // ~02h 14m 32s
    modelPath: '/images/3d%20images/antique_book_with_quill_and_key/scene.gltf',
    previewImage: '/images/collections/antique-book-preview.png',
    modelScaleAdjustment: 1.0,
    cameraPositionOffset: [0, 1.2, 3.2],
    cameraDistanceMultiplier: 1.55,
    cameraFov: 42,
  },
  {
    id: 'slot-27',
    slotNumber: 'Slot 27',
    title: 'Vintage Wristwatch',
    collection: 'Classic Horological Collection',
    period: 'Circa 1954 • Manual-Wind Chronograph • 18k Yellow Gold Case',
    provenance: 'Single-Owner Private Estate Collection, Geneva',
    estimateMin: 85000,
    estimateMax: 120000,
    currentBid: 96000,
    totalBids: 22,
    initialSeconds: 13690, // ~03h 48m 10s
    modelPath: '/images/3d%20images/old_wrist_watch_dh/scene.gltf',
    previewImage: '/images/collections/vintage-watch-preview.png',
    modelScaleAdjustment: 1.0,
    modelRotation: [Math.PI * 0.35, 0, 0],
    cameraPositionOffset: [0, 0.4, 3.4],
    cameraDistanceMultiplier: 1.45,
    cameraFov: 40,
  },
  {
    id: 'slot-35',
    slotNumber: 'Slot 35',
    title: 'Historic Masterpiece',
    collection: 'Fine Art Collection',
    period: 'Circa 1650 • Continental School • Oil on Canvas with Carved Giltwood Frame',
    provenance: 'Distinguished Private Continental Collection, Vienna',
    estimateMin: 150000,
    estimateMax: 220000,
    currentBid: 175000,
    totalBids: 19,
    initialSeconds: 3919, // ~01h 05m 19s
    modelPath: '/images/3d%20images/psx-painting/source/model.gltf',
    previewImage: '/images/collections/historic-painting-preview.png',
    modelScaleAdjustment: 1.0,
    cameraPositionOffset: [0, 0.05, 3.1],
    cameraDistanceMultiplier: 1.4,
    cameraFov: 45,
  },
  {
    id: 'slot-48',
    slotNumber: 'Slot 48',
    title: 'Ancient Roman Coin',
    collection: 'Classical Numismatic Collection',
    period: 'Circa 76 AD • Roman Gold Aureus • Emperor Domitian (Caesar Aug F Domitianus)',
    provenance: 'Ex-European Institutional Numismatic Cabinet, Medallion Archive',
    estimateMin: 45000,
    estimateMax: 65000,
    currentBid: 54000,
    totalBids: 28,
    initialSeconds: 15765, // ~04h 22m 45s
    modelPath: '/images/3d%20images/roman-coin/scene.glb',
    previewImage: '/images/collections/roman-coin-preview.png',
    modelScaleAdjustment: 1.0,
    modelRotation: [0, 0, 0],
    cameraPositionOffset: [0, 0.05, 2.7],
    cameraDistanceMultiplier: 1.35,
    cameraFov: 38,
  },
];

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
}

function formatCountdown(totalSecs: number): { hours: string; minutes: string; seconds: string } {
  if (totalSecs <= 0) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  };
}

/**
 * Mechanical Departure-Board Rolling Digit
 * Replaces digits with a smooth vertical wheel transition without flickering or resetting stationary digits.
 */
function MechanicalDigit({ value }: { value: string }) {
  const [curr, setCurr] = useState(value);
  const [prev, setPrev] = useState(value);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (value !== curr) {
      setPrev(curr);
      setCurr(value);
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [value, curr]);

  return (
    <span className="relative inline-block w-[0.62em] h-[1.2em] overflow-hidden align-baseline select-none" aria-label={value}>
      <span
        className={`flex flex-col transition-transform ${
          animating
            ? 'duration-350 ease-[cubic-bezier(0.2,0.8,0.2,1)] -translate-y-1/2'
            : 'duration-0 translate-y-0'
        } motion-reduce:transition-none motion-reduce:transform-none`}
      >
        <span className="h-[1.2em] flex items-center justify-center font-mono">{animating ? prev : curr}</span>
        {animating && (
          <span className="h-[1.2em] flex items-center justify-center font-mono" aria-hidden="true">{curr}</span>
        )}
      </span>
    </span>
  );
}

export function ClosingSoonSection() {
  // Target timestamps initialized once to avoid drift or resets
  const [targetTimestamps] = useState<number[]>(() =>
    CLOSING_SOON_OBJECTS.map((obj) => Date.now() + obj.initialSeconds * 1000)
  );

  const [secondsRemaining, setSecondsRemaining] = useState<number[]>(() =>
    CLOSING_SOON_OBJECTS.map((obj) => obj.initialSeconds)
  );

  const [active3DObject, setActive3DObject] = useState<AuctionObject3D | null>(null);
  const [active3DIndex, setActive3DIndex] = useState<number>(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Live Timer: updates remaining seconds calculated from persistent target timestamp
  useEffect(() => {
    const updateCountdowns = () => {
      const now = Date.now();
      setSecondsRemaining(
        targetTimestamps.map((target) => {
          const diff = Math.max(0, Math.floor((target - now) / 1000));
          return diff;
        })
      );
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamps]);

  // Carousel navigation for mobile / compact screens
  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 320;
    const scrollAmount = direction === 'left' ? -cardWidth - 16 : cardWidth + 16;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  const open3DViewer = (obj: AuctionObject3D, index: number) => {
    setActive3DObject(obj);
    setActive3DIndex(index);
  };

  const close3DViewer = () => {
    setActive3DObject(null);
  };

  return (
    <section
      id="auctions"
      className="relative w-full bg-[#F8F7F2] text-[#183D30] z-10 pt-16 sm:pt-20 lg:pt-24 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16 selection:bg-[#C5A059]/30 selection:text-[#0B2B20]"
      aria-label="Closing Soon Live Auctions"
    >
      <div id="closing-soon" className="absolute -top-[70px] pointer-events-none" aria-hidden="true" />
      <div className="max-w-[1520px] mx-auto">
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 sm:mb-10 border-b border-[#C5A059]/30">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-[#183D30]">
                Closing Soon
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#183D30] text-[#D7E65A] font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7E65A] animate-pulse" />
                Live Auctions
              </span>
            </div>
            <p className="mt-2 text-sm text-[#183D30]/70 max-w-xl font-sans">
              Active salerooms entering final bidding intervals. Select any lot to inspect authentic 3D geometry and verified curatorial provenance.
            </p>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-4 self-start md:self-end">
            <a
              href="#closing-soon"
              className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-[#183D30] hover:text-[#C5A059] font-medium transition-colors"
            >
              <span>View all auctions</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Prev / Next Carousel Controls (visible for smaller widths) */}
            <div className="flex items-center gap-1.5 pl-3 border-l border-[#C5A059]/30">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="w-9 h-9 flex items-center justify-center rounded-none border border-[#183D30]/25 bg-[#F4F0E8] hover:bg-[#183D30] hover:text-[#F4F0E8] text-[#183D30] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                aria-label="Previous auction lot"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="w-9 h-9 flex items-center justify-center rounded-none border border-[#183D30]/25 bg-[#F4F0E8] hover:bg-[#183D30] hover:text-[#F4F0E8] text-[#183D30] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                aria-label="Next auction lot"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 4 Featured Auction Objects in ONE Horizontal Row ── */}
        <div
          ref={carouselRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 w-full overflow-x-auto pb-4 scroll-smooth"
        >
          {CLOSING_SOON_OBJECTS.map((obj, idx) => {
            const countdown = formatCountdown(secondsRemaining[idx]);

            return (
              <article
                key={obj.id}
                className="group bg-[#F4F0E8] border border-[#C5A059]/30 hover:border-[#C5A059] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {/* Top: Side-by-Side Object Image & Curatorial Info */}
                <div className="flex gap-3 sm:gap-3.5 items-start mb-3.5">
                  {/* Left: Clean Object Image (Interaction target with subtle hover scale, no text overlay) */}
                  <div
                    onClick={() => open3DViewer(obj, idx)}
                    className="relative w-24 sm:w-28 aspect-square flex-shrink-0 bg-[#141716] overflow-hidden cursor-pointer group/img border border-[#C5A059]/20"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        open3DViewer(obj, idx);
                      }
                    }}
                    aria-label={`Inspect 3D model for ${obj.title}`}
                  >
                    <img
                      src={obj.previewImage}
                      alt={obj.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center transform group-hover/img:scale-108 transition-transform duration-500 ease-out select-none"
                    />
                    {/* Subtle hover vignette cue without any visible text overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors pointer-events-none" />
                  </div>

                  {/* Right: Curatorial Information */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#C5A059] font-bold">
                          {obj.slotNumber}
                        </span>
                        <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#183D30]/60">
                          [DEMO]
                        </span>
                      </div>
                      <h3
                        onClick={() => open3DViewer(obj, idx)}
                        className="font-serif text-[15px] sm:text-[16px] text-[#183D30] font-normal leading-snug group-hover:text-[#C5A059] transition-colors cursor-pointer truncate mb-1"
                        title={obj.title}
                      >
                        {obj.title}
                      </h3>
                      <p className="font-sans text-[11px] text-[#183D30]/75 leading-snug line-clamp-2 mb-2">
                        {obj.period}
                      </p>
                    </div>

                    <div className="font-mono text-[10.5px] text-[#183D30]/80">
                      <span className="text-[#183D30]/50 uppercase tracking-wider text-[9px] block">Estimate</span>
                      <span className="font-medium text-[#183D30]">{formatCurrency(obj.estimateMin)} – {formatCurrency(obj.estimateMax)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Mechanical Rolling Countdown Timer */}
                <div className="bg-[#EDE7DC] border border-[#C5A059]/30 px-3 py-2 mb-3">
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#183D30]/70 uppercase tracking-wider mb-1">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-[#C5A059]" />
                      Closing In
                    </span>
                    <span className="text-[#C5A059] font-medium">Saleroom</span>
                  </div>

                  {/* Rolling Mechanical Digits */}
                  <div data-testid="countdown-clock" className="flex items-center justify-center gap-1 font-mono text-[16px] sm:text-[17px] font-bold text-[#183D30]">
                    {/* Hours */}
                    <div className="flex items-center bg-[#F4F0E8] px-1.5 py-0.5 border border-[#C5A059]/20 shadow-inner">
                      <MechanicalDigit value={countdown.hours[0]} />
                      <MechanicalDigit value={countdown.hours[1]} />
                    </div>
                    <span className="text-[#C5A059] font-normal select-none">:</span>
                    {/* Minutes */}
                    <div className="flex items-center bg-[#F4F0E8] px-1.5 py-0.5 border border-[#C5A059]/20 shadow-inner">
                      <MechanicalDigit value={countdown.minutes[0]} />
                      <MechanicalDigit value={countdown.minutes[1]} />
                    </div>
                    <span className="text-[#C5A059] font-normal select-none">:</span>
                    {/* Seconds */}
                    <div className="flex items-center bg-[#F4F0E8] px-1.5 py-0.5 border border-[#C5A059]/20 shadow-inner">
                      <MechanicalDigit value={countdown.seconds[0]} />
                      <MechanicalDigit value={countdown.seconds[1]} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 text-center text-[8.5px] font-mono text-[#183D30]/60 uppercase tracking-widest mt-1">
                    <span>HRS</span>
                    <span>MIN</span>
                    <span>SEC</span>
                  </div>
                </div>

                {/* Action CTA Row */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#C5A059]/20">
                  <div>
                    <span className="block text-[8.5px] font-mono uppercase tracking-wider text-[#183D30]/55">
                      Current Bid
                    </span>
                    <span className="font-mono text-[13px] sm:text-[14px] text-[#183D30] font-bold">
                      {formatCurrency(obj.currentBid)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="py-1.5 px-3 bg-[#183D30] hover:bg-[#0B2B20] text-[#F4F0E8] font-mono text-[10.5px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 shadow-sm group/btn"
                  >
                    <span>Place Bid</span>
                    <ArrowUpRight className="w-3 h-3 text-[#C5A059] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── Interactive 3D Viewer Modal (Rendered ONLY when active) ── */}
      {active3DObject && (
        <Interactive3DViewer
          object={active3DObject}
          remainingSeconds={secondsRemaining[active3DIndex]}
          onClose={close3DViewer}
          formatCountdown={formatCountdown}
          formatCurrency={formatCurrency}
        />
      )}
    </section>
  );
}
