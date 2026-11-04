'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * AUREVANT AUCTION HOUSE — Collections Section
 * 
 * Cinematic Scroll-Driven Video Expansion Architecture:
 * - Scene 01 (0% scroll): Warm Ivory canvas (#F8F7F2), centered editorial intro,
 *   compact 16:9 video preview (58vw desktop, 16px radius, antique gold hairline, drop shadow)
 * - Stage 4 Expanded Composition: Reaches approximately 90–95vw width and 50vh height
 *   (NOT full-screen), keeping complete video subject visible without excessive cropping
 * - Clean Scroll Pin Release: Un-pins smoothly after expansion, allowing normal page scroll
 *   to reveal the "Explore Our Collections" catalogue directly underneath
 * - Continuous Reversibility: Scrolling up seamlessly reverses expansion back to compact preview
 *   and reveals the Hero section, preserving video playback position
 * - Persistent Single Video Element: exactly 1 <video> mounted, zero reloads, zero pauses
 * 
 * Asset: /video/Marble_statues_at_luxury_auction_b2db8f87_1080p.mp4
 */

export function CollectionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
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

  /* ── Coordinated Scroll-Driven GSAP Timeline ── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const track = trackRef.current;
    const intro = introRef.current;
    const videoWrapper = videoWrapperRef.current;
    const section = sectionRef.current;

    if (!track || !intro || !videoWrapper || !section) return;

    if (mq.matches) {
      videoWrapper.style.width = '92vw';
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

          // Initial Compact Geometry (Scene 01)
          const compactWidth = isMobile ? '88vw' : isTablet ? '72vw' : '58vw';
          const compactMaxWidth = isMobile ? '480px' : isTablet ? '700px' : '820px';
          const compactHeight = isMobile ? '49.5vw' : isTablet ? '40.5vw' : '32.6vw'; // 16:9
          const compactMaxHeight = isMobile ? '300px' : isTablet ? '400px' : '460px';
          const compactRadius = isMobile ? '12px' : '16px';
          const compactShadow = '0 24px 60px rgba(18, 61, 44, 0.14)';
          const compactBorder = '1px solid rgba(185, 148, 85, 0.28)';

          // Target Expanded Geometry (Stage 4: ~90-95vw, ~50vh, NOT full-screen)
          const expandedWidth = isMobile ? '94vw' : '92vw';
          const expandedMaxWidth = '1440px';
          const expandedHeight = isMobile ? '44vh' : '50vh';
          const expandedMaxHeight = isMobile ? '420px' : '520px';
          const expandedRadius = '8px';
          const expandedShadow = '0 20px 50px rgba(18, 61, 44, 0.16)';
          const expandedBorder = '1px solid rgba(185, 148, 85, 0.20)';

          // Master Scroll-Linked Timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: track,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          // 1. Editorial Intro Fades Out and Gently Rises (0.0 → 0.32)
          tl.fromTo(
            intro,
            { opacity: 1, y: 0 },
            {
              opacity: 0,
              y: -35,
              ease: 'power1.out',
              duration: 0.32,
            },
            0
          );

          // 2. Video Wrapper Expands Symmetrically to 92vw × 50vh (0.05 → 0.82)
          // Holds at the approved Stage 4 composition for the final portion before clean release
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
            },
            {
              width: expandedWidth,
              maxWidth: expandedMaxWidth,
              height: expandedHeight,
              maxHeight: expandedMaxHeight,
              borderRadius: expandedRadius,
              boxShadow: expandedShadow,
              border: expandedBorder,
              ease: 'power1.inOut',
              duration: 0.77,
            },
            0.05
          );
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
        Scroll Track: 180vh total height
        Provides approximately 80vh of smooth scrubbed expansion distance,
        then cleanly releases to allow normal page scrolling into the next section
      */}
      <div
        ref={trackRef}
        className="relative w-full"
        style={{ minHeight: reducedMotion ? 'auto' : '180vh' }}
      >
        {/*
          Pinned Viewport Canvas:
          Native CSS position: sticky; top: 0; height: 100vh
          Renders 100% warm ivory at all times. Zero gap, zero spacer bugs.
        */}
        <div
          ref={viewportRef}
          className={`${
            reducedMotion
              ? 'relative min-h-[85vh] py-16 px-4 flex flex-col items-center justify-center'
              : 'sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center'
          }`}
          style={{ backgroundColor: '#F8F7F2' }}
        >
          {/* ── Scene 01: Editorial Typography Header ── */}
          <div
            ref={introRef}
            className="absolute top-[80px] sm:top-[86px] lg:top-[92px] left-0 right-0 z-20 px-6 text-center max-w-[840px] mx-auto pointer-events-none will-change-[transform,opacity]"
          >
            {/* Subtle Eyebrow with Antique Gold Separators */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-2.5">
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
              className="font-serif font-normal text-[#123D2C] leading-[1.10] tracking-tight mb-1.5 sm:mb-2 drop-shadow-sm"
              style={{ fontSize: 'clamp(1.85rem, 3.1vw, 2.75rem)' }}
            >
              Rare pieces. Timeless value.
            </h2>

            {/* Supporting Headline — Italic Serif */}
            <p
              className="font-serif italic text-[#0B2B20]/75 leading-[1.4] max-w-[560px] mx-auto text-[14px] sm:text-[15px] lg:text-[16px]"
            >
              Explore our curated collections of exceptional treasures.
            </p>

            {/* Subtle Architectural Divider */}
            <div className="flex items-center justify-center gap-2 mt-3.5 sm:mt-4">
              <span className="block w-5 h-px bg-[#123D2C]/15" />
              <span className="block w-1 h-1 rounded-full bg-[#B99455]/40" />
              <span className="block w-5 h-px bg-[#123D2C]/15" />
            </div>
          </div>

          {/* 
            ── The Persistent Video Canvas ──
            Animates symmetrically from compact (58vw, 16px radius)
            to Stage 4 composition (~92vw × 50vh, 8px radius)
          */}
          <div
            ref={videoWrapperRef}
            className="relative z-10 overflow-hidden will-change-[width,height,border-radius,box-shadow]"
            style={{
              width: reducedMotion ? '92vw' : '58vw',
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
                className="w-full h-full object-cover object-center select-none"
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
      </div>
    </section>
  );
}
