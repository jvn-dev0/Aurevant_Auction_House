'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * AUREVANT AUCTION HOUSE — Collections Section
 * 
 * Cinematic Video as the Second Hero Section:
 * 1. Compact Square (Stage 1): 290px x 290px (1:1 ratio), 16px radius, warm ivory canvas (#F8F7F2)
 * 2. Beginning to Expand (Stage 2): 420px x 420px, intro typography remains clearly visible
 * 3. Transition to Wide (Stage 3): 70vw x 440px, intro lifts & fades, footprint collapses smoothly
 * 4. Second Hero Transformation (Stage 4): 94vw x 50vh (~500px), settles in prominent upper hero position
 *    (top: ~86px under navbar), becoming the dominant visual element without card-like styling.
 * 5. Pin Release directly into Closing Soon: The pin releases cleanly so that Closing Soon | LIVE AUCTIONS
 *    begins immediately beneath the second hero with zero extra blank space.
 * 6. Smooth Bidirectional Reversibility: Scrolling up smoothly reverses every stage back to Hero 1.
 * 7. Single persistent video instance with uninterrupted looping playback.
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
      videoWrapper.style.width = '94vw';
      videoWrapper.style.maxWidth = '1560px';
      videoWrapper.style.height = '50vh';
      videoWrapper.style.maxHeight = '520px';
      videoWrapper.style.borderRadius = '6px';
      if (intro) {
        intro.style.opacity = '0';
        intro.style.display = 'none';
      }
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

          // Compute exact natural height of intro block for smooth collapse
          const introHeight = intro.offsetHeight || 140;

          // Stage 1: Compact Square Video Geometry (1:1 Ratio)
          const s1Width = isMobile ? '230px' : isTablet ? '260px' : '290px';
          const s1Height = isMobile ? '230px' : isTablet ? '260px' : '290px';
          const s1Radius = '16px';
          const s1Shadow = '0 24px 60px rgba(18, 61, 44, 0.12)';
          const s1Border = '1px solid rgba(197, 160, 89, 0.28)';

          // Stage 2: Larger Square Video Geometry (1:1 Ratio, expanding)
          const s2Width = isMobile ? '310px' : isTablet ? '360px' : '400px';
          const s2Height = isMobile ? '310px' : isTablet ? '360px' : '400px';
          const s2Radius = '14px';

          // Stage 3: Mid Expansion (Transitioning from Square to Wide Rectangle)
          const s3Width = isMobile ? '88vw' : isTablet ? '76vw' : '70vw';
          const s3MaxWidth = '1080px';
          const s3Height = isMobile ? '46vw' : isTablet ? '40vw' : '440px';
          const s3Radius = '8px';

          // Stage 4: Second Hero Cinematic Expansion (Fills upper hero spot, 92-96vw x 48-55vh)
          const s4Width = isMobile ? '95vw' : '94vw';
          const s4MaxWidth = '1560px';
          const s4Height = isMobile ? '48vh' : isTablet ? '50vh' : '50vh';
          const s4MaxHeight = isMobile ? '420px' : isTablet ? '460px' : '500px';
          const s4Radius = '6px';
          const s4Shadow = '0 30px 80px rgba(0, 0, 0, 0.38)';
          const s4Border = '1px solid rgba(197, 160, 89, 0.20)';

          // Master Scroll-Linked Timeline across the track
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: track,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          // ── Phase 1 (0.00 → 0.30): Stage 1 to Stage 2 (Expand Square) ──
          // Video expands while maintaining 1:1 square ratio; intro text remains fully visible
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
              duration: 0.30,
            },
            0
          );

          tl.fromTo(
            intro,
            { opacity: 1, y: 0, marginBottom: 20 },
            {
              opacity: 0.95,
              y: -4,
              marginBottom: 20,
              ease: 'none',
              duration: 0.30,
            },
            0
          );

          // ── Phase 2 (0.30 → 0.65): Stage 2 to Stage 3 (Transition to Wide Rectangle) ──
          // Video widens to 70vw; intro lifts & fades; intro footprint smoothly collapses
          tl.to(
            videoWrapper,
            {
              width: s3Width,
              maxWidth: s3MaxWidth,
              height: s3Height,
              maxHeight: s3Height,
              borderRadius: s3Radius,
              ease: 'power1.inOut',
              duration: 0.35,
            },
            0.30
          );

          tl.to(
            intro,
            {
              opacity: 0,
              y: -20,
              marginBottom: -introHeight,
              ease: 'power1.inOut',
              duration: 0.35,
            },
            0.30
          );

          // ── Phase 3 (0.65 → 0.90): Stage 3 to Stage 4 (Second Hero Transformation) ──
          // Video reaches 94vw x 50vh (~500px), cleanly positioned under the navbar as Second Hero
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
              duration: 0.25,
            },
            0.65
          );

          // ── Phase 4 (0.90 → 1.00): Steady Hold at Second Hero State ──
          // Holds the Second Hero composition before the pin releases cleanly into Closing Soon
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
        Scroll Track: 220vh total height
        Provides smooth, progressive scroll progression across all 4 stages:
        Stage 1 (Compact Square) -> Stage 2 (Large Square) -> Stage 3 (Wide Rect) -> Stage 4 (Second Hero)
      */}
      <div
        ref={trackRef}
        className="relative w-full"
        style={{ minHeight: reducedMotion ? 'auto' : '220vh' }}
      >
        {/*
          Pinned Viewport Canvas:
          Native CSS position: sticky; top: 0
          Height matches Second Hero content bounds (~calc(50vh + 105px), ~600px)
          so that when the track ends, Closing Soon begins IMMEDIATELY beneath the video
          with ZERO unwanted blank space!
        */}
        <div
          ref={viewportRef}
          className={`${
            reducedMotion
              ? 'relative min-h-[85vh] py-16 px-4 flex flex-col items-center justify-center'
              : 'sticky top-0 w-full overflow-hidden flex flex-col items-center justify-start pt-[78px] sm:pt-[82px] lg:pt-[86px] pb-6'
          }`}
          style={{
            height: reducedMotion ? 'auto' : 'calc(50vh + 105px)',
            minHeight: reducedMotion ? 'auto' : '540px',
            maxHeight: reducedMotion ? 'none' : '620px',
            backgroundColor: '#F8F7F2',
          }}
        >
          {/* ── Stage 1 & 2: Editorial Typography Header ── */}
          <div
            ref={introRef}
            className="relative z-20 px-6 text-center max-w-[840px] mx-auto pointer-events-none will-change-[transform,opacity,margin-bottom]"
            style={{ marginBottom: '20px' }}
          >
            {/* Curated Departments Eyebrow flanked by horizontal gold divider lines */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2.5 sm:mb-3">
              <span className="block w-8 sm:w-12 h-px bg-[#C5A059]/60" />
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#C5A059] font-mono font-medium">
                CURATED DEPARTMENTS
              </p>
              <span className="block w-8 sm:w-12 h-px bg-[#C5A059]/60" />
            </div>

            {/* Main Headline — High-Contrast Editorial Serif */}
            <h2
              className="font-serif font-normal text-[#183D30] leading-[1.08] tracking-tight mb-2 sm:mb-2.5 drop-shadow-sm"
              style={{ fontSize: 'clamp(2rem, 3.2vw, 3rem)' }}
            >
              Explore Our Collections
            </h2>

            {/* Supporting Description — Refined Curatorial Text */}
            <p className="font-sans text-[#183D30]/80 leading-[1.5] max-w-[620px] mx-auto text-[13.5px] sm:text-[14.5px] lg:text-[15.5px]">
              Authenticated objects of historical resonance, academic significance, and exceptional market provenance.
            </p>
          </div>

          {/* 
            ── The Persistent Video Canvas (Second Hero) ──
            Animates symmetrically from Stage 1 Compact Square (290px x 290px, 16px radius)
            to Stage 2 Larger Square (400px x 400px)
            to Stage 3 Wide Rectangle (~70vw x 440px)
            to Stage 4 Second Hero (~94vw x 50vh, ~500px max, right under navbar)
          */}
          <div
            ref={videoWrapperRef}
            className="relative z-10 overflow-hidden will-change-[width,height,border-radius,box-shadow]"
            style={{
              width: reducedMotion ? '94vw' : '290px',
              maxWidth: reducedMotion ? '1560px' : '290px',
              height: reducedMotion ? '50vh' : '290px',
              maxHeight: reducedMotion ? '500px' : '290px',
              borderRadius: reducedMotion ? '6px' : '16px',
              boxShadow: '0 24px 60px rgba(18, 61, 44, 0.12)',
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
