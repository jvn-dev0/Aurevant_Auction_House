'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * AUREVANT AUCTION HOUSE — Collections Section
 * 
 * Cinematic Scroll-Driven Video Expansion Architecture:
 * - Scene 01 (0% scroll): Warm Ivory canvas (#F8F7F2), centered editorial intro,
 *   compact 16:9 video preview (58vw desktop, 16px radius, antique gold hairline, drop shadow)
 * - Scene 02 (100% scroll): 100vw × 100vh full-screen cinematic immersion
 * - Symmetrical expansion: Centered flexbox anchor expands seamlessly in all 4 directions
 * - Persistent Single Video Element: 1 <video> mounted, uninterrupted playback, zero restarts
 * - CSS Sticky + GSAP Scrub: Native compositor stability, zero layout shifts, zero .pin-spacer artifacts
 * 
 * Asset: /video/Marble_statues_at_luxury_auction_b2db8f87_1080p.mp4
 */

export function CollectionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
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

    const stage = stageRef.current;
    const intro = introRef.current;
    const videoWrapper = videoWrapperRef.current;
    const section = sectionRef.current;

    if (!stage || !intro || !videoWrapper || !section) return;

    if (mq.matches) {
      videoWrapper.style.width = '90vw';
      videoWrapper.style.maxWidth = '1400px';
      videoWrapper.style.height = '60vh';
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
          const compactMaxWidth = isMobile ? '500px' : isTablet ? '720px' : '840px';
          const compactHeight = isMobile ? '49.5vw' : isTablet ? '40.5vw' : '32.6vw'; // 16:9
          const compactMaxHeight = isMobile ? '320px' : isTablet ? '420px' : '472px';
          const compactRadius = isMobile ? '12px' : '16px';
          const compactShadow = '0 24px 60px rgba(18, 61, 44, 0.14)';
          const compactBorder = '1px solid rgba(185, 148, 85, 0.28)';

          // Master Scroll-Linked Timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          // 1. Editorial Intro Fades Out and Shifts Up (0.0 → 0.28)
          tl.fromTo(
            intro,
            { opacity: 1, y: 0 },
            {
              opacity: 0,
              y: -40,
              ease: 'power1.out',
              duration: 0.28,
            },
            0
          );

          // 2. Video Wrapper Expands Symmetrically in All 4 Directions (0.04 → 0.88)
          // Holds at 100vw × 100vh full-screen for the final ~12% of the scroll track
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
              width: '100vw',
              maxWidth: '100vw',
              height: '100vh',
              maxHeight: '100vh',
              borderRadius: '0px',
              boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
              border: '0px solid transparent',
              ease: 'power2.inOut',
              duration: 0.88,
            },
            0.04
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
        Scroll Track: 220vh total height
        Provides exactly 120vh of smooth, scrubbed expansion distance
      */}
      <div
        ref={stageRef}
        className="relative w-full"
        style={{ minHeight: reducedMotion ? 'auto' : '220vh' }}
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
              ? 'relative min-h-[90vh] py-16 px-4 flex flex-col items-center justify-center'
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
            Animates symmetrically from compact (58vw, 16px radius) to 100vw × 100vh
          */}
          <div
            ref={videoWrapperRef}
            className="relative z-10 overflow-hidden will-change-[width,height,border-radius,box-shadow]"
            style={{
              width: reducedMotion ? '90vw' : '58vw',
              maxWidth: reducedMotion ? '1400px' : '840px',
              height: reducedMotion ? '60vh' : '32.6vw',
              maxHeight: reducedMotion ? '60vh' : '472px',
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
