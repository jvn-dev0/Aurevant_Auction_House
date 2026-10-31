# ChronoBid Vault — Multi-Category Creative Direction & Visual Architecture
## Institutional Design System for Global Cultural Masterworks

> **Project Name:** ChronoBid Vault  
> **Status:** Phase 2.1 Formally Accepted Prototype Baseline | Phase 3 Architecture Draft & Owner Decisions Provisional  
> **Creative Thesis:** *"Extraordinary objects deserve an extraordinary digital experience."*  
> **Marketplace Scope:** Multi-Category Collectible Auction House (Paintings, Coins, Rare Books, Horology, Haute Joaillerie, Antiquities)  
> **Governance:** Zero application code modified | Zero dependencies installed | Complete isolation in `experiments/cinematic-homepage-v2/`  
> **Date:** 27 October 2026

---

## 1. Governance & Boundary Affirmation

1. **Inviolability of Accepted Phase 2.1 Prototype:** The accepted clickable prototype (`app/*`, `components/*`, `lib/*`, `package.json`, `tailwind.config.ts`) remains 100% untouched and operative.
2. **Preservation of Experiment V1:** The initial single-lot experiment at `experiments/cinematic-homepage/index.html` is strictly preserved.
3. **Dedicated Isolated Experiment Space:** All new multi-category design implementations reside exclusively within `experiments/cinematic-homepage-v2/` and its static mirror `public/experiments/cinematic-homepage-v2/`.
4. **Zero Project Dependencies:** No npm packages, external build scripts, or third-party dependencies are introduced into the project.
5. **Phase 3 & Phase 4 Status:** Phase 3 backend implementation, database schemas, real-time live auction engines, and Phase 4 production infrastructure remain strictly **UNAUTHORIZED (NO-GO)**.

---

## 2. Institutional Brand Identity: Confirmed Brand Colour Palette (Owner Locked)

ChronoBid Vault is an institutional auction marketplace, not a watch boutique. To maintain absolute brand coherence across radically different physical media—from ancient Cycladic marble to 17th-century oil on panel, to high-beat Swiss balance wheels—the visual architecture is locked to the owner's confirmed six-colour palette:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       CONFIRMED OWNER BRAND COLOUR PALETTE                                             │
├────────────────────┬───────────┬───────────────────────────────────┬───────────────────────────────────────────────────┤
│ Token Name         │ Hex Code  │ Core Semantic Role                │ Strict Application Rule                           │
├────────────────────┼───────────┼───────────────────────────────────┼───────────────────────────────────────────────────┤
│ Charcoal Black     │ #111312   │ Main visual foundation            │ Primary dark canvas across all curatorial sections│
│ Forest Green       │ #183D30   │ Selected brand surfaces           │ Masthead banner, transitions, badge grounding     │
│ Crimson Red        │ #A61935   │ Highlights & selected actions     │ Applied sparingly: hammer alert, live bid button  │
│ Antique Gold       │ #C5A059   │ Refined details & accents         │ Dividers, hairline borders, currency ask HUD      │
│ Warm Ivory         │ #F4F0E8   │ Readable primary text             │ Display titles, primary editorial typography      │
│ Muted Stone        │ #A7A39A   │ Secondary text                    │ Supporting metadata, spec labels, captions        │
└────────────────────┴───────────┴───────────────────────────────────┴───────────────────────────────────────────────────┘
```

### Strict Brand Invariants Across Every Category
- **Owner Confirmed Palette Locked:** Charcoal Black (`#111312`), Forest Green (`#183D30`), Crimson Red (`#A61935`), Antique Gold (`#C5A059`), Warm Ivory (`#F4F0E8`), and Muted Stone (`#A7A39A`). Do not substitute or alter without explicit written owner authorization.
- **Contrast & Legibility Invariants:**
  - Warm Ivory (`#F4F0E8`) on Charcoal Black (`#111312`): 16.3:1 contrast (exceeds WCAG AAA 7:1)
  - Muted Stone (`#A7A39A`) on Charcoal Black (`#111312`): 7.46:1 contrast (exceeds WCAG AAA 7:1)
  - Antique Gold (`#C5A059`) on Charcoal Black (`#111312`): 7.37:1 contrast (exceeds WCAG AAA 7:1)
  - Warm Ivory (`#F4F0E8`) on Forest Green (`#183D30`): 10.4:1 contrast (exceeds WCAG AAA 7:1)
  - Warm Ivory (`#F4F0E8`) on Crimson Red (`#A61935`): 6.58:1 contrast (exceeds WCAG AA 4.5:1)
