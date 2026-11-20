'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { CuratorialModal } from '../common/CuratorialModal';

/**
 * AUREVANT AUCTION HOUSE — AUREVANT Intelligence Section
 *
 * Specific visual direction:
 * - Background: Clean, minimal soft warm-white / ivory (#FAF8F2)
 * - Top label: AUREVANT INTELLIGENCE in lime-green (#A8CF22) uppercase tracking
 * - Main heading: "A more intelligent way to discover."
 *   - "discover" in lime-to-yellow gradient (#A8CF22 -> #E7C94A)
 *   - Final period "." in coral-red (#F16B59)
 * - Subtitle: "Search naturally. Explore exceptional objects with deeper insight." in muted charcoal (#66645F)
 * - Search bar: Wide rectangular with multi-color fine border (#A8CF22, #E7C94A, #F16B59),
 *   search symbol, clean white background, lime-green "SEARCH" button (#A8CF22)
 * - Three supporting features below:
 *   - Curated discoveries (lime-green bar accent)
 *   - Provenance insights (muted-yellow bar accent)
 *   - Specialist perspective (coral-red bar accent)
 *   - Text-only: NO icons, NO numbers, NO cards, NO vertical dividers
 * - Scoped palette strictly to this section
 * - Smooth scroll entrance and focus animations, prefers-reduced-motion compliant
 */

const FEATURES = [
  {
    title: 'Curated discoveries',
    description:
      'Explore exceptional objects across collections and global auction references.',
    accentColor: '#A8CF22', // Lime green
  },
  {
    title: 'Provenance insights',
    description:
      'Discover available historical records and documented ownership information.',
    accentColor: '#E7C94A', // Muted yellow
  },
  {
    title: 'Specialist perspective',
    description:
      'Access clearly identified expert knowledge and research context.',
    accentColor: '#F16B59', // Coral red
  },
] as const;

