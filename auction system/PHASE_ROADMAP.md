# ChronoBid Vault — Master Phase Roadmap
## Sequential Path from Frontend Prototype to Enterprise Production Launch

> **Document Type:** Master Project Lifecycle & Implementation Phase Roadmap  
> **Project:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Working Directory:** `C:\Users\kbjee\OneDrive\Desktop\omniroute\auction system`  
> **Date:** 20 October 2026  
> **Author:** Senior Project Manager, ChronoBid Vault  
> **Current Lifecycle Stage:** Phase 2 Complete (Closure Pending) &rarr; Phase 3 Design (Proposed)  
> **Governance Directive:** **ALL IMPLEMENTATION BEYOND PHASE 2 REMAINS STRICTLY BLOCKED PENDING WRITTEN OWNER AUTHORIZATION**  

---

## 1. Lifecycle Overview & Phase-by-Phase Governance

ChronoBid Vault strictly enforces a **Phase-by-Phase Discipline**. We never skip ahead to future implementation phases, provision production infrastructure, write backend code, or install third-party dependencies without explicit, separate written authorization from the Project Owner.

```
+---------------------------------------------------------------------------------------------------------+
|                                    CHRONOBID VAULT LIFECYCLE ROADMAP                                    |
|                                                                                                         |
|  [PHASE 1 & 1.5]  --->  [PHASE 2]  --->  [PHASE 3]  --->  [PHASE 4]  --->  [PHASE 5]  --->  [PHASES 6-9]
|  Approved Baseline   Clickable       Production     Core Auth &    Pre-Funded Vault  Saleroom, Custody
|  v2.2 & Amend v2.3   Prototype       Architecture   Relational DB   Ledger & Rails    Audit & Launch
|  (COMPLETED)         (CLOSURE REQ)   (PROPOSED)     (PROHIBITED)    (PROHIBITED)      (PROHIBITED)
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Phase-by-Phase Implementation Matrix

### Phase 1: Requirements & Design Specification
- **Lifecycle Status:** **COMPLETED & FORMALLY APPROVED**
- **Date Approved:** 17 October 2026 (Baseline v2.2) | 19 October 2026 (Amendment v2.3)
- **Primary Deliverables:**
  - `phase1_requirements_and_design_specification.md` (Active Specification v2.3)
  - `phase1_requirements_and_design_specification_v2.2_approved_baseline.md` (Immutable Baseline Archive)
  - `DECISIONS.md` (ADR-001 through ADR-026)
- **Key Achievements:** Defined domain model, user journeys, 11-section editorial layout, 4-tier currency model, Pre-Funded Vault math, and soft-close anti-sniping rules.

---

### Phase 1.5: Prototype Readiness Planning & Gate Verification
- **Lifecycle Status:** **COMPLETED & VERIFIED**
- **Date Completed:** 18 October 2026
- **Primary Deliverables:**
  - `PROTOTYPE_READINESS_PLAN.md`
  - `PROTOTYPE_INTERACTION_INVENTORY.md`
  - `PROTOTYPE_ACCEPTANCE_CHECKLIST.md`
  - `PROTOTYPE_ASSET_READINESS.md`
- **Key Achievements:** Verified all 14 prototype routes, interaction inventories, and acceptance checklists. Resolved `/auth/reset-password` readiness gaps.

---

### Phase 2: Clickable Frontend Website Prototype
- **Lifecycle Status:** **ACCEPTED AS DESIGN & INTERACTION BASELINE FOR NOW (22 October 2026) — SUBJECT TO DOCUMENTED ACCEPTANCE CONDITIONS**
- **Authorization Date:** 18 October 2026
- **Primary Deliverables:**
  - Next.js App Router frontend prototype running at `http://localhost:3000`
  - 11-section monograph homepage, 14 leaf routes, 8-currency conversion engine
  - Client-side Pre-Funded Vault state machine, soft-close anti-sniping simulation
  - Tab-scoped session state persistence (`sessionStorage`), data sanitation, and safe resets (ADR-027)
  - `tests/qa-verification-runner.js` (51/51 tests passing)
  - `tests/verify-css-assets.js` (10/10 routes & 6/6 JS runtime chunks delivered with HTTP 200)
  - `PHASE2_CLOSURE_REPORT.md`
  - `PHASE2_FINAL_OWNER_ACCEPTANCE_AUDIT.md`
