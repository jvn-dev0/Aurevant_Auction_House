# ChronoBid Vault — Project Decision Log & Progress Checklist

> [!NOTE]
> ### 🏛️ PHASE 2 AUTHORIZATION GRANTED — CLICKABLE FRONTEND PROTOTYPE ONLY
> **The project owner has explicitly authorized Phase 2 (2026-10-18), strictly limited to building the clickable frontend website prototype.**  
> On 2026-10-19, the Project Owner issued the Phase 1 Specification Amendment ("Multi-Category Auction Marketplace and Pre-Funded Vault Controls"), formally incorporated as Version 2.3 (ADR-025).
> 
> - **Phase 1 Status:** `FORMALLY APPROVED (BASELINE v2.2 — 2026-10-17) WITH AMENDMENT (v2.3 — 2026-10-19)`  
> - **Phase 2 Status:** **`AUTHORIZED (Clickable Frontend Prototype Only — In Progress)`**  
> - **Phase 3+ Status:** **`NOT AUTHORISED — PRODUCTION BACKEND & LIVE PAYMENTS STRICTLY PROHIBITED`**

---

## 1. Architectural & Design Decision Log

| ID | Date | Category | Decision Summary | Approved Specification / Current Status | State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ADR-001** | 2026-10-16 | Project Scope | ChronoBid Vault as a curated horology auction platform | Specialized in rare, vintage, and historically significant horological timepieces (initial debut collection). | **Approved** |
| **ADR-002** | 2026-10-16 | Design Identity | Editorial-parallax, premium-light, monograph publication style | Rejects generic SaaS patterns, purple gradients, and excessive glassmorphism. | **Approved** |
| **ADR-003** | 2026-10-16 | Typography | Instrument Serif + Manrope + IBM Plex Mono | Display: Instrument Serif; Body/UI: Manrope; Technical/Data: IBM Plex Mono. | **Approved** |
| **ADR-004** | 2026-10-16 | Color Palette | Warm Paper (`#F4F0E8`), Deep Forest (`#182720`), Acid Lime (`#D7E65A`), Stone (`#D8D0C2`) | Warm tactile baseline, high contrast readability (12.8:1), precision highlight color for urgent cues. | **Approved** |
| **ADR-005** | 2026-10-16 | Tech Stack | Next.js App Router + React + TypeScript + Tailwind CSS | Component-based, maintainable, typed architecture (authorized for Phase 2 prototype). | **Approved** |
| **ADR-006** | 2026-10-16 | User Model | Unified Account Model (Buyer + Consignor) | Single login profile supporting both buyer and consignor actions; admin privileges separated. | **Approved** |
| **ADR-007** | 2026-10-16 | Simulation Integrity | Transparent sandbox boundaries for demo functionality | No misrepresentation of mock bidding, frontend auth, or dummy payments as real transactions. | **Approved** |
| **ADR-008** | 2026-10-16 | Tooling | UI/UX Pro Max verified & installed for Antigravity | Available in `.agent/skills/ui-ux-pro-max` for design system guidance. | **Approved** |
| **ADR-009** | 2026-10-16 | Demo Catalog | Provisional Marquee Timepiece Models | Initial 6 models (*Patek 3520D, AP 5402ST, Rolex 6239, Omega 2915, Cartier Tank Cintrée, Lange Datograph*) remain **Provisional** pending exact reference, documentation, and image rights checks. | **Provisional** |
| **ADR-010** | 2026-10-16 | Sandbox Integrity | Universal Demo Data Labeling | All fictional listings, prices, sellers, bids, paddles, and countdowns must carry explicit `[DEMO DATA]` badges. | **Approved** |
| **ADR-011** | 2026-10-16 | Homepage Sequence | Approved 11-Section Editorial Order | Announcement &rarr; Header &rarr; Hero ("Objects worth waiting for.") &rarr; Editorial Intro &rarr; Collection &rarr; Interlude &rarr; Saleroom &rarr; How It Works &rarr; Trust &rarr; Invitation &rarr; Footer. | **Approved** |
| **ADR-012** | 2026-10-16 | Anti-Sniping Rule | 120-Second Soft-Close Clock Reset & 10-Extension Cap | Approved Clock-Reset Model (Prototype Simulation): Pre-deadline bids are evaluated under normal validation. A valid bid submitted with strictly less than 120 seconds remaining (00:01:59 or less) resets the countdown clock to exactly 120 seconds (00:02:00) provided fewer than 10 extensions have been consumed. A bid at exactly 00:02:00 is accepted under normal validation, but does not reset the clock or consume an extension. A hard cap of 10 extensions is enforced per lot (+20 minutes max overrun). Once 10 extensions have been consumed, valid pre-deadline bids may still be accepted under normal validation, but the clock never resets again and the lot closes definitively at 00:00:00. Bids submitted at or after 00:00:00 are rejected. | **Approved (Prototype Simulation)** |
| **ADR-013** | 2026-10-16 | Optional Features | Roadmap Deferral of 5 Showcase Features | Selected approach: defer world clocks, live hammer price ticker, historic sales archive, horological journal, and consignment valuation calculator to future product roadmap. Excluded from Phase 1 core homepage. Agreed 11-section homepage sequence strictly preserved. | **Selected Approach (Deferred to Future Roadmap)** |
| **ADR-014** | 2026-10-16 | Image Governance | Formal Image Manifest & License Policy | Manifest table required; no invented URLs, no stock imagery claiming authentic inspection. | **Approved** |
| **ADR-015** | 2026-10-16 | Accessibility | WCAG 2.2 AA Target | Proposed accessibility target including contrast, focus management, and screen-reader polite regions. | **Approved Direction** |
| **ADR-016** | 2026-10-16 | Appraisal Simulation | Simulated Demo Feedback Classification | 48-hour appraisal ticket is classified strictly as simulated demo feedback, not a legally binding service commitment. | **Approved** |
| **ADR-017** | 2026-10-16 | Service Boundaries | Escrow Custody & Insured Transit Classification | Escrow and insured courier transit are formally classified as proposed future services, not currently available operational services. | **Approved** |
| **ADR-018** | 2026-10-16 | Governance Policy | Strict Implementation Gate & No-Coding Rule | All coding, scaffolding, and package installation absolutely prohibited until separate, explicit written authorization from the project owner (Granted for Phase 2 frontend prototype on 2026-10-18). | **Approved & Enforced** |
| **ADR-019** | 2026-10-16 | Bid Increments | 5-Tier Increment Schedule & Option B Jump-Bid Ladder | Approved for Prototype Simulation Only (Not Production Authorization): 5-tier schedule (Under $10k: +$250; $10k–$49,999: +$1,000; $50k–$99,999: +$2,500; $100k–$249,999: +$5,000; $250k+: +$10,000). Custom jump-bids follow Option B (Destination-Tier Ladder Model), requiring any custom bid crossing into a higher tier to land on an exact multiple of the destination tier increment anchored at its lower boundary. | **Approved (Prototype Simulation Only)** |
| **ADR-020** | 2026-10-16 | Technical Auth | Draft Authentication Parameter Thresholds | Unapproved draft assumptions pending security review: 6-digit email PIN, 15-minute token expiry, 10-character password rule, and 5 failed attempts per 15 minutes throttling threshold. Not approved or production-ready; formal security review required before implementation. Prototype test PIN (123456) is classified strictly as an arbitrary testing convenience fixture for demonstration. | **Draft Assumptions (Unapproved — Pending Security Review)** |
| **ADR-021** | 2026-10-16 | Currency Display | 7-Currency Display & Verified ECB Demonstration Rates | Approved for Prototype Simulation/Display Only (Not Production Authorization): USD is base calculation currency. 7 display currencies (USD, EUR, CHF, GBP, JPY, HKD, SGD) use fixed demonstration multipliers rounded to documented precision (EUR 0.8887, GBP 0.7499, CHF 0.8240, JPY 158.02, HKD 7.8482, SGD 1.2792), mathematically derived from verified European Central Bank reference rates of 16 October 2026. Prototype conversions execute directly against these rounded multipliers (not unrounded rates). Stored in sessionStorage. Missing conversions display USD base with [CONVERSION UNAVAILABLE]. | **Approved (Prototype Simulation/Display Only)** |
| **ADR-022** | 2026-10-16 | Bidding Engine | Client-Side Proxy Bidding Simulation | Demo prototype automatically steps bids up to user's confidential ceiling against simulated bots. | **Approved** |
| **ADR-023** | 2026-10-16 | Mobile UX | Mobile Sticky Bidding Bar | On viewports &lt;768px, scrolling past Section 7 pins a compact 56px bottom bar with lot reference, current ask, and bid trigger. | **Approved** |
| **ADR-024** | 2026-10-16 | Asset Resilience | Image Loading Failure & Fallback Monogram | Failing or broken image URLs automatically render a `#EDE7DC` monogram fallback card preserving container aspect ratio (CLS &lt; 0.02). | **Approved** |
| **ADR-025** | 2026-10-19 | Product Architecture & Bidding Controls | Multi-Category Marketplace & Pre-Funded Vault Bidding Controls | Defines platform as a multi-category, multi-lot digital auction marketplace with fine horology as initial debut. Mandates Pre-Funded Vault system with three distinct values: Total Vault Balance, Reserved Funds, and Available to Bid, where Available to Bid = Total Vault Balance − Reserved Funds − Other Applicable Holds. Rejects bids exceeding Available to Bid prior to acceptance (e.g. ₹1,00,000 available rejecting ₹2,00,000 bid). Reserves funds on leading bids, immediately releases upon being outbid, holds funds on winning lots until simulated settlement, enforces cross-lot global fund constraint preventing double-counting, and provides accessible feedback. Client-side prototype simulation only; live wallets/rails prohibited. | **Approved (Phase 1 Amendment v2.3)** |
| **ADR-026** | 2026-10-20 | Global Marketplace, Currency & Auth UX | 4-Tier Currency Model, INR Currency, Dual-Price Invariant & Auth Sandbox Redesign | Formally distinguishes 4 currencies: (1) Auction Currency, (2) Vault Funding Currency, (3) Display Currency, and (4) Seller Settlement Currency. Adds INR (₹, multiplier 84.07, locale en-IN derived from ECB/RBI reference rates 16 October 2026) to display currencies (now USD, EUR, GBP, CHF, JPY, HKD, SGD, INR). Mandates dual-currency pricing invariant: base auction currency (USD) is always visible alongside converted estimates (e.g. ₹18,49,540 [EST. DEMO] / $22,000 USD) with fallback [CONVERSION UNAVAILABLE] for unavailable rates. Enforces cross-lot Vault affordability benchmarks (₹1,00,000 vs ₹2,00,000 rejection; ₹70,000 + ₹60,000 multi-lot limit). Upgrades auth routes (/auth/login, /auth/register, /auth/verify-email, /auth/reset-password) to 2-column desktop editorial layouts, 16px inputs, accessible inline errors, failed-login throttling, simulated Google Sign-in with [SIMULATED AUTH PROVIDER — PROTOTYPE ONLY] disclosure, and accessible simulated CAPTCHA anti-bot verification with [SIMULATED ANTI-BOT VERIFICATION] disclosure. | **Approved Direction (Prototype Simulation)** |
| **ADR-027** | 2026-10-20 | Prototype Simulation & State Persistence | Session-Based Prototype State Persistence via `sessionStorage` | Preserves demo Vault balance, reserved funds, available to bid, leading bid commitments, active countdown overrides, and simulated account state across client page reloads and route transitions during the active browser session. Automatically resets when browser tab/window is closed, or manually via a "Reset Demo State" control. Never stores plain-text passwords or secret keys. Enforces strict schema validation and sanitization upon deserialization. Displays persistent demo disclosure indicator that data is held in ephemeral browser session memory only. Approved strictly as a client-side prototype simulation aid; not a production database or persistence model. | **Approved Direction (Prototype Simulation)** |

