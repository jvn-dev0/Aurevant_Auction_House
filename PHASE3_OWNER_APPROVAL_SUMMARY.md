# ChronoBid Vault — Phase 3 Architecture Owner Approval Summary
## Executive Decision Review, Provisional Recommendations & Professional Validation Register

> **Document Type:** Project Owner Executive Decision Summary & Approval Docket  
> **Project Name:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Target Audience:** Project Owner (Executive Leadership)  
> **Working Directory:** `C:\Users\kbjee\OneDrive\Desktop\omniroute`  
> **Date:** 25 October 2026  
> **Authors:** Principal Solutions Architect, Senior Financial Systems Analyst, Head of Security & Compliance  
> **Current Governance Directive:**  
> 1. **PROVISIONAL RECOMMENDATIONS ONLY:** The four Tier 1 foundation architectural directions are recorded strictly as provisional recommendations pending explicit written Project Owner approval.  
> 2. **DO NOT MARK APPROVED:** These decisions are **NOT APPROVED** and do not commit the Project Owner to vendor contracts, cloud expenditure, or commercial settlement policies.  
> 3. **PRESERVED INVARIANTS & REVIEWS:** Strictly preserves all unresolved Buyer Vault accounting invariants and all outstanding legal, tax, privacy, security, and statutory accounting reviews.  
> 4. **STRICT IMPLEMENTATION BOUNDARY:** Phase 2.1 is accepted strictly as a prototype. Phase 3 backend implementation and Phase 4 production implementation remain **STRICTLY NOT AUTHORIZED (NO-GO)**.

---

## 1. Executive Summary & Review Scope

Following the formal Project Owner acceptance of the Phase 2.1 multi-category frontend prototype on 25 October 2026, this document presents the **Phase 3 Strategic Architecture Decision Review** covering the four critical Tier 1 foundation decisions required before Phase 4 database and service scaffolding can be initiated.

### Governance Guardrails Enforced in This Review:
- **No Premature Approvals:** None of the four decisions are marked approved; all are classified as `PROVISIONAL RECOMMENDATION ONLY — PENDING EXPLICIT OWNER APPROVAL`.
- **Zero Financial Commitment:** No cloud infrastructure accounts will be provisioned, no SaaS subscriptions activated, and no vendor contracts signed.
- **Preserved Accounting Invariants:** The double-entry Chart of Accounts, unified headroom formula with escrow hold subtractions, ascending multi-account lock ordering, and the prohibition of automated shortfall write-offs remain strictly preserved.
- **Preserved Professional Reviews:** Six external specialist legal, tax, privacy, security, and CPA audit reviews remain formally recorded as outstanding requirements.

---

## 2. Tier 1: Core Foundation Decisions (Provisional Recommendations Only)

```
+----------------------------------------------------------------------------------------------------------+
|                                  TIER 1 PROVISIONAL RECOMMENDATIONS SUMMARY                              |
+------------+--------------------------+---------------------------------------------------+--------------+
| Decision ID| Strategic Subject        | Provisional Recommendation (Pending Owner Sign-Off)| Timing Action|
+------------+--------------------------+---------------------------------------------------+--------------+
| DEC-P3-001 | Currency Settlement      | Option A: Canonical USD Settlement                | DECIDE NOW   |
| DEC-P3-002 | Authentication Platform  | Option A: Clerk Initial Candidate; Auth0 Alt      | DECIDE NOW   |
| DEC-P3-007 | Cloud Infrastructure     | Option A: AWS ECS Fargate + Aurora PostgreSQL     | DECIDE NOW   |
| DEC-P3-010 | Saleroom WebSocket Engine| Option A: Fastify + TypeScript Modular Monolith   | DECIDE NOW   |
+------------+--------------------------+---------------------------------------------------+--------------+
```

---

### DEC-P3-001: Canonical USD Settlement Model & FX Risk Allocation

- **The Decision to be Made:**  
  Whether ChronoBid Vault legally and commercially settles international auction invoices strictly in United States Dollars (USD) or guarantees a 48-hour fixed foreign exchange (FX) rate in the winning bidder's local currency.
- **Provisional Recommendation:**  
  **Option A (Canonical USD-Only Settlement) — PROVISIONAL RECOMMENDATION ONLY.**
