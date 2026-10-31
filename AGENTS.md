# ChronoBid Vault — Persistent Project Rules & Guidelines

> [!NOTE]
> ### 🏛️ PHASE 2 & 2.1 FORMALLY ACCEPTED BY PROJECT OWNER (2026-10-25) — PROTOTYPE ONLY
> **The project owner has formally accepted Phase 2 and Phase 2.1 (2026-10-25) strictly as a clickable, multi-category frontend website prototype using simulated auction and Buyer Vault behavior.**
> 
> **PROTOTYPE ACCEPTANCE BOUNDARIES:**
> 1. Phase 2.1 is accepted strictly as a prototype with client-side simulated bidding, timers, paddles, and Buyer Vault headroom mechanics.
> 2. All 15 demonstration lots across 4 divisions (Fine Horology, Rare Coins, Haute Joaillerie, Fine Art) operate under simulated demo conditions with `#EDE7DC` monogram cards.
> 3. Phase 3 technical architecture remains subject to separate written Project Owner review and approval.
> 
> **STRICTLY PROHIBITED ACTIONS (REMAINS IN FULL FORCE):**
> 1. Phase 3 backend implementation remains STRICTLY NOT AUTHORIZED — NO-GO.
> 2. Phase 4 production implementation remains STRICTLY NOT AUTHORIZED — NO-GO.
> 3. Do NOT modify application code, stylesheets, configuration, or test suites.
> 4. Do NOT install packages or dependencies, create database schemas, Prisma/Drizzle models, or migrations.
> 5. Do NOT scaffold backend services, microservices, APIs, or cloud infrastructure.
> 6. Do NOT integrate real payment processors (Stripe, Adyen), bank wires, or live custody systems.
> 7. Do NOT remove or conceal required demo disclosures (`[DEMO DATA]`, `[SANDBOX SIMULATION]`, or future-service notes).
> 
> *This restriction is a mandatory project instruction from the project owner that all agents must strictly obey.*

---

> **Project Name:** ChronoBid Vault  
> **Domain:** Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Architecture & Stack:** Next.js App Router (React, TypeScript, Tailwind CSS)  
> **Current Status:** PHASE 1, 1.5, 2, & 2.1 FORMALLY APPROVED & ACCEPTED (2026-10-25)  
> **Phase 2 & 2.1 Status:** **FORMALLY ACCEPTED BY PROJECT OWNER (Clickable Prototype Only)**  
> **Phase 3 Architecture Status:** **SPECIFICATION & CONSISTENCY AUDIT COMPLETED — SUBJECT TO SEPARATE OWNER REVIEW & APPROVAL**  
> **Phase 3 Backend Status:** **STRICTLY PROHIBITED — NOT AUTHORIZED (NO-GO)**  
> **Phase 4 Production Status:** **STRICTLY PROHIBITED — NOT AUTHORIZED (NO-GO)**  

---

## 1. Core Operating Principles & Workflow Control
1. **Phase-by-Phase Discipline:** We build strictly in sequential phases:
   - *Phase 1:* Requirements & Design Specification (FORMALLY APPROVED BASELINE v2.2 — 2026-10-17)
   - *Phase 1.5:* Prototype Readiness Planning & Gate Verification (COMPLETED & VERIFIED 2026-10-18)
   - *Phase 2 & 2.1:* Clickable Frontend Website Prototype (FORMALLY ACCEPTED BY OWNER — 2026-10-25)
   - *Phase 3 Architecture:* Technical Blueprint & Concurrency Specifications (COMPLETED — PENDING SEPARATE OWNER APPROVAL)
   - *Phase 3 Backend:* Backend Architecture, Database & Real-Time Engine (STRICTLY PROHIBITED — NOT AUTHORIZED)
   - *Phase 4 Production:* Production Deployment, Custody, Banking & Escrow (STRICTLY PROHIBITED — NOT AUTHORIZED)
2. **Strict Approval Gate:** Never skip ahead to subsequent phases, generate pages prematurely, change approved design decisions, or install dependencies without explicit, separate written project owner authorization.
3. **Ambiguity Stop Condition:** If any prompt or instruction is ambiguous, STOP immediately and ask the project owner for clarification. Never infer coding authorization.
4. **Completion Protocol:** Before declaring any documentation task complete:
   - Verify that no implementation code was generated.
   - Document and report actual check results, any unresolved issues or limitations, and the next sequential step.

---

## 2. Visual Identity & Design System

### 2.1 Approved Design Direction
- **Style:** Editorial-parallax, premium-light, bespoke horological publication aesthetic.
- **Strict Anti-Patterns (Anti-Vibe-Coding):**
  - **NEVER** default to generic SaaS layouts, purple gradients, excessive glassmorphism, emoji icons, random stock imagery, or non-functional decorative controls that do nothing.
  - Every button, tab, and control must have a defined state and purpose.

### 2.2 Approved Typography Hierarchy
- **Display / Headings:** `Instrument Serif` (Italic accents for horological references and editorial emphasis).
- **Interface / Body Text:** `Manrope` (Clean, geometric, highly legible UI and narrative copy).
- **Technical Labels / Data:** `IBM Plex Mono` (Timers, Reference IDs, Serial numbers, Movement Calibres, Bid values, Currency counters).

### 2.3 Approved Color Palette
| Token Name | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| **Warm Paper** | `#F4F0E8` | Primary canvas & background surface |
| **Deep Forest** | `#182720` | Primary typography, deep structural elements, high-contrast accents |
| **Acid Lime** | `#D7E65A` | Precision vibrant highlight, active auction status, primary action cues |
| **Stone** | `#D8D0C2` | Hairline dividers, subtle borders, secondary card backdrops |

### 2.4 Imagery Policy
- Use only documented, appropriately licensed images that faithfully depict the exact horological reference shown (case, dial, hands, calibre).
- **NEVER** fabricate image URLs, hallucinate watch references, or imply demo/sample listings are real inventory available for purchase.
- All 6 sample watch listings remain **provisional** until verified.

### 2.5 Iconography & Accessible Controls
- **Library:** Exclusively `lucide-react`.
- **Accessibility:** 100% of icon buttons and interactive controls MUST have explicit accessible names via `aria-label`, visible text, or screen-reader text (`sr-only`).

### 2.6 Transitions & Parallax Motion
- Motion must be subtle, tactile, and reminiscent of mechanical watchmaking precision (Framer Motion spring curves: `damping: 24, stiffness: 140`).
- Parallax offsets must be layered smoothly (background paper texture, midground watch dial, foreground text).
- Must strictly support `@media (prefers-reduced-motion: reduce)` by disabling transform parallax while preserving clean opacity transitions.

---

## 3. Architecture & Domain Rules

### 3.1 Unified User & Account Model
- Buyers and consignors (sellers) operate within a **single unified account**.
- All registered accounts default to buyer capabilities. Consignor features (lot intake, appraisal dashboard, reserve agreements) are unlocked through a dedicated seller onboarding verification workflow within the same profile.
- Administrative and specialist privileges are provisioned separately with isolated security gates.

### 3.2 Simulation & Sandbox Transparency
- In compliance with project integrity standards, **never** represent simulated bidding, frontend-only authentication, mock escrow, or simulated payments as real production operations.
- All mock states, demo paddles, and sandbox engines must carry explicit, persistent disclaimers (e.g., `[SANDBOX SIMULATION — NOT REAL TRANSACTIONS]`).
- Escrow custody and insured transit are classified strictly as **proposed future services**, not currently operational services.
- The 48-hour appraisal ticket is classified strictly as **simulated demo feedback**, not a legal SLA.
