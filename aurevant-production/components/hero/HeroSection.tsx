import React from 'react';
import { EditorialContent } from './EditorialContent';
import { SectionSelector } from './SectionSelector';
import { LotOverlay } from './LotOverlay';
import { SculptureContainer } from '../sculpture/SculptureContainer';

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] lg:h-[100svh] lg:max-h-[100svh] w-full flex flex-col justify-between overflow-hidden pt-[66px] isolate">
      <div id="about" className="absolute top-0 pointer-events-none" aria-hidden="true" />
      {/* 1. Cinematic Full-Width Museum Gallery Background */}
      <div className="hero-background-container absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <picture className="w-full h-full block">
          <source srcSet="/images/Hero-background.webp" type="image/webp" />
          <img
            src="/images/Hero-background.png"
            alt="Museum exhibition gallery background"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center pointer-events-none select-none"
          />
        </picture>
        {/* Cinematic Left Vignette for Curatorial Typography Contrast */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[60%] bg-gradient-to-r from-[#0B0D0C]/85 via-[#101113]/55 via-50% to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full lg:w-[50%] h-full bg-[radial-gradient(ellipse_at_20%_45%,rgba(11,13,12,0.78)_0%,rgba(16,17,19,0.35)_55%,transparent_100%)] pointer-events-none" />
        {/* Soft Ambient Vignette preserving reflective floor & gallery architecture */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101113]/60 via-transparent to-[#101113]/30 pointer-events-none" />
      </div>

      {/* 2. Main Editorial & 3D Composition Grid */}
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-4 sm:py-6 lg:py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-grow">
        {/* Left Editorial Text Column */}
        <div className="lg:col-span-7 xl:col-span-7 z-10 flex flex-col justify-center">
          <EditorialContent />
        </div>

        {/* Centre-Right 3D Marble Sculpture Column */}
        <div className="lg:col-span-5 xl:col-span-5 relative flex items-center justify-center sculpture-column z-10">
          <SculptureContainer />
        </div>
      </div>

      {/* 3. Hero Bottom Bar (Ticker & Lot Overlay) */}
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-16 pb-6 sm:pb-8 pt-2 flex flex-col sm:flex-row items-start sm:items-end justify-between z-20 relative">
        {/* Curatorial Ticker Brand Pillars */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1.5 text-[11px] sm:text-[12px] lg:text-[12.5px] tracking-[0.18em] sm:tracking-[0.22em] text-[#C5A059] font-mono uppercase leading-relaxed bg-[#101113]/75 backdrop-blur-md px-4 py-2.5 border border-[#F4F0E8]/12 shadow-lg">
          <div className="flex items-center space-x-2.5">
            <span className="whitespace-nowrap font-medium">A GLOBAL AUCTION HOUSE</span>
            <span className="text-[#C5A059]/40 select-none">|</span>
            <span className="whitespace-nowrap font-medium">EXPERTISE</span>
          </div>
          <span className="text-[#C5A059]/40 select-none hidden sm:inline">|</span>
          <div className="flex items-center space-x-2.5">
            <span className="whitespace-nowrap font-medium">TRUSTED PROVENANCE</span>
            <span className="text-[#C5A059]/40 select-none">|</span>
            <span className="whitespace-nowrap font-medium">INTELLIGENT DISCOVERY</span>
          </div>
        </div>

        {/* Discreet Lot Overlay */}
        <LotOverlay />
      </div>

      {/* 4. Right Vertical Section Selector (01 - 04) */}
      <SectionSelector />
    </section>
  );
}