- **Detailed Rationale:**  
  - Eliminates foreign exchange volatility risk from ChronoBid Vault's balance sheet during the 48-hour post-auction settlement window. On six-figure horology lots ($100k–$500k+), a 1%–2% currency swing represents thousands of dollars in unhedged liability.
  - Aligns with the proven operational standard of premier global auction houses (Christie's, Sotheby's, Phillips), which settle in saleroom base currencies.
  - Preserves full collector transparency: International collectors see real-time estimated local currency conversions (EUR, GBP, CHF, JPY, HKD, SGD, INR) on the frontend clearly marked with mandatory `[ESTIMATE]` tags, while their issuing bank handles the foreign exchange conversion upon executing the wire.
- **Main Alternative & Trade-Offs:**  
  - *Option B (Guaranteed 48-Hour FX Rate Lock):* Gives buyers fixed local currency invoices, but forces ChronoBid Vault to absorb currency losses or pay third-party hedging providers (e.g., Adyen Guaranteed FX with an integrated ~1.25% spread buffer). Exposes the platform to currency arbitrage during geopolitical macroeconomic shocks.
- **Estimated Cost Profile:**  
  - Option A (USD Settlement): **$0 external vendor cost** *(Verified)*. Ledger configuration and currency converters are built into baseline software design.
  - Option B (Guaranteed FX Lock): **~$15,000–$30,000 upfront setup** *(Estimated)* for treasury integration, multi-currency corporate banking accounts, and specialized legal/tax review, plus ~1.25% per-transaction hedging spreads.
- **Dependencies & Risks:**  
  - *Dependencies:* Commercial banking partner capable of receiving incoming international Fedwire and SWIFT wires.
  - *Risks:* Retail foreign exchange conversion spreads (typically 1.0%–2.5%) charged by international buyers' local banks.
- **Required Professional Reviews (Preserved as Outstanding):**  
  - **Indian Foreign Exchange Legal Counsel Review:** Formal legal review of Reserve Bank of India (RBI) Liberalised Remittance Scheme (LRS) $250,000 annual limit, mandatory Form A2 declarations, Section 206C(1G) 20% Tax Collected at Source (TCS) withholding, and Indian customs duties.
- **Explicit Non-Commitment Notice:**  
  *DO NOT MARK APPROVED.* Recording this provisional recommendation does **not** commit the Project Owner or ChronoBid Vault to an operational settlement policy or commercial banking agreement.

---

### DEC-P3-002: Authentication Architecture (Clerk Initial Candidate; Auth0 Alternative)

- **The Decision to be Made:**  
  Whether to deploy a managed enterprise identity platform (Clerk Enterprise or Auth0) or build and self-host a custom authentication service (Fastify Auth / Ory Kratos).
- **Provisional Recommendation:**  
  **Option A (Managed Enterprise Identity Provider — Clerk as initial candidate; Auth0 remains an active alternative) — PROVISIONAL RECOMMENDATION ONLY.**
- **Detailed Rationale:**  
  - Offloads master user password storage, credential hashing, and identity breach liability entirely away from ChronoBid Vault servers.
  - Accelerates time-to-market by ~6 weeks by providing turn-key FIDO2/WebAuthn biometric passkeys (Apple FaceID / TouchID / Windows Hello), enabling collectors to authenticate bids in <1 second with zero SMS or password friction.
  - **Clerk as Initial Candidate:** Delivers superior developer ergonomics for Fastify/Next.js, a lightweight launch cost ($25/mo base), and stateless 60-second JWTs that auto-refresh via HTTP-only cookies without requiring stateful Redis token denylist infrastructure.
  - **Auth0 as Active Alternative:** Remains an evaluated enterprise alternative if dedicated European Union data residency is strictly mandated by EU privacy counsel.
- **Main Alternative & Trade-Offs:**  
  - *Option B (Self-Hosted Identity — Fastify Auth / Ory Kratos):* Eliminates monthly SaaS fees and ensures complete data sovereignty in private VPC subnets, but ChronoBid Vault engineers bear 100% of the ongoing liability for security patches, rate limiting, token hygiene, and 24/7 uptime.
- **Estimated Cost Profile:**  
  - Clerk Enterprise Starter: **$25/month base fee** *(Verified published rate)*, scaling at **~$0.05 per monthly active user** beyond included tiers.
  - Auth0 Enterprise: **$700 to $3,500/month** *(Verified published enterprise tiers)* for equivalent enterprise passkey, brute-force shielding, and SLA guarantees.
  - Option B (Self-Hosted): **$0/month vendor fees**, but requires **~$30,000 in custom engineering, DevOps setup, and annual penetration testing** *(Estimated)*.
- **Dependencies & Risks:**  
  - *Dependencies:* Google Cloud Console OAuth 2.0 Client credentials; Apple Developer credentials for WebAuthn passkey domain binding.
  - *Risks:* Third-party vendor availability during live auctions (mitigated by stateless JWT signature verification, ensuring active bidder sessions function even if vendor dashboards suffer an outage).
