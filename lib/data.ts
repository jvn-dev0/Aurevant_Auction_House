// ChronoBid Vault — Multi-Category Catalog Data
// Approved marketplace catalog comprising Fine Horology, Rare Coins & Numismatics, Haute Joaillerie, and Fine Art.
// All provisional listings strictly utilize the Stone Surface #EDE7DC monogram fallback card.

export type MarketplaceCategory =
  | 'Fine Horology'
  | 'Rare Coins & Numismatics'
  | 'Haute Joaillerie'
  | 'Fine Art';

export const MARKETPLACE_CATEGORIES = [
  'All Categories',
  'Fine Horology',
  'Rare Coins & Numismatics',
  'Haute Joaillerie',
  'Fine Art',
] as const;

export interface MarketplaceLot {
  id: string;
  slug: string;
  lotNumber: number;
  title: string;
  marketplaceCategory: MarketplaceCategory;
  category: string; // Sub-category (e.g., 'Chronographs', 'Ancient Classical', 'Art Deco', 'Old Masters')
  makerOrArtist: string;
  manufacturer: string; // Backward compatibility with HorologicalLot
  reference: string;
  year: number | string;
  dimensions: string;
  conditionGrade: string;
  provenanceSummary: string;
  estimateLowUsd: number;
  estimateHighUsd: number;
  currentBidUsd: number;
  reserveStatus: 'Reserve Met' | 'Reserve Pending' | 'No Reserve';
  monogram: string;
  monogramSubtitle: string;
  status: 'live' | 'upcoming' | 'closed';
  provisionalNotice: string;
  bidCount: number;

  // Horology-specific attributes (optional for non-horology)
  calibre?: string;
  caseMaterial?: string;
  dialDescription?: string;
  complications?: string[];
  timegrapherReading?: {
    rate: string;      // e.g., "+1.8 s/d"
    amplitude: string; // e.g., "298°"
    beatError: string; // e.g., "0.1 ms"
  };

  // Numismatics-specific attributes
  coinAttributes?: {
    issuingAuthority: string;
    denomination: string;
    metalComposition: string;
    weightGrams: number;
    diameterMm: number;
    gradingService: 'NGC' | 'PCGS';
    grade: string;
    strikeScore: string;
    surfaceScore: string;
    dieAxis: string;
  };

  // Haute Joaillerie-specific attributes
  jewelryAttributes?: {
    maison: string;
    principalStones: string;
    totalCaratWeight: string;
    gemstoneOrigin: string;
    treatmentStatus: string;
    mountingMetal: string;
    hallmarks: string;
    certificationLab: 'SSEF' | 'Gübelin' | 'GIA';
    certificateNumber: string;
  };

  // Fine Art-specific attributes
  artAttributes?: {
    artist: string;
    mediumAndSupport: string;
    executionYear: string;
    signatureLocation: string;
    catalogueRaisonneRef: string;
    framingStatus: string;
    conservationNotes: string;
    exhibitionHistory: string;
  };
}

// Backward-compatible type alias
export type HorologicalLot = MarketplaceLot;

