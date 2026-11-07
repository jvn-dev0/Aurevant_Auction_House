'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * AUREVANT AUCTION HOUSE — Collections Section
 * 
 * Four-Stage Cinematic Scroll Expansion Architecture:
 * - Stage 1: Collections introduction with compact square video (1:1 ratio, 280px, 16px radius)
 * - Stage 2: Beginning to expand (still square, larger 420px, intro remains visible)
 * - Stage 3: Mid expansion (transitioning from square to wide rectangle ~68vw x 440px, intro lifts & fades)
 * - Stage 4: Near full expansion (video fills viewport ~95vw x 82vh, rounded edges fade to 0-2px)
 * 
 * Persistent Single Video Element: exactly 1 <video> mounted, continuous looping playback,
 * smooth scrubbed bidirectional reverse when scrolling upwards back to Stage 1 and Hero.
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

  /* ── Coordinated Scroll-Driven GSAP Timeline Across 4 Stages ── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const track = trackRef.current;
    const intro = introRef.current;
    const videoWrapper = videoWrapperRef.current;
    const section = sectionRef.current;

    if (!track || !intro || !videoWrapper || !section) return;

    if (mq.matches) {
      videoWrapper.style.width = '95vw';
      videoWrapper.style.maxWidth = '1560px';
      videoWrapper.style.height = '78vh';
      videoWrapper.style.borderRadius = '4px';
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

          // Stage 1: Compact Square Video Geometry (1:1 Ratio)
          const s1Width = isMobile ? '230px' : isTablet ? '260px' : '290px';
          const s1Height = isMobile ? '230px' : isTablet ? '260px' : '290px';
          const s1Radius = '16px';
          const s1Shadow = '0 24px 60px rgba(18, 61, 44, 0.14)';
          const s1Border = '1px solid rgba(197, 160, 89, 0.28)';

          // Stage 2: Larger Square Video Geometry (1:1 Ratio, expanding)
          const s2Width = isMobile ? '310px' : isTablet ? '360px' : '420px';
          const s2Height = isMobile ? '310px' : isTablet ? '360px' : '420px';
          const s2Radius = '14px';

          // Stage 3: Mid Expansion (Transitioning from Square to Wide Rectangle)
          const s3Width = isMobile ? '88vw' : isTablet ? '75vw' : '68vw';
          const s3MaxWidth = '1020px';
          const s3Height = isMobile ? '48vw' : isTablet ? '42vw' : '440px';
          const s3Radius = '8px';

          // Stage 4: Near Full Expansion (Fills Viewport, Rounded Edges Fade)
          const s4Width = isMobile ? '96vw' : '95vw';
          const s4MaxWidth = '1560px';
          const s4Height = isMobile ? '58vh' : isTablet ? '72vh' : '82vh';
          const s4MaxHeight = isMobile ? '480px' : isTablet ? '640px' : '740px';
          const s4Radius = '2px';
          const s4Shadow = '0 30px 80px rgba(0, 0, 0, 0.42)';
          const s4Border = '1px solid rgba(197, 160, 89, 0.15)';

          // Master Scroll-Linked Timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: track,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          // ── Phase 1 (0.00 → 0.32): Stage 1 to Stage 2 (Expand Square) ──
          // Video expands while maintaining 1:1 square ratio; intro remains visible
          tl.fromTo(
            videoWrapper,
            {
              width: s1Width,
              maxWidth: s1Width,
              height: s1Height,
              maxHeight: s1Height,
              borderRadius: s1Radius,
              boxShadow: s1Shadow,
              border: s1Border,
            },
            {
              width: s2Width,
              maxWidth: s2Width,
              height: s2Height,
              maxHeight: s2Height,
              borderRadius: s2Radius,
              ease: 'power1.out',
              duration: 0.32,
            },
            0
          );

          tl.fromTo(
            intro,
            { opacity: 1, y: 0 },
            {
              opacity: 0.95,
              y: -5,
              ease: 'none',
              duration: 0.32,
            },
            0
          );

          // ── Phase 2 (0.32 → 0.66): Stage 2 to Stage 3 (Transition to Wide) ──
          // Video widens to 68vw; intro text lifts and fades
          tl.to(
            videoWrapper,
            {
              width: s3Width,
              maxWidth: s3MaxWidth,
              height: s3Height,
              maxHeight: s3Height,
              borderRadius: s3Radius,
              ease: 'power1.inOut',
              duration: 0.34,
            },
            0.32
          );

          tl.to(
            intro,
            {
              opacity: 0,
              y: -28,
              ease: 'power1.out',
              duration: 0.26,
            },
            0.32
          );

          // ── Phase 3 (0.66 → 0.92): Stage 3 to Stage 4 (Near Full Expansion) ──
          // Video fills the viewport (~95vw x 82vh), rounded edges fade to 2px
          tl.to(
            videoWrapper,
            {
              width: s4Width,
              maxWidth: s4MaxWidth,
              height: s4Height,
              maxHeight: s4MaxHeight,
              borderRadius: s4Radius,
              boxShadow: s4Shadow,
              border: s4Border,
              ease: 'power1.inOut',
              duration: 0.26,
            },
            0.66
          );

          // ── Phase 4 (0.92 → 1.00): Steady Hold at Final State ──
          // Gives visitor complete view of Stage 4 composition before pin releases
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
      className="relative w-full bg-[#F8F7F2] text-[#183D30] z-10 selection:bg-[#C5A059]/30 selection:text-[#0B2B20]"
      aria-label="Collections"
    >
      {/* 
        Scroll Track: 240vh total height
        Provides smooth, progressive scroll progression across all 4 stages:
        Stage 1 (Compact Square) -> Stage 2 (Large Square) -> Stage 3 (Wide Rect) -> Stage 4 (Full Expansion)
      */}
      <div
        ref={trackRef}
        className="relative w-full"
        style={{ minHeight: reducedMotion ? 'auto' : '240vh' }}
      >
        {/*
          Pinned Viewport Canvas:
          Native CSS position: sticky; top: 0; height: 100vh
          Renders warm ivory canvas (#F8F7F2) with zero layout shift
        */}
        <div
          ref={viewportRef}
          className={`${
            reducedMotion
              ? 'relative min-h-[85vh] py-16 px-4 flex flex-col items-center justify-center'
              : 'sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-12 sm:pt-14 pb-8'
          }`}
          style={{ backgroundColor: '#F8F7F2' }}
        >
          {/* ── Stage 1 & 2: Editorial Typography Header ── */}
          <div
            ref={introRef}
            className="relative z-20 px-6 text-center max-w-[840px] mx-auto mb-8 sm:mb-10 lg:mb-12 pointer-events-none will-change-[transform,opacity]"
          >
            {/* Curated Departments Eyebrow flanked by horizontal gold divider lines */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-3.5">
              <span className="block w-8 sm:w-12 h-px bg-[#C5A059]/60" />
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#C5A059] font-mono font-medium">
                CURATED DEPARTMENTS
              </p>
              <span className="block w-8 sm:w-12 h-px bg-[#C5A059]/60" />
            </div>

            {/* Main Headline — High-Contrast Editorial Serif */}
            <h2
              className="font-serif font-normal text-[#183D30] leading-[1.08] tracking-tight mb-2 sm:mb-2.5 drop-shadow-sm"
              style={{ fontSize: 'clamp(2.1rem, 3.5vw, 3.25rem)' }}
            >
              Explore Our Collections
            </h2>

            {/* Supporting Description — Refined Curatorial Text */}
            <p
              className="font-sans text-[#183D30]/80 leading-[1.5] max-w-[620px] mx-auto text-[14px] sm:text-[15px] lg:text-[16px]"
            >
              Authenticated objects of historical resonance, academic significance, and exceptional market provenance.
            </p>
          </div>

          {/* 
            ── The Persistent Video Canvas ──
            Animates symmetrically from Stage 1 Compact Square (290px x 290px, 16px radius)
            to Stage 2 Larger Square (420px x 420px)
            to Stage 3 Wide Rectangle (~68vw x 440px)
            to Stage 4 Near Full Expansion (~95vw x 82vh, 2px radius)
          */}
          <div
            ref={videoWrapperRef}
            className="relative z-10 overflow-hidden will-change-[width,height,border-radius,box-shadow]"
            style={{
              width: reducedMotion ? '95vw' : '290px',
              maxWidth: reducedMotion ? '1560px' : '290px',
              height: reducedMotion ? '78vh' : '290px',
              maxHeight: reducedMotion ? '740px' : '290px',
              borderRadius: reducedMotion ? '2px' : '16px',
              boxShadow: '0 24px 60px rgba(18, 61, 44, 0.14)',
              border: '1px solid rgba(197, 160, 89, 0.28)',
              backgroundColor: '#111312',
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
                aria-label="AUREVANT Curated Collections cinematic exhibition preview"
              />

              {/* Ambient Saleroom Vignette */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#111312]/30 via-transparent to-[#111312]/15" />

              {/* Center Play/Pause Circular Control Button */}
              <button
                type="button"
                onClick={togglePlay}
                className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] ${
                  isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                }`}
                aria-label={isPlaying ? 'Pause video presentation' : 'Play video presentation'}
              >
                {/* Subtle scrim on hover/pause */}
                <div className="absolute inset-0 bg-[#111312]/15 transition-colors duration-200" />

                {/* Circular Glassmorphic Control Button */}
                <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border border-[#F4F0E8]/80 bg-[#111312]/50 backdrop-blur-md flex items-center justify-center shadow-xl transition-transform duration-200 hover:scale-105 hover:bg-[#111312]/70 hover:border-[#F4F0E8]">
                  {isPlaying ? (
                    /* Pause Icon (⏸) */
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-[#F4F0E8] sm:w-5 sm:h-5"
                      aria-hidden="true"
                    >
                      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                    </svg>
                  ) : (
                    /* Play Icon (▶) */
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-[#F4F0E8] ml-0.5 sm:w-5 sm:h-5"
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