- **Required Professional Reviews (Preserved as Outstanding):**  
  - **European Privacy Counsel Review:** Formal legal review of Clerk's US data hosting under the EU-U.S. Data Privacy Framework (DPF) versus Auth0's native European data residency for high-net-worth EU collectors under GDPR.
- **Explicit Non-Commitment Notice:**  
  *DO NOT MARK APPROVED.* Recording Clerk as the initial candidate and Auth0 as an alternative does **not** commit the Project Owner to sign vendor contracts, activate subscriptions, or create paid identity resources.

---

### DEC-P3-007: Cloud Infrastructure (AWS ECS Fargate + Aurora PostgreSQL Multi-AZ)

- **The Decision to be Made:**  
  Which enterprise cloud hosting platform should host the production backend API, real-time saleroom WebSocket clusters, and the high-availability financial ledger database.
- **Provisional Recommendation:**  
  **Option A (AWS Enterprise — ECS Fargate + Aurora PostgreSQL Multi-AZ + ElastiCache Redis) — PROVISIONAL RECOMMENDATION ONLY.**
- **Detailed Rationale:**  
  - Aurora PostgreSQL Multi-AZ provides triple-availability-zone synchronous storage replication with sub-minute automatic failover and continuous point-in-time recovery (Recovery Point Objective < 1 minute; Recovery Time Objective < 15 minutes).
  - Integrates the **AWS Time Sync Service (NTP)**, maintaining server clock synchronization to within <1 millisecond across all container instances—strictly required for microsecond-accurate anti-sniping soft-close bid timestamping.
  - Provides isolated private VPC subnets with zero public database exposure, protected by an edge Web Application Firewall (Cloudflare Pro/Business).
- **Main Alternative & Trade-Offs:**  
  - *Option B (Google Cloud Platform — GCP GKE + Cloud SQL):* Excellent container tooling, but slightly less mature managed database clustering compared to Aurora.
  - *Option C (Vercel + Supabase / AWS Hybrid):* Rapid for prototyping, but introduces high risks of serverless connection pool exhaustion and unpredictable data egress bills during live WebSocket auction broadcasts.
- **Estimated Cost Profile:**  
  - Development & Staging Environment: **$250 to $450/month** *(Estimated)*.
  - High-Availability Multi-AZ Production Environment: **$600 to $1,200/month** *(Estimated)*.
  - *Itemized Cost Breakdown:* Compute (ECS Fargate: ~$150–$300/mo), Database (Aurora Multi-AZ: ~$220–$450/mo), Cache (ElastiCache Redis: ~$35–$75/mo), Networking (Dual NAT Gateways: ~$65–$120/mo *(Verified AWS rate: $0.045/hr/gateway)*), Data Egress (~$50–$200/mo *(Estimated)*), AWS KMS encryption (~$15/mo).
- **Dependencies & Risks:**  
  - *Dependencies:* AWS Organization account, Cloudflare DNS zone delegation, domain SSL certificates.
  - *Risks:* Cloud infrastructure misconfiguration leading to security exposure or unexpected egress costs.
- **Required Professional Reviews (Preserved as Outstanding):**  
  - **Independent Cloud DevOps / Security Review:** Technical audit of Terraform infrastructure-as-code templates, VPC subnet isolation, and automated disaster recovery failover runbooks prior to production launch.
- **Explicit Non-Commitment Notice:**  
  *DO NOT MARK APPROVED.* Recording this provisional recommendation does **not** commit the Project Owner to cloud expenditures or infrastructure provisioning. Zero paid cloud resources may be created.

---

### DEC-P3-010: Live Saleroom WebSocket Core Technology (Fastify + TypeScript Modular Monolith)

- **The Decision to be Made:**  
  Whether the real-time live auction saleroom WebSocket engine should be built directly inside the Unified Fastify TypeScript backend or built as an independent microservice written in Go.
- **Provisional Recommendation:**  
  **Option A (Unified Fastify TypeScript Modular WebSocket Engine on Node.js 22 LTS) — PROVISIONAL RECOMMENDATION ONLY.**
- **Detailed Rationale:**  
  - Shares 100% of domain models, bid increment validation logic (Zod schemas), and database contexts directly with the frontend Next.js app and the core REST API.
  - Eliminates the operational complexity of maintaining two different programming languages, accelerating development velocity and saving approximately ~3 weeks of engineering effort (~$15,000 dev value).
  - Easily accommodates debut auction volumes (1,000 to 5,000 simultaneous collectors).
  - Preserves a pre-defined architectural extraction trigger: If peak concurrency exceeds 15,000 connections or if Node.js event-loop lag exceeds 25 milliseconds, the modularized WebSocket worker can be cleanly extracted into a dedicated Go binary without altering client interfaces or database schemas.
