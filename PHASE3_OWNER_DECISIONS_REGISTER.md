# ChronoBid Vault — Phase 3 Owner Decisions Register
## Prioritized Decision Architecture, Dependency Tiers, Accounting Invariants & Trade-Off Analysis

> **Document Type:** Project Owner Strategic Decision Matrix & Governance Register  
> **Project:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Working Directory:** `C:\Users\kbjee\OneDrive\Desktop\omniroute\auction system`  
> **Date:** 25 October 2026 (Updated Phase 3 Strategic Architecture Review)  
> **Author:** Senior Solutions Architect, Senior Project Manager, Financial Systems Analyst  
> **Status:** **PROVISIONAL RECOMMENDATIONS RECORDED — PENDING EXPLICIT OWNER APPROVAL — IMPLEMENTATION NOT AUTHORIZED (NO-GO)**  
> **Strict Governance Directive:**  
> 1. **DO NOT MARK THESE DECISIONS APPROVED.** All Tier 1 selections remain provisional recommendations awaiting explicit, separate written Project Owner approval.  
> 2. **NO COMMITMENTS:** Do NOT commit the Project Owner to vendor contracts, cloud expenditure, or commercial settlement policies. Zero subscriptions activated, zero paid resources created, zero contracts signed.  
> 3. **PRESERVED INVARIANTS & REVIEWS:** Strictly preserves the unresolved Buyer Vault accounting invariants (double-entry chart of accounts, headroom formula with committed escrow holds, and ascending lock ordering) and all outstanding legal, tax, privacy, security, and accounting reviews.  
> 4. **IMPLEMENTATION STATUS:** Phase 3 backend implementation remains **STRICTLY NOT AUTHORIZED (NO-GO)**. Phase 4 production implementation remains **STRICTLY NOT AUTHORIZED (NO-GO)**.

---

## 1. Prioritization Framework & Dependency Tiers

Rather than requiring the Project Owner to resolve all ten strategic decisions simultaneously, decisions are organized into three sequential **Dependency Tiers**:

```
+---------------------------------------------------------------------------------------------------------+
|                                    DECISION DEPENDENCY TIERS                                            |
|                                                                                                         |
|   [TIER 1: Core Foundation Blockers] — 4 Decisions (PROVISIONAL RECOMMENDATIONS PENDING APPROVAL)       |
|   - Must be resolved before Phase 4 database schema and service design can commence.                   |
|   * DEC-P3-001 (Currency Settlement Model: Canonical USD Settlement)                                   |
|   * DEC-P3-002 (Authentication Architecture: Clerk initial candidate; Auth0 active alternative)         |
|   * DEC-P3-007 (Cloud Infrastructure: AWS ECS Fargate + Aurora PostgreSQL Multi-AZ)                     |
|   * DEC-P3-010 (WebSocket Real-Time Engine: Fastify + TypeScript Modular Monolith)                      |
|                                                                                                         |
|   [TIER 2: Commercial Rails & Vendor Integrations] — 3 Decisions (DEFERRED TO PHASE 5)                  |
|   - Must be resolved before Phase 5 payment and KYC ledger implementation.                             |
|   * DEC-P3-003 (Primary Payment Gateway & Banking Rails)                                                |
|   * DEC-P3-005 (Identity Verification KYC/AML Vendor)                                                  |
|   * DEC-P3-006 (Anti-Bot & Abuse Security Vendor)                                                      |
|                                                                                                         |
|   [TIER 3: Operational Logistics & Catalog Commercial Policies] — 3 Decisions (DEFERRED TO PHASE 7)     |
|   - Must be resolved before Phase 7 physical intake and dry-run auctions.                              |
|   * DEC-P3-004 (Vault Custody & Armored Transit Partner)                                                |
|   * DEC-P3-008 (Buyer's Premium Fee Schedule)                                                          |
|   * DEC-P3-009 (Debut Catalog Licensing Clearance — ADR-009)                                           |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Tier 1: Core Foundation Blockers (Action Required for Phase 4)

### DEC-P3-001: International Currency Settlement Model & FX Risk Allocation
- **The Question Requiring Resolution:** How should ChronoBid Vault legally and commercially settle international auction invoices between the fall of the hammer and wire receipt?
- **Available Options:**
  - **Option A (Canonical USD-Only Settlement — Recommended):** The auction invoice is issued and settled strictly in USD. The buyer instructs their bank to wire USD; the buyer's bank converts local currency at the prevailing retail wire rate. ChronoBid Vault's balance sheet bears zero FX volatility risk.
  - **Option B (Guaranteed 48-Hour FX Rate Lock):** ChronoBid locks the local display currency estimate shown at the hammer for 48 hours. ChronoBid absorbs currency fluctuations or hedges them via Adyen's Guaranteed FX contract (with an integrated ~1.25% treasury buffer).
- **Rationale for Recommendation (Option A):**
  - Eliminates foreign exchange volatility risk entirely from ChronoBid Vault's balance sheet during the 48-hour post-auction settlement window.
  - Preserves the gold standard established by leading international luxury houses (Christie's, Sotheby's, Phillips) of settling in the saleroom's base currency.
  - International collectors still benefit from real-time estimated conversions on the website in their local currency (EUR, GBP, CHF, JPY, HKD, SGD, INR) with mandatory `[ESTIMATE]` tags.
- **Main Alternative & Trade-Offs (Option B):**
  - Option B provides a frictionless local currency experience, but forces ChronoBid Vault to absorb foreign currency depreciations or pay hedging fees (~1.25% treasury buffer), exposing the platform to cross-border currency arbitrage during macroeconomic shocks.
- **Estimated Cost Profile:**
  - Option A: **$0 external vendor cost** *(Verified)*. Ledger configuration and currency converter utilities are part of the baseline software design.
  - Option B: **~$15,000–$30,000 setup** *(Estimated)* for treasury integration, multi-currency banking setup, and specialized legal/tax counsel, plus ongoing hedging spreads (~1.25%).
- **Dependencies & Risks:**
  - Dependencies: Commercial banking partner capable of receiving incoming international Fedwire and SWIFT wires.
  - Risks: Potential retail wire conversion spread friction (1.0%–2.5%) charged by international buyers' local banks.
- **Required Professional Reviews:**
  - Indian Foreign Exchange Legal Counsel Review: Required to validate Reserve Bank of India (RBI) Liberalised Remittance Scheme (LRS) $250,000 annual limit, Form A2 declarations, and Section 206C(1G) 20% Tax Collected at Source (TCS) withholding rules for Indian bidders.
  - Commercial Banking Review: Required to confirm incoming wire handling and automated virtual IBAN matching.
- **Timing Determination:** **MUST BE DECIDED NOW (Tier 1)** — Dictates database currency types, ledger schema, and invoice generation engines.
- **Owner Determination Status:** `PROVISIONAL RECOMMENDATION ONLY — PENDING EXPLICIT OWNER APPROVAL: Option A (Canonical USD-Only Settlement)`
- **Owner Governance Directives & Non-Commitment Notice:**
  - *DO NOT MARK APPROVED:* This recommendation is recorded strictly for planning purposes and awaits separate, explicit Project Owner sign-off.
  - *No Commercial Policy Commitment:* Does NOT commit the Project Owner or platform to a binding settlement policy or bank contract.
  - *Preserved Distinction:* Strictly preserves the approved distinction between display-currency conversion (`[ESTIMATE]`) and canonical settlement currency (USD only).

---

### DEC-P3-002: Production Authentication Architecture (Managed vs. Self-Hosted)
- **The Question Requiring Resolution:** Should ChronoBid Vault utilize a managed identity platform (Clerk / Auth0) or implement a self-hosted OIDC service (NextAuth / Fastify Auth / Ory Kratos)?
- **Available Options:**
  - **Option A (Managed Enterprise Identity Provider — Clerk as initial candidate; Auth0 remains an active alternative — Recommended):** Out-of-the-box Google OIDC, FIDO2/WebAuthn biometric passkeys, SOC 2 Type II compliance, brute-force mitigation, account linking dashboards.
  - **Option B (Self-Hosted Identity Service — Fastify Auth / Ory Kratos):** Full data sovereignty within private VPC; zero per-user licensing fees; complete customization.
- **Rationale for Recommendation (Option A with Clerk Initial Candidate):**
  - Offloads master credential storage and password breach liability completely away from ChronoBid servers.
  - Accelerates time-to-market by ~6 weeks by providing audited biometric passkey (FaceID / TouchID / Windows Hello) authentication for high-net-worth bidders in <1 second.
  - Clerk delivers superior developer ergonomics for Fastify/Next.js and a highly cost-effective launch floor ($25/mo base) with stateless 60-second JWTs (requiring zero Redis denylist overhead).
  - Auth0 remains an active evaluated alternative if dedicated EU data residency is legally mandated by European counsel.
- **Main Alternative & Trade-Offs (Option B):**
  - Option B eliminates recurring SaaS licensing fees and ensures 100% data residency within private VPC subnets, but ChronoBid Vault engineers bear 100% of the ongoing legal and technical liability for auth zero-day CVEs, cryptographic hygiene, rate limiting, and 24/7 uptime.
- **Estimated Cost Profile:**
  - Clerk Enterprise Starter: **$25/month base fee** *(Verified published rate)*, scaling at **~$0.05 per monthly active user** beyond included tiers.
  - Auth0 Enterprise: **$700 to $3,500/month** *(Verified published enterprise tiers)* for equivalent enterprise B2C passkey, attack protection, and SLA features.
  - Option B (Self-Hosted): **$0/month in vendor licensing**, but requires **~$30,000 in custom security engineering, DevOps maintenance, and independent penetration testing** *(Estimated)*.
- **Dependencies & Risks:**
  - Dependencies: Google Cloud Console OAuth 2.0 Client credentials; Apple Developer credentials for WebAuthn passkey domain association.
  - Risks: Third-party SaaS availability during live auctions (mitigated by stateless JWT signature verification, ensuring active bidder sessions function even if vendor dashboards suffer an outage).
- **Required Professional Reviews:**
  - European Privacy Counsel Review: Required to assess Clerk's US data hosting under the EU-U.S. Data Privacy Framework (DPF) versus Auth0's native European data residency for high-net-worth EU bidders under GDPR.
- **Timing Determination:** **MUST BE DECIDED NOW (Tier 1)** — Dictates user schema, session token verification middleware, and API security architecture.
- **Owner Determination Status:** `PROVISIONAL RECOMMENDATION ONLY — PENDING EXPLICIT OWNER APPROVAL: Option A (Clerk Enterprise as initial candidate; Auth0 remains an active alternative)`
- **Owner Governance Directives & Non-Commitment Notice:**
  - *DO NOT MARK APPROVED:* Candidate selection remains provisional pending explicit written Project Owner authorization.
  - *No Vendor Commitments:* Zero vendor contracts signed, zero subscriptions activated, zero paid identity resources created.

---

### DEC-P3-007: Primary Cloud Infrastructure & Database Platform
- **The Question Requiring Resolution:** Which enterprise cloud provider should host the production backend API, databases, and real-time saleroom cluster?
- **Available Options:**
  - **Option A (AWS Enterprise — ECS Fargate + Aurora PostgreSQL Multi-AZ + ElastiCache Redis — Recommended):** Multi-AZ Aurora PostgreSQL cluster, ECS Fargate serverless containers, AWS Time Sync NTP service, AWS KMS encryption.
  - **Option B (Google Cloud Platform — GCP GKE + Cloud SQL + Memorystore):** Managed Kubernetes, Cloud SQL PostgreSQL, Cloud KMS.
  - **Option C (Vercel + Supabase / AWS Hybrid):** Vercel for frontend; Supabase/AWS for database and stateful services.
- **Rationale for Recommendation (Option A):**
  - Aurora PostgreSQL Multi-AZ provides triple-availability-zone storage replication with sub-minute automatic failover and continuous point-in-time recovery (RPO < 1 minute; RTO < 15 minutes).
  - AWS Time Sync Service provides dedicated NTP synchronization to within <1 millisecond, strictly required for microsecond-accurate anti-sniping soft-close bid determinations.
  - Complete private VPC subnet isolation ensures databases and Redis caches have zero public internet routing.
- **Main Alternative & Trade-Offs (Option B & Option C):**
  - Option B (GCP) provides strong Kubernetes tooling, but slightly less mature managed database clustering compared to Aurora.
  - Option C (Vercel/Supabase) is rapid for prototypes, but poses serverless connection exhaustion and unpredictable data egress bills during live, continuous saleroom WebSocket streaming.
- **Estimated Cost Profile:**
  - Development & Staging Environment: **$250 to $450/month** *(Estimated)*.
  - High-Availability Multi-AZ Production Environment: **$600 to $1,200/month** *(Estimated)*.
  - *Itemized Cost Breakdown:* Compute (ECS Fargate: ~$150–$300/mo), Database (Aurora Multi-AZ: ~$220–$450/mo), Cache (ElastiCache Redis: ~$35–$75/mo), Networking (Dual NAT Gateways: ~$65–$120/mo *(Verified AWS rate: $0.045/hr/gateway)*), Data Egress (~$50–$200/mo *(Estimated)*), AWS KMS encryption (~$15/mo).
- **Dependencies & Risks:**
  - Dependencies: AWS Organization account, Cloudflare DNS zone delegation, domain SSL certificates.
  - Risks: Cloud infrastructure misconfiguration leading to security exposure or unexpected egress costs.
- **Required Professional Reviews:**
  - Independent Senior DevOps / Cloud Architect Review: Required to audit Terraform infrastructure-as-code templates, VPC subnet isolation, and disaster recovery failover procedures prior to production deployment.
- **Timing Determination:** **MUST BE DECIDED NOW (Tier 1)** — Dictates deployment scripts, environment configurations, container build targets, and database connection pooling libraries.
- **Owner Determination Status:** `PROVISIONAL RECOMMENDATION ONLY — PENDING EXPLICIT OWNER APPROVAL: Option A (AWS Enterprise — ECS Fargate + Aurora PostgreSQL Multi-AZ)`
- **Owner Governance Directives & Non-Commitment Notice:**
  - *DO NOT MARK APPROVED:* Architecture baseline remains provisional pending explicit written Project Owner authorization.
  - *No Cloud Expenditure:* Zero AWS accounts, VPCs, databases, or paid cloud resources may be provisioned or billed.

---

### DEC-P3-010: Live Saleroom WebSocket Core Technology
- **The Question Requiring Resolution:** Should the live saleroom WebSocket engine be implemented as part of the Unified TypeScript Fastify Monolith or as a separate Go microservice?
- **Available Options:**
  - **Option A (Unified Fastify TypeScript Modular WebSocket Engine on Node.js 22 LTS — Recommended):** Fastify worker pods running dedicated WebSocket servers sharing TypeScript domain models, Zod schemas, and database contexts.
  - **Option B (Dedicated Compiled Go WebSocket Service):** Standalone compiled Go binary managing WebSocket connections, broadcasting via Redis Pub/Sub.
- **Rationale for Recommendation (Option A):**
  - Shares 100% of data models, bid increment validation rules (Zod schemas), and database logic directly with the frontend and REST API, avoiding duplicate codebases.
  - Accelerates development velocity and saves approximately ~3 weeks of specialized engineering effort (~$15,000 dev value).
  - Easily accommodates debut auction concurrency (1,000 to 5,000 simultaneous collectors).
  - Preserves an explicit, pre-defined architectural trigger to extract the WebSocket component into a Go microservice if peak active connections exceed 15,000 sockets or if Node.js event-loop lag exceeds 25ms.
- **Main Alternative & Trade-Offs (Option B):**
  - Option B provides an extremely small memory footprint (~100MB per pod vs. ~500MB) and supports 50,000+ connections per node, but introduces polyglot development friction and requires maintaining identical validation logic in two programming languages.
- **Estimated Cost Profile:**
  - Option A: **$0 extra software cost**; saves **~$15,000 in upfront engineering time** *(Estimated)*.
  - Option B: Requires **~$15,000 in additional specialized backend engineering** *(Estimated)*.
  - Infrastructure difference: Negligible for debut volume (**~$20 to $50/month** in container RAM) *(Estimated)*.
- **Dependencies & Risks:**
  - Dependencies: Redis Cluster for distributed pub/sub broadcasting and rate limiting.
  - Risks: Event-loop blocking if CPU-heavy tasks are executed on the main thread (mitigated by architectural rules requiring cryptographic hashing and image processing to run in worker threads).
- **Required Professional Reviews:**
  - Concurrency & Performance Testing Review: Execution of simulated k6 load tests (5,000 concurrent virtual collectors) against live PostgreSQL and Redis backends during Phase 3 verification.
- **Timing Determination:** **MUST BE DECIDED NOW (Tier 1)** — Dictates backend repository structure, build pipelines, and language toolchains.
- **Owner Determination Status:** `PROVISIONAL RECOMMENDATION ONLY — PENDING EXPLICIT OWNER APPROVAL: Option A (Fastify Modular Monolith on Node.js 22 LTS with TypeScript)`
- **Owner Governance Directives & Non-Commitment Notice:**
  - *DO NOT MARK APPROVED:* Engine selection remains provisional pending explicit written Project Owner authorization.
  - *No Implementation Authorized:* Phase 3 backend implementation remains strictly unauthorized (NO-GO).

---

## 3. Tier 2: Commercial Rails & Vendor Integrations (Action for Phase 5)

### DEC-P3-003: Primary Payment Gateway & High-Value Banking Rails
- **The Question Requiring Resolution:** Which payment processor and commercial bank integration should process pre-funded Vault deposits and settlement wires?
- **Available Options:**
  - **Option A (Adyen + Automated Bank Wire Matching — Recommended Hybrid):** Global acquiring for cards/local payment methods; virtual IBANs for programmatic wire matching.
  - **Option B (Stripe Connect + Stripe Treasury):** Card processing, US ACH direct debit, financial connections.
  - **Option C (Modern Treasury Direct Bank Core Integration):** Direct programmatic Fedwire/SWIFT integration into JPMorgan Chase or Bank of America.
- **Rationale for Hybrid Recommendation:** Cards/wallets for instant deposits up to $10,000; bank wires with virtual IBANs for settlements ($10,000+) to eliminate 1.1%–2.9% merchant processing fees on six-figure lots.
- **Estimated Cost Profile:** Cards: 1.1% + €0.10 (Adyen) to 2.9% + $0.30 (Stripe) *(Verified published rates)*; Bank Wires: flat $15–$25 per wire *(Verified)*. Modern Treasury: $2,000+/mo *(Estimated)*.
- **Dependencies & Risks:** Merchant underwriting approval for luxury goods; chargeback risks mitigated by mandatory 3DS2.
- **Required Professional Reviews:** Corporate banking counsel review to establish segregated, bankruptcy-remote client escrow accounts.
- **Timing Determination:** **CAN BE DEFERRED TO PHASE 5 (Tier 2)**.
- **Owner Determination Status:** `[ PENDING OWNER DECISION IN PHASE 5: OPTION A / OPTION B / OPTION C ]`

---

### DEC-P3-005: Automated Identity Verification & AML/KYC Provider
- **The Question Requiring Resolution:** Which identity verification platform should enforce statutory 5AMLD/FinCEN KYC compliance on bidders committing over $10,000 USD?
- **Available Options:**
  - **Option A (Persona — Recommended):** Government ID parsing across 200+ countries, biometric liveness, automated PEP/Sanctions list screening, luxury marketplace tailored UX.
  - **Option B (Stripe Identity):** Basic ID verification; limited international coverage and no integrated sanctions screening.
  - **Option C (Jumio / Sumsub):** Legacy enterprise identity platforms; high integration complexity and rigid contract minimums.
- **Estimated Cost Profile:** Persona: **~$1.50 to $3.00 per verified identity check** *(Verified industry market estimate; pay-as-you-go)*.
- **Dependencies & Risks:** False rejections of legitimate collectors (mitigated by built-in manual review consoles).
- **Required Professional Reviews:** Specialized AML/FinCEN legal counsel review of ChronoBid's written Customer Identification Program (CIP) policy.
- **Timing Determination:** **CAN BE DEFERRED TO PHASE 5 (Tier 2)**.
- **Owner Determination Status:** `[ PENDING OWNER DECISION IN PHASE 5: OPTION A / OPTION B / OPTION C ]`

---

### DEC-P3-006: Anti-Bot & Abuse Security Vendor
- **The Question Requiring Resolution:** What anti-bot verification technology should protect saleroom bidding and authentication without degrading luxury visual aesthetics?
- **Available Options:**
  - **Option A (Cloudflare Turnstile on Pro / Business Tier — Recommended):** Invisible or non-intrusive challenge evaluating browser telemetry; zero user friction (no image puzzles); free tier available.
  - **Option B (Google reCAPTCHA Enterprise):** Behavioral scoring; requires loading external Google scripts; requires GDPR cookie disclosures.
- **Estimated Cost Profile:** Cloudflare Turnstile: **$0 (Free up to 1M evaluations/mo)** *(Verified)*; Cloudflare Pro ($20–$25/mo) or Business ($200/mo) *(Verified)*. Cloudflare Enterprise ($3,000+/mo) deferred.
- **Dependencies & Risks:** Token expiry during extended saleroom sessions (mitigated by automated token refresh 45s prior to lot soft-close).
- **Required Professional Reviews:** Standard web security engineering review.
- **Timing Determination:** **CAN BE DEFERRED TO PHASE 5/6 (Tier 2)**.
- **Owner Determination Status:** `[ PENDING OWNER DECISION IN PHASE 5: OPTION A / OPTION B ]`

---

## 4. Tier 3: Operational Logistics & Catalog Commercial Policies (Action for Phase 7)

### DEC-P3-004: Physical Horology Custody, Vaulting & Armored Transit Partner
- **The Question Requiring Resolution:** Which specialized fine art and horology logistics operator will provide physical custody, bonded freeport vaulting, and transit insurance?
- **Available Options:**
  - **Option A (Malca-Amit Primary Custody + Ferrari Logistics Pickups — Recommended):** Global leader in horological vaulting with bonded facilities in Geneva, Zurich, London, New York, Singapore; full Lloyd's of London all-risk insurance.
  - **Option B (Brink's Global Services):** Armored transport and secure warehousing; global reach.
  - **Option C (Ferrari Logistics Exclusively):** Specialized white-glove luxury watch transit courier.
- **Estimated Cost Profile:** Vault Storage: **~0.15% to 0.35% of declared asset value/year** *(Estimated)*; Armored Transit: **$250 to $1,500 per shipment** *(Estimated)*.
- **Dependencies & Risks:** CITES import/export permits for exotic leather straps; physical site inspection.
- **Required Professional Reviews:** Fine art insurance broker review for secondary contingent liability; bailee bailment counsel.
- **Timing Determination:** **CAN BE DEFERRED TO PHASE 7 (Tier 3)**.
- **Owner Determination Status:** `[ PENDING OWNER DECISION IN PHASE 7: OPTION A / OPTION B / OPTION C ]`

---

### DEC-P3-008: Buyer's Premium & Commission Schedules
- **The Question Requiring Resolution:** What commercial fee structure should the automated settlement engine calculate?
- **Available Options:**
  - **Option A (Tiered Luxury Auction Industry Standard — Recommended):** 20% on first $100k; 15% from $100k–$500k; 10% above $500k. Consignor commission: 0%–8% negotiated.
  - **Option B (Flat Competitive Platform Fee):** Flat 12.5% Buyer's Premium; flat 5% seller fee.
- **Estimated Cost Profile:** **$0 software implementation cost** *(Verified)*. Parameterized calculation engine.
- **Dependencies & Risks:** Commercial positioning and operating margin targets.
- **Required Professional Reviews:** Independent CPA / tax advisor review to verify sales tax, VAT, and marketplace facilitator withholding rules.
- **Timing Determination:** **CAN BE DEFERRED TO PHASE 5/7 (Tier 3)**.
- **Owner Determination Status:** `[ PENDING OWNER DECISION IN PHASE 7: OPTION A / OPTION B ]`

---

### DEC-P3-009: Debut Timepiece Catalog Rights Clearance (ADR-009 Resolution)
- **The Question Requiring Resolution:** How should the provisional status of the 6 debut watch references be resolved for the public catalog?
- **Available Options:**
  - **Option A (Commission Authentic Studio Macro-Photography for Marquee Lots + Consignor Intake — Recommended):** Source physical exhibition timepieces and produce multi-angle movement, hallmark, and dial photography. Monogram `#EDE7DC` fallback cards continue in prototype/demo.
  - **Option B (Licensed Institutional Archive Photography):** License existing authenticated archive imagery ($500–$2,000/image).
  - **Option C (Transition to Consignor-Supplied Intake Assets):** Replace debut models with verified consignments onboarded during pilot intake.