- **Natural Specimen Fidelity:** Preserve the authentic physical coloration of canvases, ancient coin flans, rag paper folios, jewellery stones, and marble patina.
- **Zero SaaS Homogenization:** No identical card grids with uniform square thumbnails.
- **Zero Generic AI Gradients:** No purple, neon cyan, or rainbow gradient flourishes.
- **Canonical USD Settlement:** Official base currency remains USD, with multi-currency displayed strictly as estimated demo equivalents.

---

## 3. Multi-Category Art Direction: Six Curatorial Disciplines

Each category requires a tailored visual language that honors its unique physical materiality, scholarship, and collector psychology:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       SIX CURATORIAL DISCIPLINES & ART DIRECTION                                       │
├──────────────────────┬───────────────────────┬────────────────────────────┬────────────────────────────────────────────┤
│ Category Division    │ Visual Atmosphere     │ Key Data & Schema Invariant│ Inspection Experience                      │
├──────────────────────┼───────────────────────┼────────────────────────────┼────────────────────────────────────────────┤
│ 1. Fine Art &        │ Gallery monumentalism,│ Artist, Date, Medium,      │ 4K Surface Loupe:                          │
│    Paintings         │ natural wood panel    │ Support, Dimensions,       │ Pigment texture, craquelure, brushwork,    │
│                      │ on Charcoal Black     │ Raisonné Ref, Provenance   │ conservation report, frame verso           │
├──────────────────────┼───────────────────────┼────────────────────────────┼────────────────────────────────────────────┤
│ 2. Historical Coins  │ Archaeological weight,│ Denomination, Mint, Period,│ 360° Die Axis & Strike Loupe:              │
│    & Numismatics     │ stone plinth textures,│ Metal, Weight, Die Axis,   │ High-relief obverse/reverse strike,        │
│                      │ Crimson Red accents   │ Grade, Surface/Strike Score│ edge lettering, flan flow lines            │
├──────────────────────┼───────────────────────┼────────────────────────────┼────────────────────────────────────────────┤
│ 3. Rare Books &      │ Archival library,     │ Author, Printer, Date,     │ Leaf & Binding Explorer:                   │
│    Manuscripts       │ deckled paper, blind- │ Binding, Collation, Leaves,│ Tooling, watermarks, deckled edges,        │
│                      │ stamped morocco calf  │ Inscriptions, Census Ref   │ illuminated gold leaf, rubrication         │
├──────────────────────┼───────────────────────┼────────────────────────────┼────────────────────────────────────────────┤
│ 4. Fine Horology     │ Precision chronometry,│ Manufacture, Reference,    │ Micro-Horology Inspector:                  │
│    & Timepieces      │ Charcoal Black,       │ Calibre, Jewels, Rate,     │ Anglage, perlage, Geneva stripes, dial     │
│                      │ Antique Gold accents  │ Case Dimensions, Heritage  │ typography, caseback movement display      │
├──────────────────────┼───────────────────────┼────────────────────────────┼────────────────────────────────────────────┤
│ 5. Haute Joaillerie  │ Nocturnal velvet,     │ Maison, Period, Gemstones, │ Gemological Fire & Setting Viewer:         │
│    & Jewels          │ Colombian emerald fire│ Carat Weight, Cut, Origin, │ Facet brilliance, claw settings, platinum  │
│                      │ with Forest Green tint│ Metal Purity, Lab Cert     │ hallmarks, articulated links               │
├──────────────────────┼───────────────────────┼────────────────────────────┼────────────────────────────────────────────┤
│ 6. Antiquities &     │ Museum sanctuary,     │ Culture, Period, Material, │ Archaeological Provenance & 3D Form:       │
│    Historical Objects│ raking light, natural │ Century/BCE, Height/Width, │ Surface patina, chisel marks, thermolumin- │
│                      │ mineral patinas       │ Conservation, Title Ledger │ escence analysis, documented collection hist│
└──────────────────────┴───────────────────────┴────────────────────────────┴────────────────────────────────────────────┘
```

---

### Detailed Departmental Art Direction

#### Department I: Fine Art & Paintings
- **Atmospheric Palette:** Charcoal Black foundation (`#111312`), Forest Green transitional accents (`#183D30`), Warm Ivory (`#F4F0E8`), and Antique Gold brackets (`#C5A059`).
- **Typographic Expression:** `Instrument Serif` Italic headlines capturing the painterly rhythm of the artist’s hand; disciplined `Manrope` for scholarly provenance and conservation condition notes.
- **Documented Reference Specimen:** Studio of Rembrandt van Rijn, *Portrait of a Scholar* (1638, Oil on oak panel, 64.2 × 50.8 cm, Documented in Hofstede de Groot catalogue raisonné).
- **Inspection Interaction:** **The Conservation Surface Loupe** — Allows continuous zooming into the oil craquelure, signature varnish, and wood grain support.

