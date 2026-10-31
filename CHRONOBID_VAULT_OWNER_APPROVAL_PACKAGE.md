# ChronoBid Vault — Project Owner Approval Package
## Executive Governance Dossier: Phase 2 Prototype Acceptance, Phase 3 Design Approval & Strategic Architecture Decisions

> **Document Type:** Executive Project Owner Approval Dossier & Governance Decision Package  
> **Project:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Working Directory:** `C:\Users\kbjee\OneDrive\Desktop\omniroute\auction system`  
> **Date:** 20 October 2026  
> **Target Audience:** ChronoBid Vault Project Owner & Board of Directors  
> **Authors:** Senior Project Manager, Senior Solutions Architect, CISO & Financial Systems Analyst  
> **Current Status:** Phase 2 Accepted as Baseline for Now (22 Oct 2026) &rarr; Phase 3 Provisional Baseline Approved (Validation Required) &rarr; Phase 4 Blocked  
> **Governance Directive:** **STRICTLY DOCUMENTATION ONLY — ZERO APPLICATION CODE EDITS, ZERO DATABASE PROVISIONING, ZERO LIVE PAYMENTS, ZERO INFRASTRUCTURE SPEND**

---

## Executive Overview & How to Use This Package

This approval package consolidates the governance findings, verification results, and strategic choices of ChronoBid Vault into a single executive decision dossier.

It is structured into three distinct parts, followed by an actionable decision register:
- **Part A:** Phase 2 Prototype Acceptance Review (Clickable Frontend Prototype).
- **Part B:** Phase 3 Technical Documentation Baseline Approval.
- **Part C:** Plain-English Evaluation of the Four Outstanding Tier 1 Architecture Decisions.
- **Master Decision Register:** Separate, unselected signature fields for the Project Owner.

```
+---------------------------------------------------------------------------------------------------------+
|                                    PROJECT LIFECYCLE & GOVERNANCE GATES                                 |
|                                                                                                         |
|   [PHASE 1: BASELINE v2.2 & v2.3]  --->  APPROVED & PRESERVED IMMUTABLE ARCHIVE (17 & 19 Oct 2026)      |
|                                                                                                         |
|   [PART A: PHASE 2 PROTOTYPE]      --->  ACTION: Review scope, tests & decide Prototype Acceptance     |
|                                                                                                         |
|   [PART B: PHASE 3 DESIGN]         --->  ACTION: Review baseline docs, risks & decide Design Approval   |
|                                                                                                         |
|   [PART C: STRATEGIC DECISIONS]    --->  ACTION: Select preferred options for 4 Tier 1 Blockers         |
|                                                                                                         |
|   [PHASE 4: IMPLEMENTATION]        --->  ACTION: Explicit separate Go / No-Go decision (Blocked)       |
+---------------------------------------------------------------------------------------------------------+
```

> [!IMPORTANT]
> **GOVERNANCE NOTICE ON DECISION BOUNDARIES:**  
> Approving the Phase 3 documentation baseline does **NOT** authorize backend implementation, cloud infrastructure provisioning, or financial expenditure. Each decision is isolated, and implementation remains strictly blocked until explicit written authorization is recorded in the Phase 4 gate.

---

## Part A — Phase 2 Prototype Acceptance Review

### 1. Delivered Scope & Implemented Routes
The Phase 2 prototype is operational on the Next.js App Router (React, TypeScript, Tailwind CSS) at `http://localhost:3000`. It faithfully implements the approved editorial-parallax visual identity (Warm Paper `#F4F0E8`, Deep Forest `#182720`, Acid Lime `#D7E65A`), typography hierarchy (`Instrument Serif`, `Manrope`, `IBM Plex Mono`), and all 14 leaf routes:

