'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * AUREVANT AUCTION HOUSE — Collections Section
 * 
 * Cinematic Scroll-Driven Video Expansion & Next-Section Handoff:
 * - Phase A (Compact): Center-aligned intro header in standard document flow, followed by
 *   40–60px of vertical breathing room before the compact video preview (zero text overlap).
 *   Geometry: 58vw desktop (max 820px), 16:9 ratio, 16px radius, gold hairline, soft drop shadow.
 * - Phase B (Expansion): Progressive symmetrical expansion linked directly to scroll scrub (0.00 → 0.65).
 *   Intro fades up gently; video expands to 95vw width, 50vh height, reducing radius to 8px.
 * - Phase C (Final State Hold): Video reaches approved dimensions (~95vw width, ~50vh height, max 520px)
 *   and holds steady for 35% of the pinned sequence (0.65 → 1.00) for an intentional cinematic pause.
 * - Phase D (Release & Handoff): GSAP ScrollTrigger cleanly releases pinning; video returns to normal
 *   document flow at its final dimensions, allowing "Explore Our Collections" to enter naturally below it.
 * - Full Bidirectional Reversibility: Scrubbing upwards cleanly reverses the expansion back to compact.
 * - Single Persistent Video Element: strictly 1 <video> mounted, uninterrupted playback, zero restarts.
 * 
 * Asset: /video/Marble_statues_at_luxury_auction_b2db8f87_1080p.mp4
 */

