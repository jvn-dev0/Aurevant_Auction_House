import React from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { HeroSection } from '../components/hero/HeroSection';
import { CollectionsSection } from '../components/collections/CollectionsSection';
import { ExploreCollectionsSection } from '../components/collections/ExploreCollectionsSection';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#101113] text-[#F4F0E8] overflow-x-clip antialiased">
      <Navbar />
      <HeroSection />
      <CollectionsSection />
      <ExploreCollectionsSection />
    </main>
  );
}