| Route | Page Name & Nature | Delivered Capabilities |
| :--- | :--- | :--- |
| `/` | 11-Section Editorial Monograph | Complete 11-section publication sequence, responsive layout down to 360px. |
| `/auctions` | Saleroom Redirect | 307 temporary redirect routing to preview catalog. |
| `/auctions/live` | Live Auction Saleroom | Active saleroom console (`● SALEROOM ACTIVE`), live countdown clock, 3-tier Vault status card, Benchmark 1 & 2 triggers, jump-bid ladder, simulated bot counter-bidding, outbid fund release. |
| `/auctions/upcoming` | Preview Catalog | Multi-category filter chips (Horology, Coins, Jewelry, Art), opening bids, dual-currency cards. |
| `/auctions/lots/[lotSlug]` | Deep Lot Dossier | 4:5 image gallery, movement SpecGrid, condition drawer, live bidding console. |
| `/how-it-works` | Curatorial & Bidding Guide | 4-step procedural guide; designates Escrow Custody and Transit as proposed future services. |
| `/transparency` | Governance & Trust | 3 transparency pillars; 8-dimension Demo vs. Production boundary disclosure matrix. |
| `/consign` | Private Consignment Intake | 4-step intake wizard, dynamic appraisal estimate, `CBV-INTAKE-XXXX` demo tracking ticket. |
| `/account/bids` | My Bids & Watchlist | Real-time active bids, outbid alerts, saved watchlists, simulated winning invoices. |
| `/account/consignments`| Consignments Dashboard | Submitted intake tickets, simulated specialist review status, reserve price agreement toggles. |
| `/account/settings` | Profile & Vault Balances | Virtual demo paddle card (`Paddle #4102`), profile editor, 3-tier Vault card (`[DEMO DATA]`). |
| `/auth/login` | Editorial Login | 2-column layout, simulated CAPTCHA, simulated Google Sign-In, 5-attempt brute force lockout. |
| `/auth/register` | Stepped Intake Flow | 3-stage visual tracker, 16px iOS auto-zoom prevention inputs, password strength meter. |
| `/auth/verify-email` | PIN Verification | 6-digit monospace PIN input, demo hint (`"410299"`), 30s resend cooldown timer. |
| `/auth/reset-password` | Password Recovery | 2-stage recovery state machine, simulated token banner, 10-character complexity rules. |

---

### 2. Reported Automated Test Results & Their Limitations
The prototype is backed by automated test suites executed via `npm test`:

```text
========================================================================================
AUTOMATED TEST VERIFICATION SUMMARY
========================================================================================
Test Suite                Script                          Assertions       Pass Rate
----------------------------------------------------------------------------------------
Master QA Runner          tests/qa-verification-runner.js 51 / 51 Passed   100%
CSS & Font Asset Delivery tests/verify-css-assets.js      16 / 16 Passed   100%
Combined Verification     npm test                        67 / 67 Passed   100%
Next.js Production Build  npm run build                   Exit Code 0      PASS
Static Code Analysis      npm run lint                    Exit Code 0      PASS
========================================================================================
```

#### What These Tests Prove:
1. **Currency Mathematics:** Accurate conversions across all 8 currencies (USD, EUR, GBP, CHF, JPY, HKD, SGD, INR), INR lakhs formatting (`₹84,07,000`), dual-price invariant (`[Converted] [EST. DEMO] / $[Base] USD`), and missing rate fallbacks (`[CONVERSION UNAVAILABLE]`).
2. **Pre-Funded Vault State Machine:** Accurate execution of Benchmark 1 (₹1,00,000 available rejecting ₹2,00,000 bid), Benchmark 2 (cross-lot hold: ₹70k Lot A accepted, concurrent ₹60k Lot B rejected), leading reservations, outbid releases, and session persistence across page refresh.
3. **Soft-Close Anti-Sniping:** 120-second deadline reset trigger, 10-extension hard cap, and post-deadline rejection.
4. **Asset & Layout Integrity:** 10/10 routes and 6/6 JavaScript chunks deliver HTTP 200 with compiled Tailwind tokens and Google Font `@font-face` definitions.

#### Critical Limitations of the Prototype Tests:
> [!WARNING]
> The automated test suite executes **strictly within client-side browser memory and Node.js testing harnesses**. The tests do **NOT** test real backend database concurrency, actual PostgreSQL row-level locks, multi-user WebSocket server load, live bank wires, real email dispatch, or real Google OAuth token validation. All such capabilities in Phase 2 are **simulations**.

---

