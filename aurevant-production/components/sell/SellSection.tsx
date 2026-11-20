'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { CuratorialModal } from '../common/CuratorialModal';

/**
 * AUREVANT AUCTION HOUSE — Sell with AUREVANT Section
 *
 * Visual direction:
 * - Asymmetric two-column layout: editorial photograph (left) + consignment copy (right)
 * - Warm ivory background (#F4F0E8) with forest-green (#183D30) typography
 * - Antique gold (#C5A059) accent details on CTA border and decorative elements
 * - Custom scroll-triggered entrance: vertical clip-mask image reveal,
 *   horizontal heading slide, staggered text, gold border CTA animation
 * - CuratorialModal (type: 'consignment') for guest "Request an Estimate" CTA
 * - Responsive: stacked on mobile, asymmetric on desktop
 * - prefers-reduced-motion compliant
 *
 * Fonts: Instrument Serif (headings), Manrope (body/interface), IBM Plex Mono (labels)
 */

export function SellSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // ─── Reduced motion detection ──────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ─── Scroll visibility detection (dual: scroll listener + IntersectionObserver) ─
  useEffect(() => {
    const checkVisibility = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= windowHeight * 0.82) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    checkVisibility();

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

  // ─── Animation transition helpers ──────────────────────────────────
  const motion = !prefersReducedMotion;
  const dur = motion ? undefined : '0ms';

  // Image: vertical clip-path reveal (bottom to top)
  const imageClip = motion
    ? isVisible
      ? 'inset(0 0 0 0)'
      : 'inset(100% 0 0 0)'
    : 'inset(0 0 0 0)';

  const imageTranslateY = motion
    ? isVisible
      ? 'translateY(0)'
      : 'translateY(12px)'
    : 'translateY(0)';

  // Text: horizontal slide from right
  const textSlideClass = motion
    ? isVisible
      ? 'opacity-100 translate-x-0'
      : 'opacity-0 translate-x-8'
    : 'opacity-100 translate-x-0';

  // Staggered vertical fade for supporting elements
  const staggerFade = (delay: string) =>
    motion
      ? isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-5'
      : 'opacity-100 translate-y-0';

  // CTA gold border animation
  const ctaBorderOpacity = motion
    ? isVisible
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-95'
    : 'opacity-100 scale-100';

  return (
    <>
      <section
        ref={sectionRef}
        id="sell"
        className="relative w-full bg-[#F4F0E8] text-[#183D30] overflow-hidden"
        aria-label="Sell with AUREVANT consignment section"
      >
        {/* Subtle top border separating from Intelligence section */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/25 to-transparent" />

        <div className="relative max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-0 min-h-[520px] lg:min-h-[640px]">

            {/* ── LEFT COLUMN: Editorial Photograph ──────────────────── */}
            <div className="lg:col-span-6 relative order-2 lg:order-1">
              <div
                ref={imageContainerRef}
                className="relative w-full h-[380px] sm:h-[440px] lg:h-full overflow-hidden"
                style={{
                  clipPath: imageClip,
                  transform: imageTranslateY,
                  transition: motion
                    ? 'clip-path 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)'
                    : 'none',
                  transitionDelay: motion ? '100ms' : '0ms',
                }}
              >
                <Image
                  src="/images/sell.webp"
                  alt="Specialist carefully examining an exceptional antique object"
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover object-center"
                  quality={90}
                  priority={false}
                />
                {/* Soft gradient overlay at bottom for text legibility on mobile */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F4F0E8]/60 to-transparent lg:hidden"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* ── RIGHT COLUMN: Editorial Copy & CTA ────────────────── */}
            <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2 py-16 sm:py-20 lg:py-24 lg:pl-16 xl:pl-20">

              {/* Eyebrow */}
              <div
                className={`mb-5 sm:mb-6 transition-all ${
                  motion ? 'duration-700' : 'duration-0'
                } ease-out ${textSlideClass}`}
                style={{ transitionDelay: dur ?? '200ms' }}
              >
                <p className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.28em] text-[#C5A059] font-medium">
                  Sell with AUREVANT
                </p>
              </div>

              {/* Main Heading */}
              <h2
                className={`font-serif font-normal text-[#183D30] leading-[1.12] tracking-tight mb-5 sm:mb-6 transition-all ${
                  motion ? 'duration-900' : 'duration-0'
                } ease-out ${textSlideClass}`}
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                  transitionDelay: dur ?? '350ms',
                }}
              >
                Give exceptional objects
                <br />
                their next chapter
                <span className="text-[#C5A059]">.</span>
              </h2>

              {/* Supporting Text */}
              <p
                className={`font-sans text-[#183D30]/75 leading-relaxed max-w-md mb-8 sm:mb-10 transition-all ${
                  motion ? 'duration-700' : 'duration-0'
                } ease-out ${staggerFade('500ms')}`}
                style={{
                  fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                  transitionDelay: dur ?? '500ms',
                }}
              >
                From rare works of art to remarkable collectibles, our
                specialists help you present your object to the right audience.
              </p>

              {/* Primary CTA: REQUEST AN ESTIMATE */}
              <div
                className={`mb-5 transition-all ${
                  motion ? 'duration-800' : 'duration-0'
                } ease-out ${ctaBorderOpacity}`}
                style={{ transitionDelay: dur ?? '680ms' }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#183D30] text-[#F4F0E8] font-sans font-medium text-[13px] sm:text-[14px] tracking-[0.08em] uppercase transition-all duration-300 hover:bg-[#1f4d3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F0E8]"
                  aria-label="Request an estimate for consignment"
                  style={{
                    boxShadow: isVisible && motion
                      ? '0 0 0 1px rgba(197, 160, 89, 0.4)'
                      : 'none',
                    transition: 'background-color 300ms ease, box-shadow 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <span>Request an Estimate</span>
                  <span
                    className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </button>
              </div>

              {/* Secondary Link */}
              <div
                className={`mb-8 transition-all ${
                  motion ? 'duration-700' : 'duration-0'
                } ease-out ${staggerFade('800ms')}`}
                style={{ transitionDelay: dur ?? '800ms' }}
              >
                {/* Route does not exist yet — using # as placeholder */}
                <a
                  href="#"
                  className="font-sans text-[13px] sm:text-[14px] text-[#183D30]/65 hover:text-[#C5A059] transition-colors duration-200 underline underline-offset-4 decoration-[#C5A059]/30 hover:decoration-[#C5A059]"
                  aria-label="Discover our selling process"
                  onClick={(e) => e.preventDefault()}
                >
                  Discover our selling process
                </a>
              </div>

              {/* Decorative Gold Hairline */}
              <div
                className={`w-12 h-px bg-[#C5A059]/40 mb-5 transition-all ${
                  motion ? 'duration-700' : 'duration-0'
                } ease-out ${staggerFade('900ms')}`}
                style={{ transitionDelay: dur ?? '920ms' }}
                aria-hidden="true"
              />

              {/* Editorial Supporting Line */}
              <p
                className={`font-serif italic text-[#183D30]/50 max-w-sm transition-all ${
                  motion ? 'duration-700' : 'duration-0'
                } ease-out ${staggerFade('1000ms')}`}
                style={{
                  fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
                  transitionDelay: dur ?? '1040ms',
                }}
              >
                Thoughtful guidance. Specialist knowledge. A considered approach
                to every object.
              </p>
            </div>
          </div>
        </div>

        {/* Demo disclosure — required by AGENTS.md */}
        <div className="text-center pb-6 pt-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#183D30]/25">
            [DEMO DATA — SANDBOX SIMULATION]
          </p>
        </div>
      </section>

      {/* ── Consignment CTA Modal ──────────────────────────────────── */}
      <CuratorialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="consignment"
        eyebrow="SELL WITH AUREVANT"
        title="Consignment Enquiry"
        subtitle="An account is required to submit consignment details"
        description="Creating an AUREVANT account allows you to submit detailed object information, upload photographs, and follow your consignment enquiry with our specialist team. Our experts will review your submission and provide a thoughtful, considered estimate."
        note="[CONSIGNMENT REGISTRATION — SANDBOX SIMULATION]"
      />
    </>
  );
}