#### Department II: Historical Coins & Numismatics
- **Atmospheric Palette:** Charcoal Black foundation (`#111312`), Muted Stone labels (`#A7A39A`), Antique Gold numerals (`#C5A059`), with Crimson Red incuse punch & rim highlights (`#A61935`).
- **Typographic Expression:** Monospaced tabular data in `IBM Plex Mono` dominates, presenting NGC/PCGS strike grades (`Strike 5/5, Surface 4/5`), flan diameter, and gram weights with archaeological precision.
- **Documented Reference Specimen:** Classical Athenian Silver Tetradrachm Owl (c. 450 BC, Attic Standard, 17.18g, Classical Athens).
- **Inspection Interaction:** **The Obverse / Reverse Die Axis Flip** — Dual synchronized inspection lenses revealing Athena’s crested helmet on obverse and the deep incuse punch, owl plumage, and olive sprig on reverse.

#### Department III: Rare Books & Manuscripts
- **Atmospheric Palette:** Charcoal Black foundation (`#111312`), Warm Ivory paper tones (`#F4F0E8`), Muted Stone text (`#A7A39A`), with Crimson Red morocco leather and rubrication highlights (`#A61935`).
- **Typographic Expression:** Heavy classical serif pacing reminiscent of Aldus Manutius and early movable type, accompanied by bibliographical collation formula in monospace.
- **Documented Reference Specimen:** William Shakespeare, *The First Folio: Comedies, Histories, and Tragedies* (London: Isaac Jaggard and Ed. Blount, 1623. Folio, 454 leaves, contemporary calf binding).
- **Inspection Interaction:** **The Leaf & Collation Explorer** — High-resolution leaf turner displaying typographical drop caps, paper chain-lines, watermarks, and contemporary marginalia.

#### Department IV: Fine Horology
- **Atmospheric Palette:** Charcoal Black foundation (`#111312`), hairline Antique Gold (`#C5A059`) accents, Warm Ivory (`#F4F0E8`) indicators, and Muted Stone (`#A7A39A`) calibration ticks.
- **Typographic Expression:** `IBM Plex Mono` for chronometric rates, serials, and calibres; `Instrument Serif` for manufacture pedigree.
- **Documented Reference Specimen:** Patek Philippe Calatrava Ref. 3520D (1974, 18k White Gold, Calibre 175, Clous de Paris bezel).
- **Inspection Interaction:** **The Micro-Calibre Inspector** — Toggles between the pristine porcelain dial and the exposed movement bridges revealing Gyromax balance and Côtes de Genève finishing.

