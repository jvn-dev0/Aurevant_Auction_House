# ChronoBid Vault — Phase 2.1 Formal Owner Acceptance Record
## Clickable Multi-Category Auction Marketplace Prototype — Formal Acceptance, Scope Baseline & Known Limitations

> **Document Type:** Formal Project Owner Acceptance Record & Baseline Sign-Off  
> **Project Name:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Accepted Deliverable:** Phase 2.1 Clickable Multi-Category Frontend Prototype  
> **Acceptance Date:** 25 October 2026  
> **Approving Authority:** Project Owner (Direct Written Acceptance)  
> **Current Project Status:** **PHASE 1, 1.5, 2 & 2.1 FORMALLY APPROVED & ACCEPTED (PROTOTYPE ONLY)**  
> **Implementation Prohibitions:** Phase 3 backend and Phase 4 production remain strictly **NO-GO — NOT AUTHORIZED**  

---

## 1. Executive Acceptance Declaration

On **25 October 2026**, the Project Owner formally accepted **Phase 2.1 of ChronoBid Vault: the clickable, multi-category auction marketplace prototype**, following the successful completion and verification of the prototype expansion scope, automated accessibility suites, and the delivery of the [`PHASE2_1_OWNER_ACCEPTANCE_REVIEW_REPORT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PHASE2_1_OWNER_ACCEPTANCE_REVIEW_REPORT.md).

### Binding Governance Declarations:
1. **Prototype Acceptance Only:** Phase 2.1 is accepted strictly as a **clickable frontend website prototype** utilizing simulated auction mechanics, mock paddles, demo accounts, and client-side simulated Buyer Vault headroom behavior.
2. **Phase 3 Architecture Gated Separately:** The Phase 3 technical architecture specification ([`PHASE3_ARCHITECTURE_SPECIFICATION_DRAFT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PHASE3_ARCHITECTURE_SPECIFICATION_DRAFT.md)) and its consistency audit report ([`PHASE3_ARCHITECTURE_CONSISTENCY_AUDIT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PHASE3_ARCHITECTURE_CONSISTENCY_AUDIT.md)) remain subject to separate, subsequent Project Owner review and formal approval.
3. **Phase 3 Backend Implementation Remains Unauthorized:** Zero backend servers, microservices, databases (PostgreSQL/Redis), API endpoints, or migrations may be scaffolded or implemented.
4. **Phase 4 Production Implementation Remains Unauthorized:** Zero real-money banking rails, payment processors (Stripe, Adyen), physical custody contracts (Malca-Amit), or live escrow systems may be integrated.
5. **Codebase Freeze:** Application code (`app/`, `lib/`, `components/`), stylesheets, and configuration remain completely frozen. No npm packages or dependencies may be installed.

---

## 2. Inventory of Accepted Phase 2.1 Scope

The scope accepted by the Project Owner includes the following complete, verified prototype deliverables:

```
+-------------------------------------------------------------------------------------------------------------------------------+
|                                    PHASE 2.1 FORMALLY ACCEPTED SCOPE INVENTORY                                                |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| #  | Feature / Subsystem        | Functional Deliverable Scope                                       | Verification Evidence  |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 1  | 4-Division Taxonomy        | Fine Horology (Lots 01–06), Rare Coins & Numismatics (Lots 07–09),  | LOT-01 through LOT-15  |
|    | (15 Catalog Lots)          | Haute Joaillerie (Lots 10–12), Fine Art (Lots 13–15).              | HTTP 200 delivery      |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 2  | Polymorphic SpecGrids      | Category-specific metadata displays (Calibres, Mintages/Grading,   | SpecGrid.tsx component |
|    |                            | Carats/Gemmology, Medium/Provenance).                              | QA assertions passing  |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 3  | Specialist Admin Console   | `/admin` Curatorial Desk with category-filtered review queue,       | ADM-01 through ADM-03  |
|    | (`/admin`)                 | valuation tools, doc-request modal, and [SIMULATION] banner.       | HTTP 200 & DOM tests   |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 4  | Consignment Seller Wizard  | 4-step intake wizard at `/consign` generating tracking tickets      | SEC-01 through SEC-03  |
|    | & Seller Tracking          | (`CBV-INTAKE-XXXX`) linked to `/account/consignments`.             | Flow verified in test  |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 5  | Option B Increment Ladder  | 5-tier bid ladder ($250 step in Tier 1; $1k in Tier 2; $2.5k,      | LAD-01 through LAD-03  |
|    |                            | $5k, $10k in Tiers 3–5) with nearest-step suggestions.             | QA runner passing      |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 6  | Soft-Close Anti-Sniping    | 120-second timer extension triggering strictly when remaining <    | SC-01 through SC-04    |
|    |                            | 120s, 120s exact boundary invariance, 10-extension hard cap.       | QA runner passing      |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 7  | Pre-Funded Vault Headroom  | Affordability checks, active lot reservations, instant outbid      | VAULT-01 through       |
|    | State Machine              | restoration, Benchmark 1 (₹1L vs ₹2L), Benchmark 2 (cross-lot).    | VAULT-10 passing       |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 8  | Multi-Currency Display     | 8-currency conversion (USD, EUR, GBP, CHF, JPY, HKD, SGD, INR)    | CURR-01 through        |
|    |                            | with dual-display reference rates and [ESTIMATE] disclosures.      | CURR-04 passing       |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 9  | Visual Identity & Tokens   | Editorial-parallax publication aesthetic, Warm Paper (#F4F0E8),    | CSS-01 through CSS-05  |
|    |                            | Deep Forest (#182720), Acid Lime (#D7E65A), Instrument Serif.      | Asset verification OK  |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 10 | WCAG 2.2 AA Accessibility  | Automated scanning across 14 application routes verifying headings,| 84/84 accessibility    |
|    |                            | programmatic input labels, button accessible names, 14.8:1 contrast| audit checks passed    |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
| 11 | Consolidated Test Suite    | Automated end-to-end regression test harness (`npm test`).         | 176 passed, 0 failed   |
|    |                            |                                                                    | (100% pass rate)       |
+----+----------------------------+--------------------------------------------------------------------+------------------------+
```

---

## 3. Scope Exclusions & Known Limitations

The Project Owner's acceptance of Phase 2.1 explicitly incorporates the following known limitations, scope boundaries, and unresolved questions:

### 3.1 Prototype Simulation Limitations (Non-Production)
- **Client-Side Simulation:** Bidding, outbid bot events, timer countdowns, and Pre-Funded Vault headroom are simulated in browser React state and `sessionStorage`. No persistent relational database (PostgreSQL) or distributed cache (Redis) is active.
- **Mock Authentication:** Sign-in, registration, email PIN verification, and password resets are simulated UI flows without real cryptographic credential storage or live OAuth provider connections.
- **Mock Consignment SLAs:** The 48-hour appraisal feedback timeline in `/admin` and `/account/consignments` represents simulated demonstration feedback, not a legally binding service-level agreement.
- **Proposed Future Services:** Physical custodial storage (Malca-Amit/Brink's) and insured white-glove transit remain strictly classified as proposed future services on `/transparency`.

### 3.2 Inventory Imagery Licensing Policy (ADR-009)
- All 15 catalog lots across Fine Horology, Rare Coins, Haute Joaillerie, and Fine Art strictly display the approved `#EDE7DC` monogram fallback cards with visible `[DEMO DATA]` disclosures.
- No commercial imagery licenses have been executed; high-resolution archival photography is deferred until formal licensing agreements are established.

### 3.3 Buyer Vault Balance Formula Overlap Ambiguity
- In the conceptual database schema specification (`vault_accounts` table in `PHASE3_ARCHITECTURE_SPECIFICATION_DRAFT.md` §6.1), the headroom equation is defined as:
  $$\mathbf{Available\ to\ Bid} = \mathbf{Total\ Vault\ Balance} - \mathbf{Reserved\ Funds} - \mathbf{Committed\ Funds} - \mathbf{Applicable\ Holds}$$
- **Known Limitation:** While double-entry accounts (1010, 1020, 1030, 1040) are mathematically disjoint, the summary database column update rules between `committed_balance_cents` (won lots in escrow) and `holds_balance_cents` (compliance freezes) are **UNRESOLVED**. Formal database trigger check constraints to prevent double-deduction remain an open engineering item for Phase 4.

### 3.4 Deferred Category Divisions
- **Group B Categories:** Collectible Vehicles, Antiques & Decorative Arts, Rare Books & Manuscripts, Luxury Collectibles, Historical Memorabilia, Minerals & Natural History, and Contemporary Design remain deferred.
- **Group C Categories:** Patents & Intellectual Property (granted vs. pending, assignments vs. term licenses) remain deferred to future phases per the established roadmap.

### 3.5 Required External Legal, Tax & Accounting Reviews
- **Indian Tax Counsel:** Written opinion on RBI Liberalised Remittance Scheme (LRS) $250k/year pre-funding caps and Section 206C(1G) Tax Collected at Source (TCS) withholding calculation base remains outstanding.
- **CPA Accounting Review:** Formal validation of the double-entry Chart of Accounts (Series 1000 liabilities, Series 2000 bank asset, Series 3000 revenue, Series 4000 payables) under US GAAP/IFRS remains required.
- **EU Data Privacy & GDPR Counsel:** Legal validation of Clerk US hosting under the EU-U.S. Data Privacy Framework (DPF) vs. Auth0 EU-native data residency remains required.
- **Banking Regulatory Counsel:** US FinCEN and EU PSD2/PSD3 money transmission licensing analysis remains required.

### 3.6 Unresolved Strategic Owner Decisions (DEC-P3-001 through DEC-P3-010)
- All 10 strategic decisions documented in [`PHASE3_OWNER_DECISIONS_REGISTER.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_OWNER_DECISIONS_REGISTER.md) remain pending formal Owner selection:
  - DEC-P3-001 (Currency Settlement: Canonical USD vs. Multi-currency)
  - DEC-P3-002 (Identity Provider: Clerk Enterprise vs. Auth0)
  - DEC-P3-003 (Payment Rails: Adyen / Stripe vs. Bank Direct)
  - DEC-P3-004 (Armored Physical Custody: Malca-Amit vs. Brink's)
  - DEC-P3-005 (Identity KYC/AML: Persona vs. Sumsub)
  - DEC-P3-006 (Edge Anti-Bot: Cloudflare Pro/Business confirmation)
  - DEC-P3-007 (Cloud Platform: AWS ECS Fargate + Aurora Multi-AZ)
  - DEC-P3-008 (Buyer's Premium: Option A 20%/15%/10% vs. Option B Flat 12.5%)
  - DEC-P3-009 (Catalog Photography Rights & Clearance Plan)
  - DEC-P3-010 (Real-Time Saleroom Engine: Fastify WS Modular Monolith)

---

## 4. Current Project Governance Status

With the formal acceptance of Phase 2.1 recorded, the official project status across all phases is:

```
+-------------------------------------------------------------------------------------------------------------------------------+
|                                          CHRONOBID VAULT — OFFICIAL PROJECT PHASE STATUS                                      |
+---------------+-----------------------------------------------+-----------------------------------+---------------------------+
| Project Phase | Description                                   | Current Status                    | Authority & Date          |
+---------------+-----------------------------------------------+-----------------------------------+---------------------------+
| Phase 1       | Requirements & Design Specification (v2.2)    | FORMALLY APPROVED BASELINE        | Project Owner (2026-10-17)|
| Phase 1.5     | Prototype Readiness Planning & Gate Checklist | COMPLETED & VERIFIED              | Project Owner (2026-10-18)|
| Phase 2       | Clickable Fine Horology Frontend Prototype    | FORMALLY APPROVED & ACCEPTED      | Project Owner (2026-10-22)|
| Phase 2.1     | Clickable Multi-Category Marketplace Prototype| FORMALLY ACCEPTED (PROTOTYPE ONLY)| Project Owner (2026-10-25)|
| Phase 3       | Technical Architecture & Concurrency Specs    | SPECIFICATION COMPLETED & AUDITED | Pending Owner Approval    |
| Phase 3       | Backend Infrastructure, Database & Engine     | STRICTLY PROHIBITED (NO-GO)       | Mandatory Instruction     |
| Phase 4       | Production Banking, Escrow, Custody & Go-Live | STRICTLY PROHIBITED (NO-GO)       | Mandatory Instruction     |
+---------------+-----------------------------------------------+-----------------------------------+---------------------------+
```

---

## 5. Next Steps & Recommended Owner Actions

Now that Phase 2.1 is formally accepted and documented:

1. **Review Phase 3 Architecture Specification:**
   The Project Owner can review the remediated [`PHASE3_ARCHITECTURE_SPECIFICATION_DRAFT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PHASE3_ARCHITECTURE_SPECIFICATION_DRAFT.md) and [`PHASE3_ARCHITECTURE_CONSISTENCY_AUDIT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PHASE3_ARCHITECTURE_CONSISTENCY_AUDIT.md) to evaluate the production system topology, concurrency invariants, and double-entry ledger design.
2. **Resolve Tier 1 Strategic Decisions:**
   Review and decide upon Tier 1 foundational decisions in [`PHASE3_OWNER_DECISIONS_REGISTER.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_OWNER_DECISIONS_REGISTER.md):
   - `DEC-P3-001` (Currency Settlement Model)
   - `DEC-P3-002` (Authentication Provider: Clerk vs. Auth0)
   - `DEC-P3-007` (Cloud Hosting Platform: AWS)
   - `DEC-P3-010` (Saleroom Gateway Architecture: Fastify WebSocket Modular Monolith)
3. **Commission Required External Professional Advice:**
   Commission the statutory Indian tax counsel brief and CPA audit review of the Chart of Accounts before considering Phase 3 backend planning closure.

---

*Record formally documented and certified into the ChronoBid Vault governance repository.*  
*Timestamp: 25 October 2026.*
