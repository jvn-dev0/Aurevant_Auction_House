# ChronoBid Vault — Phase 2.1 Multi-Category Expansion Plan
## Strategic Architecture, Category Experience Design & Prototype Completion Roadmap

> **Document Type:** Engineering & Product Planning Specification  
> **Project Name:** ChronoBid Vault  
> **Domain:** Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Current Baseline:** Phase 2 Clickable Frontend Prototype (Formally Audited at 90% Completion)  
> **Phase Status:** **PHASE 2.1 PLANNING ONLY — IMPLEMENTATION NOT AUTHORIZED**  
> **Governance Prohibitions:** Phase 3 Backend & Phase 4 Production remain strictly **NO-GO — NOT AUTHORIZED**  
> **Target Application:** `http://localhost:3000` (Next.js 14 App Router, TypeScript, Tailwind CSS)  
> **Planning Date:** 23 October 2026  
> **Authors:** Senior Enterprise Architect, Lead UI/UX Strategist, Principal QA Engineer  

---

## 1. Executive Summary

This specification defines the comprehensive, multi-phase roadmap to evolve ChronoBid Vault from an exclusive fine-horology auction prototype into an **expanded, multi-category luxury and specialist auction marketplace**.

As established in the [PROTOTYPE_COMPLETION_AUDIT_REPORT.md](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PROTOTYPE_COMPLETION_AUDIT_REPORT.md), the existing clickable prototype achieved a defensible **90% completion score**. Its visual identity, 3-tier Pre-Funded Vault state machine, soft-close anti-sniping simulation, Option B bid ladder, 8-currency dual-pricing engine, and unified buyer/consignor accounts are verified and protected by automated regression suites.

However, the audit identified three specific gaps that prevent 100% Phase 2 closure as a multi-category platform:
1. **Category Scope Restriction:** Catalog browsing and filtering are currently confined to horology subcategories (Chronographs, Dress & Ultra-Thin, Historic Divers, Complications). Zero inventory or filter routes exist for Rare Coins, Haute Joaillerie, or Fine Art.
2. **Missing Administrative Console:** There is no `/admin` or specialist back-office console to review submitted consignments, issue valuations, or sign off on reserve agreements.
3. **Automated Accessibility & E2E Tooling:** While contrast and keyboard focus pass, automated `axe-core` CI scanning and headless browser Playwright tests are not yet integrated.

This document outlines the **Phase 2.1 Expansion Plan** to address these gaps across 12 distinct asset categories divided into three strategic groups. **No application code, stylesheets, dependencies, or configuration will be modified until the Project Owner explicitly reviews and approves this plan.**

---

## 2. Current Prototype Baseline

The proposed expansion builds strictly upon the verified, stable Phase 2 prototype baseline:

```text
========================================================================================
CURRENT PROTOTYPE BASELINE STATUS (AUDITED 23 OCT 2026)
========================================================================================
Architecture:           Next.js 14.2.35 App Router (React 18, TypeScript 5.6, Tailwind CSS 3.4)
Application Routes:     14 leaf routes + 1 redirect + Next.js internal 404 (All HTTP 200 OK)
Master QA Test Suite:   tests/qa-verification-runner.js (51 / 51 assertions passed)
CSS & Asset Delivery:   tests/verify-css-assets.js (16 / 16 assertions passed)
Next.js Build:          Exit Code 0 (All 17 static & dynamic routes cleanly compiled)
ESLint Code Quality:    Exit Code 0 (Zero warnings, zero errors)
Design System:          Warm Paper (#F4F0E8), Deep Forest (#182720), Acid Lime (#D7E65A)
Typography:             Instrument Serif (Display), Manrope (Body), IBM Plex Mono (Data)
Asset Governance:       Approved #EDE7DC 4:5 Monogram fallback card (Zero unlicensed photos)
Active Inventory:       6 provisional fine horology lots (PP, AP, Rolex, Omega, Cartier, ALS)
========================================================================================
```

### Architectural Preservation Commitment:
The existing prototype architecture is fundamentally sound and will be **preserved without regression**. The core state machines (`lib/context.tsx`, `lib/bidding.ts`, `lib/currency.ts`) and global styles (`app/globals.css`) require zero structural redesign; they will be extended cleanly through polymorphic TypeScript interfaces and modular components.

---

## 3. Recommended Category Architecture

To scale from horology to a comprehensive marketplace without creating disconnected silos, the platform adopts a 3-tier hierarchical category taxonomy:

```
[ChronoBid Vault Marketplace]
  │
  ├── Group A: Initial Prototype Expansion (Sprint 1)
  │     ├── Fine Horology
  │     ├── Rare Coins & Numismatics
  │     ├── Haute Joaillerie
  │     └── Fine Art
  │
  ├── Group B: Additional Collectible Markets (Sprint 2 - Roadmap)
  │     ├── Collectible Vehicles
  │     ├── Antiques & Collectibles
  │     ├── Rare Books & Manuscripts
  │     ├── Luxury Collectibles & Haute Maroquinerie
  │     ├── Historical & Cultural Memorabilia
  │     ├── Rare Minerals & Natural Specimens
  │     └── 20th-Century Design & Architecture
  │
  └── Group C: Specialist Intellectual Property Markets (Sprint 3 - Separate Gate)
        └── Patents & Intellectual Property (Granted Patents, Licensing, Portfolios)
```

### 3.1 Group A — Initial Prototype Expansion (Sprint 1 Scope)

Group A represents the immediate focus of Phase 2.1, completing the vision codified in Phase 1 Amendment v2.3:

| Category ID | Category Name | Semantic Subcategories | Curatorial Tone & Aesthetic | Demonstration Listings |
| :--- | :--- | :--- | :--- | :--- |
| `horology` | **Fine Horology** *(Existing)* | Chronographs, Dress & Ultra-Thin, Historic Divers, Grand Complications | Mechanical micromechanics, acoustic performance, unpolished case integrity | 1. 1968 Patek Philippe Calatrava 3520D<br>2. 1972 AP Royal Oak 5402ST A-Series<br>3. 1965 Rolex Daytona 6239 Paul Newman |
| `numismatics` | **Rare Coins & Numismatics** | Ancient Greek & Roman, Early Modern European, British Sovereigns, Historic Asian & Mughal | Metallic provenance, die strike quality, certification encapsulation, historical sovereignty | 1. 460 BC Athenian Silver Tetradrachm (NGC Choice VF)<br>2. 1642 Charles I Oxford Mint Triple Unite (PCGS AU55)<br>3. 1619 Mughal Jahangir Gold Mohur (Zodiac Leo, Fine) |
| `joaillerie` | **Haute Joaillerie** | Period Art Deco, Belle Époque, Natural Pearls, Signed Masterpiece Jewellery | Lapidary precision, unheated gemstone origins, precious metal assay hallmarks, Cartier/Van Cleef provenance | 1. 1925 Art Deco Colombian Emerald & Diamond Sautoir<br>2. 5.12ct Unheated Burmese Ruby Solitaire Ring (SSEF)<br>3. Natural Basra Pearl Three-Strand Choker (GIA) |
| `fine-art` | **Fine Art** | Old Master Paintings, Impressionist & Modern, Post-War & Contemporary, Fine Prints | Provenance archives, canvas conservation status, catalogue raisonné validation, gallery exhibition history | 1. 1638 Studio of Rembrandt Oil on Panel Portrait<br>2. 1894 Edgar Degas Pastel on Paper Study<br>3. 1958 Abstract Expressionist Canvas by Helen Frankenthaler |

---

### 3.2 Group B — Additional Collectible Markets (Roadmap)

Group B expands into high-value tangible cultural assets:

| Category ID | Category Name | Subcategories | Representative Example Demonstration Listings |
| :--- | :--- | :--- | :--- |
| `vehicles` | **Collectible Vehicles** | Pre-War Classics, Historic Grand Tourers, FIA Homologation Specials, Rare Supercars | 1. 1954 Aston Martin DB2/4 Competition Drophead Coupé<br>2. 1973 Porsche 911 Carrera RS 2.7 Lightweight (Matching Numbers)<br>3. 1961 Ferrari 250 GT SWB Berlinetta Recreation |
| `antiques` | **Antiques & Decorative Arts** | Imperial Chinese Porcelain, 18th-C French Furniture, Renaissance Bronzes, Islamic Metalwork | 1. Qianlong Period Blue and White Imperial Dragon Moonflask<br>2. Louis XVI Ormolu-Mounted Ebony Bureau Plat by Martin Carlin<br>3. 16th-Century Venetian Bronze Sphinx Andirons |
| `books-manuscripts` | **Rare Books & Manuscripts** | Medieval Illuminated Vellum, Incunabula, Landmark Scientific First Editions, Literary Archives | 1. 1493 Nuremberg Chronicle (Hartmann Schedel, Latin Folio)<br>2. 1687 Isaac Newton *Philosophiae Naturalis Principia Mathematica*<br>3. 1922 James Joyce *Ulysses* (Signed Shakespeare and Company 1st) |
| `luxury-collectibles` | **Luxury Collectibles** | Historic Trunks & Luggage, Haute Maroquinerie, Mechanical Music & Automata | 1. 1912 Louis Vuitton Zinc Cabin Trunk with Original Steamer Labels<br>2. 1885 Swiss Singing Bird Box by Charles Bruguier (Enamel & Silver)<br>3. Hermès Birkin 35 Porosus Crocodile Faubourg Edition |
| `memorabilia` | **Historical & Cultural Memorabilia** | Historic Stage Instruments, Championship Regalia, Space Exploration Artifacts | 1. 1968 Fender Stratocaster Owned & Played by Pioneering Rock Virtuoso<br>2. 1969 Apollo 11 Lunar Flown Checklist Flight Sheet (Autographed)<br>3. 1936 Berlin Olympic Bronze Winner’s Medal & Ribbon |
| `natural-specimens` | **Minerals & Natural History** | Museum-Grade Crystal Matrices, Iron-Nickel Meteorites, Historic Palaeontology | 1. 42cm Tourmaline on Cleavelandite Matrix (Minas Gerais, Brazil)<br>2. 14.8kg Seymchan Pallasite Meteorite Full Slice (Etched Olivine Crystals)<br>3. Upper Cretaceous Tyrannosaur Tooth in Matrix (Hell Creek) |
| `design-architecture` | **Design & Architecture** | Bauhaus Prototypes, Mid-Century Scandinavian Masters, Radical Italian 1970s Design | 1. 1928 Marcel Breuer B3 "Wassily" Armchair Early Thonet Edition<br>2. 1949 Finn Juhl Chieftain Chair in Brazilian Rosewood & Leather<br>3. 1968 Joe Colombo Elda Armchair in Original White Fiberglass |