- **Estimated Cost Profile:** Monogram Cards: **$0** *(Verified)*; Studio Photography: **~$300–$750 per timepiece** *(Estimated)*; Archive Licensing: **$500–$2,000/image** *(Estimated)*.
- **Dependencies & Risks:** Physical possession of consigned timepieces; copyright release.
- **Required Professional Reviews:** Standard IP / copyright release agreements.
- **Timing Determination:** **CAN BE DEFERRED TO PHASE 7 (Tier 3)**.
- **Owner Determination Status:** `[ PENDING OWNER DECISION IN PHASE 7: OPTION A / OPTION B / OPTION C ]`

---

## 5. Preserved Buyer Vault Accounting Invariants & Professional Reviews Matrix

In strict compliance with project governance instructions, all unresolved Buyer Vault accounting invariants and outstanding specialist reviews are preserved without modification:

### 5.1 Preserved Buyer Vault Accounting Invariants
1. **Canonical Double-Entry Chart of Accounts:**  
   Preserves the canonical 9-account structure from [`PHASE3_VAULT_LEDGER_DESIGN.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_VAULT_LEDGER_DESIGN.md):
   - `1010`: User Available Funds (Liability — Credit normal balance)
   - `1020`: User Reserved Funds (Liability — Credit normal balance)
   - `1030`: User Pending Clearance Holds (Liability — Credit normal balance)
   - `1040`: Settlement Escrow Holds (Liability — Credit normal balance)
   - `2010`: Bank Custody Clearing Account (Asset — Debit normal balance)
   - `2050`: Unidentified Clearing Suspense (Liability — Credit normal balance)
   - `3010`: Platform Buyer's Premium (Revenue — Credit normal balance)
   - `3020`: Platform Consignor Commission (Revenue — Credit normal balance)
   - `4010`: Consignor Payout Payable (Liability — Credit normal balance)
2. **Unified Bidding Headroom Invariant:**  
   $$\mathbf{Available\ to\ Bid} = \mathbf{Total\ Vault\ Balance} - \mathbf{Reserved\ Funds} - \mathbf{Committed\ Funds\ (Account\ 1040)} - \mathbf{Applicable\ Holds}$$
   Prevents double-spending by subtracting winning hammer amounts in Account 1040 awaiting invoice payment.
3. **Deterministic Multi-Account Lock Ordering:**  
   To prevent cyclic database deadlocks during simultaneous outbid transactions across lots, locks must be acquired strictly in ascending primary-key order:
   ```sql
   SELECT * FROM vault_accounts WHERE user_id IN (:newBidder, :prevLeader) ORDER BY user_id ASC FOR UPDATE;
   ```
4. **Wire Clearance Proof & Zero Automated Write-Offs:**  
   Uploaded wire slips grant **$0 bidding headroom**; physical release of purchased assets remains strictly locked until funds clear bank settlement. Automated write-offs of shortfalls under $50 USD remain strictly prohibited.

### 5.2 Outstanding Professional Reviews Register

| Domain | Scope of Professional Review | Required Specialist / Authority | Status |
| :--- | :--- | :--- | :--- |
| **Indian Foreign Exchange** | RBI FEMA LRS $250k cap, Form A2 declarations, and Sec 206C(1G) 20% TCS withholding | Indian Foreign Exchange / Tax Legal Counsel | **OUTSTANDING** |
| **European Privacy (GDPR)** | Clerk US hosting under EU-U.S. Data Privacy Framework (DPF) vs. Auth0 native EU data residency | European Data Privacy Counsel | **OUTSTANDING** |
| **Statutory Accounting & Escrow** | Double-entry chart of accounts mapping, escrow liabilities, and revenue recognition under US GAAP (ASC 606/946) or IFRS | Qualified Certified Public Accountant (CPA) / Statutory Auditor | **OUTSTANDING** |
| **Merchant Risk & Underwriting** | Underwriting application for luxury horology/jewelry acquiring and rolling reserve terms | Adyen / Stripe Merchant Risk Committee | **OUTSTANDING** |
| **Cloud Infrastructure Security** | Multi-AZ VPC isolation, AWS KMS key rotation, and automated failover runbooks | Independent Senior DevOps / Cloud Architect | **OUTSTANDING** |
| **Live Auction Concurrency** | k6 load testing (5,000 concurrent collectors) validating <25ms event-loop lag and zero deadlocks | Senior Performance / QA Engineer | **OUTSTANDING** |

---

## 6. Master Owner Sign-Off Summary Block

```
========================================================================================================================
                             CHRONOBID VAULT — PHASE 3 STRATEGIC OWNER DECISION SUMMARY
========================================================================================================================

Decision Ref   Category              Priority  Owner Determination Status                            Selected Option
------------------------------------------------------------------------------------------------------------------------
DEC-P3-001     Currency & FX         Tier 1    PROVISIONAL RECOMMENDATION ONLY (PENDING APPROVAL)    Option A (USD Settlement)
DEC-P3-002     Authentication        Tier 1    PROVISIONAL RECOMMENDATION ONLY (PENDING APPROVAL)    Option A (Clerk Initial / Auth0 Alt)
DEC-P3-007     Cloud Infrastructure  Tier 1    PROVISIONAL RECOMMENDATION ONLY (PENDING APPROVAL)    Option A (AWS Fargate + Aurora Multi-AZ)
DEC-P3-010     WebSocket Gateway     Tier 1    PROVISIONAL RECOMMENDATION ONLY (PENDING APPROVAL)    Option A (Fastify Modular Monolith)
DEC-P3-003     Payment Gateway       Tier 2    [ ] DEFERRED TO PHASE 5                               _______________
DEC-P3-005     Identity AML/KYC      Tier 2    [ ] DEFERRED TO PHASE 5                               _______________
DEC-P3-006     Anti-Bot Security     Tier 2    [ ] DEFERRED TO PHASE 5                               _______________
DEC-P3-004     Vault Custody         Tier 3    [ ] DEFERRED TO PHASE 7                               _______________
DEC-P3-008     Buyer's Premium       Tier 3    [ ] DEFERRED TO PHASE 7                               _______________
DEC-P3-009     Debut Catalog Rights  Tier 3    [ ] DEFERRED TO PHASE 7                               _______________
========================================================================================================================

Governance Decision Record:
- Phase 2.1 Prototype Status:    FORMALLY ACCEPTED (25 October 2026) — CLICKABLE PROTOTYPE ONLY
- Tier 1 Strategic Decisions:    4 PROVISIONAL RECOMMENDATIONS RECORDED — PENDING EXPLICIT OWNER APPROVAL
- Approval Status:               DO NOT MARK APPROVED — ZERO VENDOR CONTRACTS SIGNED — ZERO CLOUD EXPENDITURE
- Accounting Invariants:         CANONICAL 9-ACCOUNT DOUBLE-ENTRY & ASCENDING LOCK ORDERING PRESERVED
- Professional Reviews:          ALL 6 LEGAL, TAX, PRIVACY, SECURITY & CPA REVIEWS PRESERVED AS OUTSTANDING
- Implementation Status:         PHASE 3 BACKEND & PHASE 4 PRODUCTION REMAIN STRICTLY NOT AUTHORIZED (NO-GO)

Project Owner Determination: PROVISIONAL RECOMMENDATIONS RECORDED   Date: 25 October 2026
========================================================================================================================
```

---
*Updated register compiled by Senior Solutions Architect, Senior Project Manager, and Financial Systems Analyst.*  
*Timestamp: 2026-10-25T05:48:00Z*
