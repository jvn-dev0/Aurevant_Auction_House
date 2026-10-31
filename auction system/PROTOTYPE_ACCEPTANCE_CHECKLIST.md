# ChronoBid Vault — Prototype Acceptance Checklist & Review Framework

> [!NOTE]
> ### 🏛️ PHASE 2 AUTHORIZATION GRANTED — CLICKABLE FRONTEND PROTOTYPE ONLY
> **The project owner has explicitly authorized Phase 2 (2026-10-18), strictly limited to building the clickable frontend website prototype.**  
> On 2026-10-19, the Project Owner issued the Phase 1 Specification Amendment ("Multi-Category Auction Marketplace and Pre-Funded Vault Controls"), formally incorporated as Version 2.3.
> 
> - **Phase 1 Status:** `FORMALLY APPROVED (BASELINE v2.2 — 2026-10-17) WITH AMENDMENT (v2.3 — 2026-10-19)`  
> - **Phase 2 Status:** **`AUTHORIZED (Clickable Frontend Prototype Only — In Progress)`**  
> - **Phase 3+ Status:** **`NOT AUTHORISED — PRODUCTION BACKEND & LIVE PAYMENTS STRICTLY PROHIBITED`**

---

## 1. Quality & Acceptance Architecture

The **Prototype Acceptance Checklist** provides a testable, measurable review framework for validating the ChronoBid Vault clickable prototype across all 14 approved leaf routes and pre-funded Vault controls.

Every test case is defined with an explicit verification method, expected outcome, governance status, and pass/fail condition.

---

## 2. Section 1: Route & Page Readiness Verification (14 Leaf Routes)

| Test ID | Route Path | Verification Criteria & Expected Behavior | Pass / Fail Condition | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TC-R01** | `/` (Homepage) | Renders all 11 approved editorial sections in exact sequence (Announcement &rarr; Header &rarr; Hero &rarr; Editorial &rarr; Collection &rarr; Interlude &rarr; Saleroom &rarr; How It Works &rarr; Trust &rarr; Invitation &rarr; Footer) with zero horizontal overflow; includes multi-category filter chips. | Pass: 11 sections in order; no overflow. | Approved Baseline |
| **TC-R02** | `/auctions/live` | Displays active saleroom marquee with live countdown clock, pulsating Acid Lime indicator (`● SALEROOM ACTIVE`), live bid feed, interactive quick-bid buttons, and compact Vault available balance chip. | Pass: Clock counts down; bid feed updates; Vault chip visible. | Approved Baseline |
| **TC-R03** | `/auctions/upcoming` | Renders preview catalog with working multi-category (Horology, Coins, Jewelry, Art) and era filter chips; displays estimated opening bids and registration CTAs. | Pass: Filtering works in <260ms; CLS < 0.02. | Approved Baseline |
| **TC-R04** | `/auctions/lots/[lotSlug]` | Renders deep lot dossier with 4:5 image gallery, thumbnail switcher, calibre/spec SpecGrid, condition report drawer, Available to Bid indicator, and live bidding console. | Pass: Thumbnails switch; specs expand; Available balance shown. | Approved Baseline |
| **TC-R05** | `/how-it-works` | Displays 4 sequential steps; explicitly designates Escrow Custody and Insured Armored Transit as `[PROPOSED FUTURE SERVICE — NOT OPERATIONAL]`. | Pass: Explicit disclosures present. | Approved Baseline |
| **TC-R06** | `/transparency` | Displays 3 transparency pillars, Timegrapher condition audit template, Pre-Funded Vault reserve policies, and full 8-dimension Demo vs. Production matrix. | Pass: All 8 matrix dimensions visible. | Approved Baseline |
| **TC-R07** | `/consign` | Renders 4-step intake wizard; validates inputs; generates simulated ticket `CBV-INTAKE-XXXX` with demo feedback notice. | Pass: Validates fields; generates mock ticket. | Approved Baseline |
| **TC-R08** | `/account/bids` | Displays active bids, outbid alerts, saved watchlist lots, and simulated invoices for won lots with demo payment links. | Pass: Displays bids/watchlist; demo invoices. | Approved Baseline |
| **TC-R09** | `/account/consignments` | Displays submitted intake tickets with simulated status `Under Specialist Review`; demonstrates reserve acceptance toggle. | Pass: Shows tickets; 48h demo notice visible. | Approved Baseline |
| **TC-R10** | `/account/settings` | Displays virtual demo paddle card (`Paddle #4102`), profile fields, currency selection, onboarding intent switcher, and 3-tier Vault balance cards (`[DEMO DATA]`). | Pass: Shows paddle card; intent changeable; Vault balances render. | Approved Baseline |
| **TC-R11** | `/auth/login` | Renders email/password form with inline validation, quick-fill demo buttons, throttling alert after 5 failures (unapproved draft assumption), and generic error banner. | Pass: Rejects bad logins; throttles after 5. | Draft Assumption |
| **TC-R12** | `/auth/register` | Stepped signup flow: Step 1 Account creation &rarr; Step 2 Email PIN verification (`/auth/verify-email` with arbitrary test PIN `123456`) &rarr; Step 3 Intent selection routing (routes to saleroom, consign, dashboard, or explore). | Pass: Test PIN activates account; routes by intent. | Draft Assumption |
| **TC-R13** | `/auth/reset-password` | Dedicated password recovery page: validates simulated 15-minute token on mount; renders expired/invalid token states with recovery trigger; enforces 10-char password complexity & equality; redirects to `/auth/login` with success banner. | Pass: Validates token on mount; recovers from expired link; enforces password rules. | Draft Assumption |

