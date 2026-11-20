# AUREVANT AUCTION HOUSE

> **International Curated Auction Platform** — Fine Art · Rare Horology · Historic Books · Jewellery · Numismatics · Antiquities

---

## Project Overview

AUREVANT is an international curated auction house web platform, purpose-built as a premium, editorial-first collecting destination for exceptional objects across six specialist departments.

The homepage design language draws from curatorial print publishing — editorial white space, fine serif typography, gold hairline borders, and atmospheric imagery — rather than conventional e-commerce patterns.

> **Development Status:** Active homepage implementation. Backend infrastructure, live bidding, payment, and account systems are defined in the roadmap and are not yet implemented.

---

## Project Vision

> *"Objects with provenance. Auctions with intelligence."*

AUREVANT aspires to be the global digital saleroom for collectors, scholars, and curators seeking access to authenticated, expertly catalogued rare objects — from First Folio bindings and Roman numismatics to 18k horological instruments and classical antiquity.

Every interface decision — from grid rhythm to countdown typesetting — serves the idea that **exceptional objects deserve an exceptional stage**.

---

## Current Development Status

### ✅ Implemented (Phase 2 — Homepage Frontend)

| Feature | Status |
|---|---|
| Navbar with search, watchlist, account, consign modals | ✅ Complete |
| Hero section with 3D marble sculpture + cinematic gallery bg | ✅ Complete |
| Closing Soon — live auction row with Three.js 3D inspection | ✅ Complete |
| Explore the Collections — curved exhibition gallery (6 panels) | ✅ Complete |
| Beyond the Object — editorial story section with glass-lens | ✅ Complete |
| AUREVANT Intelligence — natural-language search with scroll animation | ✅ Complete |
| Sell with AUREVANT — editorial consignment section with custom scroll reveal | ✅ Complete |
| Guest access notice (CuratorialModal system) | ✅ Complete |
| Responsive layout (360px → 1600px+) | ✅ Complete |
| WCAG 2.2 AA focus indicators, ARIA roles, keyboard nav | ✅ Complete |
| `prefers-reduced-motion` compliance | ✅ Complete |
| WebP image delivery (Hero-background, sculpture-fallback) | ✅ Complete |
| OpenGraph + Twitter card metadata | ✅ Complete |
| Schema.org JSON-LD (WebSite + Organization + AuctionHouse) | ✅ Complete |
| `#auctions`, `#categories`, `#stories`, `#intelligence`, `#about` anchor system | ✅ Complete |
| Consignment, Watchlist, Account, Search — interactive modals | ✅ Complete |
| `app/icon.svg` — gold monogram SVG favicon | ✅ Complete |
| TypeScript strict mode — 0 errors | ✅ Passing |
| ESLint — 0 errors (pre-existing warnings retained) | ✅ Passing |
| Production build (`next build`) | ✅ Passing |

### 🔲 Planned (Roadmap — Not Yet Authorized)

| Feature | Phase |
|---|---|
| Live bidding engine (WebSocket, real-time paddle management) | Phase 3+ |
| Registered collector accounts (Auth, session, JWT) | Phase 3+ |
| Consignment intake API and appraisal workflow | Phase 3+ |
| Searchable catalogue index (full-text, vector embeddings) | Phase 3+ |
| Payment processing (escrow, wire, card) | Phase 3+ |
| Individual lot detail pages | Phase 3+ |
| Seller / consignor dashboard | Phase 3+ |
| Specialist department sub-pages | Phase 3+ |
| CMS-driven catalogue and provenance records | Phase 3+ |
| Insured international transit integrations | Phase 4 |

---

## Homepage Sections

### 1. Navbar
Fixed translucent header with glassmorphism backdrop. Contains the AUREVANT wordmark, five primary navigation anchors, a curatorial search form, regional/language selectors, and collector icon buttons (Watchlist, Account). All interactive controls trigger accessible `CuratorialModal` notices in the prototype.

