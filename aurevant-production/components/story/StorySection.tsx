'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GlasswaveCanvas } from './GlasswaveCanvas';

/**
 * AUREVANT AUCTION HOUSE — Beyond the Object (Story Section)
 * 
 * Editorial Heritage & Storytelling Section:
 * - Left Side: Exclusive private collection visual presentation with interactive
 *   Glasswave liquid-glass refraction grid responsive to scroll.
 * - Right Side: Refined Warm Ivory editorial information area with generous whitespace,
 *   approved typography hierarchy, and forest green CTA with antique-gold border.
 */

export function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll listener to calculate normalized scroll progress (0.0 to 1.0)
  // for the reversible liquid-glass wave animation
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Progress begins when top of section enters bottom of viewport (rect.top = windowHeight)
          // Progress completes when section is well centered/passed (rect.top = 0)
          const totalDistance = windowHeight + rect.height;
          const currentProgress = (windowHeight - rect.top) / totalDistance;
          const clamped = Math.max(0, Math.min(1, currentProgress));

          setScrollProgress(clamped);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial computation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stories"
      className="relative w-full bg-[#F4F0E8] text-[#111312] overflow-hidden py-20 sm:py-28 lg:py-36 border-t border-[#C5A059]/25"
      aria-label="Beyond the Object stories"
    >
      {/* Subtle Warm Ivory Ambient Glow & Texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(197,160,89,0.06)_0%,transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-20 lg:items-stretch">
          {/* ── LEFT SIDE — OBJECTS AND HERITAGE (Glasswave Visual Artwork) ── */}
          <div className="lg:col-span-7 w-full flex flex-col h-full">
            {/* Visual Frame Container: Exactly matches right column height on desktop */}
            <div
              className="relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-full overflow-hidden bg-[#111312] border border-[#C5A059]/40 shadow-[0_24px_60px_rgba(17,19,18,0.18)] flex-1"
              style={{
                boxShadow:
                  '0 30px 60px -15px rgba(24, 61, 48, 0.15), 0 0 0 1px rgba(197, 160, 89, 0.35)',
              }}
            >
              {/* WebGL Glasswave Canvas (Floating Liquid-Glass Magnifying Lens) */}
              <GlasswaveCanvas
                imageSrc="/images/story-background.webp"
                scrollProgress={scrollProgress}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* ── RIGHT SIDE — EDITORIAL INFORMATION (Warm Ivory & Refined Typography) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full py-0.5 space-y-6 lg:space-y-0">
            {/* Curatorial Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="w-10 sm:w-12 h-px bg-[#C5A059]" />
              <p className="text-[13px] sm:text-[14px] font-serif uppercase tracking-[0.32em] text-[#C5A059] font-medium">
                DISCOVER THE STORIES
              </p>
            </div>

            {/* Main Heading: Beyond the Object. */}
            <h2
              className="font-serif font-normal text-[#111312] leading-[0.98] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 5.4vw, 5.5rem)' }}
            >
              Beyond the Object.
            </h2>

            {/* Secondary Heading: Every remarkable object has a story worth discovering. */}
            <h3
              className="font-serif italic font-normal text-[#183D30] leading-[1.12]"
              style={{ fontSize: 'clamp(2.1rem, 3.2vw, 3.1rem)' }}
            >
              Every remarkable object has a story worth discovering.
            </h3>

            {/* Curatorial Description: Large Bespoke Editorial Serif */}
            <p
              className="font-serif font-normal text-[#2A312B] leading-[1.5] max-w-xl"
              style={{ fontSize: 'clamp(1.4rem, 1.85vw, 1.75rem)' }}
            >
              Explore provenance, extraordinary craftsmanship, forgotten histories and the people behind the world’s most exceptional collectibles.
            </p>

            {/* CTA Button: Forest Green with Antique Gold Border & Serif Lettering */}
            <div className="pt-2 sm:pt-4">
              <a
                href="#stories"
                className="group inline-flex items-center justify-center gap-3.5 px-9 sm:px-11 h-14 sm:h-16 bg-[#183D30] hover:bg-[#122A21] text-[#F4F0E8] border border-[#C5A059] font-serif font-medium text-[15px] sm:text-[17px] tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_12px_28px_rgba(24,61,48,0.22)] hover:shadow-[0_16px_36px_rgba(24,61,48,0.32)] hover:border-[#E7C477] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
                aria-label="Explore the Stories"
              >
                <span>EXPLORE THE STORIES</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1.5 transition-transform duration-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
