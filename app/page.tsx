'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useChronoBid } from '@/lib/context';
import { WATCH_LOTS, CATEGORIES } from '@/lib/data';
import { LotCard } from '@/components/LotCard';
import { MonogramCard } from '@/components/MonogramCard';
import { CountdownClock } from '@/components/CountdownClock';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  FileCheck,
  Lock,
  Compass,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export default function HomePage() {
  const {
    liveLot,
    remainingSeconds,
    extensionCount,
    currentBidUsd,
    highestBidderPaddle,
    formatPrice,
    isSaleroomClosed,
    placeQuickBid,
  } = useChronoBid();

  const [selectedCategory, setSelectedCategory] = useState<string>('All Specimens');

  const filteredLots =
    selectedCategory === 'All Specimens'
      ? WATCH_LOTS
      : WATCH_LOTS.filter((lot) => lot.category === selectedCategory);

  return (
    <div className="space-y-20 pb-16">
      {/* SECTION 2: EDITORIAL HERO HEADER */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-dark border border-stone-hairline text-xs font-mono tracking-widest uppercase text-forest/80">
            <span className="w-2 h-2 rounded-full bg-lime"></span>
            <span>Geneva Session No. 18 • Curated Horology</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-forest leading-[1.08]">
            Mechanical Permanence in an Ephemeral Era.
          </h1>

          <p className="font-sans text-base sm:text-lg text-forest/80 max-w-2xl leading-relaxed">
            ChronoBid Vault is an editorial saleroom for fine horology. Every timepiece is physically inspected,
            audited via acoustic Timegrapher diagnostic, and offered through transparent, anti-sniping auction mechanics.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/auctions/live"
              className="py-3.5 px-6 bg-lime hover:bg-lime-hover active:scale-[0.99] text-forest font-mono text-xs uppercase tracking-wider font-bold transition-all border border-forest/10 flex items-center gap-2 shadow-tactile"
            >
              <span>Enter Active Saleroom</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/consign"
              className="py-3.5 px-6 bg-paper hover:bg-paper-dark text-forest font-mono text-xs uppercase tracking-wider transition-colors border border-stone-hairline flex items-center gap-2 shadow-tactile"
            >
              <span>Request Private Intake</span>
              <ArrowUpRight className="w-4 h-4 text-forest/70" />
            </Link>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 border-t border-stone-hairline max-w-3xl">
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-forest block">
                $42.8M
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-forest/60">
                Gross Auction GMV (Simulated)
              </span>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-forest block">
                99.4%
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-forest/60">
                Settlement Integrity Rate
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-forest block">
                14 Days
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-forest/60">
                Bespoke Custody Escrow Window
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LIVE SALEROOM MARQUEE TICKER (IX-SAL-01) */}
      <section className="bg-forest text-paper py-3 border-y border-forest-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-lime text-forest font-bold uppercase text-[10px] tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-forest animate-ping"></span>
              Live Room
            </span>
            <span className="hidden sm:inline font-semibold text-paper/90">
              Lot 01: 1968 Patek Philippe Calatrava Ref. 3520D
            </span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto">
            <div>
              <span className="text-paper/60 mr-2">High Ask:</span>
              <span className="font-bold text-lime">{formatPrice(currentBidUsd)}</span>
            </div>
            <div>
              <span className="text-paper/60 mr-2">Holding Paddle:</span>
              <span className="font-semibold text-paper">#{highestBidderPaddle}</span>
            </div>
            <div>
              <span className="text-paper/60 mr-2">Clock:</span>
              <span className="font-semibold text-paper">
                {Math.floor(remainingSeconds / 60)}m {remainingSeconds % 60}s
              </span>
            </div>
            <Link
              href="/auctions/live"
              className="text-lime hover:underline font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
            >
              <span>Join Bidding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: CURATED FEATURED LOT SPOTLIGHT (IX-LOT-01) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-stone-hairline bg-paper p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-tactile">
          {/* Left Column: Visual Fallback Monogram Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              <MonogramCard
                monogram={liveLot.monogram}
                referenceLabel={liveLot.monogramSubtitle}
                subtext={liveLot.provisionalNotice}
                showBadges={true}
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-lime text-forest text-[11px] font-mono font-bold px-2.5 py-1 uppercase tracking-wider shadow-tactile">
                  Featured Debut Lot
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Saleroom Dossier & Quick Live Bid Trigger */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-forest/60">
                Lot #{liveLot.lotNumber} • {liveLot.manufacturer} • {liveLot.year}
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-tight">
                {liveLot.title}
              </h2>
              <p className="font-sans text-sm text-forest/80 leading-relaxed">
                {liveLot.dialDescription} Featuring the legendary ultra-thin manual-wind Calibre 175 with Gyromax balance.
                Handcrafted Clous de Paris hobnail bezel in unpolished 18k yellow gold with intact Swiss hallmarks.
              </p>
            </div>

            {/* Countdown Clock Component */}
            <CountdownClock
              remainingSeconds={remainingSeconds}
              extensionCount={extensionCount}
            />

            {/* Price Overview & CTA */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-hairline">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-forest/60 block">
                  Current High Ask
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-forest">
                  {formatPrice(currentBidUsd)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/auctions/live"
                  className="py-3 px-5 bg-lime hover:bg-lime-hover text-forest font-mono text-xs uppercase tracking-wider font-bold transition-all border border-forest/10 flex items-center gap-1.5 shadow-tactile"
                >
                  <Zap className="w-3.5 h-3.5 fill-forest" />
                  <span>Open Bid Console</span>
                </Link>
                <Link
                  href={`/auctions/lots/${liveLot.slug}`}
                  className="py-3 px-4 bg-paper-dark hover:bg-forest hover:text-paper text-forest font-mono text-xs uppercase tracking-wider transition-colors border border-stone-hairline"
                >
                  Specimen Dossier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE MASTER VAULT COLLECTION (IX-CAT-01) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-hairline pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-forest/60 block">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              The Master Vault Collection
            </h2>
          </div>

          {/* Working Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Watch Categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? 'bg-forest text-paper border-forest font-semibold'
                    : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest hover:text-forest'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6-Lot Grid (or filtered subset) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>
      </section>

      {/* SECTION 6: EDITORIAL HOROLOGY FOCUS / HISTORICAL NARRATIVE */}
      <section className="bg-paper-dark border-y border-stone-hairline py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-forest/60">
            <span className="w-1.5 h-1.5 bg-forest"></span>
            <span>Editorial Horology Dispatches • Volume IV</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest leading-tight">
            The Anatomy of a Holy Grail: Deconstructing the 1965 Singer Step-Plate Dial.
          </h2>

          <p className="font-sans text-base sm:text-lg text-forest/80 leading-relaxed">
            In the realm of vintage chronograph scholarship, few dial variations evoke the forensic scrutiny commanded
            by the reference 6239 exotic configuration. Produced by Singer on a brass blank with a concentric step-down
            outer track, every authentic specimen reflects a specific interaction between crosshair sub-dial tolerances
            and the manual-wind Valjoux 722 column-wheel mechanism.
          </p>

          <blockquote className="border-l-2 border-forest pl-6 py-2 my-6 font-serif italic text-xl sm:text-2xl text-forest">
            “A collector does not purchase merely a steel case; one acquires an immutable physical record of mid-century Swiss micromechanics.”
          </blockquote>

          <div className="pt-4 flex items-center justify-between text-xs font-mono text-forest/70 border-t border-stone-hairline">
            <span>By Jean-Claude Vernier • Senior Horological Specialist</span>
            <Link
              href="/auctions/lots/rolex-daytona-6239-paul-newman"
              className="text-forest hover:underline font-bold flex items-center gap-1"
            >
              <span>Inspect Lot 03 Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: FOUR PILLARS OF AUTHENTICATION & PROVENANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-forest/60 block">
            Verification Protocol
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
            The Four Pillars of ChronoBid Integrity
          </h2>
          <p className="text-sm font-sans text-forest/70">
            Every lot submitted to the Vault undergoes a non-destructive forensic audit before being admitted to the catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-paper border border-stone-hairline space-y-3">
            <div className="w-10 h-10 bg-paper-dark border border-stone-hairline flex items-center justify-center text-forest">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest">
              1. Microscopic Inspection
            </h3>
            <p className="text-xs font-sans text-forest/70 leading-relaxed">
              High-magnification ultraviolet and binocular microscopy audits dial lacquer, step indices, hands, and case chamfers.
            </p>
          </div>

          <div className="p-6 bg-paper border border-stone-hairline space-y-3">
            <div className="w-10 h-10 bg-paper-dark border border-stone-hairline flex items-center justify-center text-forest">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest">
              2. Acoustic Timegrapher
            </h3>
            <p className="text-xs font-sans text-forest/70 leading-relaxed">
              Full 6-position acoustic audit measuring rate deviation, balance wheel amplitude, and escapement beat error.
            </p>
          </div>

          <div className="p-6 bg-paper border border-stone-hairline space-y-3">
            <div className="w-10 h-10 bg-paper-dark border border-stone-hairline flex items-center justify-center text-forest">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest">
              3. Archival Ledger Extract
            </h3>
            <p className="text-xs font-sans text-forest/70 leading-relaxed">
              Direct liaison with manufacture heritage departments to cross-reference movement serials against original ledger records.
            </p>
          </div>

          <div className="p-6 bg-paper border border-stone-hairline space-y-3">
            <div className="w-10 h-10 bg-paper-dark border border-stone-hairline flex items-center justify-center text-forest">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest">
              4. Provenance Assurance
            </h3>
            <p className="text-xs font-sans text-forest/70 leading-relaxed">
              Every sold timepiece is backed by our full authenticity covenant and registered custody ledger transfer.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: PRIVATE CONSIGNMENT INTAKE PORTAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-stone-hairline bg-paper-dark p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-paper border border-stone-hairline text-xs font-mono uppercase tracking-wider text-forest/80">
              <span className="w-2 h-2 rounded-full bg-forest"></span>
              <span>Consignor Onboarding</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              Entrust Your Rare Timepiece to Global Connoisseurs.
            </h2>
            <p className="text-sm font-sans text-forest/80 leading-relaxed">
              Receive a preliminary specialist valuation within 48 hours. Enjoy confidential reserve agreements,
              bespoke studio cataloging, and competitive consignor commission tiers.
            </p>
          </div>

          <div className="shrink-0 space-y-3 text-center sm:text-left">
            <Link
              href="/consign"
              className="py-3.5 px-6 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold transition-colors inline-flex items-center gap-2"
            >
              <span>Begin Consignment Wizard</span>
              <ArrowRight className="w-4 h-4 text-lime" />
            </Link>
            <p className="text-[11px] font-mono text-forest/60">
              [Simulated Intake: Generates Demo CBV-INTAKE-XXXX Ticket]
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: BESPOKE ESCROW & ARMORED TRANSIT SAFEGUARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border border-stone-hairline bg-paper p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-hairline pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-forest/60 block">
                Custody Protocol Architecture
              </span>
              <h3 className="font-serif text-2xl font-bold text-forest">
                Proposed Escrow Custody & Insured Transit
              </h3>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300">
              [PROPOSED FUTURE SERVICE — NOT OPERATIONAL]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
            <div className="p-4 bg-paper-dark border border-stone-hairline space-y-2">
              <div className="font-bold text-forest uppercase tracking-wider">
                Phase 1: Escrow Custody
              </div>
              <p className="text-forest/70 font-sans leading-relaxed">
                Winning bids will be held in a segregated Swiss custody account. Funds remain locked until the collector conducts physical inspection.
              </p>
            </div>
            <div className="p-4 bg-paper-dark border border-stone-hairline space-y-2">
              <div className="font-bold text-forest uppercase tracking-wider">
                Phase 2: Armored Transit
              </div>
              <p className="text-forest/70 font-sans leading-relaxed">
                Fully insured worldwide transit through specialized armored carriers (Malca-Amit / Ferrari Group) with GPS telemetry.
              </p>
            </div>
            <div className="p-4 bg-paper-dark border border-stone-hairline space-y-2">
              <div className="font-bold text-forest uppercase tracking-wider">
                Phase 3: 14-Day Vault Sign-Off
              </div>
              <p className="text-forest/70 font-sans leading-relaxed">
                The collector enjoys a 14-day inspection window to verify that timekeeping and condition match the Timegrapher report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: PRIVATE COLLECTOR TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-forest/60 block">
            Institutional Trust
          </span>
          <h2 className="font-serif text-3xl font-bold text-forest">
            Collector Endorsements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-paper border border-stone-hairline flex flex-col justify-between space-y-4">
            <p className="font-serif italic text-sm text-forest leading-relaxed">
              “The soft-close auction anti-sniping mechanism is a breath of fresh air. It rewards true connoisseurship rather than algorithmic millisecond bots.”
            </p>
            <div className="text-xs font-mono text-forest/70 border-t border-stone-hairline pt-3">
              <strong className="block text-forest">Marcus von Graff</strong>
              <span>Zurich Horological Society Member</span>
            </div>
          </div>

          <div className="p-6 bg-paper border border-stone-hairline flex flex-col justify-between space-y-4">
            <p className="font-serif italic text-sm text-forest leading-relaxed">
              “Having the full Timegrapher acoustic report and extract provenance before placing a paddle bid gave our trust absolute peace of mind.”
            </p>
            <div className="text-xs font-mono text-forest/70 border-t border-stone-hairline pt-3">
              <strong className="block text-forest">Elena Rostova</strong>
              <span>Private Foundation Curator, Geneva</span>
            </div>
          </div>

          <div className="p-6 bg-paper border border-stone-hairline flex flex-col justify-between space-y-4">
            <p className="font-serif italic text-sm text-forest leading-relaxed">
              “The consignment intake was transparent from start to finish. The reserve agreement was honored exactly as agreed in the catalog preview.”
            </p>
            <div className="text-xs font-mono text-forest/70 border-t border-stone-hairline pt-3">
              <strong className="block text-forest">Sir Arthur Pendelton</strong>
              <span>Collector of Historic Chronographs</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