### 2. Hero Section
Full-viewport editorial hero combining:
- Cinematic gallery background (`Hero-background.webp` / `.png` via `<picture>`)
- Three.js WebGL 3D marble sculpture (animated rotation, lighting)
- Editorial typesetting with animated lot counter
- Right-side vertical section selector (01–04)
- Bottom curatorial ticker strip

### 3. Closing Soon
Live auction showcase row featuring four lots with:
- Mechanical departure-board rolling countdown timers (HRS MIN SEC)
- Side-by-side thumbnail + curatorial metadata layout
- Full-screen Three.js interactive 3D model inspection on click
- Carousel controls for sub-desktop viewports
- `[DEMO AUCTION]` sandbox disclosures on all estimate values

### 4. Explore the Collections
Six-panel curved exhibition gallery with:
- Deep burgundy atmospheric background with gold architectural arches
- Concave 3D perspective framing for all six department panels
- Polished floor reflections and warm center spotlight
- Guest Access Notice modal on panel interaction
- Mobile horizontal scroll with pagination dots

### 5. Beyond the Object (Story Section)
Editorial storytelling section featuring:
- Left column: `story-background.webp` statue image with floating liquid-glass magnifying lens (WebGL canvas, cursor-following, click ripple)
- Right column: Typographic hierarchy in Instrument Serif + Manrope
- Height-matched columns on desktop
- Touch-drag lens interaction on mobile

### 6. AUREVANT Intelligence (Search Section)
Premium natural-language search experience featuring:
- Minimal soft warm-white canvas (`#FAF8F2`) with clean, spacious layout (no distracting backgrounds or imagery)
- Top label: `AUREVANT INTELLIGENCE` in uppercase lime-green (`#A8CF22`) with generous letter spacing
- Editorial display typography: *"A more intelligent way to discover."* with a lime-to-yellow (`#A8CF22` → `#E7C94A`) gradient on "discover" and coral-red (`#F16B59`) punctuation
- Clean contemporary subtitle: *"Search naturally. Explore exceptional objects with deeper insight."* in muted charcoal (`#66645F`)
- Wide rectangular search bar featuring a fine lime-yellow-coral multi-color transition border, clean white background, left search symbol, and lime-green (`#A8CF22`) `SEARCH` button with dark readable lettering
- Focus interaction: search bar gently elevates with smooth multi-color border transition
- Three supporting features presented text-only with color-coded bar accents:
  - **Curated discoveries** (lime-green bar accent `#A8CF22`)
  - **Provenance insights** (muted-yellow bar accent `#E7C94A`)
  - **Specialist perspective** (coral-red bar accent `#F16B59`)
  - Text-only presentation: no icons, no numbered labels, no floating cards, no vertical dividers
- Loading spinner and `CuratorialModal` feedback on submission with sandbox indexing notice
- `prefers-reduced-motion` compliance across all animations
- Responsive across desktop (1440px), tablet (768px), and mobile (390px/360px) with zero horizontal overflow
- **Backend status:** Frontend interaction complete; search indexing not yet connected (documented via CuratorialModal notice)

### 7. Sell with AUREVANT (Consignment Section)
Editorial consignment section positioned immediately following AUREVANT Intelligence:
- **Asymmetric two-column composition:**
  - Left column: authentic high-resolution editorial photograph (`sell.webp`) showing a specialist wearing white gloves carefully inspecting an exceptional antique object.
  - Right column: curatorial consignment copy with eyebrow, display heading, supporting narrative, primary CTA, secondary link, and editorial reflection.
- **Palette:** Warm ivory canvas (`#F4F0E8`), forest-green typography (`#183D30`), antique gold accents (`#C5A059`), and muted stone (`#D8D0C2`).
- **Typography:**
  - Eyebrow: `SELL WITH AUREVANT` in antique gold IBM Plex Mono with generous tracking.
  - Display heading: *"Give exceptional objects their next chapter."* set in Instrument Serif.
  - Supporting narrative: *"From rare works of art to remarkable collectibles, our specialists help you present your object to the right audience."* in refined Manrope.
  - Editorial reflection: *"Thoughtful guidance. Specialist knowledge. A considered approach to every object."* in italic serif.