---

## 3. Section 2: Critical User Journey Verification

| Test ID | User Journey | Verification Flow | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TC-J01** | **Guest Browsing** | Guest enters `/`, reads hero, filters collection across categories, clicks Rolex 6239 card. | All views load without login blockers; clicking "Save to Watchlist" opens Auth Drawer. | Pass / Fail |
| **TC-J02** | **Buyer Bidding & Vault Verification** | Authenticated buyer enters `/auctions/live`, reviews Available to Bid, clicks "Bid Next", observes fund reservation, and observes bot counter-bid with outbid fund release. | Available balance verified; bid accepted moves funds to Reserved Funds; bot counter-bids after 3–6s; user receives outbid toast and reserved funds are released back to Available to Bid. | Pass / Fail |
| **TC-J03** | **Soft-Close Anti-Sniping & Late Bidding** | Buyer places valid bid on active lot. | Valid pre-deadline bids are evaluated under normal validation. If <120s remaining and <10 extensions consumed, clock resets to exactly 120s (00:02:00) and extension count increments (e.g., 1/10); Acid Lime badge appears. Bids placed at exactly 00:02:00 are accepted without timer reset or extension increment. After 10 extensions, valid pre-deadline bids are accepted without timer reset. Bids submitted at or after 00:00:00 are rejected. | Pass / Fail |
| **TC-J04** | **Consignor Submission** | Collector completes `/consign` wizard (4 steps) and submits. | Generates `CBV-INTAKE-XXXX` tracking ticket; routed to `/account/consignments`. | Pass / Fail |
| **TC-J05** | **Combined Account Switch** | Member toggles between "My Bids & Watchlist" and "Consigned Lots & Valuations". | Smooth transition within `/account` without requiring re-authentication. | Pass / Fail |
| **TC-J06** | **Exploring-User Journey** | Visitor signs up and selects "Just exploring" on Step 3. | Redirected to curated editorial catalog view without aggressive sales prompts. | Pass / Fail |

---

## 4. Section 2A: Pre-Funded Vault & Multi-Category Verification (v2.3 Amendment)