- **Main Alternative & Trade-Offs:**  
  - *Option B (Dedicated Compiled Go WebSocket Service):* Minimal RAM footprint (~100MB per pod vs. ~500MB) and handles 50,000+ connections per node, but introduces polyglot development friction and requires maintaining duplicate validation logic in TypeScript and Go.
- **Estimated Cost Profile:**  
  - Option A: **$0 extra software cost**; saves **~$15,000 in upfront engineering time** *(Estimated)*.
  - Option B: Requires **~$15,000 in additional specialized backend engineering** *(Estimated)*.
  - Infrastructure difference: Negligible for debut auctions (**~$20 to $50/month** in container RAM) *(Estimated)*.
- **Dependencies & Risks:**  
  - *Dependencies:* Redis Cluster for distributed pub/sub broadcasting and rate limiting.
  - *Risks:* Event-loop blocking if CPU-heavy calculations run on the main thread (mitigated by architectural rules requiring cryptographic hashing and image processing to run in worker threads).
- **Required Professional Reviews (Preserved as Outstanding):**  
  - **Concurrency & Performance Load Testing Review:** Execution of simulated k6 load tests (5,000 concurrent virtual collectors) against live PostgreSQL and Redis backends during Phase 3 verification.
- **Explicit Non-Commitment Notice:**  
  *DO NOT MARK APPROVED.* Recording this provisional recommendation does **not** authorize Phase 3 backend coding or service implementation.

---

## 3. Preserved Buyer Vault Accounting Invariants

In strict adherence to governance instructions, the core mathematical and financial ledger invariants established in [`PHASE3_VAULT_LEDGER_DESIGN.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_VAULT_LEDGER_DESIGN.md) and audited in [`PHASE3_ARCHITECTURE_CONSISTENCY_AUDIT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PHASE3_ARCHITECTURE_CONSISTENCY_AUDIT.md) are preserved in full:

1. **Canonical Double-Entry Chart of Accounts:**  
   Preserves the approved 9-account structure:
   - `Account 1010`: User Available Funds (Liability — Credit)
   - `Account 1020`: User Reserved Funds (Liability — Credit)
   - `Account 1030`: User Pending Clearance Holds (Liability — Credit)
   - `Account 1040`: Settlement Escrow Holds (Liability — Credit)
   - `Account 2010`: Bank Custody Clearing Account (Asset — Debit)
   - `Account 2050`: Unidentified Clearing Suspense (Liability — Credit)
   - `Account 3010`: Platform Buyer's Premium (Revenue — Credit)
   - `Account 3020`: Platform Consignor Commission (Revenue — Credit)
   - `Account 4010`: Consignor Payout Payable (Liability — Credit)
2. **Unified Headroom Equation:**  
   $$\mathbf{Available\ to\ Bid} = \mathbf{Total\ Vault\ Balance} - \mathbf{Reserved\ Funds} - \mathbf{Committed\ Funds\ (Account\ 1040)} - \mathbf{Applicable\ Holds}$$
   Prevents double-spending by subtracting winning hammer amounts in Account 1040 awaiting invoice payment.
3. **Deterministic Multi-Account Lock Acquisition Order:**  
   To prevent cyclic deadlocks during rapid outbid transactions across lots, database locks must be acquired in strict ascending primary-key order:
   ```sql
   SELECT * FROM vault_accounts WHERE user_id IN (:newBidder, :prevLeader) ORDER BY user_id ASC FOR UPDATE;
   ```
4. **Wire Clearance Proof Invariant:**  
   Uploaded customer wire slips grant **$0 bidding headroom**. Physical custody release of purchased assets remains strictly locked until funds clear bank settlement. Automated write-offs of shortfalls under $50 USD remain strictly prohibited.

---

## 4. Outstanding Specialist & Legal Reviews Register

The following six specialist professional reviews are formally preserved as outstanding requirements prior to production authorization:

| Domain | Scope of Professional Review | Required Specialist / Authority | Status |
| :--- | :--- | :--- | :--- |
| **Indian Foreign Exchange** | RBI FEMA LRS $250k cap, Form A2 declarations, and Sec 206C(1G) 20% TCS withholding | Indian Foreign Exchange / Tax Legal Counsel | **OUTSTANDING** |
| **European Privacy (GDPR)** | Clerk US hosting under EU-U.S. Data Privacy Framework (DPF) vs. Auth0 native EU data residency | European Data Privacy Counsel | **OUTSTANDING** |
| **Statutory Accounting & Escrow** | Double-entry chart of accounts mapping, escrow liabilities, and revenue recognition under US GAAP (ASC 606/946) or IFRS | Qualified Certified Public Accountant (CPA) / Statutory Auditor | **OUTSTANDING** |
| **Merchant Risk & Underwriting** | Underwriting application for luxury horology/jewelry acquiring and rolling reserve terms | Adyen / Stripe Merchant Risk Committee | **OUTSTANDING** |
| **Cloud Infrastructure Security** | Multi-AZ VPC isolation, AWS KMS key rotation, and automated failover runbooks | Independent Senior DevOps / Cloud Architect | **OUTSTANDING** |
| **Live Auction Concurrency** | k6 load testing (5,000 concurrent collectors) validating <25ms event-loop lag and zero deadlocks | Senior Performance / QA Engineer | **OUTSTANDING** |

---

## 5. Roadmap of Deferred Decisions (Tiers 2 & 3)

The remaining six decisions remain deferred to subsequent phases as planned:

- **Tier 2: Commercial Rails & Vendor Integrations (Deferred to Phase 5):**
  - **DEC-P3-003:** Primary Payment Gateway (Adyen / Stripe Cards + Bank Wires).
  - **DEC-P3-005:** Identity Verification AML/KYC Vendor (Persona).
  - **DEC-P3-006:** Anti-Bot & Abuse Security Vendor (Cloudflare Turnstile Pro/Business).
- **Tier 3: Operational Logistics & Catalog Commercial Policies (Deferred to Phase 7):**
  - **DEC-P3-004:** Vault Custody & Armored Transit Partner (Malca-Amit + Ferrari Logistics).
  - **DEC-P3-008:** Buyer's Premium Fee Schedule (Tiered 20% / 15% / 10%).
  - **DEC-P3-009:** Debut Timepiece Catalog Rights Clearance (Studio Macro-Photography + Consignor Intake).

---

## 6. Actionable Owner Determination Block

Whenever you choose to formally determine any of the four Tier 1 decisions, you may record your decision below. Until then, all four remain provisional recommendations:

```
========================================================================================================================
                             CHRONOBID VAULT — PHASE 3 TIER 1 OWNER DETERMINATION DOCKET
========================================================================================================================

Decision Ref   Category              Current Status                     Owner Sign-Off (Pending Written Approval)
------------------------------------------------------------------------------------------------------------------------
DEC-P3-001     Currency & FX         PROVISIONAL RECOMMENDATION ONLY    [ ] APPROVED   [ ] REJECTED   [ ] REVISE: _____
DEC-P3-002     Authentication        PROVISIONAL RECOMMENDATION ONLY    [ ] APPROVED   [ ] REJECTED   [ ] REVISE: _____
DEC-P3-007     Cloud Infrastructure  PROVISIONAL RECOMMENDATION ONLY    [ ] APPROVED   [ ] REJECTED   [ ] REVISE: _____
DEC-P3-010     WebSocket Gateway     PROVISIONAL RECOMMENDATION ONLY    [ ] APPROVED   [ ] REJECTED   [ ] REVISE: _____
========================================================================================================================

Governance Confirmation:
- Phase 2.1 Prototype:         FORMALLY ACCEPTED (25 October 2026) — CLICKABLE PROTOTYPE ONLY
- Tier 1 Decisions:            4 PROVISIONAL RECOMMENDATIONS RECORDED — PENDING EXPLICIT WRITTEN OWNER APPROVAL
- Approval Status:             DO NOT MARK APPROVED — ZERO CONTRACT COMMITMENTS — ZERO CLOUD EXPENDITURES
- Accounting Invariants:       CANONICAL 9-ACCOUNT DOUBLE-ENTRY & ASCENDING LOCK ORDERING STRICTLY PRESERVED
- Professional Reviews:        ALL 6 LEGAL, TAX, PRIVACY, SECURITY & CPA REVIEWS PRESERVED AS OUTSTANDING
- Implementation Status:       PHASE 3 BACKEND & PHASE 4 PRODUCTION REMAIN STRICTLY NOT AUTHORIZED (NO-GO)

Project Owner Signature: _________________________________________   Date: ________________________
========================================================================================================================
```

---
*Document compiled by Senior Solutions Architect, Senior Financial Systems Analyst, and Project Management Office.*  
*Timestamp: 2026-10-25T05:49:00Z*