---

---

## 2. Phase-by-Phase Progress Checklist

### Phase 1: Requirements & Design Specification
- [x] Product requirements and domain modeling defined
- [x] User roles specified (Exploring User, Registered Buyer, Verified Consignor, Admin)
- [x] Complete user journeys documented (Guest, Buyer, Consignor, Combined, Exploring)
- [x] Expanded authentication requirements (signup, login, logout, visibility, reset, PIN, errors, expiry, seller KYC)
- [x] Approved 11-section homepage sequence and interaction rules documented
- [x] How It Works corrected (Escrow & Insured Transit classified as proposed future services)
- [x] Seller journey corrected (48-hour appraisal ticket classified as simulated demo feedback)
- [x] Exact typography scales (desktop 88-112px hero, mobile 46-58px hero) and 6 viewports mapped
- [x] Spacing, image ratios (4:5, 16:9), and motion parameters (ms limits, reduced motion) documented
- [x] Image Manifest schema and strict licensing rules established
- [x] Provisional status of 6 watch references codified
- [x] Comprehensive Demo vs. Production boundary matrix defined across 8 core dimensions
- [x] Trust, compliance, and service claims corrected to reflect future capabilities
- [x] Accessibility (WCAG 2.2 AA target), performance targets, and testing matrix mapped
- [x] Image loading failure & fallback card acceptance criteria added
- [x] Mobile sticky bidding bar acceptance criteria added
- [x] Currency conversion and proxy bidding acceptance criteria added
- [x] ADR-012: 120-second soft-close clock-reset model approved for prototype simulation (valid pre-deadline bids evaluated regardless of extension count; qualifying bid with <120s remaining resets countdown to 00:02:00 if <10 extensions consumed; bid at exactly 00:02:00 does not reset timer; 10-extension cap per lot; pre-deadline bids accepted post-cap under normal validation without clock reset; bids at or after deadline rejected; lot closes definitively at 00:00:00)
- [x] ADR-013: Five optional features (world clocks, live ticker, sales archive, horological journal, appraisal calculator) deferred to future product roadmap and excluded from Phase 1 core homepage
- [x] ADR-019: 5-tier bid increment schedule (<$10k: +$250, $10k–$49,999: +$1,000, $50k–$99,999: +$2,500, $100k–$249,999: +$5,000, $250k+: +$10,000) and Option B Destination-Tier Ladder Model approved for prototype simulation only (not production authorization)
- [x] ADR-020: Authentication parameters (6-digit PIN, 15m token expiry, 10-char password rule, 5 attempts/15m) maintained strictly as unapproved draft assumptions pending security review; test PIN 123456 classified as arbitrary testing fixture
- [x] ADR-025: Multi-Category Marketplace & Pre-Funded Vault Bidding Controls incorporated into Phase 1 Specification as Version 2.3 (dated 2026-10-19)
- [x] Baseline v2.2 preserved as byte-for-byte archive ([phase1_requirements_and_design_specification_v2.2_approved_baseline.md](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/phase1_requirements_and_design_specification_v2.2_approved_baseline.md))
- [x] Active working specification synchronized ([phase1_requirements_and_design_specification.md](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/phase1_requirements_and_design_specification.md))
- [x] Version 1.0 preserved as archive ([phase1_requirements_and_design_specification_v1.md](file:///C:/Users/kbjee/.gemini/antigravity/brain/a1cb3096-bf53-49f1-84e2-572bb49a89f3/phase1_requirements_and_design_specification_v1.md))
- [x] Project owner product direction review completed and confirmed (2026-10-16: vision, design approach, 11-section homepage, and journeys aligned; provisional & pending items strictly retained)
- [x] **FORMAL OWNER PHASE 1 SIGN-OFF** (Formally approved by Project Owner on 2026-10-17 as baseline v2.2; provisional holdings and pending details retained)
- [x] **PHASE 2 AUTHORIZED BY PROJECT OWNER** (Explicit written authorization on 2026-10-18 strictly for clickable frontend prototype; production backend strictly prohibited)

---

### Phase 2: Design System, Tokens, Base Component Kit & Complete Frontend Prototype
> **STATUS: IMPLEMENTATION COMPLETE & VERIFIED — FORMAL CLOSURE PENDING OWNER SIGN-OFF.**  
> *(Production backend infrastructure, live financial wallets, payment processing, and escrow custody remain strictly prohibited)*
- [x] Next.js App Router project scaffolding (Next.js 14, React 18, TypeScript)
- [x] Tailwind CSS token configuration (`#F4F0E8`, `#182720`, `#D7E65A`, `#D8D0C2`)
- [x] Font loader configuration (`Instrument Serif`, `Manrope`, `IBM Plex Mono`)
- [x] Base component implementation (`Button`, `Badge`, `CountdownClock`, `LotCard`, `SpecGrid`, `VaultBadge`)
- [x] 11-section editorial-parallax monograph homepage
- [x] All 14 leaf routes implemented and returning HTTP 200
- [x] Client-side Pre-Funded Vault state machine, cross-lot affordability, and soft-close anti-sniping simulation
- [x] Tab-scoped session state persistence (`sessionStorage`), data sanitation, and safe demo resets (ADR-027)
- [x] Automated test suites passing (67/67 assertions: 51/51 QA verification + 16/16 CSS and asset delivery)
- [ ] Phase 2 Owner Acceptance Gate (Formal written sign-off by Project Owner in `PHASE2_CLOSURE_REPORT.md` pending)

---

### Phase 3: Production Architecture, Security & Financial Systems Design
> **STATUS: DOCUMENTATION COMPLETE & SUBMITTED FOR OWNER REVIEW — CODING STRICTLY PROHIBITED.**
- [x] High-level system architecture and ADR-P3-001 (Unified TypeScript Modular Monolith vs. Polyglot)
- [x] STRIDE threat model, asset taxonomy, and authentication security specification (`PHASE3_SECURITY_THREAT_MODEL.md`)
- [x] Pre-Funded Vault double-entry bookkeeping ledger, atomic reservations, and mathematical concurrency proofs (`PHASE3_VAULT_LEDGER_DESIGN.md`)
- [x] International commerce design, 4-tier currency model, and FX rate ingestion (`PHASE3_INTERNATIONAL_COMMERCE_DESIGN.md`)
- [x] Implementation readiness checklist, Gate 1–4 criteria, and Go/No-Go controls (`PHASE3_IMPLEMENTATION_READINESS_CHECKLIST.md`)
- [x] Strategic owner decisions register re-structured into 3 dependency tiers (`PHASE3_OWNER_DECISIONS_REGISTER.md`)
- [x] Final architecture review report (`PHASE3_FINAL_REVIEW_REPORT.md`)
- [ ] Formal Project Owner Review and Phase 3 Approval (Pending)

---

### Phase 4: Core Services, Relational Database & Production Authentication
> **STATUS: NOT AUTHORISED — CODING STRICTLY PROHIBITED PENDING OWNER WRITTEN AUTHORIZATION.**
- [ ] Aurora PostgreSQL Multi-AZ cluster & ElastiCache Redis provisioning (subject to DEC-P3-007)
- [ ] Database schema migrations (`users`, `sessions`, `kyc_profiles`, `lots`, `bids`)
- [ ] Production Google OAuth 2.0 / OIDC integration with PKCE & state verification (subject to DEC-P3-002)
- [ ] Server-side Cloudflare Turnstile anti-bot verification middleware (subject to DEC-P3-006)
- [ ] Postmark transactional email dispatch with HMAC 6-digit PIN verification
- [ ] User profile, watchlist, and consignor role management APIs
- [ ] Phase 4 Automated Integration Testing & Approval Gate

---

### Phase 5: Pre-Funded Vault Ledger, Payment Rails & Banking Integration
> **STATUS: NOT AUTHORISED — LIVE FINANCIAL RAILS STRICTLY PROHIBITED.**
- [ ] Immutable double-entry bookkeeping ledger engine (`vault_ledger_entries`, `vault_accounts`)
- [ ] Atomic balance reservation, release, and hold management APIs
- [ ] Adyen / Stripe payment gateway integration for credit/debit deposits and 3DS2 authentication (subject to DEC-P3-003)
- [ ] Direct bank wire (Fedwire/CHAPS/SWIFT) incoming transfer webhook processing and automated MT940 reconciliation
- [ ] Withdrawal request workflow with automated AML compliance checks
- [ ] Hourly FX rate ingestion worker (ECB & OANDA feeds)
- [ ] Phase 5 Financial Concurrency Simulation & Reconciliation Audit Gate ($0.00 variance)

---

### Phase 6: Real-Time Live Saleroom Engine & Saleroom WebSocket
> **STATUS: NOT AUTHORISED — CODING STRICTLY PROHIBITED.**
- [ ] Server-authoritative Saleroom WebSocket Gateway (Fastify Monolith with Go extraction trigger per ADR-P3-001)
- [ ] NTP sub-millisecond clock synchronization pipeline
- [ ] Redis distributed locking (Redlock) and channel broadcasting
- [ ] Server-authoritative ADR-012 Soft-Close clock reset and 10-extension hard cap enforcement
- [ ] Option B Destination-Tier ladder validation on incoming custom jump-bids
- [ ] Real-time bid stream ingestion, sequence numbering, and lag compensation
- [ ] Phase 6 k6 Concurrency Benchmark Gate (10,000 connections, <150ms p99 latency, 0 race conditions)

---

### Phase 7: Custody Logistics, Provenance Dossiers & Settlement Automation
> **STATUS: NOT AUTHORISED — IMPLEMENTATION STRICTLY PROHIBITED.**
- [ ] Malca-Amit (or Brink's) vault intake and barcode tracking API integration (subject to DEC-P3-004)
- [ ] High-resolution 4:5 horological macro-photography and digital provenance dossier viewer
- [ ] Automated post-auction winning invoice generator with tiered Buyer's Premium calculation (subject to DEC-P3-008)
- [ ] Consignor settlement payout engine and automated wire disbursement
- [ ] Private consignment appraisal workflow and formal specialist review dashboard
- [ ] Phase 7 Physical Specimen Dry-Run Gate (Intake vaulting to buyer handover)

---

### Phase 8: Comprehensive Security Audits, Compliance & Pilot Auction
> **STATUS: NOT AUTHORISED — IMPLEMENTATION STRICTLY PROHIBITED.**
- [ ] Independent CREST-accredited third-party penetration testing and source code security audit
- [ ] SOC 2 Type II readiness audit and PCI-DSS SAQ-A certification
- [ ] Tiered KYC/AML integration with Persona (identity verification, PEP/sanctions screening; subject to DEC-P3-005)
- [ ] Disaster recovery, failover testing, and database backup verification
- [ ] Private invitational dry-run pilot auction with real pre-funded deposits and test lots
- [ ] Phase 8 Zero-Vulnerability Security Gate & Legal/Compliance Sign-off

---

### Phase 9: Public Production Launch & Operational Runbooks
> **STATUS: NOT AUTHORISED.**
- [ ] Public domain DNS cutover (`https://chronobid.com` / `https://vault.chronobid.com`)
- [ ] 24/7 saleroom monitoring, on-call rotation runbooks, and incident response protocols
- [ ] Debut public curated auction featuring verified, authenticated marquee timepieces
- [ ] Post-launch operational review and retrospective