---

### 3.3 Group C — Specialist Intellectual Property Markets (Roadmap & Dedicated Gate)

Category 12 operates under a specialized commercial and legal structure:

```
[Category 12: Patents & Intellectual Property]
  │
  ├── 1. Granted Patent Asset Transfers (Assignment of full ownership)
  │     └── Strict requirement: Must be a fully granted patent in good standing.
  │
  ├── 2. Patent Licensing Agreements (Exclusive & Non-Exclusive Field-of-Use)
  │     └── Strict requirement: Licensed term, royalty schedule, field-of-use definitions.
  │
  └── 3. Multi-Jurisdictional IP Portfolios (Commercial technology clusters)
        └── Strict requirement: Complete jurisdictional audit across USPTO, EPO, JPO, IPO.
```

#### Governance & Demarcation Rules for IP Auctions:
- **Application vs. Granted Right:** The prototype UI strictly differentiates pending patent applications (`Status: PENDING APPLICATION — NO GRANTED MONOPOLY`) from fully granted patents (`Status: GRANTED ENFORCEABLE PATENT`).
- **Assignment vs. Licensing:** Transfer of full title/ownership is clearly segregated from term licensing rights.
- **Verification Disclosure:** Every IP listing carries the mandatory disclosure: `[DEMO IP ASSET — LEGAL TRANSFERABILITY, JURISDICTIONAL VALIDITY & ENCUMBRANCE SEARCH REQUIRED PRIOR TO PRODUCTION HAMMER]`.
- **Demonstration Listings:**
  1. *Granted Patent Transfer:* Precision Micro-Electro-Mechanical Sensor (MEMS) Gyroscope Calibration (US Patent 10,845,219 B2 — Active, All Maintenance Fees Confirmed).
  2. *Exclusive Licensing Right:* Solid-State Lithium-Sulfur Ceramic Separator Architecture (European Patent EP 3 412 901 B1 — 10-Year Automotive Exclusive License).
  3. *Portfolio Transfer:* 14-Family International Quantum Dot Display Patent Cluster (USPTO, EPO, JPO).

---

## 4. Category Experience Design

To maintain the tactile, editorial feel of ChronoBid Vault while reflecting the physical reality of each asset class, category pages avoid generic e-commerce grids in favor of bespoke curatorial layouts:

```
+----------------------------------------------------------------------------------------------------+
| CHRONOBID VAULT EDITORIAL DESIGN TOKENS (UNIFIED ACROSS ALL CATEGORIES)                          |
| Canvas: Warm Paper (#F4F0E8) | Structure: Deep Forest (#182720) | Operational Cue: Acid Lime (#D7E65A)|
| Hairline Borders: Stone (#D8D0C2) | Monogram Fallback: Stone Surface (#EDE7DC) with 4:5 Aspect Ratio|
| Typography: Instrument Serif (Display), Manrope (Interface), IBM Plex Mono (Technical Data/Prices)|
+----------------------------------------------------------------------------------------------------+
```

### 4.1 Category-Specific Design & Metadata Profiles