#### Department V: Haute Joaillerie
- **Atmospheric Palette:** Charcoal Black foundation (`#111312`), Forest Green emerald undertone (`#183D30`), Antique Gold bezels (`#C5A059`), with preserved emerald vivid fire (`#76DE5B`).
- **Typographic Expression:** Elegant, high-contrast serif display with delicate kerning, paired with gemological carat scales.
- **Documented Reference Specimen:** Cartier Art Deco Colombian Emerald Sautoir (c. 1925, Platinum, 14.82ct sugarloaf cabochon emerald, European-cut diamonds).
- **Inspection Interaction:** **The Facet & Setting Loupe** — Highlights refractive fire, millegrain edge work, and French platinum assay marks.

#### Department VI: Antiquities & Historical Objects
- **Atmospheric Palette:** Charcoal Black foundation (`#111312`), Muted Stone carvings (`#A7A39A`), Antique Gold details (`#C5A059`), and Warm Ivory incised strokes (`#F4F0E8`).
- **Typographic Expression:** Classical inscriptional proportions; formal academic catalogue attribution.
- **Documented Reference Specimen:** Cycladic Marble Female Figure (Early Spedos Variety, c. 2700–2500 BC, Parian marble, height 28.5 cm).
- **Inspection Interaction:** **The Archaeological Profile Viewer** — Multi-angle raking light inspection highlighting ancient tool abrasions, root etching, and the lyre-shaped head profile.

---

## 4. Multi-Category Homepage Design: "The Pantheon of Provenance"

### 4.1 The Reimagined Multi-Category Hero
The opening viewport is strictly **not dominated exclusively by a wristwatch**. Instead, it introduces ChronoBid Vault as a global cultural auction house through an **Asymmetric Curatorial Triptych**:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     THE MULTI-CATEGORY HERO COMPOSITION                                                │
├───────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────┤
│ LEFT: EDITORIAL AUTHORITY & DISCIPLINE SELECTOR       │ RIGHT: SPATIAL OBJECT TRIPTYCH (CROSS-DISCIPLINE BREADTH)      │
├───────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ CHRONOBID VAULT &bull; OCTOBER SALEROOM 2026           │ [SPECIMEN A: FINE ART]                                         │
│                                                       │ Rembrandt Studio: Portrait of a Scholar (1638)                 │
│ "The Architecture                                     │ [SPECIMEN B: NUMISMATICS]                                      │
│  of Exceptional Things."                              │ Athenian Silver Tetradrachm Owl (c. 450 BC)                   │
│                                                       │ [SPECIMEN C: RARE BOOKS / MANUSCRIPTS]                         │
│ Six curatorial departments. Bound by pre-funded       │ Shakespeare First Folio (1623)                                 │
│ custodial escrow and physical forensic assay.         │ [SPECIMEN D: FINE HOROLOGY]                                    │
│                                                       │ Patek Philippe Calatrava (1974)                                │
│ [ EXPLORE ALL 6 DEPARTMENTS &rarr; ]  [ VIEW SALEROOM ] │ &bull; Interactive focus pull smoothly brings selected lot into │
│                                                       │   prominent center stage with spatial depth                    │
└───────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────┘
```

---

### 4.2 The 9 Homepage Structural Sections
1. **Institutional Masthead & Department Bar:** Hallmarked brand mark, global department dropdown (`Fine Art`, `Numismatics`, `Rare Books`, `Horology`, `Jewellery`, `Antiquities`), and Pre-Funded Vault Headroom chip (`$150,000 USD`).
2. **The Multi-Category Curatorial Hero:** The Asymmetric Object Triptych showcasing breadth immediately upon page load.
3. **The ChronoBid Institutional Standard:** Three pillars: Pre-Funded Settlement Integrity, Forensic Laboratory Assay, and Swiss FreePort Custody.
4. **The Six Curatorial Departments (Interactive Stage):** Dedicated atmospheric switcher demonstrating individual visual identities and specimen dossiers across all six disciplines.
5. **The Evening Sale Saleroom Pulse:** Live simulated auction chronometer with anti-sniping soft-close (<120s extension) telemetry across mixed-category lots.
6. **Cross-Department Masterpiece Spotlight:** Deep-dive into an exceptional cross-category highlight with the tailored multi-mode inspection loupe.
7. **Specialist Review Desk & Consignor Intake:** 48-hour formal appraisal portal with department-specific submission routing.
8. **Custodial Provenance & Legal Registry:** Title clearance, Art Loss Register verification, metallurgical assay certification.
9. **Archival Institutional Footer:** Canonical USD settlement disclosure, department index, legal terms, and sandbox simulation notices.

---

## 5. Component Architecture: Shared vs. Category-Specific Systems

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       COMPONENT ARCHITECTURAL MATRIX                                                   │
├───────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────┤
│ Reusable Shared Components (System Consistency)       │ Category-Specific Components (Department Materiality)          │
├───────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ • Masthead & Institutional Header                     │ • FineArtSpecGrid (Canvas, Varnish, Raisonné, Verso)           │
│ • VaultHeadroomBadge ($150,000 USD Bidding Headroom)  │ • CoinSpecGrid (Die Axis, NGC Grade, Strike Score, Weight g)   │
│ • BiddingPaddle (Dual-Action 350ms Hold-to-Bid)       │ • BookSpecGrid (Collation, Leaves, Morocco Binding, Watermark) │
│ • SaleroomChronometer (Anti-sniping <120s extension)  │ • HorologySpecGrid (Calibre, Jewels, Rate vph, Clous de Paris) │
│ • ProvenanceTimeline (Chain of custody historical log)│ • JewellerySpecGrid (Carat, Clarity, Cut, SSEF Certification)  │
│ • ForensicAssayCard (Metallurgical & Physical Proof)  │ • AntiquitySpecGrid (Culture, Period, Thermoluminescence Test) │
│ • ArchivalFooter (Legal disclosures & category sitemap)│ • InspectionLoupe: Custom lighting & zoom modes per discipline │
└───────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────┘
```

