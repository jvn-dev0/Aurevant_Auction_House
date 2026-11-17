'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { GuestAccessNotice } from './GuestAccessNotice';

/**
 * AUREVANT AUCTION HOUSE — Explore the Collections
 * 
 * Reconstructed Exhibition Gallery Architecture:
 * Recreates the supplied reference design:
 * 1. Deep burgundy architectural background with sweeping gold arches on left & right.
 * 2. Centered header:
 *    - Eyebrow: "— CURATED DEPARTMENTS —" in antique gold with flanking horizontal lines.
 *    - Headline: "Explore the collections" in editorial serif (Instrument Serif).
 *    - Supporting copy: "SIX DISCIPLINES. A WORLD OF EXCEPTIONAL OBJECTS."
 *    - Top-right link: "View all categories →"
 * 3. Six continuous framed exhibition panels closely grouped with concave perspective:
 *    - 01: Fine Art (Paintings · Drawings / Sculpture · Prints)
 *    - 02: Horology (Collectible Watches / Clocks · Instruments)
 *    - 03: Numismatics (Ancient Coins · Medals / Currency · Tokens)
 *    - 04: Rare Books (First Editions · Manuscripts / Maps · Documents)
 *    - 05: Jewellery (Fine Jewellery · Gemstones / Signed Pieces)
 *    - 06: Antiquities (Classical · Asian · Egyptian / Historic Objects)
 * 4. Realistic gold picture frame borders with outer bevels and metallic light accents.
 * 5. Polished dark lacquer reflective gallery floor with downward mirrored reflections.
 * 6. Center warm golden floor light pooling at the base between Numismatics & Rare Books.
 * 7. Centered pagination dots (● ○ ○ ○ ○ ○).
 * 8. Compact informational Guest Access Notice upon interaction.
 */

interface ExhibitionPanel {
  id: string;
  deptNumber: string;
  title: string;
  subtitleLine1: string;
  subtitleLine2: string;
  image: string;
  rotationY: number;
  translateZ: number;
  transformOrigin: string;
  edgeBevelStyle?: React.CSSProperties;
}

const EXHIBITION_PANELS: ExhibitionPanel[] = [
  {
    id: 'fine-art',
    deptNumber: '01',
    title: 'Fine Art',
    subtitleLine1: 'Paintings · Drawings',
    subtitleLine2: 'Sculpture · Prints',
    image: '/images/painting.jpg',
    rotationY: 15,
    translateZ: -16,
    transformOrigin: 'right center',
    edgeBevelStyle: {
      boxShadow: '-3px 0 0 #B99455, -5px 0 15px rgba(0, 0, 0, 0.7), 0 16px 40px rgba(0, 0, 0, 0.8)',
    },
  },
  {
    id: 'horology',
    deptNumber: '02',
    title: 'Horology',
    subtitleLine1: 'Collectible Watches',
    subtitleLine2: 'Clocks · Instruments',
    image: '/images/vintage%20watch.jpg',
    rotationY: 9,
    translateZ: -6,
    transformOrigin: 'right center',
    edgeBevelStyle: {
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
    },
  },
  {
    id: 'numismatics',
    deptNumber: '03',
    title: 'Numismatics',
    subtitleLine1: 'Ancient Coins · Medals',
    subtitleLine2: 'Currency · Tokens',
    image: '/images/roman%20coin.jpg',
    rotationY: 2.5,
    translateZ: 0,
    transformOrigin: 'right center',
    edgeBevelStyle: {
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
    },
  },
  {
    id: 'rare-books',
    deptNumber: '04',
    title: 'Rare Books',
    subtitleLine1: 'First Editions · Manuscripts',
    subtitleLine2: 'Maps · Documents',
    image: '/images/old%20books.jpg',
    rotationY: -2.5,
    translateZ: 0,
    transformOrigin: 'left center',
    edgeBevelStyle: {
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
    },
  },
  {
    id: 'jewellery',
    deptNumber: '05',
    title: 'Jewellery',
    subtitleLine1: 'Fine Jewellery · Gemstones',
    subtitleLine2: 'Signed Pieces',
    image: '/images/jwellery.jpg',
    rotationY: -9,
    translateZ: -6,
    transformOrigin: 'left center',
    edgeBevelStyle: {
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
    },
  },
  {
    id: 'antiquities',
    deptNumber: '06',
    title: 'Antiquities',
    subtitleLine1: 'Classical · Asian · Egyptian',
    subtitleLine2: 'Historic Objects',
    image: '/images/vintage%20statue.jpg',
    rotationY: -15,
    translateZ: -16,
    transformOrigin: 'left center',
    edgeBevelStyle: {
      boxShadow: '3px 0 0 #B99455, 5px 0 15px rgba(0, 0, 0, 0.7), 0 16px 40px rgba(0, 0, 0, 0.8)',
    },
  },
];

