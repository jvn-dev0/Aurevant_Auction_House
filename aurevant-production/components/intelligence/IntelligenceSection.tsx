'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CuratorialModal } from '../common/CuratorialModal';

/**
 * AUREVANT AUCTION HOUSE — AUREVANT Intelligence Section
 *
 * Premium editorial natural-language search experience.
 * No icons — uses typographic markers, gold numbering, and em-dash accents.
 * Choreographed scroll-triggered entrance with CSS animations.
 * Integrates with the existing CuratorialModal system for search feedback.
 */

// ─── Benefit data with Roman-numeral-style gold indices ──────────────────
const BENEFITS = [
  {
    index: '01',
    title: 'Curated discoveries',
    description:
      'Explore exceptional objects across collections and global auction references.',
  },
  {
    index: '02',
    title: 'Provenance insights',
    description:
      'Discover available historical records and documented ownership information.',
  },
  {
    index: '03',
    title: 'Specialist perspective',
    description:
      'Access clearly identified expert knowledge and research context.',
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

  // ─── Intersection observer — trigger entrance once ───────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ─── Search submission ───────────────────────────────────────────────
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed || isSubmitting) return;

      setIsSubmitting(true);
      setSearchedQuery(trimmed);

      // Brief loading state before showing the modal
      setTimeout(() => {
        setIsModalOpen(true);
        setIsSubmitting(false);
      }, 600);
    },
    [query, isSubmitting]
  );

  // ─── Animation class helpers ─────────────────────────────────────────
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
        className="relative w-full bg-[#F4F0E8] text-[#111312] overflow-hidden"
        aria-label="AUREVANT Intelligence search"
      >
        {/* ── Subtle ambient radial glow ─────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(197,160,89,0.07)_0%,transparent_60%)]"
          aria-hidden="true"
        />

        {/* ── Top gold hairline separator ────────────────────────────── */}
        <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div
            className={`h-px bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent transition-all ${
              prefersReducedMotion ? 'duration-0' : 'duration-[1400ms]'
            } ease-out ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
            style={{ transitionDelay: dur ?? '200ms' }}
          />
        </div>

        {/* ── Main content ──────────────────────────────────────────── */}
        <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32 lg:py-40 z-10">
          <div className="max-w-3xl mx-auto">
            {/* ── Stage 1: Eyebrow ──────────────────────────────────── */}
            <div className="flex items-center justify-center gap-3 mb-8 sm:mb-10">
              <span
                className={`hidden sm:block w-8 h-px bg-[#C5A059] transition-all ${
                  prefersReducedMotion ? 'duration-0' : 'duration-700'
                } ease-out ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                style={{ transitionDelay: dur ?? '400ms', transformOrigin: 'right' }}
              />
              <p
                className={`font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.35em] text-[#C5A059] font-medium transition-all ${
                  prefersReducedMotion ? 'duration-0' : 'duration-700'
                } ease-out ${baseReveal}`}
                style={{ transitionDelay: dur ?? '500ms' }}
              >
                AUREVANT INTELLIGENCE
              </p>
              <span
                className={`hidden sm:block w-8 h-px bg-[#C5A059] transition-all ${
                  prefersReducedMotion ? 'duration-0' : 'duration-700'
                } ease-out ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                style={{ transitionDelay: dur ?? '400ms', transformOrigin: 'left' }}
              />
            </div>

            {/* ── Stage 1: Main heading ─────────────────────────────── */}
            <h2
              className={`font-serif font-normal text-center text-[#111312] leading-[1.05] tracking-tight mb-5 sm:mb-6 transition-all ${
                prefersReducedMotion ? 'duration-0' : 'duration-800'
              } ease-out ${baseReveal}`}
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)',
                transitionDelay: dur ?? '650ms',
              }}
            >
              A more intelligent way
              <br />
              to discover.
            </h2>

            {/* ── Stage 1: Supporting description ──────────────────── */}
            <p
              className={`font-sans text-center text-[#4A524C] leading-relaxed max-w-lg mx-auto mb-12 sm:mb-14 transition-all ${
                prefersReducedMotion ? 'duration-0' : 'duration-700'
              } ease-out ${baseReveal}`}
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                transitionDelay: dur ?? '800ms',
              }}
            >
              Search naturally. Explore exceptional objects with deeper insight.
            </p>

            {/* ── Stage 2: Search field ─────────────────────────────── */}
            <form
              role="search"
              onSubmit={handleSubmit}
              className={`relative transition-all ${
                prefersReducedMotion ? 'duration-0' : 'duration-800'
              } ease-out ${baseReveal}`}
              style={{ transitionDelay: dur ?? '950ms' }}
              aria-label="AUREVANT Intelligence natural-language search"
            >
              <div
                className={`relative flex items-center border transition-all duration-300 ease-out ${
                  isFocused
                    ? 'border-[#C5A059] shadow-[0_0_0_1px_rgba(197,160,89,0.3),0_8px_32px_rgba(197,160,89,0.08)]'
                    : 'border-[#A7A39A]/40 shadow-[0_4px_24px_rgba(17,19,18,0.06)]'
                } bg-white/80 backdrop-blur-sm`}
              >
                {/* Gold vertical bar marker — replaces search icon */}
                <div className="flex items-center pl-5 sm:pl-6">
                  <span
                    className={`block w-[2px] h-5 sm:h-6 transition-colors duration-300 ${
                      isFocused ? 'bg-[#C5A059]' : 'bg-[#A7A39A]/50'
                    }`}
                    aria-hidden="true"
                  />
                </div>

                {/* Input */}
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  maxLength={200}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Find a mid-century painting with a documented exhibition history..."
                  aria-label="Search the AUREVANT catalogue using natural language"
                  className="flex-1 bg-transparent text-[#111312] placeholder-[#A7A39A]/70 font-sans py-4 sm:py-5 px-4 text-[15px] sm:text-base focus:outline-none"
                />

                {/* Submit button — typographic arrow instead of icon */}
                <button
                  type="submit"
                  disabled={isSubmitting || !query.trim()}
                  className={`flex items-center gap-2.5 mr-2 sm:mr-3 px-5 sm:px-7 py-2.5 sm:py-3 bg-[#183D30] text-[#F4F0E8] font-sans font-medium text-[13px] sm:text-sm uppercase tracking-[0.14em] transition-all duration-300 border border-[#C5A059]/30 hover:bg-[#122A21] hover:border-[#C5A059]/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] whitespace-nowrap ${
                    isSubmitting ? 'animate-pulse' : ''
                  }`}
                  aria-label="Search"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-[#F4F0E8]/30 border-t-[#F4F0E8] rounded-full animate-spin" />
                      <span className="hidden sm:inline">Searching</span>
                    </span>
                  ) : (
                    <>
                      <span>Search</span>
                      <span className="text-[#C5A059] font-serif text-base leading-none" aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </div>

              {/* Light sweep effect on focus */}
              <div
                className={`absolute inset-x-0 top-0 h-px transition-all duration-700 ease-out ${
                  isFocused
                    ? 'bg-gradient-to-r from-transparent via-[#C5A059]/70 to-transparent opacity-100'
                    : 'opacity-0'
                }`}
                aria-hidden="true"
              />
            </form>

            {/* ── Stage 3: Benefits ─────────────────────────────────── */}
            <div className="mt-16 sm:mt-20">
              {/* Thin horizontal divider */}
              <div
                className={`h-px w-full bg-gradient-to-r from-transparent via-[#C5A059]/25 to-transparent mb-12 sm:mb-14 transition-all ${
                  prefersReducedMotion ? 'duration-0' : 'duration-700'
                } ease-out ${
                  isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`}
                style={{ transitionDelay: dur ?? '1200ms' }}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-10">
                {BENEFITS.map((benefit, idx) => (
                  <div
                    key={benefit.title}
                    className={`text-center md:text-left transition-all ${
                      prefersReducedMotion ? 'duration-0' : 'duration-700'
                    } ease-out ${baseReveal}`}
                    style={{
                      transitionDelay: dur ?? `${1300 + idx * 150}ms`,
                    }}
                  >
                    {/* Gold numbered index + title */}
                    <div className="flex items-baseline justify-center md:justify-start gap-3 mb-2.5">
                      <span className="font-mono text-[11px] text-[#C5A059] tracking-wider font-medium">
                        {benefit.index}
                      </span>
                      <span className="w-4 h-px bg-[#C5A059]/40 hidden md:block" aria-hidden="true" />
                      <h3 className="font-serif font-normal text-[#111312] text-lg sm:text-[19px] tracking-tight">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="font-sans text-[#4A524C] text-[14px] sm:text-[15px] leading-relaxed md:pl-[calc(11px_*_2_+_0.75rem_+_1rem_+_2px)]">
                      {benefit.description}
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
        title="Catalogue Search"
        subtitle={
          searchedQuery
            ? `Your query: "${searchedQuery}"`
            : undefined
        }
        description="The AUREVANT Intelligence search engine is currently indexing verified provenance records and cataloguing notes across all six specialist departments. Full natural-language search capabilities will activate with the upcoming seasonal saleroom release."
        note="[CATALOGUE INDEXING IN PROGRESS]"
      />
    </>
  );
}