export const ALL_AUCTION_LOTS: MarketplaceLot[] = [
  // =========================================================================
  // GROUP A1: FINE HOROLOGY (6 LOTS)
  // =========================================================================
  {
    id: 'lot-01',
    slug: 'patek-philippe-calatrava-3520d',
    lotNumber: 1,
    title: '1968 Patek Philippe Calatrava Ref. 3520D Clous de Paris',
    marketplaceCategory: 'Fine Horology',
    category: 'Dress & Ultra-Thin',
    makerOrArtist: 'Patek Philippe',
    manufacturer: 'Patek Philippe',
    reference: 'Ref. 3520D',
    year: 1968,
    calibre: 'Calibre 175 (Manual-wind, 18 jewels, 21,600 vph, Gyromax balance)',
    caseMaterial: '18k Yellow Gold with Hobnail (Clous de Paris) Bezel',
    dimensions: '32.5mm diameter × 5.5mm depth',
    dialDescription: 'White lacquered porcelain dial, black Roman numerals, black blackened-gold baton hands.',
    complications: ['Ultra-Thin Dress Architecture', 'Gyromax Balance', 'Hobnail Bezel'],
    conditionGrade: 'Grade 9.4 (Excellent — Unpolished case, intact Swiss hallmarks)',
    timegrapherReading: {
      rate: '+2.1 s/d',
      amplitude: '292°',
      beatError: '0.1 ms',
    },
    provenanceSummary: 'Private collector, Geneva (1974–2026). Retained in vault storage; service papers dated 2021 by Stern Frères.',
    estimateLowUsd: 18000,
    estimateHighUsd: 26000,
    currentBidUsd: 22000,
    reserveStatus: 'Reserve Met',
    monogram: 'PP',
    monogramSubtitle: 'REF. 3520D — CAL. 175',
    status: 'live',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 14,
  },
  {
    id: 'lot-02',
    slug: 'audemars-piguet-royal-oak-5402st',
    lotNumber: 2,
    title: '1972 Audemars Piguet Royal Oak Ref. 5402ST "A-Series"',
    marketplaceCategory: 'Fine Horology',
    category: 'Dress & Ultra-Thin',
    makerOrArtist: 'Audemars Piguet',
    manufacturer: 'Audemars Piguet',
    reference: 'Ref. 5402ST (A-Series)',
    year: 1972,
    calibre: 'Calibre 2121 (Automatic, 21k gold rotor segment, 19,800 vph)',
    caseMaterial: 'Stainless steel with octagonal bezel and 8 hexagonal white gold screws',
    dimensions: '39.0mm diameter × 7.0mm depth',
    dialDescription: 'Dark charcoal Petite Tapisserie guilloché dial, applied luminous baton markers, AP logo at 6 o\'clock.',
    complications: ['Ultra-Thin Automatic', 'Integrated Bracelet', 'Date aperture'],
    conditionGrade: 'Grade 9.1 (Very Fine — Crisp bezel bevels, original Gay Frères clasp)',
    timegrapherReading: {
      rate: '+3.4 s/d',
      amplitude: '284°',
      beatError: '0.2 ms',
    },
    provenanceSummary: 'Purchased Milan 1973; estate acquisition 2018. Audemars Piguet heritage extract confirmed.',
    estimateLowUsd: 85000,
    estimateHighUsd: 120000,
    currentBidUsd: 95000,
    reserveStatus: 'Reserve Met',
    monogram: 'AP',
    monogramSubtitle: 'REF. 5402ST — CAL. 2121',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
  },
  {
    id: 'lot-03',
    slug: 'rolex-daytona-6239-paul-newman',
    lotNumber: 3,
    title: '1965 Rolex Daytona Cosmograph Ref. 6239 "Paul Newman"',
    marketplaceCategory: 'Fine Horology',
    category: 'Chronographs',
    makerOrArtist: 'Rolex',
    manufacturer: 'Rolex',
    reference: 'Ref. 6239',
    year: 1965,
    calibre: 'Valjoux 722 (Manual-wind chronograph, 17 jewels, column wheel, 18,000 vph)',
    caseMaterial: 'Stainless steel, polished pump pushers, engraved tachymeter bezel',
    dimensions: '36.5mm diameter × 12.0mm depth',
    dialDescription: 'Exotic three-color cream dial, black step sub-dials with art-deco square numerals, red Daytona signature.',
    complications: ['Column-Wheel Chronograph', 'Tachymeter Scale', 'Tri-Compax Register'],
    conditionGrade: 'Grade 9.6 (Exceptional Museum Grade — Singer step-plate verified, matching tritium patina)',
    timegrapherReading: {
      rate: '+1.2 s/d',
      amplitude: '305°',
      beatError: '0.0 ms',
    },
    provenanceSummary: 'Consigned from private Nordic horological trust. Single family custody since 1968 delivery.',
    estimateLowUsd: 175000,
    estimateHighUsd: 250000,
    currentBidUsd: 210000,
    reserveStatus: 'Reserve Met',
    monogram: 'ROLEX',
    monogramSubtitle: 'REF. 6239 — CAL. 722',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
  },
  {
    id: 'lot-04',
    slug: 'omega-speedmaster-ck-2915-1',
    lotNumber: 4,
    title: '1957 Omega Speedmaster Ref. CK 2915-1 "Broad Arrow"',
    marketplaceCategory: 'Fine Horology',
    category: 'Historic Divers',
    makerOrArtist: 'Omega',
    manufacturer: 'Omega',
    reference: 'Ref. CK 2915-1',
    year: 1957,
    calibre: 'Calibre 321 (Lemania 2310 base, lateral clutch column-wheel chronograph, 18,000 vph)',
    caseMaterial: 'Stainless steel, straight lugs, no crown guards, engraved Base-1000 steel bezel',
    dimensions: '38.5mm diameter × 13.0mm depth',
    dialDescription: 'Matte black dial, radium indices, polished steel Broad Arrow hour and minute hands.',
    complications: ['Base-1000 Tachymeter', 'Lateral Clutch Chronograph', 'First Generation Broad Arrow'],
    conditionGrade: 'Grade 8.9 (Historic Patina — Unpolished lugs, original radium radiation verified)',
    timegrapherReading: {
      rate: '+4.8 s/d',
      amplitude: '270°',
      beatError: '0.3 ms',
    },
    provenanceSummary: 'Delivered to Chile October 1957 per Omega Museum extract. Acquired via private trade 2012.',
    estimateLowUsd: 110000,
    estimateHighUsd: 160000,
    currentBidUsd: 125000,
    reserveStatus: 'Reserve Met',
    monogram: 'Ω',
    monogramSubtitle: 'REF. CK 2915-1 — CAL. 321',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
  },
  {
    id: 'lot-05',
    slug: 'cartier-tank-cintree-dual-time',
    lotNumber: 5,
    title: '1928 Cartier Tank Cintrée Dual-Time Platinum',
    marketplaceCategory: 'Fine Horology',
    category: 'Complications',
    makerOrArtist: 'Cartier',
    manufacturer: 'Cartier',
    reference: 'Tank Cintrée Dual-Time (1928)',
    year: 1928,
    calibre: 'Twin European Watch & Clock Co. (EWC) manual-wind mechanical calibres with dual winding crowns',
    caseMaterial: 'Platinum 950 with twin faceted sapphire cabochon crowns',
    dimensions: '23.0mm width × 46.0mm curved length × 6.8mm depth',
    dialDescription: 'Dual independent silvered guilloché dials, painted Roman numerals, blued steel Breguet hands.',
    complications: ['Dual Timezone Architecture', 'Curved Anatomical Case', 'Twin Independent Calibres'],
    conditionGrade: 'Grade 9.2 (Museum Conservation — Original dials unrestored, intact French platinum eagle stamps)',
    timegrapherReading: {
      rate: '+5.2 s/d',
      amplitude: '265°',
      beatError: '0.4 ms',
    },
    provenanceSummary: 'Sold Paris 1929; recorded in Cartier London archival ledger. European aristocratic estate.',
    estimateLowUsd: 220000,
    estimateHighUsd: 320000,
    currentBidUsd: 245000,
    reserveStatus: 'Reserve Met',
    monogram: 'CARTIER',
    monogramSubtitle: 'REF. TANK CINTRÉE (1928)',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
  },
  {
    id: 'lot-06',
    slug: 'a-lange-sohne-datograph-403-035',
    lotNumber: 6,
    title: '1999 A. Lange & Söhne Datograph Ref. 403.035 Platinum',
    marketplaceCategory: 'Fine Horology',
    category: 'Complications',
    makerOrArtist: 'A. Lange & Söhne',
    manufacturer: 'A. Lange & Söhne',
    reference: 'Ref. 403.035',
    year: 1999,
    calibre: 'Calibre L951.1 (In-house manual-wind flyback chronograph, 405 components, Glashütte stripes)',
    caseMaterial: 'Platinum 950, sapphire display caseback, rectangular date pusher at 10 o\'clock',
    dimensions: '39.0mm diameter × 12.8mm depth',
    dialDescription: 'Deep black solid silver dial, subsidiary silver registers, outsize double date aperture, tachymeter scale.',
    complications: ['Flyback Chronograph', 'Outsize Jumping Date', 'Precision Jumping Minute Counter'],
    conditionGrade: 'Grade 9.8 (Mint Collector Condition — Complete with original platinum deployant clasp and Glashütte box)',
    timegrapherReading: {
      rate: '+0.8 s/d',
      amplitude: '312°',
      beatError: '0.0 ms',
    },
    provenanceSummary: 'Originally supplied through Wempe Hamburg December 1999. Serviced by Lange Glashütte factory in 2023.',
    estimateLowUsd: 78000,
    estimateHighUsd: 105000,
    currentBidUsd: 84000,
    reserveStatus: 'Reserve Met',
    monogram: 'ALS',
    monogramSubtitle: 'REF. 403.035 — CAL. L951.1',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
  },

  // =========================================================================
  // GROUP A2: RARE COINS & NUMISMATICS (3 LOTS)
  // =========================================================================
  {
    id: 'lot-07',
    slug: 'athenian-silver-tetradrachm-owl-460bc',
    lotNumber: 7,
    title: '460–455 BC Athenian Classical Silver Tetradrachm (Owl of Athena)',
    marketplaceCategory: 'Rare Coins & Numismatics',
    category: 'Ancient Classical',
    makerOrArtist: 'Classical Athens',
    manufacturer: 'Classical Athens Mint',
    reference: 'HGC 4, 1597; Kroll 8',
    year: 'c. 460–455 BC',
    dimensions: '24.5mm diameter × 4.8mm thick',
    conditionGrade: 'NGC Ancients Choice VF (Strike 5/5, Surface 4/5)',
    provenanceSummary: 'Ex-Geneva private numismatic collection (assembled 1952–1978). Documented Swiss customs clearance 1981.',
    estimateLowUsd: 14000,
    estimateHighUsd: 20000,
    currentBidUsd: 16500,
    reserveStatus: 'Reserve Met',
    monogram: 'ATH',
    monogramSubtitle: 'NGC CHOICE VF • STRIKE 5/5',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
    coinAttributes: {
      issuingAuthority: 'Classical Athens (Attica)',
      denomination: 'Silver Tetradrachm',
      metalComposition: 'Silver (Ar 0.985)',
      weightGrams: 17.20,
      diameterMm: 24.5,
      gradingService: 'NGC',
      grade: 'Choice VF',
      strikeScore: '5/5',
      surfaceScore: '4/5',
      dieAxis: '3 h',
    },
  },
  {
    id: 'lot-08',
    slug: 'charles-i-oxford-gold-triple-unite-1642',
    lotNumber: 8,
    title: '1642 King Charles I Oxford Mint Gold Triple Unite (£3)',
    marketplaceCategory: 'Rare Coins & Numismatics',
    category: 'Early Modern European',
    makerOrArtist: 'Kingdom of England',
    manufacturer: 'Oxford Civil War Royalist Mint',
    reference: 'S.3204; Brooker 832; North 2382',
    year: 1642,
    dimensions: '44.0mm diameter × 2.2mm depth',
    conditionGrade: 'PCGS AU55 (Extremely Rare British Civil War Issue)',
    provenanceSummary: 'Duke of Beaufort estate sale, Sotheby\'s 1903; private Swiss custody since 1984. Spink & Son provenance tags intact.',
    estimateLowUsd: 90000,
    estimateHighUsd: 130000,
    currentBidUsd: 105000,
    reserveStatus: 'Reserve Met',
    monogram: 'Oxf',
    monogramSubtitle: 'PCGS AU55 • EXTREMELY RARE',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
    coinAttributes: {
      issuingAuthority: 'Kingdom of England (King Charles I)',
      denomination: 'Triple Unite (£3)',
      metalComposition: 'Crown Gold (Au 0.917)',
      weightGrams: 27.12,
      diameterMm: 44.0,
      gradingService: 'PCGS',
      grade: 'AU55',
      strikeScore: 'Well Struck on Broad Flann',
      surfaceScore: 'Lustrous AU',
      dieAxis: '12 h',
    },
  },
  {
    id: 'lot-09',
    slug: 'mughal-jahangir-gold-zodiac-mohur-leo-1619',
    lotNumber: 9,
    title: '1619 Mughal Emperor Jahangir Gold Zodiac Mohur (Sign of Leo)',
    marketplaceCategory: 'Rare Coins & Numismatics',
    category: 'Historic Asian & Mughal',
    makerOrArtist: 'Mughal Empire',
    manufacturer: 'Agra Imperial Mint',
    reference: 'KM 180.11; BMC Mughal 342',
    year: 'AH 1028 / RY 14 (1619 AD)',
    dimensions: '21.0mm diameter × 2.8mm depth',
    conditionGrade: 'NGC Choice Fine (Crisp Lion Radiate Strike)',
    provenanceSummary: 'Discovered in private Anglo-Indian trust archive; certified by British Museum numismatic bulletin (1927 archival extract).',
    estimateLowUsd: 180000,
    estimateHighUsd: 260000,
    currentBidUsd: 215000,
    reserveStatus: 'Reserve Met',
    monogram: 'MUG',
    monogramSubtitle: 'ZODIAC LEO • AGRA MINT 1619',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
    coinAttributes: {
      issuingAuthority: 'Mughal Empire (Emperor Nur-ud-din Jahangir)',
      denomination: 'Gold Mohur (Constellation Leo)',
      metalComposition: 'Fine Gold (Au 0.990)',
      weightGrams: 10.95,
      diameterMm: 21.0,
      gradingService: 'NGC',
      grade: 'Choice Fine',
      strikeScore: 'Bold Radiate Mane',
      surfaceScore: 'Intact Calligraphy',
      dieAxis: '8 h',
    },
  },

  // =========================================================================
  // GROUP A3: HAUTE JOAILLERIE (3 LOTS)
  // =========================================================================
  {
    id: 'lot-10',
    slug: 'cartier-art-deco-colombian-emerald-sautoir-1925',
    lotNumber: 10,
    title: '1925 Art Deco Colombian Emerald & Diamond Sautoir by Cartier Paris',
    marketplaceCategory: 'Haute Joaillerie',
    category: 'Art Deco Jewels',
    makerOrArtist: 'Cartier Paris',
    manufacturer: 'Cartier Paris Haute Joaillerie Workshop',
    reference: 'Cartier Paris Archive No. 8412-A',
    year: 1925,
    dimensions: '82.0cm wearable sautoir length with detachable pendant drop',
    conditionGrade: 'Museum Conservation Grade (Original Cartier Fitted Presentation Box)',
    provenanceSummary: 'Commissioned Paris 1925; gifted to European aristocratic family; Cartier archival sketch and ledger confirmed.',
    estimateLowUsd: 350000,
    estimateHighUsd: 500000,
    currentBidUsd: 390000,
    reserveStatus: 'Reserve Met',
    monogram: 'CARTIER',
    monogramSubtitle: '28.40CT COLOMBIAN • SSEF CERT',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
    jewelryAttributes: {
      maison: 'Cartier Paris',
      principalStones: '28.40 carats Colombian Emeralds (Octagonal & Sugarloaf cabochons) & 18.50 carats Old European & Baguette Diamonds',
      totalCaratWeight: '46.90 ctw',
      gemstoneOrigin: 'Muzo & Chivor Mines, Colombia',
      treatmentStatus: 'Minor Cedar Oil Clarity Enhancement (SSEF Report No. 129482)',
      mountingMetal: 'Platinum 950 with French Tête de Chien assay marks',
      hallmarks: 'Signed Cartier Paris, numbered, French platinum hallmarks',
      certificationLab: 'SSEF',
      certificateNumber: 'SSEF-129482',
    },
  },
  {
    id: 'lot-11',
    slug: 'van-cleef-burmese-pigeons-blood-ruby-ring-5ct',
    lotNumber: 11,
    title: '5.12ct Unheated Burmese "Pigeon\'s Blood" Ruby Ring by Van Cleef & Arpels',
    marketplaceCategory: 'Haute Joaillerie',
    category: 'Signed Masterpiece Jewellery',
    makerOrArtist: 'Van Cleef & Arpels',
    manufacturer: 'Van Cleef & Arpels New York',
    reference: 'VCA NY Special Order No. 41908',
    year: 1958,
    dimensions: 'Ring size 6.0 US (resizable) × 18.5mm cluster head',
    conditionGrade: 'Exceptional (Pristine Setting, Original VCA Velvet Box)',
    provenanceSummary: 'Private collection, Beverly Hills & Geneva. Exhibited at 1962 VCA Retrospective; Gübelin gemmological monography included.',
    estimateLowUsd: 450000,
    estimateHighUsd: 650000,
    currentBidUsd: 520000,
    reserveStatus: 'Reserve Met',
    monogram: 'VCA',
    monogramSubtitle: '5.12CT BURMA NO-HEAT • GÜBELIN',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
    jewelryAttributes: {
      maison: 'Van Cleef & Arpels',
      principalStones: '5.12ct Cushion-Cut Natural Burmese Ruby (Pigeon\'s Blood) flanked by 1.40ct tapered baguette diamonds (F/VVS)',
      totalCaratWeight: '6.52 ctw',
      gemstoneOrigin: 'Mogok Valley, Burma (Myanmar)',
      treatmentStatus: 'No Indications of Thermal Treatment (Unheated) — Gübelin Report 21040089',
      mountingMetal: 'Platinum 950 and 18k Yellow Gold claw prongs',
      hallmarks: 'Signed VCA, numbered, maker\'s mark',
      certificationLab: 'Gübelin',
      certificateNumber: 'GUB-21040089',
    },
  },
  {
    id: 'lot-12',
    slug: 'natural-basra-pearl-three-strand-choker',
    lotNumber: 12,
    title: 'Natural Basra Saltwater Pearl Three-Strand Choker with Diamond Clasp',
    marketplaceCategory: 'Haute Joaillerie',
    category: 'Natural Pearls',
    makerOrArtist: 'Meister Geneva',
    manufacturer: 'Meister Fine Jewels Atelier, Zurich',
    reference: 'Meister Heirloom Commission No. 714',
    year: 1910,
    dimensions: 'Strand lengths: 36.5cm, 39.0cm, 42.0cm; pearl diameter 4.8mm to 9.6mm',
    conditionGrade: 'Exceptional Luster (Uniform Cream-Rose Orient, Unrestored Silk Knotting)',
    provenanceSummary: 'Royal provenance, Middle Eastern diplomatic estate; single custodian in Geneva vault custody since 1971.',
    estimateLowUsd: 120000,
    estimateHighUsd: 180000,
    currentBidUsd: 140000,
    reserveStatus: 'Reserve Met',
    monogram: 'PRL',
    monogramSubtitle: '216 BASRA SALTWATER • GIA CERT',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
    jewelryAttributes: {
      maison: 'Meister Geneva',
      principalStones: '216 Natural Saltwater Pearls (Pinctada radiata) graduating from 4.8mm to 9.6mm; clasp set with 3.20ct marquise and brilliant diamonds',
      totalCaratWeight: '3.20 ctw diamonds + 216 pearls',
      gemstoneOrigin: 'Persian Gulf (Basra Waters)',
      treatmentStatus: 'Natural Saltwater Pearls with No Artificial Coloration (GIA Monograph Report 521190432)',
      mountingMetal: 'Platinum 950 and 18k White Gold clasp tongue',
      hallmarks: 'Swiss St. Bernard dog hallmarks, Meister maker\'s mark',
      certificationLab: 'GIA',
      certificateNumber: 'GIA-521190432',
    },
  },

  // =========================================================================
  // GROUP A4: FINE ART (3 LOTS)
  // =========================================================================
  {
    id: 'lot-13',
    slug: 'rembrandt-studio-portrait-of-a-scholar-1638',
    lotNumber: 13,
    title: 'Studio of Rembrandt van Rijn — Portrait of a Scholar in a Fur-Trimmed Cloak',
    marketplaceCategory: 'Fine Art',
    category: 'Old Master Paintings',
    makerOrArtist: 'Studio of Rembrandt van Rijn',
    manufacturer: 'Studio of Rembrandt van Rijn (Amsterdam)',
    reference: 'Bredius/Corpus IV Compendium Ref. S-1638-04',
    year: 1638,
    dimensions: '68.5cm height × 54.0cm width (27.0 in × 21.3 in)',
    conditionGrade: 'Fine Conserved State (Stable Support, Historical Varnish Layer)',
    provenanceSummary: 'Collection of Baron von der Heydt, Berlin (1892); acquired Zurich 1954; dendrochronological analysis by Prof. Klein confirms 1634 oak felling date.',
    estimateLowUsd: 280000,
    estimateHighUsd: 420000,
    currentBidUsd: 310000,
    reserveStatus: 'Reserve Met',
    monogram: 'RMB',
    monogramSubtitle: 'OIL ON OAK PANEL • 1638',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
    artAttributes: {
      artist: 'Studio of Rembrandt van Rijn (1606–1669)',
      mediumAndSupport: 'Oil on single-plank Baltic oak panel with bevelled reverse edges',
      executionYear: 'Circa 1638',
      signatureLocation: 'Traces of signature and date upper right (RHL van Rijn / 1638)',
      catalogueRaisonneRef: 'Corpus of Rembrandt Paintings, Vol. IV, Addendum S-04',
      framingStatus: '17th-Century Dutch ebonised ripple-moulded fruitwood frame',
      conservationNotes: 'Cleaned and revarnished 2018 by Rijksmuseum-accredited conservator. Minimal retouching confined to panel join.',
      exhibitionHistory: 'Gemäldegalerie Berlin Loan Exhibition 1924; Zurich Kunsthaus 1958',
    },
  },
  {
    id: 'lot-14',
    slug: 'edgar-degas-danseuse-a-la-barre-1894',
    lotNumber: 14,
    title: 'Edgar Degas — Danseuse à la Barre (Pastel & Charcoal on Paper, 1894)',
    marketplaceCategory: 'Fine Art',
    category: 'Impressionist & Modern',
    makerOrArtist: 'Edgar Degas',
    manufacturer: 'Atelier Edgar Degas, Paris',
    reference: 'Lemoisne Catalogue Raisonné No. 1184',
    year: 1894,
    dimensions: '48.0cm height × 38.0cm width (18.9 in × 15.0 in)',
    conditionGrade: 'Exceptional (Luminous Untrimmed Paper, Intact Atelier Red Wax Stamp)',
    provenanceSummary: 'Atelier Degas stamp lower left; Galerie Durand-Ruel, Paris (Stock No. 4109); Private Swiss collection, Geneva since 1968.',
    estimateLowUsd: 220000,
    estimateHighUsd: 340000,
    currentBidUsd: 265000,
    reserveStatus: 'Reserve Met',
    monogram: 'DEGAS',
    monogramSubtitle: 'PASTEL ON PAPER • 1894',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
    artAttributes: {
      artist: 'Edgar Degas (1834–1917)',
      mediumAndSupport: 'Pastel and charcoal on heavy wove cream paper laid down on board by the artist',
      executionYear: '1894',
      signatureLocation: 'Stamped with red artist\'s signature stamp lower left (Lugt 658)',
      catalogueRaisonneRef: 'P.A. Lemoisne, Degas et son oeuvre, Paris, 1946, Vol. III, No. 1184',
      framingStatus: 'Bespoke museum-glazed giltwood frame with Optium anti-reflective acrylic',
      conservationNotes: 'Sheet in fine state of preservation; pastel pigment completely stable and unfaded.',
      exhibitionHistory: 'Galerie Durand-Ruel 1918 (4th Degas Sale); Musée de l\'Orangerie Paris 1937',
    },
  },
  {
    id: 'lot-15',
    slug: 'helen-frankenthaler-amber-wave-1958',
    lotNumber: 15,
    title: 'Helen Frankenthaler — Amber Wave (Soak-Stain Pigment on Canvas, 1958)',
    marketplaceCategory: 'Fine Art',
    category: 'Post-War & Contemporary',
    makerOrArtist: 'Helen Frankenthaler',
    manufacturer: 'Helen Frankenthaler Studio, New York',
    reference: 'Frankenthaler Foundation Archive Reference HF-1958-028',
    year: 1958,
    dimensions: '142.0cm height × 115.0cm width (55.9 in × 45.3 in)',
    conditionGrade: 'Pristine (Raw Unprimed Duck Canvas Untreated, Original Keyable Stretchers)',
    provenanceSummary: 'André Emmerich Gallery, New York (1959); Estate of Dr. Leonard Bernstein; Exhibited Whitney Museum of American Art 1969.',
    estimateLowUsd: 380000,
    estimateHighUsd: 550000,
    currentBidUsd: 425000,
    reserveStatus: 'Reserve Met',
    monogram: 'HF',
    monogramSubtitle: 'SOAK-STAIN CANVAS • 1958',
    status: 'upcoming',
    provisionalNotice: 'Archival specimen photograph currently undergoing provenance rights review.',
    bidCount: 0,
    artAttributes: {
      artist: 'Helen Frankenthaler (1928–2011)',
      mediumAndSupport: 'Oil and dilute acrylic soak-stain on raw unprimed cotton duck canvas',
      executionYear: '1958',
      signatureLocation: 'Signed and dated Frankenthaler \'58 on canvas overlap on reverse',
      catalogueRaisonneRef: 'Forthcoming Helen Frankenthaler Catalogue Raisonné of Paintings (1952–2001)',
      framingStatus: 'Natural waxed American walnut floating gallery strip frame',
      conservationNotes: 'Raw canvas clean and taut; unvarnished surface unblemished with vivid ochre and sienna saturation.',
      exhibitionHistory: 'André Emmerich Gallery 1960; Whitney Museum 1969; Venice Biennale collateral 1995',
    },
  },
];