### 3. Outstanding Acceptance Criteria & Required Disclosures
To accept Phase 2, the Project Owner must confirm acceptance of the following provisional items and demo disclosures:
1. **Provisional Inventory Status ([ADR-009](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/DECISIONS.md#L26)):** The 6 initial watch references remain provisional until physical specimens and licensed photography are cleared. The `#EDE7DC` monogram card serves as the approved visual fallback.
2. **Simulated Authentication Parameters ([ADR-020](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/DECISIONS.md#L37)):** The 6-digit PIN, 15-minute token expiry, and 5-attempt lockout are client-side demonstrations, not audited production security parameters.
3. **Mandatory Simulation Disclosures:** All Vault balances, bids, paddles, Google sign-in buttons, and CAPTCHA checkboxes display prominent demo disclosures (`[DEMO DATA]`, `[SIMULATED AUTH PROVIDER]`, `[SANDBOX SIMULATION]`).
4. **Future Service Classification ([ADR-017](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/DECISIONS.md#L34)):** Custodial escrow vaulting and insured transit are classified strictly as **proposed future services**, not operational capabilities.

---

### 4. Manual Browser Checks Still Required by the Project Owner
While automated tests confirm code correctness, the Project Owner is requested to conduct a brief manual visual inspection in their own desktop and mobile browser at `http://localhost:3000`:
- [ ] **Visual Aesthetic & Tone:** Confirm the Warm Paper `#F4F0E8` canvas, editorial serif typography, and spacing feel aligned with luxury horological brand expectations.
- [ ] **Mobile Responsiveness:** View the homepage, preview catalog, and lot dossier on a physical mobile device or mobile emulation to confirm touch layout and sticky bidding bar feel.
- [ ] **Saleroom Interaction:** Visit `/auctions/live`, click the pre-configured Benchmark 1 and Benchmark 2 buttons, place a bid, and observe the live countdown clock and simulated bot counter-bid.
- [ ] **Consignment Wizard:** Navigate `/consign` and step through the 4-stage intake form to verify the submission flow.

---

### 5. The Exact Decision the Project Owner Must Make for Part A
The Project Owner must determine:
> *"Does the clickable frontend prototype faithfully represent the approved Phase 1 specification and user experience requirements, and is it accepted as the completed Phase 2 deliverable, subject to the documented simulation limitations?"*  
> &rarr; **Record determination in Section 1 of the Master Decision Register.**

---

## Part B — Phase 3 Documentation Approval Review

### 1. Technical Documents Proposed as the Design Baseline
The Phase 3 documentation package establishes the architectural, financial, security, and regulatory specifications required before any backend coding can begin:

1. [`PHASE3_ARCHITECTURE_DECISION_RECORD.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_ARCHITECTURE_DECISION_RECORD.md) (ADR-P3-001): Defines system topology, evaluates monolith vs. microservices, and recommends the Fastify Modular Monolith on Node.js 22 LTS with a Go extraction trigger at >15k sockets.
2. [`PHASE3_SECURITY_THREAT_MODEL.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_SECURITY_THREAT_MODEL.md): STRIDE threat analysis across assets A1–A5, PKCE Google OIDC flow, 15s UUID WebSocket ticket handshake, WCAG 2.2 AA accessibility protections, and RBAC matrix.
3. [`PHASE3_VAULT_LEDGER_DESIGN.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_VAULT_LEDGER_DESIGN.md): Unified Global Lock Acquisition Hierarchy, 11-row locking matrix, `READ COMMITTED` isolation with `lock_timeout = 1500ms`, double-entry bookkeeping (accounts 1010–4010), 5-state payment taxonomy, and strict prohibition on automatic write-offs.
4. [`PHASE3_INTERNATIONAL_COMMERCE_DESIGN.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_INTERNATIONAL_COMMERCE_DESIGN.md): 4-tier currency architecture, dual-currency presentation invariant, Settlement Model A vs. B trade-offs, India FEMA LRS $250k cap, 20% TCS, 40%+ customs duties, and specialist review checklist.
5. [`PHASE3_IMPLEMENTATION_READINESS_CHECKLIST.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_IMPLEMENTATION_READINESS_CHECKLIST.md): Four-gate verification framework, critical path dependency tree, and Go/No-Go controls.
6. [`PHASE3_OWNER_DECISIONS_REGISTER.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_OWNER_DECISIONS_REGISTER.md): Ten strategic decisions grouped into 3 dependency tiers with explicit options, consequences, and unselected status.
7. [`PHASE3_FINAL_APPROVAL_CORRECTIONS.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_FINAL_APPROVAL_CORRECTIONS.md): Focused corrections report codifying the locking matrix, reconciliation integrity, anti-bot accessibility, and excluded infrastructure expenses.
8. [`PHASE3_FINAL_CONSISTENCY_AUDIT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_FINAL_CONSISTENCY_AUDIT.md): Final independent consistency audit confirming 100% agreement across all deliverables.
9. [`PHASE_ROADMAP.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE_ROADMAP.md): Master sequential implementation roadmap mapping Phases 1 through 9.

---

### 2. Remaining Technical Risks & Unverified Assumptions
The architecture design is complete, but the following risks and assumptions are documented and unverified:
1. **Unperformed Concurrency Testing:** While relational algebra mathematically proves deadlock immunity under the Unified Global Lock Acquisition Hierarchy, **zero tests have been executed against a real PostgreSQL database**. Concurrency benchmarks under network latency remain an unperformed Phase 4 task.
2. **Correspondent Bank Intermediary Deductions:** SWIFT international bank wires frequently incur $25 to $50 deductions by intermediary correspondent banks. These will cause invoice underpayment exceptions that require operational handling.
3. **Cloudflare Turnstile Provider Constraints:** Cloudflare Turnstile tokens have a strict 300-second (5-minute) TTL and are single-use. The application's 30-minute sliding session claim in Redis and background pre-warming are custom application logic that must be empirically verified under high latency.
4. **Third-Party SaaS Availability:** Relying on external identity (Clerk/Auth0) or anti-bot (Cloudflare) introduces third-party dependency risks during live auctions.
5. **Cost Modeling Rigor:** The baseline compute estimate of $300 to $500/month represents core servers only; variable expenses (NAT gateways ~$65–$120/mo, egress ~$50–$250/mo, KMS, APM, per-user SaaS fees) are excluded from the baseline.

---

### 3. Mandatory Future Implementation & Testing Gates
If Phase 4 is authorized in the future, engineering must pass the following empirical test gates before any commercial deployment:

```
+---------------------------------------------------------------------------------------------------------+
|                                    MANDATORY FUTURE ENGINEERING GATES                                   |
+----+--------------------------------+-------------------------------------------------+-----------------+
| Gate ID | Verification Domain       | Pass Condition                                  | Target Phase    |
+----+--------------------------------+-------------------------------------------------+-----------------+
| GT-ENG-01 | PostgreSQL Concurrency  | 50 concurrent k6 threads bidding across lots;   | Phase 4         |
|           | Stress Test             | 0 deadlocks (40P01), 0 negative balances.       | Core Services   |
+----+--------------------------------+-------------------------------------------------+-----------------+
| GT-ENG-02 | Double-Entry Inbalance  | 100,000 automated journal postings;             | Phase 4         |
|           | Rejection               | Sum Debits == Sum Credits ($0.00 variance).     | Core Services   |
+----+--------------------------------+-------------------------------------------------+-----------------+
| GT-ENG-03 | WebSocket Ticket Security| Replayed or expired (>15s) tickets rejected;    | Phase 4         |
|           |                         | Mismatched Origin rejected with HTTP 403.       | Core Services   |
+----+--------------------------------+-------------------------------------------------+-----------------+
| GT-ENG-04 | Banking Statement Ingest| Daily SFTP MT940 statement ingest matches cash  | Phase 5         |
|           |                         | with $0.00 tolerance; discrepancies halt wires. | Banking Rails   |
+----+--------------------------------+-------------------------------------------------+-----------------+
| GT-ENG-05 | Underwriting Approval   | Written approval from merchant risk committee   | Phase 5         |
|           |                         | for high-ticket horology transactions.          | Commercial      |
+----+--------------------------------+-------------------------------------------------+-----------------+
```

---

### 4. Outstanding Legal, Tax, Financial & Regulatory Reviews
The following specialist opinions must be obtained before public commercial transactions:
1. **Consumer Rights Directive (EU Directive 2011/83/EU):** Legal counsel confirmation on whether online-only auctions qualify for statutory 14-day return exemptions without an in-person saleroom option.
2. **Escrow Custody & Money Transmission:** Banking counsel confirmation that pre-funded Vault custody held in fiduciary accounts does not classify ChronoBid Vault as a Money Services Business (MSB) or Payment Institution (EU PSD2/PSD3).
3. **Cross-Border Tax & Indian Remittance:** Tax accounting review of India RBI FEMA LRS $250k caps, 20% TCS withholding, 40%+ customs duties, EU/UK VAT Margin Schemes, and US sales tax economic nexus thresholds.
4. **CITES Environmental Compliance:** Legal standard operating procedure for exotic reptile watch straps (alligator, crocodile), confirming mandatory strap removal prior to export if re-export permits are unavailable.

---

### 5. The Exact Decision the Project Owner Must Make for Part B
The Project Owner must determine:
> *"Is the Phase 3 engineering, financial ledger, security, and international commerce documentation accepted as the authoritative technical design baseline for ChronoBid Vault, acknowledging that implementation remains prohibited pending separate authorization?"*  
> &rarr; **Record determination in Section 2 of the Master Decision Register.**

---

## Part C — Plain-English Evaluation of the Four Outstanding Architecture Decisions

The Project Owner is requested to review the existing options for the **Four Tier 1 Core Foundation Blockers**. These decisions determine the fundamental mechanics of the platform and must be resolved before Phase 4 database and service scaffolding can commence.

---

### DEC-P3-001: International Currency Settlement Model & Foreign Exchange Risk
*Full Technical Specification: [`PHASE3_INTERNATIONAL_COMMERCE_DESIGN.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_INTERNATIONAL_COMMERCE_DESIGN.md#L66-L100)*

```
+---------------------------------------------------------------------------------------------------------+
|                                  SETTLEMENT MODEL COMPARISON AT A GLANCE                                |
|                                                                                                         |
|   [OPTION A: Canonical USD Settlement]           [OPTION B: Guaranteed 48-Hour FX Rate Lock]            |
|   - Invoice issued strictly in USD               - Converted display total locked at hammer for 48h     |
|   - Buyer instructs bank to wire USD             - Buyer wires exact local currency                     |
|   - Zero platform balance-sheet FX risk          - Platform absorbs FX movements or pays hedging fees   |
|   - Standard practice at Christie's & Phillips   - Zero buyer friction, but higher platform complexity  |
+---------------------------------------------------------------------------------------------------------+
```

1. **What the choice means:** When the auction hammer falls, should international collectors wire payment strictly in US Dollars (Option A), or should ChronoBid Vault guarantee the exact foreign currency estimate shown on screen for 48 hours (Option B)?
2. **Main benefits and disadvantages:**
   - *Option A (Canonical USD):* **Benefits:** 100% elimination of currency volatility risk for ChronoBid Vault. Clean, single-currency accounting ledger. Standard industry practice across premier global auction houses. **Disadvantages:** International buyers experience minor friction (1% to 2% bank wire exchange rate spread charged by their own retail bank).
   - *Option B (Guaranteed FX Lock):* **Benefits:** Frictionless collector experience; the buyer pays the exact amount seen in their local currency. **Disadvantages:** Exposes ChronoBid Vault to financial loss if exchange rates swing drastically during geopolitical events, or requires paying payment processors a hedging premium (~1.25% treasury buffer).
3. **Cost and operational implications (Preliminary Estimates):**
   - *Option A:* $0 additional software cost. Requires 1 week of standard single-currency ledger setup.
   - *Option B:* ~$15,000 to $30,000 in specialized treasury engineering, multi-currency bank account fees, and commercial foreign exchange hedging contracts (e.g., Adyen Guaranteed FX).
4. **Security, financial, and international-commerce implications:**
   - *Option A:* Zero balance-sheet exposure. Completely immune to currency arbitrage attacks.
   - *Option B:* Requires maintaining reserve capital in foreign currencies; introduces currency arbitrage risk if buyers exploit delayed rate updates.
5. **What information remains unknown:** Formal quotes from corporate banking partners regarding multi-currency virtual IBAN wire fees and Adyen's exact risk premium for luxury horology rate locks.
6. **Whether the decision must be made now or can safely wait:** **Must be made before Phase 4 database design.** The choice dictates whether the database requires multi-currency ledger tables and FX variance accounts, or a single canonical USD ledger.

---

### DEC-P3-002: Production Authentication Architecture (Managed Provider vs. Self-Hosted)
*Full Technical Specification: [`PHASE3_SECURITY_THREAT_MODEL.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_SECURITY_THREAT_MODEL.md#L51-L68)*

```
+---------------------------------------------------------------------------------------------------------+
|                                  AUTHENTICATION ARCHITECTURE AT A GLANCE                                |
|                                                                                                         |
|   [OPTION A: Managed Identity (Clerk / Auth0)]   [OPTION B: Self-Hosted Service (Fastify Auth / Ory)]   |
|   - Turnkey Google OIDC & Biometric Passkeys     - Full data sovereignty inside private VPC             |
|   - Offloads credential breach liability         - Zero ongoing per-user software licensing fees        |
|   - 24/7 vendor SOC & automated brute-force bans - Internal team bears 100% liability for auth CVEs     |
|   - Ongoing SaaS fee: ~$0.05–$0.15 / active user - Requires ~$30k in custom security engineering        |
+---------------------------------------------------------------------------------------------------------+
```

1. **What the choice means:** Should ChronoBid Vault delegate collector login, Google OAuth, and biometric passkeys to an enterprise identity provider like Clerk or Auth0 (Option A), or build and host a custom authentication service inside our own cloud network (Option B)?
2. **Main benefits and disadvantages:**
   - *Option A (Managed Identity):* **Benefits:** Accelerates backend launch by 4 to 6 weeks. Delivers seamless FIDO2 biometric passkeys (FaceID / TouchID) and turnkey Google Sign-In. Offloads credential storage liability and SOC 2 compliance burdens to a specialized vendor. **Disadvantages:** Creates an ongoing monthly subscription fee and stores user credentials in a vendor's compliant cloud.
   - *Option B (Self-Hosted):* **Benefits:** Complete data sovereignty inside our private network; zero per-user software fees. **Disadvantages:** The internal engineering team bears 100% legal and operational liability for credential leaks, session hijacking, password hashing hygiene (Argon2id), and rate limiting.
3. **Cost and operational implications (Preliminary Estimates):**
   - *Option A:* Estimated at ~$250 to $1,000/month depending on monthly active collectors (~$0.05 to $0.15 per active user).
   - *Option B:* $0 ongoing SaaS licensing fees, but requires ~$25,000 to $35,000 in upfront custom software engineering, cryptographic testing, and dedicated external penetration audit costs.
4. **Security, financial, and international-commerce implications:**
   - High-net-worth collectors require frictionless, highly trustworthy authentication. Option A provides automated enterprise brute-force defense and device anomaly detection. Option B increases internal operational attack surface.
5. **What information remains unknown:** Final enterprise pricing discounts for Clerk vs. Auth0, and specific collector privacy preferences regarding third-party identity hosting.
6. **Whether the decision must be made now or can safely wait:** **Must be made before Phase 4 backend coding.** Dictates user database schemas, session token middleware, and API gateway routing.

---

### DEC-P3-007: Primary Cloud Infrastructure & Database Platform
*Full Technical Specification: [`PHASE3_ARCHITECTURE_DECISION_RECORD.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_ARCHITECTURE_DECISION_RECORD.md#L81-L97)*

```
+---------------------------------------------------------------------------------------------------------+
|                                  CLOUD HOSTING PLATFORM AT A GLANCE                                     |
|                                                                                                         |
|   [OPTION A: AWS Enterprise (Aurora + ECS)]      [OPTION B: Google Cloud Platform (GCP)]                |
|   - Amazon Aurora PostgreSQL (sub-second failover)- Managed Google Kubernetes Engine (GKE) + Cloud SQL  |
|   - AWS ECS Fargate serverless containers        - Seamless integration with Google Cloud IAM           |
|   - Unmatched financial compliance certifications- Slightly less mature financial database clustering   |
|   - Baseline compute: ~$300–$500/mo (preliminary)- Baseline compute: ~$300–$500/mo (preliminary)       |
+---------------------------------------------------------------------------------------------------------+
```

1. **What the choice means:** Which enterprise cloud provider should host the production backend database, real-time WebSocket containers, and financial ledger?
2. **Main benefits and disadvantages:**
   - *Option A (AWS Enterprise — Recommended):* **Benefits:** Amazon Aurora PostgreSQL provides the gold standard for financial relational databases, featuring continuous transaction log backups to S3 (<1 minute recovery point objective) and automated sub-30-second multi-zone failover. Broadest global compliance (PCI-DSS, SOC 2, ISO 27001). **Disadvantages:** AWS IAM configuration requires meticulous DevOps setup.
   - *Option B (Google Cloud Platform):* **Benefits:** Excellent Kubernetes tooling (GKE) and developer workflows. **Disadvantages:** Cloud SQL PostgreSQL failover times (60–120s) are slower than Aurora, increasing disruption risks if a database node fails during an active auction.
   - *Option C (Hybrid Vercel + Supabase):* **Benefits:** Rapid prototype deployment. **Disadvantages:** High risk of unpredictable bandwidth egress costs, vendor fragmentation, and lack of enterprise financial SLAs during live WebSocket streaming.
3. **Cost and operational implications (Preliminary Estimates):**
   - *Option A & B:* Baseline compute spend estimated at preliminary model of **$300 to $500/month** for dev/staging, scaling to ~$600 to $1,200/month for high-availability multi-zone production. Excluded variable expenses (NAT gateways ~$65–$120/mo, bandwidth egress ~$50–$250/mo, KMS, APM) apply equally across providers.
4. **Security, financial, and international-commerce implications:**
   - Option A provides physically isolated private subnets with zero public database exposure, automated point-in-time recovery for 35 days, and sub-millisecond clock synchronization (AWS Time Sync Service) critical for soft-close anti-sniping.
5. **What information remains unknown:** Whether ChronoBid Vault has existing corporate cloud partnership credits with AWS or Google Cloud.
6. **Whether the decision must be made now or can safely wait:** **Must be made before Phase 4 infrastructure scaffolding.** Governs whether Terraform infrastructure-as-code scripts target AWS or GCP.

---

### DEC-P3-010: Live Saleroom WebSocket Core Technology
*Full Technical Specification: [`PHASE3_ARCHITECTURE_DECISION_RECORD.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_ARCHITECTURE_DECISION_RECORD.md#L100-L115)*

```
+---------------------------------------------------------------------------------------------------------+
|                                  WEBSOCKET ENGINE SELECTION AT A GLANCE                                 |
|                                                                                                         |
|   [OPTION A: Fastify Unified Monolith (Node.js)] [OPTION B: Standalone Go Microservice]                 |
|   - Shared TypeScript data models & Zod schemas  - Ultra-low memory (~100MB per 10k connections)        |
|   - Single deployment pipeline & code repository - Handles 50,000+ connections per server node          |
|   - Sustains 15,000+ sockets (ample for launch)  - Requires dual language toolchains (Go + TypeScript)  |
|   - Pre-defined trigger to extract to Go later   - Slower initial time to market (+3–4 weeks)           |
+---------------------------------------------------------------------------------------------------------+
```

1. **What the choice means:** Should the live saleroom WebSocket server be built using Node.js/Fastify sharing the same TypeScript codebase as the rest of the application (Option A), or built as an independent, standalone microservice written in Go (Option B)?
2. **Main benefits and disadvantages:**
   - *Option A (Unified Fastify TypeScript Monolith — Recommended):* **Benefits:** 100% type safety and validation schema sharing (Zod) between frontend, API, and WebSocket payloads. Single build pipeline. Fastest time to market. Node.js 22 LTS comfortably handles 15,000 concurrent collectors across 2 small containers—far exceeding the debut catalogue peak need (1,000 to 5,000 collectors). Includes a clear architectural trigger to extract to Go if scale demands it. **Disadvantages:** Slightly higher memory usage (~500MB per 10k connections vs. ~100MB in Go).
   - *Option B (Standalone Go Microservice):* **Benefits:** Exceptional raw concurrency and minimal RAM usage. **Disadvantages:** Introduces a polyglot stack requiring duplicate data models in Go and TypeScript, two separate CI/CD pipelines, and 3 to 4 weeks of additional upfront engineering overhead.
3. **Cost and operational implications (Preliminary Estimates):**
   - *Option A:* Lower upfront development cost. Operates on 2 AWS ECS Fargate tasks costing ~$60/month.
   - *Option B:* Saves ~$20/month in server RAM at massive scale, but adds ~$15,000 in upfront engineering time and dual-language maintenance overhead.
4. **Security, financial, and international-commerce implications:**
   - Option A allows bid reservations and database transactions to execute within a single transaction boundary in PostgreSQL, completely eliminating the risk of network disconnects between the WebSocket engine and the ledger.
5. **What information remains unknown:** Whether the debut auction will exceed 15,000 concurrent collectors (current projections indicate 1,000 to 5,000).
6. **Whether the decision must be made now or can safely wait:** **Must be made before Phase 4 backend structuring.** Dictates repository architecture, monorepo configuration, and CI/CD workflows.

---

## Master Project Owner Decision Register

In strict adherence to project governance rules, **all decisions below are unselected and remain strictly pending until the Project Owner explicitly marks and signs them**.

```
============================================================================================================
                        CHRONOBID VAULT — MASTER PROJECT OWNER DECISION REGISTER
============================================================================================================

SECTION 1: PHASE 2 PROTOTYPE ACCEPTANCE
------------------------------------------------------------------------------------------------------------
Review Scope: Next.js App Router Clickable Prototype (14 routes, 8 currencies, Pre-Funded Vault simulation)
Evidence:     67/67 automated test assertions passing; 0 build/lint errors; verified visual identity.

DETERMINATION:
[X] ACCEPTED AS DESIGN & INTERACTION BASELINE FOR NOW (Recorded: 22 October 2026 via Owner Directive)
[ ] REVISIONS REQUESTED

Governance Bounds & Outstanding Conditions Recorded:
1. ACCEPTANCE SCOPE: Prototype accepted as the design and interaction baseline for now.
2. OUTSTANDING CONDITIONS: Subject to provisional watch inventory (ADR-009) and #EDE7DC fallback cards;
   draft authentication parameters (ADR-020); active demo data disclosures ([DEMO DATA]); and proposed
   future service status for custodial escrow and insured transit (ADR-017).
3. DISCLAIMER: Untested backend functionality, production accessibility, security, and production
   readiness remain explicitly unverified.
4. BASELINES PRESERVED: Phase 1 approved baseline v2.2 and active specification v2.3 preserved.
5. CODING RESTRICTION: Phase 4 production implementation remains strictly blocked and prohibited.

Owner Status: ACCEPTED FOR NOW (Recorded via Owner Directive)   Date: 22 October 2026


SECTION 2: PHASE 3 TECHNICAL DOCUMENTATION BASELINE APPROVAL
------------------------------------------------------------------------------------------------------------
Review Scope: Architecture Decision Record, Security Threat Model, Vault Ledger Design, Commerce Design,
              Readiness Checklist, Consistency Audit, Corrections Report, and Phase Roadmap.

DETERMINATION:
[X] APPROVED AS PROVISIONAL TECHNICAL DESIGN BASELINE (Recorded: 22 October 2026 via Owner Directive)
[ ] REVISIONS REQUESTED

Owner Directive Terms & Mandatory Governance Bounds:
1. APPROVAL SCOPE: Conditional planning approval of the Phase 3 architecture and security documentation
   as a PROVISIONAL TECHNICAL DESIGN BASELINE.
2. NOT PRODUCTION READY: This approval is strictly conditional planning approval; it is NOT a declaration
   of production readiness, legal compliance, or completed security validation.
3. PRESERVATION OF GAPS & RISKS: All documented assumptions, risks, unresolved questions, and required
   specialist reviews (legal, tax, banking, payment-provider, security) remain preserved and active.
4. IMPLEMENTATION BARRIER: Approval of the design baseline does NOT authorize Phase 4 implementation,
   cloud provisioning, database scaffolding, or backend coding.

Owner Status: PROVISIONAL BASELINE APPROVED (Recorded via Owner Directive)   Date: 22 October 2026


SECTION 3: STRATEGIC ARCHITECTURE DECISIONS (TIER 1 FOUNDATION BLOCKERS)
------------------------------------------------------------------------------------------------------------
DEC-P3-001: International Currency Settlement Model & Foreign Exchange Risk
[X] OWNER PREFERRED OPTION — PROVISIONAL — VALIDATION REQUIRED: Option A (Canonical USD Settlement)
    * Rationale: Simplifies initial accounting model and avoids platform guaranteeing customer FX rates.
    * Governance: Strictly preserves display-currency conversion vs. settlement-currency distinction.
    * Validation Required: Payment-provider capabilities, banking arrangements, jurisdictional restrictions
      (India RBI FEMA LRS $250k cap, 20% TCS, 40%+ customs), and commercial requirements require validation.
[ ] OPTION B: Guaranteed 48-Hour FX Rate Lock (Not selected; deferred to future scaling phases)

DEC-P3-002: Production Authentication Architecture
[X] OWNER PREFERRED OPTION — PROVISIONAL — VALIDATION REQUIRED: Option A (Managed Identity Provider)
    * Candidate Status: Clerk and Auth0 remain candidates; do NOT select or subscribe without further approval.
    * Validation Required: Pricing, security capabilities, passkey support, Google OAuth/OIDC requirements,
      privacy, and data-handling terms must be validated before final provider selection.
    * Governance: Zero vendor contracts may be signed or committed.
[ ] OPTION B: Self-Hosted Identity via Fastify Auth / Ory Kratos (Not selected)

DEC-P3-007: Primary Cloud Infrastructure & Relational Database Platform
[X] OWNER PREFERRED OPTION — PROVISIONAL — VALIDATION REQUIRED: Option A (AWS Enterprise — Fargate + Aurora)
    * Rationale: Proposed AWS Fargate and Aurora architecture accepted as the provisional planning direction.
    * Validation Required: Workload requirements, availability objectives, backup/recovery (sub-1m RPO),
      security configuration, operational complexity, and total cost (including variable expenses).
    * Governance: Do NOT provision infrastructure or create paid resources.
[ ] OPTION B: Google Cloud Platform (Not selected)
[ ] OPTION C: Hybrid Architecture — Vercel Frontend + Supabase / AWS Database (Not selected)

DEC-P3-010: Live Saleroom WebSocket Core Technology
[X] OWNER PREFERRED OPTION — PROVISIONAL — VALIDATION REQUIRED: Option A (Fastify Modular Monolith on Node.js 22 LTS)
    * Rationale: Fastify modular monolith with shared TypeScript domain models and Zod validation schemas.
    * Preserved Triggers: Scalability triggers to extract a separate Go microservice if connections exceed
      15,000 sockets or if Node.js event-loop lag exceeds 25ms are strictly preserved.
    * Governance: Do NOT begin implementation or claim concurrency guarantees proven without real tests.
[ ] OPTION B: Standalone Go WebSocket Microservice (Not selected; retained as documented extraction trigger)


SECTION 4: FUTURE IMPLEMENTATION GO / NO-GO GATE (PHASE 4)
------------------------------------------------------------------------------------------------------------
Implementation Scope: Scaffolding AWS/GCP VPC, Aurora PostgreSQL, Fastify API, and live authentication.

DETERMINATION:
[ ] GO — AUTHORIZED TO PROCEED TO PHASE 4 IMPLEMENTATION
[X] NO-GO — NOT AUTHORIZED (REMAIN IN PLANNING)

Governance Status:
Phase 4 production implementation remains STRICTLY BLOCKED, NO-GO, AND NOT AUTHORIZED. Implementation
cannot commence until all required technical validations, provider underwriting, and legal/tax specialist
reviews are formally satisfied and explicit written owner authorization is granted.

============================================================================================================
PROJECT OWNER FORMAL SIGN-OFF:

Project Owner Signature: _________________________________________    Date: ________________________________

Printed Name:            _________________________________________
============================================================================================================
```

---
*Dossier compiled and certified by the ChronoBid Vault Engineering, Security, and Governance Review Board.*  
*Timestamp: 2026-10-20T14:15:00Z*