- **Custom scroll entrance transition:**
  - Specialist photograph reveals smoothly through a vertical clipping mask (`clip-path: inset(0 0 0 0)`) with subtle vertical settling.
  - Display heading enters with a refined horizontal slide from right.
  - Supporting text elements appear in staggered sequence.
  - Primary CTA reveals with a delicate antique-gold border highlight (`rgba(197, 160, 89, 0.4)`).
  - Respects `prefers-reduced-motion` settings.
- **Guest CTA interaction:**
  - Clicking `REQUEST AN ESTIMATE →` opens the accessible `CuratorialModal` (type: `'consignment'`) explaining account requirements for submitting object details and following consignment status.
  - Clean dismiss via Escape key, close button, or backdrop click with focus management.
- **Secondary link:** *"Discover our selling process"* (gracefully documented placeholder).
- **Responsive design:** seamlessly stacks vertically on mobile (`390px`) and tablet (`768px`) with zero horizontal overflow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **UI** | React 18, TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 |
| **3D & WebGL** | Three.js 0.169 |
| **Animations** | GSAP 3.15 |
| **Icons** | Lucide React |
| **Fonts** | Instrument Serif · Manrope · IBM Plex Mono (Google Fonts, `next/font`) |
| **Build** | Next.js optimized production build |
| **Image Formats** | WebP (primary) / PNG (fallback) via `<picture>` |
| **Testing** | Puppeteer Core (E2E visual verification) |

---

## Color System

| Token | Hex | Role |
|---|---|---|
| Warm Ivory | `#F4F0E8` | Primary canvas surface |
| Museum Dark | `#101113` | Hero backgrounds, dark surfaces |
| Forest Green | `#183D30` | Primary body typography |
| Antique Gold | `#C5A059` | Accent, borders, hover states |
| Gold Bright | `#E7C477` | Hover highlights |
| Stone | `#D8D0C2` | Secondary text, hairlines |
| Burgundy | `#300E17` | Collections section background |

---

## Typography

| Family | Variable | Usage |
|---|---|---|
| Instrument Serif | `--font-instrument-serif` | Display headings, editorial headlines |
| Manrope | `--font-manrope` | Body text, navigation, UI labels |
| IBM Plex Mono | `--font-ibm-plex-mono` | Countdown timers, lot IDs, reference codes |

---

## Installation & Development

```bash
# Install dependencies
cd aurevant-production
npm install

# Start development server (port 3002)
npm run dev

# Type-check (TypeScript strict mode)
npm run typecheck

# Lint
npm run lint

# Production build
npm run build

# Start production server
npm run start
```

---

## Environment Variables

No environment variables are required for the current frontend prototype. When backend integration is authorized (Phase 3), the following will be needed:

```env
# Phase 3 (Not yet implemented)
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_WS_URL=
DATABASE_URL=
NEXTAUTH_SECRET=
```

---

## Public Asset Organization

```
public/
  images/
    Hero-background.png         # Original hero (2.0 MB PNG, preserved)
    Hero-background.webp        # Optimized WebP hero (166 KB, generated)
    sculpture-fallback.png      # Original marble bust (842 KB PNG, preserved)
    sculpture-fallback.webp     # Optimized WebP bust (61 KB, generated)
    story-background.webp       # Story section statue (1.3 MB WebP)
    sell.webp                   # Specialist examining antique object (662 KB WebP)
    painting.jpg                # Fine Art department panel
    vintage watch.jpg           # Horology department panel
    roman coin.jpg              # Numismatics department panel
    old books.jpg               # Rare Books department panel
    jwellery.jpg                # Jewellery department panel
    vintage statue.jpg          # Antiquities department panel
    3d images/                  # Three.js GLTF model assets
    collections/                # Closing Soon auction preview images
    marble_bust_01_4k.blend/    # Source Blender asset (reference only)
```

