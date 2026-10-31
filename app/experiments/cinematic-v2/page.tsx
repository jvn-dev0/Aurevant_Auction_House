import React from 'react';
import type { Metadata } from 'next';
import { CinematicHomepageV2 } from '@/experiments/cinematic-homepage-react/CinematicHomepageV2';
import '@/experiments/cinematic-homepage-react/cinematic-v2.css';

export const metadata: Metadata = {
  title: 'ChronoBid Vault | Multi-Category Cinematic Homepage (React Experiment)',
  description:
    'Standalone React design experiment demonstrating a multi-category cultural auction house across Fine Art, Coins, Rare Books, Horology, Haute Joaillerie, and Antiquities.',
};

export default function CinematicExperimentV2Page() {
  return (
    <div id="cinematic-v2-root" className="min-h-screen bg-[#111312] text-[#F4F0E8] overflow-x-hidden">
      {/* Standalone React Experiment Container */}
      <CinematicHomepageV2 />
    </div>
  );
}