// Preserves backward compatibility: WATCH_LOTS contains the 6 fine horology timepieces
export const WATCH_LOTS: MarketplaceLot[] = ALL_AUCTION_LOTS.filter(
  (lot) => lot.marketplaceCategory === 'Fine Horology'
);

// Backward-compatible category array for horology subcategories
export const CATEGORIES = [
  'All Specimens',
  'Chronographs',
  'Dress & Ultra-Thin',
  'Historic Divers',
  'Complications',
] as const;

// =========================================================================
// PAST AUCTION RESULTS ARCHIVE (FEATURE A)
// =========================================================================
export type PastSaleOutcome = 'sold' | 'bought_in' | 'withdrawn';

export interface PastAuctionLot {
  id: string;
  slug?: string;
  lotNumber: number;
  sessionNumber: number;
  sessionTitle: string;
  saleDate: string; // ISO date string or formatted date
  title: string;
  marketplaceCategory: MarketplaceCategory;
  category: string;
  makerOrArtist: string;
  reference: string;
  year: number | string;
  estimateLowUsd: number;
  estimateHighUsd: number;
  realizedPriceUsd: number | null; // Hammer + Buyer's Premium (null if unsold/withdrawn)
  hammerPriceUsd: number | null;
  saleOutcome: PastSaleOutcome;
  bidsCount: number;
  winningPaddle?: string;
  provenanceSummary: string;
  monogram: string;
  monogramSubtitle: string;
}