- **Gate Exit Status:** Formally accepted by Project Owner on 22 October 2026 as the design and interaction baseline for now, subject to documented acceptance conditions (provisional inventory ADR-009, draft auth parameters ADR-020, demo disclosures, and proposed future service status for escrow/transit ADR-017). Untested backend functionality, production accessibility, and security remain unverified.

---

### Phase 3: Production Architecture, Security & Financial Systems Design
- **Lifecycle Status:** **APPROVED AS PROVISIONAL TECHNICAL DESIGN BASELINE (22 October 2026) — VALIDATION REQUIRED — IMPLEMENTATION PROHIBITED**
- **Approval Date:** 22 October 2026 (Conditional Planning Approval via Owner Directive)
- **Primary Deliverables:**
  - `PHASE3_ARCHITECTURE_DECISION_RECORD.md` (ADR-P3-001: Architecture Evaluation & Fastify Monolith Recommendation)
  - `PHASE3_SECURITY_THREAT_MODEL.md` (STRIDE Threat Model & Security Controls Specification)
  - `PHASE3_VAULT_LEDGER_DESIGN.md` (Pre-Funded Vault Double-Entry Ledger & Concurrency Control)
  - `PHASE3_INTERNATIONAL_COMMERCE_DESIGN.md` (4-Tier Currency Model & FX Rate Settlement Architecture)
  - `PHASE3_IMPLEMENTATION_READINESS_CHECKLIST.md` (Four-Gate Verification Framework & Go/No-Go Criteria)
  - `PHASE3_OWNER_DECISIONS_REGISTER.md` (Ten Strategic Decisions Grouped into 3 Dependency Tiers)
  - `PHASE3_FINAL_REVIEW_REPORT.md` (Executive Review Report & Approval Criteria)
  - `PHASE3_PRODUCTION_ARCHITECTURE_AND_SECURITY_PLAN.md` (Foundational High-Level Architecture Overview)
- **Key Scope:**
  - Unified TypeScript Modular Monolith (Fastify + `fastify-websocket` + Node.js 22 LTS) on AWS ECS Fargate, with documented extraction trigger to Go binary (>15k concurrent sockets or >25ms event-loop lag per ADR-P3-001)
  - Managed vs. self-hosted authentication architecture (OIDC PKCE, Cloudflare Turnstile, Argon2id)
  - Pre-Funded Vault double-entry ledger (`vault_ledger_entries`), row-level pessimistic locking (`SELECT ... FOR UPDATE` on `vault_accounts`), atomic reservations, and mathematical concurrency proofs
  - International commerce settlement models (Model A: USD-Only Launch vs. Model B: Guaranteed FX Lock), hourly ECB/RBI/OER rate ingestion, dual-currency pricing invariant
  - STRIDE threat model across assets A1–A5, qualified regulatory checklist across 8 dimensions
- **Governance Gate:** Approved as a provisional planning and architectural design baseline only. Does NOT establish production readiness, legal compliance, or completed security validation. Zero code generation or dependency installation permitted.
- **Gate Exit Status:** Conditional planning approval granted on 22 October 2026. Implementation remains blocked pending completion of required validations and explicit owner authorization.

---

### Phase 4: Core Services, Authentication & Relational Database
- **Lifecycle Status:** **NO-GO — NOT AUTHORIZED — CODING STRICTLY PROHIBITED PENDING OWNER AUTHORIZATION**
- **Dependencies:** Completion of required validations for Tier 1 preferred decisions (DEC-P3-001, DEC-P3-002, DEC-P3-007, DEC-P3-010) and explicit written owner authorization.
- **Planned Deliverables:**
  - AWS/GCP cloud VPC provisioning, Aurora PostgreSQL Multi-AZ cluster, ElastiCache Redis cluster
  - Database schema migrations (`users`, `sessions`, `kyc_profiles`, `lots`, `bids`)
  - Production Google OAuth 2.0 / OIDC integration with state and PKCE validation
  - Cloudflare Turnstile anti-bot verification middleware
  - Transactional email dispatch via Postmark/SendGrid with HMAC 6-digit PIN verification
  - User profile, watchlist, and consignor role management APIs
- **Gate Exit Criteria:** Automated integration test suite running against real PostgreSQL/Redis instances passes 100%; zero mock auth remaining.

---