---

## 6. Imagery Sourcing & Provenance Ledger

In strict compliance with our authenticity and rights policies:
1. **Public Domain Collections:** Fine Art, Numismatics, Rare Books, and Antiquities utilize high-resolution open-access records from:
   - *The Metropolitan Museum of Art Open Access (CC0)*
   - *The Rijksmuseum Public Domain Collection*
   - *The British Museum Open Access Archive*
   - *The American Numismatic Society Open Data*
2. **Archival Reference Photography:** Fine Horology and Haute Joaillerie utilize archival manufacture reference records, clearly labeled with the immutable notice:
   > `[PROVISIONAL DEMO SPECIMEN — ARCHIVAL PHOTOGRAPHY UNDERGOING FORMAL PROVENANCE RIGHTS REVIEW]`
3. **Zero Fabricated URLs:** All image assets are self-contained, locally bundled, or vector-engraved; zero broken links or third-party hotlinking.

---

## 7. Motion & Interaction Plan

- **Compositor Exclusivity:** All animations use hardware-accelerated `transform: translate3d/scale` and `opacity` (zero layout reflows).
- **Subtle Tilt-Shift Parallax:** Max 3° perspective rotation responding to mouse coordinate vectors.
- **Cross-Category Transition Physics:** Selecting a new department transitions background ambient lighting via CSS custom property interpolation (`--ambient-tint`, 350ms ease-out).
- **Full Reduced-Motion Support:** `@media (prefers-reduced-motion: reduce)` disables all parallax and zoom transitions, rendering static high-resolution specimens immediately.
- **Keyboard Operability:** 100% of tabs, inspection loupes, and bidding controls operate via `Tab`, `Space`, and `Enter`.