| Test ID | Verification Dimension | Test Procedure & Benchmark | Expected Acceptance Result | Pass / Fail |
| :--- | :--- | :--- | :--- | :---: |
| **TC-VLT-01** | **Three-Tier Balance Display** | Inspect `/account/settings` and saleroom consoles. | Renders Total Vault Balance, Reserved Funds, and Available to Bid in `IBM Plex Mono` with `[DEMO DATA]` badges. Formula strictly balances: $\text{Available} = \text{Total} - \text{Reserved}$. | [ ] |
| **TC-VLT-02** | **Maximum Bid Enforcement** | Authenticated user with ₹1,00,000 Available to Bid attempts to place a ₹2,00,000 bid. | Bid is rejected immediately prior to acceptance; no ask update; no countdown extension; no fund reservation. | [ ] |
| **TC-VLT-03** | **Accessible Insufficient Funds Alert** | Trigger bid rejection via `TC-VLT-02`. | UI renders exact message: *"Bid not accepted. Your available Vault balance is insufficient for this bid. Add eligible funds or reduce your bid amount."* via `role="alert"` / `aria-live="polite"`; focus stays on bid input. | [ ] |
| **TC-VLT-04** | **Leading Bid Fund Reservation** | User places valid $40,000 leading bid. | $40,000 is deducted from Available to Bid and added to Reserved Funds in `<100ms`; active commitments list shows lot. | [ ] |
| **TC-VLT-05** | **Outbid Fund Release** | User with leading $40,000 bid is outbid by simulated bot. | Reserved $40,000 is immediately released back to Available to Bid; user status changes to `[OUTBID]`. | [ ] |
| **TC-VLT-06** | **Cross-Lot Global Enforcement** | User with ₹1,00,000 total balance places leading ₹70,000 bid on Lot A, then attempts ₹60,000 bid on Lot B. | Second bid on Lot B is blocked because remaining Available to Bid (₹30,000) is less than ₹60,000; insufficient funds alert displayed. | [ ] |
| **TC-VLT-07** | **Multi-Category Navigation** | Select category chips (Horology, Coins, Jewelry, Art) on `/auctions/upcoming`. | Catalog updates within 260ms; lots display independent countdowns, current asks, and dedicated dossiers. | [ ] |
| **TC-VLT-08** | **Currency-Neutral Eligibility** | Switch currency from USD to EUR; attempt bid at maximum eligibility. | Visual display converts using 16 Oct 2026 ECB demo multiplier (0.8887); base eligibility ceiling remains mathematically unchanged. | [ ] |
| **TC-VLT-09** | **INR Display & Dual-Currency Invariant** | Select INR in header dropdown or settings. | All lots display converted INR estimates (multiplier 84.07, locale `en-IN`) alongside canonical base USD price: `[INR Amount] [EST. DEMO] / $[Base USD] USD` (e.g. `₹18,49,540 [EST. DEMO] / $22,000 USD`); rate notices visible in menu. | [ ] |
| **TC-VLT-10** | **Conversion Fallback Invariant** | Simulate missing rate. | Renders `[CONVERSION UNAVAILABLE]` alongside base USD price without crashing. | [ ] |
| **TC-AUTH-01** | **2-Column Editorial Auth Layout** | View `/auth/login` and `/auth/register` on viewports ≥1024px vs. <1024px. | Desktop renders balanced 2-column split (Deep Forest brand panel + Warm Paper form); mobile renders clean single column. | [ ] |
| **TC-AUTH-02** | **iOS Auto-Zoom Prevention (16px Inputs)** | Inspect CSS on all auth form text, email, and password inputs. | Form inputs have explicit font size of 16px (`text-base`); labels are 14–16px in `Manrope`. | [ ] |
| **TC-AUTH-03** | **Simulated Third-Party Authentication** | Click "Continue with Google" on `/auth/login` or `/auth/register`. | Signs in/registers immediately as demonstration collector with persistent disclaimer `[SIMULATED AUTH PROVIDER — PROTOTYPE ONLY]`. | [ ] |
| **TC-AUTH-04** | **Accessible Simulated CAPTCHA** | Interact with "I am human [Sandbox Verification]" checkbox using Space/Enter. | Keyboard toggles verification state; displays `[SIMULATED ANTI-BOT]` tag; submitting unverified form is blocked with alert. | [ ] |

---

## 4. Section 3: Navigation & Interaction Consistency

| Test ID | Interaction Element | Verification Method | Acceptance Standard |
| :--- | :--- | :--- | :--- |
| **TC-N01** | Header Scroll Morph | Scroll window past 40px on any route. | Morphs from transparent to fixed frosted glass (`background: rgba(244, 240, 232, 0.92); backdrop-filter: blur(8px)`) over 200ms. |
| **TC-N02** | Active Route Indicator | Navigate across routes in header. | Current route link displays a 1.5px `#182720` underline and `aria-current="page"`. |
| **TC-N03** | Mobile Menu Drawer | Click hamburger on viewport <1024px. | Slides in from right over 200ms; traps keyboard focus; `Escape` closes drawer. |
| **TC-N04** | Currency Multiplier (8 Currencies) | Select INR or EUR in currency switcher (prototype display only). | Instantly converts all estimates and bids executing directly against fixed demonstration multipliers rounded to documented precision (EUR 0.8887, INR 84.07; derived from 16 Oct 2026 ECB and RBI reference rates) via `Intl.NumberFormat`; renders dual currency on cards; stores in sessionStorage. |
| **TC-N05** | Mobile Sticky Bidding Bar | Scroll past Section 7 on viewport <768px. | Pins 56px bottom bar with lot reference, current ask, and bid trigger; respects safe-area insets. |

---

## 5. Section 4: Responsive Viewport Matrix