### Phase 5: Pre-Funded Vault Ledger, Payment Rails & Banking Integration
- **Lifecycle Status:** **NOT AUTHORIZED — LIVE FINANCIAL RAILS STRICTLY PROHIBITED**
- **Dependencies:** Completion of Phase 4; commercial agreement with primary payment provider (Adyen / Stripe per Tier 2 DEC-P3-003).
- **Planned Deliverables:**
  - Immutable double-entry bookkeeping ledger service (`vault_ledger_entries`, `vault_accounts`)
  - Atomic balance reservation and hold management APIs
  - Adyen/Stripe payment gateway integration for credit/debit deposits and 3DS2 authentication
  - Direct bank wire (Fedwire/CHAPS/SWIFT) incoming transfer webhook processing and automated MT940 reconciliation
  - Withdrawal request workflow with automated AML compliance checks
  - Hourly FX rate ingestion worker (ECB & OER feeds)
- **Gate Exit Criteria:** Ledger simulation executes 100,000 concurrent deposit/reservation/release cycles with $0.00 variance; daily bank reconciliation engine passes audit.

---

### Phase 6: Real-Time Live Saleroom Engine & WebSocket Gateway
- **Lifecycle Status:** **NOT AUTHORIZED — CODING STRICTLY PROHIBITED**
- **Dependencies:** Completion of Phase 4 and Phase 5.
- **Planned Deliverables:**
  - High-performance Fastify WebSocket Saleroom Gateway (modular monolith with Go extraction trigger per ADR-P3-001)
  - NTP sub-millisecond clock synchronization pipeline
  - Redis distributed locking (Redlock) and channel broadcasting
  - Server-authoritative ADR-012 Soft-Close clock reset and 10-extension hard cap enforcement
  - Option B Destination-Tier ladder validation on incoming custom jump-bids
  - Real-time bid stream ingestion, sequence numbering, and lag compensation
- **Gate Exit Criteria:** k6 load testing validates 10,000 simultaneous WebSocket connections and 500 concurrent bids/second with 99.9th percentile latency < 150ms and 0 race conditions.

---

