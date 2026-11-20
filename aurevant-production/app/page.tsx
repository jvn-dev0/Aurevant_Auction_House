import React from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { HeroSection } from '../components/hero/HeroSection';
import { CollectionsSection } from '../components/collections/CollectionsSection';
import { ClosingSoonSection } from '../components/collections/ClosingSoonSection';
import { ExploreCollectionsSection } from '../components/collections/ExploreCollectionsSection';
import { StorySection } from '../components/story/StorySection';
import { IntelligenceSection } from '../components/intelligence/IntelligenceSection';
import { SellSection } from '../components/sell/SellSection';
import { Footer } from '../components/footer/Footer';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#F8F7F2] text-[#183D30] overflow-x-clip antialiased">
      <Navbar />
      <HeroSection />
      <CollectionsSection />
      <ClosingSoonSection />
      <ExploreCollectionsSection />
      <StorySection />
      <IntelligenceSection />
      <SellSection />
      <Footer />
    </main>
  );
}