```carousel
```markdown
### 1. Fine Horology Specimen Experience
- **Editorial Sub-Header:** "Micromechanical Permanence & Acoustic Integrity"
- **Key Display Attributes:** Movement Calibre, Jewels, VPH, Case Dimensions, Acoustic Timegrapher Reading (Rate, Amplitude, Beat Error), Intact Swiss Hallmarks.
- **Specific Filter Dimensions:** Calibre Architecture (Manual vs Automatic), Case Material (Gold, Steel, Platinum), Era (Pre-1970, Modern Vintage).
- **Monogram Card Monogram:** Brand Monogram (e.g., `PP`, `AP`, `ROLEX`) + Calibre Subtitle.
- **Inspection Drawer:** Acoustic Timegrapher plot, 6-position timing certificate, archival extract ledger.
```
<!-- slide -->
```markdown
### 2. Rare Coins & Numismatics Specimen Experience
- **Editorial Sub-Header:** "Sovereign Metal, Historic Dies & Forensic Grading"
- **Key Display Attributes:** Issuing Authority, Denomination, Strike Year, Metal Composition (e.g., Gold 0.917), Weight (Grams to 0.01g), Diameter (mm), Certification Service (NGC/PCGS Grade), Strike/Surface Scores (e.g., 5/5 Strike, 4/5 Surface).
- **Specific Filter Dimensions:** Metal (Gold, Silver, Electrum, Bronze), Period (Ancient Classical, Medieval, Early Modern, 19th/20th C), Grading Tier (Mint State 60+, Choice About Uncirculated).
- **Monogram Card Monogram:** Mintmark / Sovereign Crest (e.g., `ATH`, `Oxf`, `MUG`) + Grade Subtitle (`NGC Ch VF`).
- **Inspection Drawer:** High-resolution obverse/reverse macro photography certificate, edge lettering audit, die orientation axis (e.g., 12 o'clock).
```
<!-- slide -->
```markdown
### 3. Haute Joaillerie Specimen Experience
- **Editorial Sub-Header:** "Lapidary Connoisseurship, Natural Gemmology & Signed Provenance"
- **Key Display Attributes:** Principal Gemstones, Total Carat Weight (TCW), Color Grade, Clarity Grade, Treatment Status (e.g., Unheated / No Heat Observed), Origin (Burma, Colombia, Ceylon), Mounting Metal (Platinum 950, 18k Yellow Gold), Maker’s Hallmarks.
- **Specific Filter Dimensions:** Gemstone Type (Diamond, Ruby, Emerald, Sapphire, Natural Pearl), Epoch (Belle Époque, Art Deco, Mid-Century Retro), Maison (Cartier, Van Cleef & Arpels, Boucheron, Bulgari).
- **Monogram Card Monogram:** Maison Monogram (e.g., `CARTIER`, `VCA`, `BULGARI`) + Gemstone TCW Subtitle.
- **Inspection Drawer:** SSEF / Gübelin / GIA Gemmological Reports, spectral UV luminescence notes, setting claw integrity audit.
```
<!-- slide -->
```markdown
### 4. Fine Art Specimen Experience
- **Editorial Sub-Header:** "Archival Authenticity, Physical Conservation & Curatorial Lineage"
- **Key Display Attributes:** Artist / School, Medium & Support (e.g., Oil on Linen Canvas), Dimensions (cm and inches, H × W), Date of Execution, Signature/Inscriptions, Catalogue Raisonné Reference Number, Framing & Glazing.
- **Specific Filter Dimensions:** Movement/School (Old Masters, Impressionism, Post-War, Contemporary), Medium (Oil, Pastel, Bronze, Acrylic, Works on Paper), Valuation Tier.
- **Monogram Card Monogram:** Artist Signature Monogram (e.g., `RMB`, `ED`, `HF`) + Execution Date Subtitle.
- **Inspection Drawer:** Ultraviolet varnish fluorescence examination, raking light surface topography report, full exhibition provenance history, export license status.
```
<!-- slide -->
```markdown
### 5. Patents & Intellectual Property Specimen Experience
- **Editorial Sub-Header:** "Enforceable Commercial Exclusivity & Enacted Patent Monopolies"
- **Key Display Attributes:** Jurisdictional Office (USPTO, EPO, JPO, IPO), Official Patent Number, Filing & Priority Date, Grant Date, Maintenance Status, Assignment / Licensing Scope, Core Independent Claims Count, Encumbrance Status.
- **Specific Filter Dimensions:** Legal Structure (Full Title Assignment vs Exclusive Term License), Jurisdiction (US, Europe, Global), Technology Sector (Sensors/MEMS, Energy, Materials, Computing).
- **Monogram Card Monogram:** Jurisdictional Shield (e.g., `USPTO`, `EPO`, `WIPO`) + Patent Grant Number Subtitle.
- **Inspection Drawer:** Certified file wrapper extract, independent patent attorney validity search summary, maintenance fee payment receipt record, claims schedule.
```
````

---

## 5. Shared Buyer and Seller Experience

ChronoBid Vault maintains a **single unified account model**:

```
+----------------------------------------------------------------------------------------------------+
| UNIFIED COLLECTOR ACCOUNT (Alexander Vance — Paddle #4102)                                        |
+----------------------------------------------------------------------------------------------------+
|  Role Capability: BUYER                Role Capability: CONSIGNOR        Role: SPECIALIST/ADMIN    |
|  - Bid in Live Salerooms               - Submit Lots Across 12 Categories- Access /admin Console   |
|  - Pre-Funded Vault Headroom           - Track Appraisal Tickets         - Review Consignment Intake|
|  - Watchlist Across All Categories     - Sign Confidential Reserves      - Audit Provenance Docs    |
|  - Download Won Lot Invoices           - Inspect Specialist Valuations   - Issue Reserve Approvals  |
+----------------------------------------------------------------------------------------------------+
```

### 5.1 Account Permissions & Access Control Architecture
1. **Public Guest:** Can browse all 12 categories, inspect deep dossiers, and toggle currencies. Attempting to place a bid, toggle a watchlist, or request an intake routes to `/auth/login` or opens a contextual auth modal.
2. **Registered Collector (Default Role):** Instantly assigned a virtual paddle (`#4102`). Possesses active Pre-Funded Vault headroom ($150,000 USD default), can participate in live auctions across all categories, and can submit consignment intake forms.
3. **Consignor Permissions:** Automatically unlocked within the same account upon submitting a consignment ticket. Unlocks `/account/consignments` dashboard where reserve agreements are signed.
4. **Specialist Role (Demo Mode):** Toggled via an accessible prototype role-switcher in the user menu. Grants access to `/admin` to review intake queues, inspect Timegrapher/gemmological data, and approve reserves.
5. **Super-Admin Role (Demo Mode):** Can modify saleroom countdown timers, trigger anti-sniping extensions, and reset the simulated Vault ledger.

---

## 6. Simulated Buyer Vault Regression-Protection Plan

The Pre-Funded Vault state machine is the core mathematical foundation of ChronoBid Vault. Expanding into 12 categories must **strictly preserve the existing mathematical invariants**:

$$\text{Available to Bid} = \text{Total Vault Balance} - \text{Reserved Funds} - \text{Other Applicable Holds}$$

### 6.1 Multi-Category Cross-Lot Reservation Invariant
- **Scenario:** A collector has a demonstration Vault balance of ₹1,00,000 ($1,189 USD).
- **Action 1 (Lot A - Fine Horology):** User places a leading bid of ₹70,000 ($833 USD) on Lot 01 (Patek Philippe).
  - *Outcome:* Bid accepted. `reservedFundsUsd` = $833 USD (~₹70,000). `availableToBidUsd` decrements to $356 USD (~₹30,000).
- **Action 2 (Lot B - Rare Coins):** User attempts to place a concurrent bid of ₹60,000 ($714 USD) on Lot 08 (Athenian Tetradrachm).
  - *Outcome:* **BID REJECTED PRIOR TO ACCEPTANCE.** Required headroom ($714 USD) exceeds remaining available balance ($356 USD). Bid input preserves focus; system renders accessible error alert:
  > *"Bid not accepted. Your available Vault balance is insufficient for this bid across your active lots. Add eligible funds or reduce your bid amount."*
- **Action 3 (Outbid on Lot A):** Simulated bot counter-bids on Lot 01.
  - *Outcome:* 100% of the ₹70,000 commitment is released immediately. Available balance restores to ₹1,00,000 ($1,189 USD). Lot B is now affordable and can be placed.

### 6.2 Currency Invariant Preservation
- Changing the display currency (USD, EUR, GBP, CHF, JPY, HKD, SGD, INR) updates visual labels instantly across all 12 categories but **never alters underlying USD headroom in memory**.
- INR formatting continues to strictly observe Indian numbering conventions (lakh groupings).

---

## 7. Simulated Specialist and Admin Console (`/admin`)

To satisfy the missing capability identified in the Phase 2 audit, Phase 2.1 introduces a lightweight client-side administrative interface at `/admin`:

```
+----------------------------------------------------------------------------------------------------+
| CHRONOBID VAULT SPECIALIST & APPRAISAL DESK [SANDBOX SIMULATION — NOT REAL OPERATIONS]            |
+----------------------------------------------------------------------------------------------------+
| Intake Queue (4 Pending) | Active Saleroom Floor | Reserve Contracts | Provenance Audit Archive    |
+----------------------------------------------------------------------------------------------------+
| Ticket ID       Category     Specimen Reference         Est. Reserve   Status             Actions   |
| CBV-INTAKE-4821 Horology     Heuer Autavia 1163T        $25,000 USD    Under Review       [Inspect] |
| CBV-INTAKE-5102 Numismatics  1642 Charles I Triple Unite $85,000 USD    Docs Pending       [Inspect] |
| CBV-INTAKE-5188 Fine Art     Rembrandt School Panel     $320,000 USD   Specialist Valued  [Sign Off]|
| CBV-INTAKE-5240 Patents      MEMS Sensor Calibration    $150,000 USD   Under Review       [Inspect] |
+----------------------------------------------------------------------------------------------------+
```

### 7.1 Specialist Workflow Capabilities
1. **Intake Queue Management:** Displays all submitted consignment tickets across the 12 categories with filters by category and review status.
2. **Interactive Inspection Drawer:**
   - Review uploaded metadata (manufacturer/artist, dimensions, year, condition notes).
   - Review simulated supporting documents (heritage extracts, GIA certificates, file wrapper PDFs).
   - Enter specialist valuation estimates (Low / High / Recommended Reserve).
3. **Status State Machine:**
   $$\text{Submitted} \longrightarrow \text{Under Specialist Review} \longrightarrow \text{Valuation Issued} \longrightarrow \text{Reserve Formally Agreed} \longrightarrow \text{Admitted to Saleroom}$$
4. **Reserve Agreement Sign-Off:** Specialist can approve the reserve price, which updates the consignor's dashboard in `/account/consignments` in real time via React context.
5. **Rejection & Clarification Workflow:** Specialist can toggle `Additional Documentation Requested` (e.g., requesting UV fluorescence report or chain of title proof).
6. **Mandatory Governance Disclosure:** Every view displays a persistent header badge: `[SIMULATED SPECIALIST CONSOLE — DEMONSTRATION WORKFLOW FOR PROTOTYPE TESTING ONLY]`.

---

## 8. Category Data and Image Governance

### 8.1 Unified TypeScript Data Model
All catalog items implement a unified polymorphic interface:

```typescript
export interface BaseAuctionLot {
  id: string;
  slug: string;
  lotNumber: number;
  category: MarketplaceCategory; // 'horology' | 'numismatics' | 'joaillerie' | 'fine-art' | etc.
  subCategory: string;
  title: string;
  makerOrOrigin: string; // Manufacturer, Artist, Sovereign Authority, or Assignor
  referenceOrId: string; // Model Ref, Coin Catalog Ref, Patent Number, or Raisonné Ref
  yearOrPeriod: string;
  dimensions: string;
  conditionGrade: string;
  provenanceSummary: string;
  estimateLowUsd: number;
  estimateHighUsd: number;
  currentBidUsd: number;
  reserveStatus: 'Reserve Met' | 'Reserve Pending' | 'No Reserve';
  monogram: string;
  monogramSubtitle: string;
  provisionalNotice: string;
  bidCount: number;
  status: 'live' | 'upcoming' | 'closed';
  categoryAttributes: Record<string, string | number | string[]>;
}
```

### 8.2 Strict Image Rights & Asset Governance
- **Zero Hallucinated URLs:** No external unverified photographic URLs may be introduced.
- **Universal Stone Surface Monogram Fallback:** Every new demonstration listing across all 12 categories will render the approved `#EDE7DC` 4:5 monogram card (`MonogramCard.tsx`).
- **Category Monograms:** Monograms will utilize category-appropriate glyphs:
  - Horology: Manufacture initials (e.g., `PP`, `AP`).
  - Coins: Sovereign mintmark or Greek monogram (e.g., `ATH`, `ROMA`).
  - Jewellery: Maison monogram or gem cut glyph (e.g., `VCA`, `CARTIER`).
  - Art: Artist monogram signature (e.g., `RMB`, `DEGAS`).
  - Patents: Official office shield (`USPTO`, `EPO`, `WIPO`).
- **Provisional Badging:** All cards retain the mandatory label: `[Provisional Specimen — Rights Review in Progress]`.

---

## 9. Accessibility and Quality Assurance Strategy

### 9.1 WCAG 2.2 Level AA Compliance Targets
1. **Contrast Conformance:** Maintain Deep Forest on Warm Paper at **12.87:1** and Deep Forest on Acid Lime at **11.4:1** (both exceed WCAG AAA requirements).
2. **Keyboard Navigation & Focus Management:**
   - Global visible focus ring: `outline: 2px solid #182720; outline-offset: 2px;`.
   - Modals and drawers (e.g., the specialist inspection drawer) must trap keyboard focus and dismiss cleanly with the `Escape` key.
3. **Screen-Reader & ARIA Architecture:**
   - All category filter tabs must implement `role="tab"`, `aria-selected`, and `aria-controls`.
   - Dynamic bid changes, countdown extensions, and outbid notices must announce via `aria-live="polite"`.
   - Bid rejection errors must be bound to inputs via `aria-describedby` and announced via `role="alert"`.
4. **Touch & Mobile Ergonomics:**
   - Maintain 16px font size (`text-base`) on all form inputs across the consignment wizard and admin console to eliminate iOS Safari auto-zoom.
   - Introduce touch swipe gestures on `MonogramCard` angle switchers for mobile viewports.

### 9.2 Two-Tier Testing Suite (Automated vs. Manual Lab)
- **Tier 1: Automated Scripted Gates (CI Pipeline):**
  - Next.js production build (`npm run build`).
  - Static code analysis (`npx eslint app components lib`).
  - QA functional verification runner (`node tests/qa-verification-runner.js`).
  - CSS asset delivery runner (`node tests/verify-css-assets.js`).
  - *New:* Automated `axe-core` accessibility scan across all 12 category pages and admin console.
  - *New:* Headless Playwright smoke tests for cross-lot bidding and consignment submission.
- **Tier 2: Manual Verification Lab (Human Audit):**
  - Screen-reader verification using NVDA on Windows and VoiceOver on iOS.
  - Physical device testing on mobile (360px width) and tablet viewports.
  - Reduced-motion verification under macOS / Windows high-contrast and reduced-motion system preferences.

---

## 10. Work Packages, Implementation Order & File Estimates

The proposed expansion is broken down into five distinct, sequential work packages:

```
+----------------------------------------------------------------------------------------------------+
| PHASE 2.1 IMPLEMENTATION WORK PACKAGES                                                             |
+----------------------------------------------------------------------------------------------------+
|  [WP1: Data & Group A] ──> [WP2: Category Pages] ──> [WP3: Admin & Consign]                        |
|                                                               │                                    |
|  [WP5: Group B & C IP] <── [WP4: Automated A11y & Playwright] <────────────────────────────────────┘
+----------------------------------------------------------------------------------------------------+
```

| Package ID | Name & Objective | Scope of Changes | Estimated Files Affected (Estimates Only) | Priority |
| :---: | :--- | :--- | :--- | :---: |
| **WP1** | **Multi-Category Data Model & Group A Catalog** | Define polymorphic `MarketplaceLot` interface; create sample mock lots for Coins, Jewellery, and Art (3 lots each). | `lib/data.ts`, `lib/context.tsx` | **High** |
| **WP2** | **Category Landing Pages & Specialized Dossiers** | Build multi-category filter bar; create category landing routes (`/categories/[category]`); customize `SpecGrid` for Coins, Jewelry, and Art. | `app/auctions/upcoming/page.tsx`, `app/auctions/lots/[lotSlug]/page.tsx`, `components/SpecGrid.tsx`, `components/CategoryNav.tsx` | **High** |
| **WP3** | **Simulated Specialist & Admin Console (`/admin`)** | Build `/admin` console; implement consignment intake review drawer; wire reserve agreement approvals to context. | `app/admin/page.tsx`, `app/consign/page.tsx`, `app/account/consignments/page.tsx`, `components/Header.tsx` | **High** |
| **WP4** | **Automated Accessibility (`axe-core`) & E2E Tests** | Integrate `axe-core` CLI and Playwright smoke tests into `npm test`; verify 100% WCAG 2.2 AA compliance. | `tests/qa-verification-runner.js`, `tests/a11y-audit.js`, `package.json` | **Medium** |
| **WP5** | **Group B Collectibles & Group C Patents Engine** | Add demonstration lots and specialized claims drawers for Vehicles, Books, and Patents. | `lib/data.ts`, `app/auctions/lots/[lotSlug]/page.tsx` | **Roadmap** |

---

## 11. Acceptance Criteria & Regression Matrix

To declare any work package complete, it must pass the following verifiable criteria:

### Acceptance Criteria per Work Package:
1. **WP1 Acceptance:**
   - `lib/data.ts` contains validated fixtures for Horology (6 lots), Coins (3 lots), Jewellery (3 lots), and Art (3 lots).
   - All lots strictly enforce `#EDE7DC` monogram fallback with category-specific glyphs.
   - Zero TypeScript compiler errors during `npm run build`.
2. **WP2 Acceptance:**
   - Catalog filtering on `/auctions/upcoming` filters across all Group A categories in `<100ms`.
   - Selecting a coin renders numismatic metadata (mint, grade, strike score); selecting jewelry renders gemmological data (carat, origin, treatment).
   - Zero broken links; all lot slugs resolve to HTTP 200 dossiers.
3. **WP3 Acceptance:**
   - Submitting an intake on `/consign` generates a `CBV-INTAKE-XXXX` ticket that appears instantly in both `/account/consignments` and `/admin`.
   - In `/admin`, clicking "Approve Reserve" immediately updates status to `Reserve Approved` without page reload.
   - Persistent `[SIMULATED CONSOLE]` notice visible on all admin pages.
4. **WP4 Acceptance:**
   - Automated accessibility runner reports zero WCAG 2.2 Level AA violations across all surveyed routes.
   - Automated E2E smoke tests pass across live saleroom bidding, consignment intake, and Pre-Funded Vault benchmarks.

### Regression Testing Matrix:
All existing automated tests must continue to pass without modification:
- `CURR-01` through `CURR-04` (Currency invariants & dual-pricing)
- `SC-01` through `SC-04` (120s soft-close anti-sniping & 10-cap)
- `LAD-01` through `LAD-03` (Option B 5-tier increment ladder)
- `VAULT-01` through `VAULT-10` (Benchmark 1, Benchmark 2, outbid release, session corruption recovery)
- `DOM-01` through `DOM-07` (Auth layouts, CAPTCHA accessibility, 16px iOS inputs)

---

## 12. Legal, Ownership & Operational Questions Requiring Expert Review

In strict compliance with project governance and transparency rules, the following matters are formally identified as **unresolved legal, ownership, and operational questions requiring qualified specialist counsel before production (Phase 3+)**:

1. **Numismatic & Cultural Heritage Title:** Certain sovereign coinage and archaeological artifacts may be subject to national patrimony laws (e.g., Italian cultural property laws, UNESCO 1970 Convention, Indian Antiquities and Art Treasures Act, 1972). Production custody will require certified export clearance.
2. **Gemstone Treatment & Origin Certification Disclosures:** Standards for declaring minor oiling in emeralds, thermal enhancement in rubies, or laboratory irradiation require legal alignment with CIBJO (The World Jewellery Confederation) guidelines.
3. **Patent Title Assignment & Enforceability:** Transferring granted patent rights involves formal recording with national patent offices (e.g., USPTO Assignment Recordation Branch, EPO Register). The platform must not represent an auction hammer as an automatic legal assignment of title without formal written execution of assignment deeds.
4. **Cross-Border Escrow & AML/KYC Boundaries:** Proposed custodial escrow vaulting and high-value payments across Europe, the US, and India require banking and regulatory licenses that remain unobtained.

---

## 13. Owner Decisions Requiring Explicit Written Approval

Before any application code is created or modified for Phase 2.1, the Project Owner must make the following binding decisions:

1. **Marketplace Scope Gate:** Does the Project Owner authorize expanding the prototype immediately into **Group A (Horology, Coins, Jewellery, Fine Art)** under Phase 2.1, while keeping Groups B and C on the future roadmap?
2. **Specialist Console Placement:** Does the Project Owner approve adding the client-side `/admin` specialist review console to demonstrate appraisal workflows, or should admin functionality remain deferred to Phase 3?
3. **Asset Photography Approval:** Will the Project Owner provide licensed photography for the debut listings, or should the prototype strictly continue to utilize the `#EDE7DC` Stone Surface monogram card?
4. **Testing Tooling Authorization:** Does the Project Owner authorize installing `playwright` and `@axe-core/cli` as developer dependencies (`devDependencies`) to enable automated E2E and accessibility testing?

---

## 14. Scope & Effort Estimates (with Stated Assumptions)

| Sprint / Package | Focus & Deliverables | Estimated Engineering Effort | Risk / Uncertainty |
| :--- | :--- | :---: | :---: |
| **Sprint 1 (WP1 & WP2)** | Group A Expansion (Coins, Jewellery, Art data fixtures, filter navigation, category landing cards, specialized `SpecGrid`) | **3 – 4 Days** | *Low:* Builds cleanly on existing Next.js App Router and React context structures. |
| **Sprint 2 (WP3)** | Simulated Specialist Console (`/admin`), interactive consignment appraisal review desk, reserve price approval flows | **2 – 3 Days** | *Low:* Pure client-side React simulation utilizing existing `sessionStorage` and context. |
| **Sprint 3 (WP4)** | Automated `axe-core` accessibility scanning, Playwright headless E2E testing suite, regression certification | **2 Days** | *Medium:* Depends on Project Owner approval to install dev dependencies in `package.json`. |
| **Sprint 4 (WP5 - Roadmap)** | Group B Collectibles & Group C Patents Specialist Engine | **4 – 5 Days** | *Medium:* Requires legal review of patent assignment metadata fields. |

---

## 15. Final Governance Check & Verification Statement

1. **Preservation of Existing Prototype:** The existing prototype will be **preserved 100% intact**. All 14 leaf routes, the 11-section editorial homepage, the Pre-Funded Vault math, and the 51 passing QA tests remain unchanged.
2. **Recommended Immediate Scope:** We recommend authorizing **Sprint 1 (Group A: Horology, Coins, Jewellery, Fine Art)** and **Sprint 2 (Simulated `/admin` Specialist Console)** as the definitive Phase 2.1 scope.
3. **Roadmap Deferrals:** Groups B (Vehicles, Antiques, Books, Minerals, Memorabilia, Design) and C (Patents & IP) should remain deferred to subsequent prototype phases.
4. **Implementation Prohibition Confirmation:** **Zero application code, stylesheets, configuration files, or dependencies were altered or created during this task.** Implementation remains strictly blocked pending Project Owner authorization.

---
*Plan certified by Senior Enterprise Architect, Lead UI/UX Strategist, and Principal QA Engineer.*  
*Timestamp: 2026-10-23T10:40:00+05:30*