export function ExploreCollectionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [hoveredPanelId, setHoveredPanelId] = useState<string | null>(null);
  const [activeDotIndex, setActiveDotIndex] = useState(0);

  // Guest Notice State
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [selectedPanelTitle, setSelectedPanelTitle] = useState<string | undefined>(undefined);

  // Check if visitor is authenticated via session
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('cbv_demo_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.isLoggedIn) {
          setIsAuthenticated(true);
        }
      }
    } catch (_) {}
  }, []);

  // IntersectionObserver for scroll-driven gallery entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSectionVisible(true);
          }
        });
      },
      { threshold: 0.12 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) observer.unobserve(currentSection);
    };
  }, []);

  // Handle panel interaction
  const handlePanelClick = (e: React.MouseEvent, panel: ExhibitionPanel) => {
    e.preventDefault();
    if (isAuthenticated) {
      return;
    }
    // Guest: display informational notice
    setSelectedPanelTitle(panel.title);
    setIsNoticeOpen(true);
  };

  // Sync mobile scroll position with pagination dots
  const handleMobileScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const ratio = scrollLeft / maxScroll;
    const index = Math.min(5, Math.max(0, Math.round(ratio * 5)));
    setActiveDotIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="relative w-full overflow-hidden bg-[#241014] text-[#F4F0E8] z-10 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-28 lg:pb-36 select-none"
      aria-label="Explore the collections"
      style={{
        background: 'radial-gradient(ellipse 95% 70% at 50% 25%, #461420 0%, #300E17 38%, #1F080F 70%, #120407 100%)',
      }}
    >
      {/* ── Left Sweeping Gold Architectural Arch ── */}
      <svg
        className="pointer-events-none absolute -left-12 sm:left-0 top-12 sm:top-16 lg:top-20 w-[220px] sm:w-[320px] lg:w-[440px] h-[480px] sm:h-[600px] lg:h-[720px] z-10 opacity-75"
        viewBox="0 0 440 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 60 -40 C 60 220, 280 480, 240 740"
          stroke="url(#leftGoldGradient)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#leftGoldGlow)"
        />
        <path
          d="M 60 -40 C 60 220, 280 480, 240 740"
          stroke="#FFF0C4"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.85"
        />
        <defs>
          <linearGradient id="leftGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C5A059" stopOpacity="0.2" />
            <stop offset="40%" stopColor="#E7C477" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#C5A059" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8A6B30" stopOpacity="0.1" />
          </linearGradient>
          <filter id="leftGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* ── Right Sweeping Gold Architectural Arch ── */}
      <svg
        className="pointer-events-none absolute -right-12 sm:right-0 top-12 sm:top-16 lg:top-20 w-[220px] sm:w-[320px] lg:w-[440px] h-[480px] sm:h-[600px] lg:h-[720px] z-10 opacity-75"
        viewBox="0 0 440 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 380 -40 C 380 220, 160 480, 200 740"
          stroke="url(#rightGoldGradient)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#rightGoldGlow)"
        />
        <path
          d="M 380 -40 C 380 220, 160 480, 200 740"
          stroke="#FFF0C4"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.85"
        />
        <defs>
          <linearGradient id="rightGoldGradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C5A059" stopOpacity="0.2" />
            <stop offset="40%" stopColor="#E7C477" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#C5A059" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8A6B30" stopOpacity="0.1" />
          </linearGradient>
          <filter id="rightGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Velvet Deep Wine Drapery Texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(92,25,41,0.4)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      {/* ── Main Curatorial Header ── */}
      <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 z-20">
        <div className="flex flex-col items-center justify-center text-center relative mb-10 sm:mb-12 lg:mb-14">
          {/* Eyebrow: — CURATED DEPARTMENTS — */}
          <div
            className={`flex items-center justify-center gap-3 sm:gap-4 mb-2.5 transition-all duration-700 ${
              isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <span className="w-10 sm:w-16 h-px bg-[#C5A059]/70" />
            <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-[#C5A059] uppercase font-semibold">
              CURATED DEPARTMENTS
            </p>
            <span className="w-10 sm:w-16 h-px bg-[#C5A059]/70" />
          </div>

          {/* Main Editorial Headline: Explore the collections */}
          <h2
            className={`font-serif font-normal text-[#F4F0E8] leading-[1.08] tracking-tight mb-2 sm:mb-2.5 transition-all duration-700 delay-100 ${
              isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              fontSize: 'clamp(2.5rem, 4.2vw, 3.75rem)',
              textShadow: '0 2px 14px rgba(0,0,0,0.6)',
            }}
          >
            Explore the collections
          </h2>

          {/* Supporting Copy: SIX DISCIPLINES. A WORLD OF EXCEPTIONAL OBJECTS. */}
          <p
            className={`font-mono text-[10px] sm:text-[11px] lg:text-[11.5px] uppercase tracking-[0.24em] text-[#D8C7B5]/90 transition-all duration-700 delay-200 ${
              isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            SIX DISCIPLINES. A WORLD OF EXCEPTIONAL OBJECTS.
          </p>

          {/* Top-Right "View all categories →" Action */}
          <div className="w-full flex justify-end -mt-5 sm:-mt-7 pr-2 sm:pr-6">
            <button
              type="button"
              onClick={() => {
                setSelectedPanelTitle(undefined);
                setIsNoticeOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-serif text-[#E7C477] hover:text-[#F4F0E8] transition-colors focus:outline-none focus-visible:underline"
              aria-label="View all categories"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Continuous Exhibition Installation (6 Framed Artworks in Curved Perspective) ── */}
      <div
        className="relative w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 z-20"
        style={{ perspective: '1600px', perspectiveOrigin: '50% 45%' }}
      >
        {/* Gallery Polyptych Row */}
        <div
          ref={scrollContainerRef}
          onScroll={handleMobileScroll}
          className="flex items-center justify-start lg:justify-center gap-[4px] sm:gap-[6px] lg:gap-[6px] overflow-x-auto lg:overflow-x-visible pb-8 lg:pb-0 scroll-smooth no-scrollbar"
          style={{
            WebkitOverflowScrolling: 'touch',
            transformStyle: 'preserve-3d',
          }}
        >
          {EXHIBITION_PANELS.map((panel) => {
            const isHovered = hoveredPanelId === panel.id;

            return (
              <div
                key={panel.id}
                data-collection-id={panel.id}
                onClick={(e) => handlePanelClick(e, panel)}
                onMouseEnter={() => setHoveredPanelId(panel.id)}
                onMouseLeave={() => setHoveredPanelId(null)}
                className="group relative flex-shrink-0 cursor-pointer transition-all duration-500 ease-out"
                style={{
                  width: 'calc(min(72vw, 216px))',
                  minWidth: '180px',
                  maxWidth: '228px',
                  transform: `rotateY(${panel.rotationY}deg) translateZ(${panel.translateZ}px) ${
                    isHovered ? 'translateY(-8px) scale(1.025)' : 'translateY(0px)'
                  }`,
                  transformOrigin: panel.transformOrigin,
                  transformStyle: 'preserve-3d',
                  zIndex: isHovered ? 30 : 10,
                  ...panel.edgeBevelStyle,
                }}
              >
                {/* ── Artwork Frame Container (Matching Reference Proportions) ── */}
                <div
                  className="relative aspect-[1/1.76] w-full overflow-hidden bg-[#140508] transition-all duration-300"
                  style={{
                    border: isHovered
                      ? '1.8px solid #F3E5AB'
                      : '1.4px solid rgba(212, 175, 55, 0.85)',
                    boxShadow: isHovered
                      ? '0 0 16px rgba(243, 229, 171, 0.4), inset 0 0 10px rgba(212, 175, 55, 0.25)'
                      : 'inset 0 0 0 1px rgba(255, 235, 175, 0.15)',
                  }}
                >
                  {/* High-Resolution Artwork Image */}
                  <img
                    src={panel.image}
                    alt={`${panel.title} collection`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                    decoding="async"
                  />

                  {/* Dark Lower Vignette (Matching Reference) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0305] via-[#0E0305]/70 via-35% to-transparent opacity-95 transition-opacity duration-300" />

                  {/* Top Fine Gold Highlight Line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFF0C4]/70 to-transparent" />

                  {/* ── Lower Information Area (Directly matching Reference) ── */}
                  <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 flex flex-col justify-end text-left z-10">
                    {/* Collection Title */}
                    <h3 className="font-serif text-[18px] sm:text-[19.5px] lg:text-[20.5px] font-normal text-[#F4F0E8] leading-tight mb-1 drop-shadow-md group-hover:text-[#E7C477] transition-colors duration-200">
                      {panel.title}
                    </h3>

                    {/* Subtitle Line 1 & Line 2 */}
                    <div className="space-y-0.5 text-[10.5px] sm:text-[11px] font-sans text-[#D8C7B5]/85 leading-snug">
                      <p>{panel.subtitleLine1}</p>
                      <p>{panel.subtitleLine2}</p>
                    </div>

                    {/* Small Delicate Right Arrow at Bottom Right */}
                    <div className="w-full flex justify-end mt-1.5">
                      <span className="text-[#C5A059] group-hover:text-[#E7C477] group-hover:translate-x-1 transition-all duration-200">
                        <ArrowRight className="w-3.5 h-3.5 stroke-[1.4]" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Floor Mirrored Downward Reflection ── */}
                <div
                  className="hidden lg:block absolute -bottom-16 left-0 right-0 h-16 pointer-events-none overflow-hidden opacity-30 transition-opacity duration-300 group-hover:opacity-45"
                  style={{
                    transform: 'scaleY(-1)',
                    filter: 'blur(1.2px)',
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 80%)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 80%)',
                  }}
                  aria-hidden="true"
                >
                  <img
                    src={panel.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-bottom"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Center Warm Golden Floor Radiance (Directly matching Reference) ── */}
        <div
          className="pointer-events-none absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[500px] sm:w-[650px] lg:w-[780px] h-[75px] rounded-full opacity-65 blur-2xl z-10"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(235, 185, 95, 0.45) 0%, rgba(197, 160, 89, 0.15) 45%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* ── Centered Floor Pagination Dots (Matching Reference ● ○ ○ ○ ○ ○) ── */}
        <div className="mt-7 sm:mt-9 flex items-center justify-center gap-2.5 z-20 relative">
          {[0, 1, 2, 3, 4, 5].map((dotIdx) => {
            const isActive = dotIdx === activeDotIndex;
            return (
              <button
                key={dotIdx}
                type="button"
                onClick={() => {
                  setActiveDotIndex(dotIdx);
                  if (scrollContainerRef.current) {
                    const scrollTarget = (scrollContainerRef.current.scrollWidth / 6) * dotIdx;
                    scrollContainerRef.current.scrollTo({ left: scrollTarget, behavior: 'smooth' });
                  }
                }}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-1 focus:ring-[#C5A059] ${
                  isActive
                    ? 'w-2.5 h-2.5 bg-[#E7C477] shadow-[0_0_8px_rgba(231,196,119,0.8)]'
                    : 'w-2 h-2 rounded-full border border-[#998A7E]/60 bg-transparent hover:border-[#E7C477]'
                }`}
                aria-label={`Go to collection panel ${dotIdx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* ── Compact Informational Guest Access Notice (Informational Only, No Auth Pages) ── */}
      <GuestAccessNotice
        isOpen={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        collectionTitle={selectedPanelTitle}
      />
    </section>
  );
}