| Viewport Name | Target Width | Grid Columns | Max Container Width | Verification Standard | Pass/Fail |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Wide Desktop** | `1440px+` | 12 | `1360px` | 3-column collection, split-pane saleroom, zero horizontal scroll. | [ ] |
| **Standard Desktop** | `1280px – 1439px` | 12 | `1200px` | 3-column collection, split-pane saleroom, padding 40px. | [ ] |
| **Small Desktop** | `1024px – 1279px` | 12 | `960px` | 2-column collection, split-pane saleroom, padding 32px. | [ ] |
| **Tablet Portrait** | `768px – 1023px` | 8 | `720px` | 2-column collection, stacked saleroom, 2x2 How-It-Works. | [ ] |
| **Mobile Large** | `390px – 767px` | 4 | `100%` | 1-column collection, accordion steps, mobile sticky bar active. | [ ] |
| **Mobile Compact** | `360px – 389px` | 4 | `100%` | Typography scales appropriately (hero 46–58px); body ≥16px. | [ ] |

---

## 6. Section 5: Accessibility & WCAG 2.2 AA Compliance

- [ ] **Contrast Ratio (Deep Forest on Warm Paper):** Minimum 12.87:1 verified on all typography.
- [ ] **Contrast Ratio (Deep Forest on Acid Lime):** Minimum 11.4:1 verified on all active bid triggers and badges.
- [ ] **Focus Management:** Visible 2px solid `#182720` focus ring with 2px offset on all interactive elements.
- [ ] **Focus Trapping:** Keyboard focus trapped inside all open dialogs, drawers, and modals; pressing `Escape` closes modal and restores focus to trigger button.
- [ ] **Screen Reader Live Regions:** Dynamic bid changes, countdown extensions, and outbid notifications announced via `aria-live="polite"` regions.
- [ ] **Accessible Icon Names:** 100% of Lucide icon buttons contain explicit `aria-label` or hidden `.sr-only` descriptions.
- [ ] **Form Labeling:** 100% of input fields have associated `<label>` elements with valid `htmlFor` attributes.
- [ ] **Automated Accessibility Audit:** Zero `axe-core` violations across all 12 rendered routes.

---

## 7. Section 6: Reduced-Motion Support

- [ ] **Media Query Verification:** Enable `@media (prefers-reduced-motion: reduce)` in browser dev tools.
- [ ] **Transform Suppression:** All transform translations, scale zooms (including image hover 1.025), and parallax coordinate tracking are strictly disabled.
- [ ] **Transition Fallback:** Transitions convert to clean, instantaneous or minimal opacity cross-fades (`< 150ms`).
- [ ] **Usability Preservation:** All interactive functionality, filter switching, and modal operations remain 100% accessible and operable.

---

## 8. Section 7: Form Validation & Error Recovery

- [ ] **Email Syntax:** Enforces RFC 5322 regex validation; displays *"Please enter a valid email address."* upon invalid entry.
- [ ] **Password Strength:** Enforces minimum 10 characters, 1 uppercase, 1 lowercase, 1 digit; displays descriptive validation error.
- [ ] **Error Announcement:** Inline errors set `aria-invalid="true"` and bind to `aria-describedby="[error-id]"`.
- [ ] **Error Focus Management:** Submitting an invalid form automatically moves keyboard focus to the first erroneous field.
- [ ] **Account Throttling:** Simulating 5 failed login attempts locks form and displays 15-minute throttling notice.
- [ ] **Password Reset Token Validation:** Navigating to `/auth/reset-password` with an expired or invalid token renders the Stone Surface `#EDE7DC` expiration card (`role="alert"`) and focuses the "Request New Reset Link" recovery button.
- [ ] **Password Reset Complexity & Invalidation:** Submitting a password reset enforces the 10-character rule and password matching, invalidates all existing mock sessions upon success, and redirects to `/auth/login` with a persistent confirmation banner.

---

## 9. Section 8: Demo-Data Labeling & Simulation Boundaries

- [ ] **Universal Demo Badging:** 100% of mock lots, estimates, countdowns, bid logs, and paddles display visible `[DEMO DATA]` or `[DEMO]` badges.
- [ ] **Provisional Specimen Badging:** All 6 watch reference images and cards carry `[PROVISIONAL DEMO SPECIMEN]` tags.
- [ ] **Persistent Footer Disclaimer:** Every route renders the persistent colophon notice: `[CHRONOBID VAULT SANDBOX — PROTOTYPE ONLY. NO FINANCIAL TRANSACTIONS ARE CONDUCTED.]`.
- [ ] **Checkout Simulation Disclaimer:** Winning lot invoice screen clearly displays: `[SANDBOX SIMULATION — NOT A REAL FINANCIAL TRANSACTION]`.
- [ ] **Zero Live Transaction Infrastructure:** Verified zero payment gateway SDKs (Stripe, PayPal), zero real-money ACH wiring, and zero live identity proofing (Onfido/Stripe Identity) are connected.