### Phase 7: Custody Logistics, Provenance Dossiers & Settlement Automation
- **Lifecycle Status:** **NOT AUTHORIZED — IMPLEMENTATION STRICTLY PROHIBITED**
- **Dependencies:** Commercial partnership agreement with Malca-Amit (or Brink's).
- **Planned Deliverables:**
  - Malca-Amit vault intake and barcode tracking API integration
  - High-resolution 4:5 horological macro-photography and digital provenance dossier viewer
  - Automated post-auction winning invoice generator with tiered Buyer's Premium calculation
  - Consignor settlement payout engine and automated wire disbursement
  - Private consignment appraisal workflow and formal specialist review dashboard
- **Gate Exit Criteria:** Complete end-to-end dry-run tracking a physical specimen from intake vaulting to buyer handover.

---

### Phase 8: Comprehensive Security Audits, Compliance & Pilot Auction
- **Lifecycle Status:** **NOT AUTHORIZED — IMPLEMENTATION STRICTLY PROHIBITED**
- **Dependencies:** Completion of Phases 4 through 7.
- **Planned Deliverables:**
  - Independent CREST-accredited third-party penetration testing and source code security audit
  - SOC 2 Type II readiness audit and PCI-DSS SAQ-A certification
  - Tiered KYC/AML integration with Persona (identity verification, PEP/sanctions screening)
  - Disaster recovery, failover testing, and database backup verification
  - Private invitational dry-run pilot auction with real pre-funded deposits and test lots
- **Gate Exit Criteria:** Zero critical or high-severity vulnerabilities; formal legal and compliance sign-off.

---

### Phase 9: Public Production Launch & Operational Runbooks
- **Lifecycle Status:** **NOT AUTHORIZED**
- **Dependencies:** Successful completion and sign-off of Phase 8.
- **Planned Deliverables:**
  - Public domain DNS cutover (`https://chronobid.com` / `https://vault.chronobid.com`)
  - 24/7 saleroom monitoring, on-call rotation runbooks, and incident response protocols
  - Debut public curated auction featuring verified, authenticated marquee timepieces
- **Gate Exit Criteria:** Successful execution of Inaugural Fine Horology Auction with full financial settlement and physical delivery.

---

## 3. Four-Gate Verification Framework & Immediate Action Plan

To maintain momentum while strictly obeying project governance boundaries, the project lifecycle progresses through four formal verification gates (detailed in `PHASE3_IMPLEMENTATION_READINESS_CHECKLIST.md`):

```
+--------------------------------------------------------------------------------------------------------+
|                                    FOUR-GATE IMPLEMENTATION FRAMEWORK                                  |
|                                                                                                        |
|  [GATE 1] -------------> [GATE 2] -------------> [GATE 3] -------------> [GATE 4] ----------> [PHASE 4]
|  Prototype Closure       Phase 3 Architecture    Tier 1 Decisions        External Legal &      Engineering
|  & Owner Sign-off        Documentation Pack      Resolved by Owner       Banking Agreements    Authorized
+--------------------------------------------------------------------------------------------------------+
```

### 3.1 Four Implementation Gates Summary

1. **Gate 1: Governance & Prototype Acceptance**
   - Formal sign-off by Project Owner on `PHASE2_CLOSURE_REPORT.md`.
   - Verification that all prototype boundaries (demo data, mock auth, sandbox ledger) remain intact.
2. **Gate 2: Phase 3 Architecture Deliverables Sign-off**
   - Review and acceptance of the 7 Phase 3 design deliverables (`PHASE3_ARCHITECTURE_DECISION_RECORD.md`, `PHASE3_SECURITY_THREAT_MODEL.md`, `PHASE3_VAULT_LEDGER_DESIGN.md`, `PHASE3_INTERNATIONAL_COMMERCE_DESIGN.md`, `PHASE3_IMPLEMENTATION_READINESS_CHECKLIST.md`, `PHASE3_OWNER_DECISIONS_REGISTER.md`, `PHASE3_FINAL_REVIEW_REPORT.md`).
3. **Gate 3: Strategic Owner Decisions Resolution**
   - Strategic decisions are prioritized by dependency tier (`PHASE3_OWNER_DECISIONS_REGISTER.md`):
     - **Tier 1 (Core Foundation Blockers — Required Before Phase 4 Scaffolding):**
       - **DEC-P3-001:** Currency Settlement Model (Model A: USD-Only Launch vs. Model B: Guaranteed FX Lock)
       - **DEC-P3-002:** Authentication Architecture (Option A: Managed Identity vs. Option B: Self-Hosted)
       - **DEC-P3-007:** Primary Cloud Infrastructure (Option A: AWS vs. Option B: GCP)
       - **DEC-P3-010:** Saleroom Gateway Architecture (Option A: Fastify Monolith vs. Option B: Go Cluster)
     - **Tier 2 (Commercial & Verification Rails — Required Before Phase 5):**
       - **DEC-P3-003:** Payment Gateway (Option A: Adyen vs. Option B: Stripe)
       - **DEC-P3-005:** Identity & AML Verification (Option A: Persona vs. Option B: Stripe Identity)
       - **DEC-P3-006:** Anti-Bot Verification (Option A: Cloudflare Turnstile vs. Option B: Google reCAPTCHA)
     - **Tier 3 (Logistics & Debut Policies — Required Before Phase 7):**
       - **DEC-P3-004:** Custody & Vault Partner (Option A: Malca-Amit vs. Option B: Brink's)
       - **DEC-P3-008:** Buyer's Premium Fee Schedule
       - **DEC-P3-009:** Debut Catalogue Rights Clearance
4. **Gate 4: External Legal & Banking Prerequisites**
   - Qualified legal review of escrow exemptions and money transmission laws.
   - Bank underwriting and merchant account approval for high-value fine art/horology auctions.

### 3.2 Immediate Next Steps

1. **Step 1: Project Owner Signs Phase 2 Closure**
   - Execute signature block in `PHASE2_CLOSURE_REPORT.md` (Formal Phase 2 acceptance).
2. **Step 2: Project Owner Reviews Phase 3 Architecture Package**
   - Review `PHASE3_FINAL_REVIEW_REPORT.md` and related deliverables.
3. **Step 3: Project Owner Resolves Tier 1 Strategic Decisions**
   - Record formal selections for DEC-P3-001, DEC-P3-002, DEC-P3-007, and DEC-P3-010 in `PHASE3_OWNER_DECISIONS_REGISTER.md`.
4. **Step 4: Formal Phase 4 Authorization**
   - Upon completion of Gates 1, 2, and 3, Project Owner issues separate written authorization to initiate Phase 4 engineering.

---
*Roadmap reconciled by Senior Project Manager & Solutions Architect, ChronoBid Vault.*  
*Timestamp: 2026-10-20T06:05:00Z*