export const PAST_AUCTION_LOTS: PastAuctionLot[] = [
  {
    id: 'past-01',
    slug: 'patek-philippe-calatrava-3520d',
    lotNumber: 12,
    sessionNumber: 18,
    sessionTitle: 'Session No. 18 • September Sovereign Evening Sale',
    saleDate: '2026-09-24',
    title: '1974 Patek Philippe Calatrava Ref. 3520/1 in 18k White Gold',
    marketplaceCategory: 'Fine Horology',
    category: 'Dress & Ultra-Thin',
    makerOrArtist: 'Patek Philippe',
    reference: 'Ref. 3520/1',
    year: 1974,
    estimateLowUsd: 20000,
    estimateHighUsd: 30000,
    realizedPriceUsd: 35000,
    hammerPriceUsd: 28000,
    saleOutcome: 'sold',
    bidsCount: 16,
    winningPaddle: '#3109',
    provenanceSummary: 'Swiss private collection; complete with original certificate of origin dated November 1974.',
    monogram: 'PP',
    monogramSubtitle: 'REF. 3520/1 • 18K WG',
  },
  {
    id: 'past-02',
    slug: 'audemars-piguet-royal-oak-5402st',
    lotNumber: 24,
    sessionNumber: 18,
    sessionTitle: 'Session No. 18 • September Sovereign Evening Sale',
    saleDate: '2026-09-24',
    title: '1973 Audemars Piguet Royal Oak "Jumbo" Ref. 5402ST B-Series',
    marketplaceCategory: 'Fine Horology',
    category: 'Dress & Ultra-Thin',
    makerOrArtist: 'Audemars Piguet',
    reference: 'Ref. 5402ST',
    year: 1973,
    estimateLowUsd: 90000,
    estimateHighUsd: 130000,
    realizedPriceUsd: 143750,
    hammerPriceUsd: 115000,
    saleOutcome: 'sold',
    bidsCount: 22,
    winningPaddle: '#8801',
    provenanceSummary: 'Purchased by original owner at Milan boutique; serviced by Le Brassus restoration workshop in 2022.',
    monogram: 'AP',
    monogramSubtitle: '5402ST • B-SERIES',
  },
  {
    id: 'past-03',
    lotNumber: 31,
    sessionNumber: 18,
    sessionTitle: 'Session No. 18 • September Sovereign Evening Sale',
    saleDate: '2026-09-24',
    title: 'Rolex Cosmograph Daytona "Paul Newman" Ref. 6239 Tricolor',
    marketplaceCategory: 'Fine Horology',
    category: 'Chronographs',
    makerOrArtist: 'Rolex',
    reference: 'Ref. 6239',
    year: 1969,
    estimateLowUsd: 180000,
    estimateHighUsd: 250000,
    realizedPriceUsd: 243750,
    hammerPriceUsd: 195000,
    saleOutcome: 'sold',
    bidsCount: 28,
    winningPaddle: '#4102',
    provenanceSummary: 'Single-family ownership since retail delivery in Rome in 1970; unpolished stainless steel case.',
    monogram: 'RLX',
    monogramSubtitle: '6239 • TRICOLOR EXOTIC',
  },
  {
    id: 'past-04',
    slug: 'athenian-silver-tetradrachm-owl-460bc',
    lotNumber: 8,
    sessionNumber: 18,
    sessionTitle: 'Session No. 18 • September Sovereign Evening Sale',
    saleDate: '2026-09-24',
    title: 'Classical Athenian Silver Tetradrachm Owl (Attic Standard, c. 450 BC)',
    marketplaceCategory: 'Rare Coins & Numismatics',
    category: 'Ancient Classical',
    makerOrArtist: 'Classical Athens Mint',
    reference: 'SNG Copenhagen 31',
    year: 'c. 450 BC',
    estimateLowUsd: 85000,
    estimateHighUsd: 120000,
    realizedPriceUsd: 131250,
    hammerPriceUsd: 105000,
    saleOutcome: 'sold',
    bidsCount: 19,
    winningPaddle: '#7204',
    provenanceSummary: 'Ex-Cabinet des Médailles collection duplicate; full thick flan with complete Athena crest and reverse owl.',
    monogram: 'AR',
    monogramSubtitle: 'TETRADRACHM • NGC CH AU',
  },
  {
    id: 'past-05',
    lotNumber: 15,
    sessionNumber: 18,
    sessionTitle: 'Session No. 18 • September Sovereign Evening Sale',
    saleDate: '2026-09-24',
    title: 'Roman Empire Gold Aureus of Augustus (Lugdunum Mint, 2 BC)',
    marketplaceCategory: 'Rare Coins & Numismatics',
    category: 'Ancient Classical',
    makerOrArtist: 'Imperial Roman Mint',
    reference: 'RIC I 207',
    year: '2 BC',
    estimateLowUsd: 60000,
    estimateHighUsd: 90000,
    realizedPriceUsd: null,
    hammerPriceUsd: null,
    saleOutcome: 'bought_in',
    bidsCount: 5,
    provenanceSummary: 'European aristocratic cabinet formed 1910–1935. Reserve not met on the saleroom floor.',
    monogram: 'AV',
    monogramSubtitle: 'AUGUSTUS AUREUS • RIC 207',
  },
  {
    id: 'past-06',
    slug: 'cartier-art-deco-colombian-emerald-sautoir-1925',
    lotNumber: 42,
    sessionNumber: 17,
    sessionTitle: 'Session No. 17 • July High Summer Curatorial Auction',
    saleDate: '2026-07-16',
    title: 'Cartier Paris Art Deco Colombian Emerald & Diamond Sautoir (1925)',
    marketplaceCategory: 'Haute Joaillerie',
    category: 'Art Deco & Signed Jewels',
    makerOrArtist: 'Cartier Paris',
    reference: 'Cartier Archives #4892',
    year: 1925,
    estimateLowUsd: 320000,
    estimateHighUsd: 500000,
    realizedPriceUsd: 525000,
    hammerPriceUsd: 420000,
    saleOutcome: 'sold',
    bidsCount: 31,
    winningPaddle: '#1092',
    provenanceSummary: 'Acquired in Paris 1926; French assay platinum marks; SSEF cert verifying Colombian origin.',
    monogram: 'CP',
    monogramSubtitle: '14.82CT EMERALD • 1925',
  },
  {
    id: 'past-07',
    lotNumber: 48,
    sessionNumber: 17,
    sessionTitle: 'Session No. 17 • July High Summer Curatorial Auction',
    saleDate: '2026-07-16',
    title: 'Van Cleef & Arpels Mystery-Set Ruby & Diamond "Feuille" Brooch (1938)',
    marketplaceCategory: 'Haute Joaillerie',
    category: 'Art Deco & Signed Jewels',
    makerOrArtist: 'Van Cleef & Arpels',
    reference: 'VCA Paris #39012',
    year: 1938,
    estimateLowUsd: 240000,
    estimateHighUsd: 360000,
    realizedPriceUsd: 368750,
    hammerPriceUsd: 295000,
    saleOutcome: 'sold',
    bidsCount: 18,
    winningPaddle: '#5510',
    provenanceSummary: 'Documented in V2 Heritage collection; Serti Mystérieux calibré-cut Burmese rubies with Gübelin analysis.',
    monogram: 'VCA',
    monogramSubtitle: 'MYSTERY-SET RUBY • 1938',
  },
  {
    id: 'past-08',
    slug: 'rembrandt-studio-portrait-of-a-scholar-1638',
    lotNumber: 60,
    sessionNumber: 17,
    sessionTitle: 'Session No. 17 • July High Summer Curatorial Auction',
    saleDate: '2026-07-16',
    title: 'Studio of Rembrandt van Rijn: Portrait of a Bearded Elder (1642)',
    marketplaceCategory: 'Fine Art',
    category: 'Old Masters',
    makerOrArtist: 'Studio of Rembrandt van Rijn',
    reference: 'Hofstede de Groot #315',
    year: 1642,
    estimateLowUsd: 190000,
    estimateHighUsd: 300000,
    realizedPriceUsd: null,
    hammerPriceUsd: null,
    saleOutcome: 'withdrawn',
    bidsCount: 0,
    provenanceSummary: 'Withdrawn by mutual agreement prior to session opening for museum exhibition loan.',
    monogram: 'RR',
    monogramSubtitle: 'OIL ON OAK • 1642',
  },
  {
    id: 'past-09',
    slug: 'edgar-degas-danseuse-ajustant-son-chausson-1894',
    lotNumber: 65,
    sessionNumber: 17,
    sessionTitle: 'Session No. 17 • July High Summer Curatorial Auction',
    saleDate: '2026-07-16',
    title: 'Edgar Degas: Danseuse au Repos (Pastel on Paper, 1892)',
    marketplaceCategory: 'Fine Art',
    category: 'Impressionist & Modern',
    makerOrArtist: 'Edgar Degas',
    reference: 'Lemoisne Vol. III, #1120',
    year: 1892,
    estimateLowUsd: 450000,
    estimateHighUsd: 650000,
    realizedPriceUsd: 687500,
    hammerPriceUsd: 550000,
    saleOutcome: 'sold',
    bidsCount: 24,
    winningPaddle: '#8801',
    provenanceSummary: 'Collection Durand-Ruel; private Swiss foundation since 1954; museum exhibition history confirmed.',
    monogram: 'ED',
    monogramSubtitle: 'PASTEL ON PAPER • 1892',
  },
];