---

## Component Architecture

```
components/
  common/
    CuratorialModal.tsx         # Accessible modal system (search, consign, account, regional)
  navbar/
    Navbar.tsx                  # Fixed header, search, collector icon actions
    SearchInput.tsx             # Search form with curatorial feedback modal
    MobileMenu.tsx              # Accessible mobile drawer with focus trap
  hero/
    HeroSection.tsx             # Viewport hero with <picture> WebP delivery
    EditorialContent.tsx        # Left editorial text column
    LotOverlay.tsx              # Bottom lot counter overlay
    SectionSelector.tsx         # Right vertical section nav (01–04)
  sculpture/
    SculptureContainer.tsx      # Three.js WebGL sculpture wrapper
    SculptureFallback.tsx       # Static fallback with <picture> WebP
  collections/
    ClosingSoonSection.tsx      # Live auction row + countdown timers
    Interactive3DViewer.tsx     # Three.js 3D lot inspection modal
    ExploreCollectionsSection.tsx  # 6-panel curved exhibition gallery
    GuestAccessNotice.tsx       # Guest access modal (collections)
    CollectionsSection.tsx      # (Video hero section)
  story/
    StorySection.tsx            # Beyond the Object editorial section
    GlasswaveCanvas.tsx         # WebGL floating glass-lens interaction
  intelligence/
    IntelligenceSection.tsx     # AUREVANT Intelligence natural-language search
  sell/
    SellSection.tsx             # Sell with AUREVANT editorial consignment section
```

---

## Quality & Accessibility

| Requirement | Status |
|---|---|
| WCAG 2.2 AA visible focus indicators | ✅ `focus-visible:ring-2 ring-[#C5A059]` global |
| `prefers-reduced-motion` | ✅ CSS media query enforced globally |
| Keyboard navigation (Tab, Escape, Enter) | ✅ All interactive controls |
| ARIA roles (`role="dialog"`, `role="search"`, `aria-modal`, `aria-label`) | ✅ Implemented |
| Focus trapping in modals and mobile drawer | ✅ Implemented |
| Focus restoration on modal/drawer close | ✅ Implemented |
| Semantic landmark regions (`<header>`, `<nav>`, `<main>`, `<section>`) | ✅ Implemented |
| Alt text on all content images | ✅ Implemented |
| No horizontal overflow (all breakpoints) | ✅ `overflow-x: hidden` enforced |
| `fetchPriority="high"` on LCP hero image | ✅ Implemented |
| `loading="lazy"` on below-fold images | ✅ Implemented |
| TypeScript strict mode | ✅ 0 errors |
| ESLint | ✅ 0 errors |

---

## SEO & Metadata

```
Title:       AUREVANT | Exceptional Objects, Curated Auctions
Description: Discover exceptional art, rare books, fine jewellery,
             horology and historic collectibles at AUREVANT Auction House.
OpenGraph:   title, description, image, siteName, type: website
Twitter:     summary_large_image card
Schema.org:  WebSite + Organization + AuctionHouse (JSON-LD)
Robots:      index: true, follow: true
Canonical:   https://aurevant.com
```

---

## Future Roadmap

| Phase | Scope |
|---|---|
| Phase 3 — Backend | Real-time auction engine, registered accounts, consignment API, search index, Prisma/PostgreSQL schema — **Subject to separate Owner authorization** |
| Phase 4 — Production | Live bidding, payment escrow, banking, insured custody, full international saleroom launch — **Subject to separate Owner authorization** |

---

## Demo Disclosures

All auction lots, estimates, bids, and curatorial notices throughout this prototype are simulated demonstration data. No real transactions, custody, payment, or legal auction obligations are created by this prototype.

> `[DEMO AUCTION]` · `[SANDBOX SIMULATION]` · `[CATALOGUE INDEXING IN PROGRESS]`

---

*AUREVANT AUCTION HOUSE — Developed with curatorial precision.*
