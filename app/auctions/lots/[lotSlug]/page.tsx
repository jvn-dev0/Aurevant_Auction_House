'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ALL_AUCTION_LOTS, MarketplaceLot } from '@/lib/data';
import { useChronoBid } from '@/lib/context';
import { MonogramCard } from '@/components/MonogramCard';
import { SpecGrid } from '@/components/SpecGrid';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function LotDossierPage() {
  const params = useParams();
  const slug = params?.lotSlug as string;

  const lotIndex = ALL_AUCTION_LOTS.findIndex((l) => l.slug === slug);
  const lot = ALL_AUCTION_LOTS[lotIndex] as MarketplaceLot | undefined;

  const { currency, formatPrice, isWatchlisted, toggleWatchlist, user, addToast } = useChronoBid();
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);
  const [absenteeBid, setAbsenteeBid] = useState('');
  const [absenteeSubmitted, setAbsenteeSubmitted] = useState(false);

  if (!lot) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl text-forest">Catalog Specimen Not Found</h1>
        <p className="text-xs font-mono text-forest/70">
          The requested catalog reference was not found in the current auction inventory.
        </p>
        <Link
          href="/auctions/upcoming"
          className="inline-block py-2.5 px-4 bg-forest text-paper font-mono text-xs uppercase"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const prevLot = lotIndex > 0 ? ALL_AUCTION_LOTS[lotIndex - 1] : null;
  const nextLot = lotIndex < ALL_AUCTION_LOTS.length - 1 ? ALL_AUCTION_LOTS[lotIndex + 1] : null;
  const watchlisted = isWatchlisted(lot.id);

  const handleAbsenteeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (absenteeBid) {
      setAbsenteeSubmitted(true);
      addToast(`Confidential absentee bid of $${parseInt(absenteeBid, 10).toLocaleString()} recorded for Lot #${lot.lotNumber}.`, 'success');
      setAbsenteeBid('');
    }
  };

  const category = lot.marketplaceCategory || 'Fine Horology';
  const primaryCreator = lot.makerOrArtist || lot.manufacturer || 'Master Artisan';

  // Category-specific angle views
  const angleConfigs: Record<string, { label: string; monogram: string; sub: string }[]> = {
    'Fine Horology': [
      { label: '1. Dial', monogram: lot.monogram, sub: lot.monogramSubtitle },
      { label: '2. Calibre', monogram: 'CALIBRE', sub: lot.calibre?.split('(')[0].trim() || 'CALIBRE SPEC' },
      { label: '3. Caseback', monogram: 'HALLMARKS', sub: `${(lot.caseMaterial || 'PRECIOUS METAL').split(' ')[0]} MARKS` },
      { label: '4. Profile', monogram: 'PROFILE', sub: lot.dimensions ? lot.dimensions.split('×')[0].trim() : 'DIMENSIONS' },
    ],
    'Rare Coins & Numismatics': [
      { label: '1. Obverse', monogram: lot.monogram, sub: lot.monogramSubtitle },
      { label: '2. Strike Details', monogram: 'STRIKE', sub: lot.coinAttributes?.strikeScore || 'DIE STRIKE' },
      { label: '3. Authority', monogram: 'AUTHORITY', sub: lot.coinAttributes?.issuingAuthority ? lot.coinAttributes.issuingAuthority.slice(0, 24) : 'MINT' },
      { label: '4. Flann / Weight', monogram: 'FLANN', sub: lot.coinAttributes ? `${lot.coinAttributes.metalComposition.slice(0, 16)} • ${lot.coinAttributes.weightGrams}g` : 'FLANN' },
    ],
    'Haute Joaillerie': [
      { label: '1. Primary View', monogram: lot.monogram, sub: lot.monogramSubtitle },
      { label: '2. Principal Stones', monogram: 'STONES', sub: lot.jewelryAttributes?.totalCaratWeight || 'GEM SPEC' },
      { label: '3. Hallmarks', monogram: 'MAISON', sub: lot.jewelryAttributes?.maison || 'HALLMARKS' },
      { label: '4. Mount', monogram: 'MOUNT', sub: lot.jewelryAttributes?.mountingMetal?.split(' ')[0] || 'MOUNTING' },
    ],
    'Fine Art': [
      { label: '1. Recto Canvas', monogram: lot.monogram, sub: lot.monogramSubtitle },
      { label: '2. Medium', monogram: 'SURFACE', sub: lot.artAttributes?.mediumAndSupport ? lot.artAttributes.mediumAndSupport.slice(0, 24) : 'MEDIUM' },
      { label: '3. Signature', monogram: 'SIGNATURE', sub: lot.artAttributes?.signatureLocation ? lot.artAttributes.signatureLocation.slice(0, 24) : 'ARTIST HAND' },
      { label: '4. Frame / Verso', monogram: 'VERSO', sub: lot.artAttributes?.framingStatus ? lot.artAttributes.framingStatus.slice(0, 24) : 'EXHIBITION LABELS' },
    ],
  };

  const currentAngles = angleConfigs[category] || angleConfigs['Fine Horology'];
  const activeAngle = currentAngles[activeAngleIndex] || currentAngles[0];

  const dossierTitle = {
    'Fine Horology': 'Forensic Calibre & Condition Dossier',
    'Rare Coins & Numismatics': 'Numismatic Grading & Die Strike Dossier',
    'Haute Joaillerie': 'Gemological Certification & Setting Dossier',
    'Fine Art': 'Catalogue Raisonné & Conservation Dossier',
  }[category] || 'Forensic Authentication & Condition Dossier';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-hairline gap-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest/60">
          <Link href="/" className="hover:text-forest">Saleroom</Link>
          <span>/</span>
          <Link href="/auctions/upcoming" className="hover:text-forest">Catalog</Link>
          <span>/</span>
          <span className="text-forest font-semibold">Lot #{lot.lotNumber}</span>
        </div>

        {/* Prev / Next Lot Switcher */}
        <div className="flex items-center gap-3 text-xs font-mono">
          {prevLot && (
            <Link
              href={`/auctions/lots/${prevLot.slug}`}
              className="px-2.5 py-1 bg-paper border border-stone-hairline text-forest/80 hover:text-forest flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Lot #{prevLot.lotNumber}</span>
            </Link>
          )}
          {nextLot && (
            <Link
              href={`/auctions/lots/${nextLot.slug}`}
              className="px-2.5 py-1 bg-paper border border-stone-hairline text-forest/80 hover:text-forest flex items-center gap-1"
            >
              <span>Lot #{nextLot.lotNumber}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Dossier Grid: Visual 4:5 + Angles / Pricing & Bidding / Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Monogram Card & Multi-Angle Switcher */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative">
            <MonogramCard
              monogram={activeAngle.monogram}
              referenceLabel={activeAngle.sub}
              subtext={lot.provisionalNotice}
              showBadges={true}
            />

            {/* Quick Watchlist Heart Button */}
            <button
              type="button"
              onClick={() => toggleWatchlist(lot.id)}
              aria-label={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
              className="absolute top-4 right-4 p-2.5 bg-paper/90 hover:bg-paper border border-stone-hairline text-forest shadow-tactile z-20"
            >
              <Heart className={`w-4 h-4 ${watchlisted ? 'fill-forest text-forest' : 'text-forest/60'}`} />
            </button>
          </div>

          {/* Angle Switcher Tabs */}
          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            {currentAngles.map((angle, idx) => (
              <button
                key={angle.label}
                type="button"
                onClick={() => setActiveAngleIndex(idx)}
                className={`py-2 px-1 text-center border uppercase text-[11px] transition-all ${
                  activeAngleIndex === idx
                    ? 'bg-forest text-paper border-forest font-semibold'
                    : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest'
                }`}
              >
                {angle.label}
              </button>
            ))}
          </div>

          {/* Archival Rights Disclosure */}
          <div className="p-4 bg-paper-dark border border-stone-hairline text-xs font-mono text-forest/70 space-y-1">
            <span className="font-bold text-forest uppercase block text-[10px]">
              Asset Provenance & Image Rights Notice:
            </span>
            <p className="leading-relaxed">
              This lot is provisional pending rights clearance. All specimen photographs utilize our Stone Surface #EDE7DC monogram fallback card in compliance with project governance.
            </p>
          </div>
        </div>

        {/* Right Column: Title, Valuations, Bidding or Absentee Trigger, Provenance Narrative */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest/70">
              <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-semibold tracking-wider">
                {lot.marketplaceCategory}
              </span>
              <span>
                {primaryCreator} • {lot.year ? `Circa ${lot.year}` : ''} • Ref: {lot.reference}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-tight">
              {lot.title}
            </h1>
            <p className="font-sans text-sm text-forest/80 leading-relaxed pt-1">
              {lot.dialDescription || lot.provenanceSummary}
            </p>
          </div>

          {/* Estimate & Current Status Box (Dual-Currency Display ADR-026) */}
          <div className="p-5 bg-paper border border-stone-hairline space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-stone-hairline">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-forest/60 block">
                  Catalog Estimate
                </span>
                <span className="font-mono text-base sm:text-lg font-semibold text-forest block">
                  {formatPrice(lot.estimateLowUsd)} – {formatPrice(lot.estimateHighUsd)}
                </span>
                {currency !== 'USD' && (
                  <span className="text-[10px] font-mono text-forest/50 block">
                    (${lot.estimateLowUsd.toLocaleString()} – ${lot.estimateHighUsd.toLocaleString()} USD base)
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-forest/60 block">
                  {lot.status === 'live' ? 'Current High Bid' : 'Starting Ask'}
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-forest block">
                  {formatPrice(lot.currentBidUsd)}
                </span>
                {currency !== 'USD' && (
                  <span className="text-[10px] font-mono text-forest/50 block">
                    (${lot.currentBidUsd.toLocaleString()} USD base)
                  </span>
                )}
              </div>
            </div>

            {/* Live Room link or Absentee Form */}
            {lot.status === 'live' ? (
              <div className="space-y-3">
                <div className="p-3 bg-lime/20 border border-lime text-xs font-mono text-forest flex items-center justify-between">
                  <span className="font-bold uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-forest animate-ping"></span>
                    Currently Active in Live Saleroom
                  </span>
                  <span className="font-semibold">Bidding in Progress</span>
                </div>
                <Link
                  href="/auctions/live"
                  className="w-full py-3.5 px-4 bg-lime hover:bg-lime-hover text-forest font-mono text-xs uppercase tracking-wider font-bold transition-all border border-forest/10 flex items-center justify-center gap-2 shadow-tactile"
                >
                  <Zap className="w-4 h-4 fill-forest" />
                  <span>Enter Live Saleroom & Bid Now</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleAbsenteeSubmit} className="space-y-3">
                <label htmlFor="absentee-bid-input" className="block text-xs font-mono uppercase tracking-wider text-forest/80">
                  Register Confidential Absentee Bid
                </label>
                <div className="flex gap-2">
                  <input
                    id="absentee-bid-input"
                    type="number"
                    value={absenteeBid}
                    onChange={(e) => setAbsenteeBid(e.target.value)}
                    placeholder={`Min ${formatPrice(lot.currentBidUsd)}`}
                    required
                    className="flex-1 px-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-forest text-paper hover:bg-forest-hover font-mono text-xs uppercase tracking-wider transition-colors shrink-0"
                  >
                    Submit Absentee
                  </button>
                </div>
                {absenteeSubmitted && (
                  <p className="text-xs font-mono text-lime-800 bg-lime/20 p-2 border border-lime">
                    ✓ Confidential absentee bid logged for Paddle #{user.paddleNumber}. The saleroom clerk will execute bids up to this ceiling.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Historical Provenance Extract Box */}
          <div className="border border-stone-hairline bg-paper-dark p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest font-bold">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>Custody Provenance Ledger</span>
            </div>
            <p className="text-xs font-sans text-forest/80 leading-relaxed">
              {lot.provenanceSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Deep SpecGrid */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-forest">
          {dossierTitle}
        </h2>
        <SpecGrid lot={lot} />
      </div>
    </div>
  );
}