export function IntelligenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // ─── Reduced motion detection ────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ─── Visibility detection on scroll & mount ─────────────────────────
  useEffect(() => {
    const checkVisibility = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // Trigger when top of section enters 85% of viewport
      if (rect.top <= windowHeight * 0.85) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    checkVisibility(); // Check immediately on mount

    // Also run an IntersectionObserver as an additional progressive trigger
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setIsVisible(true);
            if (observer) observer.disconnect();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      if (observer) observer.disconnect();
    };
  }, []);

  // ─── Search submission ───────────────────────────────────────────────
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed || isSubmitting) return;

      setIsSubmitting(true);
      setSearchedQuery(trimmed);

      // Brief loading state before opening search modal feedback
      setTimeout(() => {
        setIsModalOpen(true);
        setIsSubmitting(false);
      }, 550);
    },
    [query, isSubmitting]
  );

  // ─── Animation helper classes ────────────────────────────────────────
  const dur = prefersReducedMotion ? '0ms' : undefined;
  const baseReveal = prefersReducedMotion
    ? 'opacity-100 translate-y-0'
    : isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-6';

  return (
    <>
      <section
        ref={sectionRef}
        id="intelligence"
        className="relative w-full bg-[#FAF8F2] text-[#20201E] overflow-hidden py-24 sm:py-32 lg:py-40"
        aria-label="AUREVANT Intelligence search section"
      >
        <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* ── Top Label: AUREVANT INTELLIGENCE in Lime Green ───── */}
            <div
              className={`mb-5 sm:mb-6 transition-all ${
                prefersReducedMotion ? 'duration-0' : 'duration-700'
              } ease-out ${baseReveal}`}
              style={{ transitionDelay: dur ?? '150ms' }}
            >
              <p className="font-sans text-[11px] sm:text-[12px] uppercase tracking-[0.28em] text-[#A8CF22] font-semibold">
                AUREVANT INTELLIGENCE
              </p>
            </div>

            {/* ── Main Heading: Editorial display typography ────────── */}
            <h2
              className={`font-serif font-normal text-center text-[#20201E] leading-[1.08] tracking-tight mb-5 sm:mb-6 transition-all ${
                prefersReducedMotion ? 'duration-0' : 'duration-800'
              } ease-out ${baseReveal}`}
              style={{
                fontSize: 'clamp(2.5rem, 5.2vw, 4.4rem)',
                transitionDelay: dur ?? '300ms',
              }}
            >
              A more intelligent way
              <br />
              to{' '}
              <span className="bg-gradient-to-r from-[#A8CF22] to-[#E7C94A] bg-clip-text text-transparent font-normal">
                discover
              </span>
              <span className="text-[#F16B59]">.</span>
            </h2>

            {/* ── Subtitle: Clean contemporary sans-serif ───────────── */}
            <p
              className={`font-sans text-center text-[#66645F] leading-relaxed max-w-xl mx-auto mb-10 sm:mb-12 transition-all ${
                prefersReducedMotion ? 'duration-0' : 'duration-700'
              } ease-out ${baseReveal}`}
              style={{
                fontSize: 'clamp(1.05rem, 1.4vw, 1.2rem)',
                transitionDelay: dur ?? '450ms',
              }}
            >
              Search naturally. Explore exceptional objects with deeper insight.
            </p>

            {/* ── Search Bar: Rectangular with lime-yellow-coral fine border ─ */}
            <form
              role="search"
              onSubmit={handleSubmit}
              className={`relative mx-auto transition-all ${
                prefersReducedMotion ? 'duration-0' : 'duration-800'
              } ease-out ${baseReveal}`}
              style={{ transitionDelay: dur ?? '600ms' }}
              aria-label="AUREVANT Intelligence natural-language search"
            >
              {/* Outer gradient border wrapper */}
              <div
                className={`relative p-[1px] transition-all duration-300 ease-out ${
                  isFocused
                    ? 'scale-[1.008] shadow-[0_12px_40px_rgba(32,32,30,0.08)]'
                    : 'shadow-[0_4px_24px_rgba(32,32,30,0.04)]'
                }`}
                style={{
                  background: isFocused
                    ? 'linear-gradient(90deg, #A8CF22 0%, #E7C94A 50%, #F16B59 100%)'
                    : 'linear-gradient(90deg, rgba(168,207,34,0.45) 0%, rgba(231,201,74,0.35) 50%, rgba(241,107,89,0.35) 100%)',
                }}
              >
                {/* Clean white input container */}
                <div className="relative flex items-center bg-white px-3 sm:px-4 py-2 sm:py-2.5">
                  {/* Left search icon */}
                  <div className="flex items-center pl-2 sm:pl-3 pr-2 text-[#20201E]/70">
                    <Search
                      className={`w-[19px] h-[19px] sm:w-5 sm:h-5 transition-colors duration-200 ${
                        isFocused ? 'text-[#A8CF22]' : 'text-[#66645F]'
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Text input */}
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    maxLength={200}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Find a mid-century painting with a documented exhibition history..."
                    aria-label="Find a mid-century painting with a documented exhibition history..."
                    className="flex-1 bg-transparent text-[#20201E] placeholder-[#66645F]/60 font-sans py-2.5 sm:py-3 px-2 sm:px-3 text-[14.5px] sm:text-[16px] focus:outline-none"
                  />

                  {/* Right search button: Lime green with dark readable text */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !query.trim()}
                    className="ml-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#A8CF22] hover:bg-[#99BD1F] text-[#20201E] font-sans font-semibold text-[12px] sm:text-[13px] tracking-[0.16em] uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20201E] whitespace-nowrap shadow-sm hover:shadow active:scale-[0.98]"
                    aria-label="Search"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-[#20201E]/30 border-t-[#20201E] rounded-full animate-spin" />
                        <span>SEARCHING</span>
                      </span>
                    ) : (
                      'SEARCH'
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* ── Three Supporting Features (Text-only, no icons, no numbers) ─ */}
            <div
              className={`mt-16 sm:mt-20 pt-4 transition-all ${
                prefersReducedMotion ? 'duration-0' : 'duration-800'
              } ease-out ${baseReveal}`}
              style={{ transitionDelay: dur ?? '800ms' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 text-left">
                {FEATURES.map((feat) => (
                  <div key={feat.title} className="flex flex-col">
                    {/* Feature Title */}
                    <h3 className="font-serif font-normal text-[#20201E] text-[20px] sm:text-[22px] tracking-tight">
                      {feat.title}
                    </h3>

                    {/* Short accent line beneath heading */}
                    <div
                      className="w-8 h-[2px] mt-2.5 mb-3.5 rounded-full"
                      style={{ backgroundColor: feat.accentColor }}
                      aria-hidden="true"
                    />

                    {/* Feature Description */}
                    <p className="font-sans text-[#66645F] text-[14px] sm:text-[15px] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curatorial Search Modal ──────────────────────────────────── */}
      <CuratorialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="search"
        eyebrow="AUREVANT INTELLIGENCE"
        title="Curatorial Search Query"
        subtitle={searchedQuery ? `Query: “${searchedQuery}”` : undefined}
        description="The AUREVANT Intelligence natural-language search engine is currently indexing verified provenance records, historical ownership documentation, and cataloguing notes across all specialist departments. Full query resolution will activate in the upcoming seasonal release."
        note="[SEARCH ENGINE INDEXING IN PROGRESS]"
      />
    </>
  );
}