---

## 10. Section 9: Image Fallback & Layout Stability

- [ ] **Broken Image Interception:** Supplying an invalid image path (`404` or error event) suppresses native broken image icons.
- [ ] **Monogram Fallback Rendering:** Broken image immediately renders the approved Stone Surface `#EDE7DC` monogram fallback card.
- [ ] **Metadata Display:** Fallback card displays manufacturer monogram in `Instrument Serif` (28–34px), lot reference in `IBM Plex Mono` (11px), and archival subtext.
- [ ] **Cumulative Layout Shift (CLS):** Verified CLS < 0.02 during image error transitions by enforcing `4:5` portrait aspect ratio containers.
- [ ] **Screen Reader Accessibility:** Fallback card retains descriptive `<span class="sr-only">` text describing the watch reference.

---

## 11. Section 10: Prevention of Misleading Production Claims

- [ ] **Escrow Custody Disclosure:** Clearly marked as `[PROPOSED FUTURE SERVICE — NOT CURRENTLY AVAILABLE]` in How-It-Works and Saleroom drawers.
- [ ] **Armored Transit Disclosure:** Clearly marked as `[PROPOSED FUTURE SERVICE — NOT CURRENTLY AVAILABLE]` in procedural guides.
- [ ] **Appraisal Turnaround Clarification:** 48-hour appraisal ticket explicitly described as simulated demo feedback, not a legally binding service-level guarantee.
- [ ] **Timegrapher Audit Disclosure:** Timegrapher condition diagnostics explicitly labeled as demonstration templates, not certified master watchmaker lab reports.

---

## 12. Section 11: Outstanding Project Owner Decisions & Sign-Off Gate

The following items are audited to ensure they are NOT treated as approved implementation code, but remain strictly classified as pending decisions:

| Item | Reference | Current Status | Prototype Handling | Owner Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **Debut Timepieces** | [ADR-009](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/DECISIONS.md#L25) | `Provisional` | Render with `[PROVISIONAL DEMO SPECIMEN]` and `#EDE7DC` fallback cards | Verify exact references & clear image rights |
| **Anti-Sniping Cap** | [ADR-012](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/DECISIONS.md#L28) | `Approved Baseline` | 120s clock reset; <120s boundary; 10-extension cap per lot; post-cap pre-deadline bids accepted without reset; bids at/after deadline rejected | Owner confirmed 2026-10-18 (prototype simulation) |
| **Bid Increment Tiers** | [ADR-019](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/DECISIONS.md#L35) | `Approved Baseline` | 5-tier schedule & Option B Destination-Tier Ladder Model (prototype simulation only; not production authorization) | Owner confirmed 2026-10-18 (prototype simulation) |
| **Auth Security Review**| [ADR-020](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/DECISIONS.md#L36) | `Draft Assumptions` | 6-digit PIN, 15m expiry, 10-char password, 5 attempts; test PIN 123456 | Formal security review required prior to production |
| **Vault & Multi-Category** | [ADR-025](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/DECISIONS.md#L39) | `Approved Baseline (v2.3)` | Pre-funded balance gating, reservation on lead, instant outbid release, and multi-category catalogue | Incorporated as v2.3 Amendment (2026-10-19) |
| **Phase 2 Authorization**| Phase Gate | **`AUTHORIZED`** | Clickable frontend prototype authorized by Project Owner on 2026-10-18 | In Progress (Production backend strictly prohibited) |

---

## 13. Acceptance Sign-Off Gate

> [!IMPORTANT]
> **PROTOTYPE ACCEPTANCE GATE STATUS: PHASE 2 FRONTEND PROTOTYPE AUTHORIZED**
> This acceptance framework evaluates the clickable frontend prototype authorized by the Project Owner on 2026-10-18, incorporating the Phase 1 Specification Amendment v2.3 (2026-10-19). All prototype tests evaluate client-side simulation logic, pre-funded Vault balance rules, and editorial presentation. Production backend infrastructure, live financial wallets, payment processing, and escrow custody remain strictly prohibited.