export function CollectionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  /* ── Video Play / Pause Toggle ── */
  const togglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  /* ── Ambient Auto-Play when entering viewport ── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                setIsPlaying(false);
              });
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  /* ── Coordinated Pinned GSAP ScrollTrigger Sequence ── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const pinStage = pinStageRef.current;
    const intro = introRef.current;
    const videoWrapper = videoWrapperRef.current;
    const section = sectionRef.current;

    if (!pinStage || !intro || !videoWrapper || !section) return;

    if (mq.matches) {
      videoWrapper.style.width = '94vw';
      videoWrapper.style.maxWidth = '1440px';
      videoWrapper.style.height = '50vh';
      videoWrapper.style.borderRadius = '8px';
      return;
    }

    let ctx: any;
    let isMounted = true;

    const initTimeline = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        if (!isMounted) return;

        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const isMobile = window.innerWidth < 768;
          const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

          // Initial Compact Geometry (Stage A)
          const compactWidth = isMobile ? '88vw' : isTablet ? '72vw' : '58vw';
          const compactMaxWidth = isMobile ? '460px' : isTablet ? '680px' : '820px';
          const compactHeight = isMobile ? '49.5vw' : isTablet ? '40.5vw' : '32.6vw'; // 16:9
          const compactMaxHeight = isMobile ? '280px' : isTablet ? '380px' : '460px';
          const compactRadius = isMobile ? '12px' : '16px';
          const compactShadow = '0 24px 60px rgba(18, 61, 44, 0.14)';
          const compactBorder = '1px solid rgba(185, 148, 85, 0.28)';

          // Target Expanded Geometry (Stage C: 94–96vw, 48–52vh, max 520px)
          const expandedWidth = isMobile ? '94vw' : '95vw';
          const expandedMaxWidth = '1440px';
          const expandedHeight = isMobile ? '46vh' : '50vh';
          const expandedMaxHeight = isMobile ? '420px' : '520px';
          const expandedRadius = '8px';
          const expandedShadow = '0 20px 50px rgba(18, 61, 44, 0.18)';
          const expandedBorder = '1px solid rgba(185, 148, 85, 0.22)';
          const verticalShift = isMobile ? -15 : -35;

          // Master Scroll-Linked Timeline with Pinning
          const tl = gsap.timeline();

          // 1. Editorial Intro Fades Out and Slides Up Gently (0.00 → 0.28)
          tl.fromTo(
            intro,
            { opacity: 1, y: 0 },
            {
              opacity: 0,
              y: -30,
              ease: 'power1.out',
              duration: 0.28,
            },
            0
          );

          // 2. Phase B: Video Expands Symmetrically to 95vw × 50vh (0.00 → 0.65)
          tl.fromTo(
            videoWrapper,
            {
              width: compactWidth,
              maxWidth: compactMaxWidth,
              height: compactHeight,
              maxHeight: compactMaxHeight,
              borderRadius: compactRadius,
              boxShadow: compactShadow,
              border: compactBorder,
              y: 0,
            },
            {
              width: expandedWidth,
              maxWidth: expandedMaxWidth,
              height: expandedHeight,
              maxHeight: expandedMaxHeight,
              borderRadius: expandedRadius,
              boxShadow: expandedShadow,
              border: expandedBorder,
              y: verticalShift,
              ease: 'power1.inOut',
              duration: 0.65,
            },
            0
          );

          // 3. Phase C: Intentional Cinematic Hold (0.65 → 1.00)
          // Holds final 95vw × 50vh composition steady for 35% of pinned sequence before release
          tl.to(
            videoWrapper,
            {
              y: verticalShift,
              duration: 0.35,
              ease: 'none',
            },
            0.65
          );

          // ScrollTrigger with pinSpacing to maintain document flow and release cleanly
          ScrollTrigger.create({
            trigger: pinStage,
            start: 'top top+=66',
            end: '+=100%',
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.5,
            animation: tl,
            invalidateOnRefresh: true,
          });

          // Refresh ScrollTrigger once DOM/images stabilize
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 300);
        }, section);
      } catch (err) {
        console.warn('GSAP ScrollTrigger initialization notice:', err);
      }
    };

    initTimeline();

    return () => {
      isMounted = false;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#F8F7F2] text-[#123D2C] z-10 selection:bg-[#B99455]/30 selection:text-[#0B2B20]"
      aria-label="Collections"
    >
      {/* 
        Pinned Stage:
        GSAP ScrollTrigger pins this container with pinSpacing: true.
        The surrounding canvas remains 100% #F8F7F2 Warm Ivory with zero blank gaps.
      */}
      <div
        ref={pinStageRef}
        className="relative w-full bg-[#F8F7F2] flex flex-col items-center justify-start pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 lg:pb-10 px-4 sm:px-6"
      >
        {/* ── 1. Editorial Introduction (Standard Document Flow) ── */}
        <div
          ref={introRef}
          className="w-full max-w-[840px] text-center mx-auto mb-8 sm:mb-10 lg:mb-12 will-change-[transform,opacity]"
        >
          {/* Subtle Eyebrow with Antique Gold Separators */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2.5 sm:mb-3">
            <span className="block w-8 sm:w-12 h-px bg-[#B99455]/50" />
            <span className="block w-1.5 h-1.5 rounded-full bg-[#B99455]/60" />
            <p className="text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.32em] text-[#B99455] font-mono font-medium">
              COLLECTIONS
            </p>
            <span className="block w-1.5 h-1.5 rounded-full bg-[#B99455]/60" />
            <span className="block w-8 sm:w-12 h-px bg-[#B99455]/50" />
          </div>

          {/* Main Headline — Editorial Serif */}
          <h2
            className="font-serif font-normal text-[#123D2C] leading-[1.10] tracking-tight mb-2 sm:mb-2.5 drop-shadow-sm"
            style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.85rem)' }}
          >
            Rare pieces. Timeless value.
          </h2>

          {/* Supporting Sentence */}
          <p
            className="font-serif italic text-[#0B2B20]/75 leading-[1.4] max-w-[560px] mx-auto text-[14.5px] sm:text-[15.5px] lg:text-[16.5px]"
          >
            Explore our curated collections of exceptional treasures.
          </p>

          {/* Subtle Architectural Divider */}
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-4.5">
            <span className="block w-5 h-px bg-[#123D2C]/15" />
            <span className="block w-1 h-1 rounded-full bg-[#B99455]/40" />
            <span className="block w-5 h-px bg-[#123D2C]/15" />
          </div>
        </div>

        {/* 
          ── 2. The Persistent Video Canvas ──
          Positioned below the intro with 40–60px of natural spacing (zero text overlap)
          Animates symmetrically to ~94vw × 50vh
        */}
        <div
          ref={videoWrapperRef}
          className="relative z-10 overflow-hidden mx-auto will-change-[width,height,border-radius,box-shadow,transform]"
          style={{
            width: reducedMotion ? '95vw' : '58vw',
            maxWidth: reducedMotion ? '1440px' : '820px',
            height: reducedMotion ? '50vh' : '32.6vw',
            maxHeight: reducedMotion ? '520px' : '460px',
            borderRadius: reducedMotion ? '8px' : '16px',
            boxShadow: '0 24px 60px rgba(18, 61, 44, 0.14)',
            border: '1px solid rgba(185, 148, 85, 0.28)',
            backgroundColor: '#0B2B20',
          }}
        >
          {/* Inner Video Container (Always 100% of Wrapper) */}
          <div className="relative w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              src="/video/Marble_statues_at_luxury_auction_b2db8f87_1080p.mp4"
              className="w-full h-full object-cover object-[center_35%] select-none"
              loop
              muted
              playsInline
              preload="auto"
              aria-label="Rare marble sculpture collection displayed in a luxury auction saleroom"
            />

            {/* Ambient Saleroom Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0B2B20]/25 via-transparent to-[#0B2B20]/15" />

            {/* Center Play/Pause Control Overlay */}
            <button
              type="button"
              onClick={togglePlay}
              className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B99455] ${
                isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
              }`}
              aria-label={isPlaying ? 'Pause video presentation' : 'Play video presentation'}
            >
              {/* Translucent backdrop scrim */}
              <div className="absolute inset-0 bg-[#0B2B20]/20 transition-colors duration-200" />

              {/* Circular Glassmorphic Control Pill */}
              <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-full border border-[#F8F7F2]/80 bg-[#0B2B20]/45 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-[#0B2B20]/65 hover:border-[#F8F7F2]">
                {isPlaying ? (
                  /* Pause Icon */
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#F8F7F2] sm:w-6 sm:h-6"
                    aria-hidden="true"
                  >
                    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                  </svg>
                ) : (
                  /* Play Icon */
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#F8F7F2] ml-0.5 sm:w-6 sm:h-6"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.44-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
