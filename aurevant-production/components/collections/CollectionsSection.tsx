'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * AUREVANT AUCTION HOUSE — Collections Section
 * 
 * Luxury Curatorial Design:
 * - Seamless transition immediately following HeroSection (zero blank space)
 * - Warm Ivory Canvas (#F8F7F2) with Forest Green (#123D2C) & Antique Gold (#B99455)
 * - Restrained editorial typography: Instrument Serif headline, italic supporting line
 * - Scroll-linked cinematic video expansion (Stage A: 60% compact → Stage D: ~98% cinematic)
 * - CSS Sticky pinning + GSAP scrub / requestAnimationFrame: zero pin-spacer artifacts
 * 
 * Video Asset: /video/Marble_statues_at_luxury_auction_b2db8f87_1080p.mp4
 */

export function CollectionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);

  /* ── Video Playback Toggle ── */
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  /* ── Auto-play muted video when entering viewport for luxury ambience ── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasScrolledIntoView(true);
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                // Auto-play was prevented by browser policy; user can click play
                setIsPlaying(false);
              });
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  /* ── Scroll-Linked Video Expansion Engine ── */
  useEffect(() => {
    // Check prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const videoContainer = videoContainerRef.current;
    const track = trackRef.current;
    if (!videoContainer || !track) return;

    if (mq.matches) {
      // Reduced motion: maintain stable, comfortable cinematic width without scroll distortion
      videoContainer.style.width = '88%';
      videoContainer.style.maxWidth = '1300px';
      videoContainer.style.borderRadius = '8px';
      return;
    }

    let isDestroyed = false;
    let gsapInstance: any = null;
    let scrollTriggerInstance: any = null;

    /**
     * Update function applies scroll progress (0.0 → 1.0) directly to container
     * Stage A (0.0): width 60%, maxWidth 860px, radius 14px
     * Stage B (0.3): width 72%, maxWidth 1050px, radius 10px
     * Stage C (0.7): width 88%, maxWidth 1350px, radius 6px
     * Stage D (1.0): width 98%, maxWidth 1600px, radius 2px
     */
    const applyProgress = (progress: number) => {
      const p = Math.max(0, Math.min(1, progress));

      // Interpolate width: 60% → 98%
      const widthPct = 60 + p * 38;
      // Interpolate max-width: 860px → 1600px
      const maxW = 860 + p * 740;
      // Interpolate border radius: 14px → 2px
      const radius = 14 - p * 12;

      videoContainer.style.width = `${widthPct}%`;
      videoContainer.style.maxWidth = `${maxW}px`;
      videoContainer.style.borderRadius = `${radius}px`;
    };

    // Initialize with GSAP ScrollTrigger if available
    const initScroll = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        if (isDestroyed) return;

        gsap.registerPlugin(ScrollTrigger);
        gsapInstance = gsap;

        // Drive the animation via ScrollTrigger WITHOUT pin: true (using native CSS sticky)
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: track,
          start: 'top top+=70',
          end: 'bottom bottom',
          scrub: 0.4,
          onUpdate: (self) => {
            applyProgress(self.progress);
          },
        });
      } catch (e) {
        // Fallback to requestAnimationFrame scroll listener if GSAP fails
        console.warn('ScrollTrigger fallback activated', e);
      }
    };

    // Native scroll fallback handler
    const onScrollFallback = () => {
      if (scrollTriggerInstance) return; // GSAP is active
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const scrollDist = rect.height - window.innerHeight;
      if (scrollDist <= 0) return;

      const currentScroll = -rect.top + 70;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollDist));
      applyProgress(progress);
    };

    initScroll();
    window.addEventListener('scroll', onScrollFallback, { passive: true });

    return () => {
      isDestroyed = true;
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      window.removeEventListener('scroll', onScrollFallback);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#F8F7F2] text-[#123D2C] z-10 selection:bg-[#B99455]/30 selection:text-[#0B2B20]"
      aria-label="Collections"
    >
      {/* ── 1. Editorial Introduction ── */}
      <div className="pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12 px-6 sm:px-10 lg:px-16 text-center max-w-[860px] mx-auto">
        {/* Subtle Decorative Eyebrow */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
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
          className="font-serif font-normal text-[#123D2C] leading-[1.12] tracking-tight mb-2.5 sm:mb-3"
          style={{ fontSize: 'clamp(2rem, 3.4vw, 3.125rem)' }}
        >
          Rare pieces. Timeless value.
        </h2>

        {/* Supporting Headline — Italic Serif */}
        <p
          className="font-serif italic text-[#0B2B20]/75 leading-[1.45] max-w-[580px] mx-auto text-[15px] sm:text-[16px] lg:text-[17.5px]"
        >
          Explore our curated collections of exceptional treasures.
        </p>

        {/* Subtle Architectural Divider */}
        <div className="flex items-center justify-center gap-2.5 mt-5 sm:mt-6">
          <span className="block w-5 h-px bg-[#123D2C]/15" />
          <span className="block w-1 h-1 rounded-full bg-[#B99455]/40" />
          <span className="block w-5 h-px bg-[#123D2C]/15" />
        </div>
      </div>

      {/* ── 2. Scroll-Driven Expansion Track ── */}
      <div
        ref={trackRef}
        className="relative w-full"
        style={{ minHeight: reducedMotion ? 'auto' : '150vh' }}
      >
        {/* Native CSS Sticky Wrapper: Sticks at navbar height (70px) */}
        <div
          ref={stickyRef}
          className={`${
            reducedMotion
              ? 'relative pb-16 px-4 sm:px-6'
              : 'sticky top-[70px] w-full flex items-center justify-center py-4 px-3 sm:px-6'
          }`}
          style={{ minHeight: reducedMotion ? 'auto' : 'calc(100vh - 80px)' }}
        >
          {/* Centered Expanding Video Container */}
          <div
            ref={videoContainerRef}
            className="relative overflow-hidden mx-auto transition-shadow duration-300 shadow-[0_20px_50px_rgba(11,43,32,0.12)] border border-[#B99455]/25"
            style={{
              width: '60%',
              maxWidth: '860px',
              borderRadius: '14px',
              backgroundColor: '#0B2B20',
            }}
          >
            {/* Cinematic 16:9 Aspect Ratio Frame */}
            <div className="relative w-full aspect-video sm:aspect-[16/9.2] lg:aspect-[16/9] max-h-[58vh]">
              <video
                ref={videoRef}
                src="/video/Marble_statues_at_luxury_auction_b2db8f87_1080p.mp4"
                className="w-full h-full object-cover object-center select-none"
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Rare marble sculpture collection displayed in a luxury auction saleroom"
              />

              {/* Discreet Museum Ambient Vignette */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0B2B20]/30 via-transparent to-[#0B2B20]/15" />

              {/* Sophisticated Play/Pause Control Overlay */}
              <button
                type="button"
                onClick={togglePlay}
                className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B99455] ${
                  isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                }`}
                aria-label={isPlaying ? 'Pause video presentation' : 'Play video presentation'}
              >
                {/* Subtle dark backdrop for control visibility */}
                <div className="absolute inset-0 bg-[#0B2B20]/25 transition-colors duration-200" />

                {/* Circular Glassmorphic Control Badge */}
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
                    /* Play Icon with optical horizontal nudge */
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

      {/* ── 3. Bottom Transition Cushion ── */}
      <div className="h-12 sm:h-16 lg:h-20 bg-[#F8F7F2] pointer-events-none" />
    </section>
  );
}
