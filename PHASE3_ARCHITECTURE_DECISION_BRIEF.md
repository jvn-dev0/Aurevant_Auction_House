# ChronoBid Vault — Phase 3 Architecture Decision Brief
## Strategic Architectural Decisions, Trade-Offs, Cost Models & Owner Determination Guide

> **Document Type:** Project Owner Strategic Architecture Decision Brief & Action Guide  
> **Project Name:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Target Audience:** Project Owner (Executive / Non-Technical Leadership)  
> **Governance Status:** **PHASE 2.1 PROTOTYPE FORMALLY ACCEPTED (2026-10-25) — PHASE 3 ARCHITECTURE SPECIFICATION COMPLETED — PHASE 3 BACKEND & PHASE 4 PRODUCTION REMAIN STRICTLY NOT AUTHORIZED (NO-GO)**  
> **Date:** 25 October 2026  
> **Authors:** Principal Solutions Architect, Senior Financial Systems Analyst, Head of Security & Compliance  
> **Cross-Reference:** Evaluated against [`PHASE3_OWNER_DECISIONS_REGISTER.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_OWNER_DECISIONS_REGISTER.md), [`PHASE3_ARCHITECTURE_SPECIFICATION_DRAFT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PHASE3_ARCHITECTURE_SPECIFICATION_DRAFT.md), [`PHASE3_ARCHITECTURE_CONSISTENCY_AUDIT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PHASE3_ARCHITECTURE_CONSISTENCY_AUDIT.md), and [`PHASE3_ARCHITECTURE_AUDIT_REMEDIATION_REPORT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PHASE3_ARCHITECTURE_AUDIT_REMEDIATION_REPORT.md).

---

## 1. Executive Summary & How to Use This Brief

This decision brief provides a clear, practical, and non-technical guide to the **ten strategic architectural decisions (DEC-P3-001 through DEC-P3-010)** required to take ChronoBid Vault from an accepted frontend prototype to an institutional-grade, high-concurrency auction saleroom.

### The Core Takeaway: You Do Not Need to Decide Everything Today
To prevent decision fatigue and avoid premature commitments, decisions are divided into three sequential **Dependency Tiers**:

```
+----------------------------------------------------------------------------------------------------------+
|                                    DECISION DEPENDENCY TIERS                                             |
+----------------------------------------------------------------------------------------------------------+
| [TIER 1: Core Foundation Blockers] — 4 Decisions (ACTION RECOMMENDED NOW)                               |
|   Dictates database tables, server framework, and session security.                                      |
|   -> DEC-P3-001 (Currency Settlement Model: Canonical USD Settlement)                                    |
|   -> DEC-P3-002 (Authentication Platform: Clerk Enterprise vs. Auth0)                                    |
|   -> DEC-P3-007 (Cloud Infrastructure: AWS Enterprise Fargate + Aurora PostgreSQL)                      |
|   -> DEC-P3-010 (WebSocket Real-Time Engine: Fastify TypeScript Modular Monolith)                        |
|                                                                                                          |
| [TIER 2: Commercial Rails & Integrations] — 3 Decisions (DEFERRED TO PHASE 5)                            |
|   Needed only when connecting banking, payment gateways, and automated AML/KYC checks.                  |
|   -> DEC-P3-003 (Payment Gateway & Banking Rails: Adyen / Stripe / Bank Wires)                           |
|   -> DEC-P3-005 (Identity Verification AML/KYC: Persona vs. Sumsub)                                     |
|   -> DEC-P3-006 (Anti-Bot & Abuse Security: Cloudflare Turnstile Pro/Business)                           |
|                                                                                                          |
| [TIER 3: Operational Logistics & Commercial Policy] — 3 Decisions (DEFERRED TO PHASE 7)                  |
|   Needed only prior to physical inventory intake, catalog publication, and debut saleroom launch.        |
|   -> DEC-P3-004 (Vault Custody & Armored Transit: Malca-Amit + Ferrari Logistics)                       |
|   -> DEC-P3-008 (Buyer's Premium Fee Schedule: 20%/15%/10% Tiered vs. 12.5% Flat)                        |
|   -> DEC-P3-009 (Debut Catalog Rights & Imagery: Studio Macro-Photography vs. Monogram Fallback)         |
+----------------------------------------------------------------------------------------------------------+
```

> [!IMPORTANT]
> **Governance Notice:** Reviewing and selecting preferences in this brief does **not** authorize backend coding or infrastructure provisioning. Phase 3 backend and Phase 4 production implementation remain **strictly unauthorized (NO-GO)** until you provide separate, explicit written authorization.

---

## 2. Tier 1: Core Foundation Blockers (Must Be Decided Now)

These four architectural decisions dictate the foundational database schema, core programming frameworks, and hosting infrastructure. Resolving them now unblocks detailed engineering design without committing financial capital.

---

### DEC-P3-001: International Currency Settlement Model & FX Risk Allocation

#### 1. The Decision to be Made
How should ChronoBid Vault legally and commercially settle high-value auction invoices with international collectors—in a single canonical currency (USD) or by offering a guaranteed 48-hour fixed foreign exchange (FX) rate in the buyer's local currency?

#### 2. Recommended Option & Rationale
**Option A: Canonical USD-Only Settlement (Recommended)**  
All auction bids, buyer vault deposits, escrow holds, and legal invoices are accounted for and settled strictly in United States Dollars (USD).
- **Why this is recommended:**
  - **Zero FX Risk for ChronoBid Vault:** High-value horology transactions ($50,000 to $500,000+) can experience substantial currency shifts over a 48-hour wire settlement window. Under Option A, the platform bears zero foreign exchange volatility risk.
  - **Collector Clarity & Global Standard:** Leading auction houses (Christie's, Sotheby's, Phillips) settle internationally in the currency of the saleroom. 
  - **Seamless Collector Experience:** International buyers still see real-time estimated conversions on the website in their local currency (EUR, GBP, CHF, JPY, HKD, SGD, INR) clearly marked with an `[ESTIMATE]` badge, but their bank performs the conversion when sending the wire.

#### 3. Main Alternative & Trade-Offs
- **Option B (Guaranteed 48-Hour Local FX Rate Lock):** The buyer is guaranteed the exact local currency amount shown on their screen at the fall of the hammer for 48 hours.
  - *Trade-off:* ChronoBid Vault must absorb any currency depreciation during the 48-hour wire window or pay third-party treasury hedging providers (e.g., Adyen Guaranteed FX with a ~1.25% spread buffer). This introduces complex multi-currency bank accounts, treasury balancing risks, and potential currency arbitrage exposure during macroeconomic shocks.

#### 4. Estimated Cost Profile
- **Option A (USD-Only):** **$0 external vendor cost** *(Verified)*. Ledger configuration and multi-currency display converters are built into the standard application architecture.
- **Option B (Guaranteed FX Lock):** **~$15,000–$30,000 initial setup** *(Estimated)* for treasury integration, multi-currency corporate banking accounts, and specialized legal/tax review, plus ongoing hedging fees (~1.25% per transaction).

#### 5. Dependencies, Risks & Professional Reviews Required
- **Dependencies:** Commercial bank account capable of receiving incoming international Fedwire and SWIFT wires.
- **Risks:** Friction for international collectors whose banks charge high retail foreign exchange spreads (typically 1.0%–2.5%).
- **Professional Review Required:** Indian foreign exchange legal counsel review regarding Reserve Bank of India (RBI) Liberalised Remittance Scheme (LRS) $250,000 annual remittance limits, Form A2 declarations, Section 206C(1G) 20% Tax Collected at Source (TCS), and luxury customs duty disclosures.

#### 6. Timing Determination
**MUST BE DECIDED NOW (Tier 1)**. The database schema, double-entry ledger currency columns, and invoice generation engines cannot be designed without knowing whether the platform operates on a single base currency or multi-currency ledgers.

---

### DEC-P3-002: Production Authentication Architecture (Managed vs. Self-Hosted)

#### 1. The Decision to be Made
Should ChronoBid Vault manage high-net-worth collector identities, passwords, and biometric passkeys using an established enterprise managed provider (Clerk or Auth0) or build and self-host a custom authentication service in-house?

#### 2. Recommended Option & Rationale
**Option A: Managed Enterprise Identity Provider — Clerk Enterprise as frontrunner, Auth0 as alternative (Recommended)**  
Delegate user credentials, multi-factor authentication (MFA), FIDO2/WebAuthn biometric passkeys (Apple FaceID / TouchID / Windows Hello), and Google OAuth to an audited enterprise identity platform.
- **Why this is recommended:**
  - **Offloads Breach Liability:** ChronoBid Vault never stores master user passwords or biometric secrets on its servers, dramatically reducing cybersecurity and legal liability.
  - **Speed to Market:** Saves approximately 6 weeks of high-complexity security engineering.
  - **Collector-Grade Experience:** Passkeys allow collectors to authenticate bids using biometric facial/fingerprint recognition in <1 second with zero SMS or password friction.
  - **Candidate Comparison:** **Clerk** is the recommended frontrunner for initial launch cohorts due to superior developer ergonomics, seamless Fastify/Next.js support, and a low cost floor ($25/mo vs. $700–$3,500/mo for Auth0). **Auth0** remains an enterprise fallback if dedicated European Union data residency is strictly mandated by EU counsel.

#### 3. Main Alternative & Trade-Offs
- **Option B (Self-Hosted Identity — Fastify Auth / Ory Kratos):** Build and maintain a custom authentication service running entirely inside ChronoBid's private virtual cloud.
  - *Trade-off:* Eliminates monthly SaaS fees and guarantees complete data sovereignty, but ChronoBid Vault engineers bear 100% of the ongoing responsibility for patching zero-day vulnerabilities, managing cryptographic token rot, and maintaining high availability.

#### 4. Estimated Cost Profile
- **Option A (Clerk Enterprise Starter):** **$25/month** base fee *(Verified published price)*, scaling at **~$0.05 per monthly active user** beyond the free tier.
- **Option A (Auth0 Enterprise):** **$700 to $3,500/month** *(Verified enterprise pricing tiers)* for dedicated B2C enterprise security features and SLA guarantees.
- **Option B (Self-Hosted):** **$0/month in vendor licensing**, but requires **~$30,000 in custom engineering, DevOps setup, and annual third-party penetration testing** *(Estimated)*.

#### 5. Dependencies, Risks & Professional Reviews Required
- **Dependencies:** Google Cloud Console OAuth 2.0 Client credentials; Apple Developer credentials for WebAuthn passkey domain binding.
- **Risks:** Vendor dependency and API uptime during live salerooms. (Mitigated by stateless JWT verification that operates even if the identity provider suffers a temporary dashboard outage).
- **Professional Review Required:** Privacy counsel review to verify that Clerk's US data hosting under the EU-U.S. Data Privacy Framework (DPF) satisfies European GDPR requirements for high-net-worth EU bidders, or whether Auth0's native EU hosting is required.

#### 6. Timing Determination
**MUST BE DECIDED NOW (Tier 1)**. Dictates the core database `users` schema, session token verification middleware, and API security architecture.

---

### DEC-P3-007: Primary Cloud Infrastructure & Database Platform

#### 1. The Decision to be Made
Which enterprise cloud hosting platform should host the production backend API, real-time auction WebSocket clusters, and the high-availability financial ledger database?

#### 2. Recommended Option & Rationale
**Option A: AWS Enterprise — ECS Fargate + Aurora PostgreSQL Multi-AZ (Recommended)**  
Deploy backend services as containerized micro-tasks using AWS ECS Fargate, paired with an Amazon Aurora PostgreSQL Multi-AZ database cluster, AWS ElastiCache for Redis, and Cloudflare edge shielding.
- **Why this is recommended:**
  - **Financial-Grade Reliability:** Aurora PostgreSQL Multi-AZ replicates data across three separate physical data centers with sub-minute automatic failover and continuous point-in-time recovery (Recovery Point Objective < 1 minute; Recovery Time Objective < 15 minutes).
  - **Millisecond Clock Synchronization:** Aurora and Fargate utilize the dedicated **AWS Time Sync Service (NTP)**, keeping server clocks synchronized to within <1 millisecond. This microsecond clock precision is strictly required for accurate anti-sniping soft-close bid determinations.
  - **Zero Public Exposure:** The database and cache reside in isolated private VPC subnets with no public internet routing.

#### 3. Main Alternative & Trade-Offs
- **Option B (Google Cloud Platform — GCP GKE + Cloud SQL):** Google Kubernetes Engine and Cloud SQL PostgreSQL. Excellent container tooling, but slightly less mature managed database clustering compared to Aurora.
- **Option C (Vercel + Supabase / AWS Hybrid):** Rapid prototyping stack, but vulnerable to serverless connection pool exhaustion and unpredictable data egress bills during live, continuous WebSocket auction broadcasts.

#### 4. Estimated Cost Profile
- **Development & Staging Environment:** **$250 to $450/month** *(Estimated)*.
- **High-Availability Multi-AZ Production Environment:** **$600 to $1,200/month** *(Estimated)*.
  - *Detailed Cost Breakdown:* Compute (ECS Fargate: ~$150–$300/mo), Database (Aurora Multi-AZ: ~$220–$450/mo), Cache (ElastiCache Redis: ~$35–$75/mo), Networking (Dual NAT Gateways: ~$65–$120/mo *(Verified AWS rate: $0.045/hr/gateway)*), Data Egress (~$50–$200/mo *(Estimated based on saleroom traffic)*), AWS KMS encryption (~$15/mo).

#### 5. Dependencies, Risks & Professional Reviews Required
- **Dependencies:** AWS Organization account, Cloudflare DNS zone delegation, and domain SSL certificates.
- **Risks:** Cloud infrastructure misconfiguration leading to security exposure or unexpected egress costs.
- **Professional Review Required:** Independent Senior Cloud Architect / DevOps security review to validate Terraform infrastructure-as-code templates, VPC subnet isolation, and disaster recovery failover procedures prior to production launch.

#### 6. Timing Determination
**MUST BE DECIDED NOW (Tier 1)**. Dictates deployment scripts, environment configurations, container build targets, and database connection pooling libraries.

---

### DEC-P3-010: Live Saleroom WebSocket Core Technology

#### 1. The Decision to be Made
Should the high-speed live auction saleroom engine (handling real-time bid broadcasting, soft-close countdowns, and instant outbid alerts) be built directly inside the Unified Fastify TypeScript backend or built as an independent standalone service written in Go?

#### 2. Recommended Option & Rationale
**Option A: Unified Fastify TypeScript Modular WebSocket Engine on Node.js 22 LTS (Recommended)**  
Implement the real-time WebSocket server within the core Fastify application codebase, sharing common TypeScript types, bid validation logic (Zod schemas), and database models.
- **Why this is recommended:**
  - **Shared Code & 100% Type Safety:** The exact same bid rules, increment ladder calculations, and user data models are shared between the frontend Next.js app, the REST API, and the WebSocket server.
  - **Rapid Velocity & Simplicity:** Avoids maintaining two separate codebases in two different programming languages. Saves ~3 weeks of backend engineering.
  - **Adequate Debut Capacity:** A single Fastify WebSocket pod comfortably handles 1,000 to 5,000 concurrent collectors during debut sales.
  - **Pre-Defined Extraction Trigger:** If peak concurrency exceeds 15,000 simultaneous collectors or if Node.js event-loop lag exceeds 25 milliseconds, the architecture is already modularized to allow extracting the WebSocket service into Go without modifying frontend clients or the database schema.

#### 3. Main Alternative & Trade-Offs
- **Option B (Standalone Compiled Go WebSocket Service):** A dedicated high-performance Go binary communicating with the main application via Redis Pub/Sub.
  - *Trade-off:* Go utilizes significantly less memory (~100MB per pod vs. ~500MB in Node.js) and can support 50,000+ persistent sockets per node. However, it requires duplicating business logic and types across TypeScript and Go, increasing development time, testing surface, and debugging complexity.

#### 4. Estimated Cost Profile
- **Option A (Fastify Modular Monolith):** **$0 additional software licensing**; saves **~$15,000 in upfront engineering time** *(Estimated)*.
- **Option B (Separate Go Service):** Requires **~$15,000 in additional specialized backend engineering** *(Estimated)*.
- **Infrastructure Operating Difference:** Negligible for debut auctions (**~$20 to $50/month** difference in container RAM) *(Estimated)*.

#### 5. Dependencies, Risks & Professional Reviews Required
- **Dependencies:** Redis Cluster for real-time pub/sub message broadcasting and rate limiting.
- **Risks:** Event-loop blocking if CPU-heavy calculations are accidentally run on the main thread. (Mitigated by architectural rules requiring all cryptography and image processing to run in worker threads).
- **Professional Review Required:** Execution of simulated k6 WebSocket load tests (5,000 concurrent virtual collectors) during Phase 3 verification before production deployment.

#### 6. Timing Determination
**MUST BE DECIDED NOW (Tier 1)**. Dictates backend repository structure, build pipelines, and whether the development team must support a polyglot (TypeScript + Go) environment.

---

## 3. Tier 2: Commercial Rails & Vendor Integrations (Deferred to Phase 5)

These three decisions involve commercial relationships, merchant underwriting, and third-party SaaS contracts. They can be safely deferred until core backend scaffolding is completed in Phase 4.

---

### DEC-P3-003: Primary Payment Gateway & High-Value Banking Rails

#### 1. The Decision to be Made
Which payment processing partners and commercial banking integrations should handle instant credit card vault deposits and high-value wire transfers ($10,000 to $500,000+)?

#### 2. Recommended Option & Rationale
**Hybrid Strategy: Adyen (or Stripe) for Card Deposits + Tier-1 Commercial Bank Virtual IBANs for Wire Transfers (Recommended)**  
- **Instant Pre-Funding Deposits (up to $10,000):** Processed via Adyen or Stripe for credit cards, Apple Pay, and Google Pay to allow instant bidder qualification.
- **High-Value Auction Settlements ($10,000+):** Handled via programmatic commercial bank wires (Fedwire in the US, SWIFT globally). ChronoBid issues unique **Virtual IBANs / Reference Numbers** for each winning invoice, enabling automated bank reconciliation within seconds of wire arrival.
- **Why this is recommended:** Credit card processing fees (1.1% to 2.9%) on a $250,000 Patek Philippe would cost $2,750 to $7,250. Direct bank wires cost a flat $15–$25, protecting auction margins while providing maximum security.

#### 3. Main Alternative & Trade-Offs
- **Alternative 1 (Stripe Connect Exclusively):** Simpler initial integration, but higher international transaction fees and less tailored to bespoke private banking wires.
- **Alternative 2 (Direct Bank Core Integration via Modern Treasury):** Direct API into JPMorgan Chase or Bank of America. Excellent institutional control, but requires significant monthly minimum commitments ($2,000+/month).

#### 4. Estimated Cost Profile
- **Credit Card / Debit Deposits:** **1.1% + €0.10** (Adyen Interchange++) to **2.9% + $0.30** (Stripe Standard) *(Verified published rates)*.
- **Domestic & International Bank Wires:** **Flat $15.00 to $25.00 per wire transfer** *(Verified commercial banking schedule)*.
- **Modern Treasury Platform (Alternative):** **$2,000+/month base subscription** *(Estimated)*.

#### 5. Dependencies, Risks & Professional Reviews Required
- **Dependencies:** Merchant underwriting approval from Adyen/Stripe risk committees for high-ticket luxury goods.
- **Risks:** Merchant account reserve holds or chargeback exposure on card deposits. (Mitigated by mandatory 3DS2 biometric authentication and requiring all winning settlements over $10,000 to be paid via non-reversible bank wire).
- **Professional Review Required:** Corporate banking counsel review to establish segregated, bankruptcy-remote custodial escrow accounts for collector pre-funding.

#### 6. Timing Determination
**CAN BE DEFERRED TO PHASE 5 (Tier 2)**. Underwriting applications can be submitted during Phase 4 without blocking core ledger software development.

---

### DEC-P3-005: Automated Identity Verification & AML/KYC Provider

#### 1. The Decision to be Made
Which automated identity verification platform should enforce statutory Anti-Money Laundering (AML) and Know Your Customer (KYC) compliance on bidders committing over $10,000 USD (FinCEN in the US and 5AMLD in Europe)?

#### 2. Recommended Option & Rationale
**Option A: Persona (Recommended)**  
Integrate Persona’s hosted identity verification flow for government ID capture, biometric 3D facial liveness verification, and automated Politically Exposed Person (PEP) / Sanctions screening.
- **Why this is recommended:**
  - **Luxury Collector Experience:** Persona delivers the highest completion rates for high-net-worth collectors, with minimal drop-off compared to clunky enterprise platforms.
  - **Global Reach:** Accurately verifies government passports and national IDs across 200+ countries and territories.
  - **Automated Sanctions Screening:** Instantly screens bidders against international OFAC, UN, and EU sanctions lists before bidding headroom is granted.

#### 3. Main Alternative & Trade-Offs
- **Option B (Stripe Identity):** Inexpensive (~$1.50/check) and easy to integrate, but lacks comprehensive international sanctions and PEP watchlist screening.
- **Option C (Jumio / Sumsub):** Robust legacy platforms, but require rigid enterprise contracts, high minimum monthly commitments, and have steeper user verification friction.

#### 4. Estimated Cost Profile
- **Persona:** **~$1.50 to $3.00 per completed verification check** *(Verified industry market estimate; pay-as-you-go with no large annual minimums for starter volume)*.

#### 5. Dependencies, Risks & Professional Reviews Required
- **Dependencies:** Formal written Anti-Money Laundering (AML) Compliance Policy and Customer Identification Program (CIP).
- **Risks:** False rejections of legitimate high-net-worth collectors due to foreign document formatting. (Mitigated by Persona’s built-in manual review console for ChronoBid compliance officers).
- **Professional Review Required:** Specialized AML/FinCEN legal counsel review of ChronoBid's written compliance policy and bidder qualification thresholds.

#### 6. Timing Determination
**CAN BE DEFERRED TO PHASE 5 (Tier 2)**. The user profile and verification status flags can be scaffolded in Phase 4; the actual API integration occurs in Phase 5.

---

### DEC-P3-006: Anti-Bot & Abuse Security Vendor

#### 1. The Decision to be Made
What anti-bot challenge and DDoS protection technology should safeguard auction saleroom bidding, registrations, and logins from automated scraping and bot manipulation?

#### 2. Recommended Option & Rationale
**Option A: Cloudflare Turnstile on Pro / Business Tier (Recommended)**  
Deploy Cloudflare Turnstile as the bot protection layer across all authentication, bidding, and consignment intake forms, backed by Cloudflare Pro or Business edge web application firewalls (WAF).
- **Why this is recommended:**
  - **Zero Visual Friction:** Turnstile evaluates browser telemetry silently in <100 milliseconds without forcing collectors to solve annoying image puzzles (no picking traffic lights, motorcycles, or crosswalks).
  - **Editorial Aesthetic Preservation:** Preserves the bespoke, luxury publication aesthetic of ChronoBid Vault.
  - **Budget-Conscious Launch Scaling:** Cloudflare Pro ($20–$25/mo) or Business ($200/mo) provides full launch-phase DDoS and bot protection. The $36,000/year Cloudflare Enterprise tier is explicitly deferred until saleroom trading volume warrants it.

#### 3. Main Alternative & Trade-Offs
- **Option B (Google reCAPTCHA Enterprise):** Highly effective risk scoring, but injects heavy third-party Google tracking scripts, slows mobile load times, and mandates prominent GDPR cookie disclosures for European collectors.

#### 4. Estimated Cost Profile
- **Cloudflare Turnstile:** **$0 (Free for up to 1,000,000 evaluations/month)** *(Verified published offering)*.
- **Cloudflare Edge Plan:** **$20 to $25/month (Pro Tier)** or **$200/month (Business Tier)** *(Verified published rates)*.
- *(Contrast: Cloudflare Enterprise at $3,000+/mo ($36,000/yr) is explicitly deferred).*

#### 5. Dependencies, Risks & Professional Reviews Required
- **Dependencies:** Cloudflare DNS management for chronobid.com domain.
- **Risks:** Token expiry if a bidder keeps an auction tab open for hours before placing a last-second bid. (Mitigated by an automated background token refresh protocol 45 seconds prior to lot soft-close).
- **Professional Review Required:** None. Standard web security engineering practice.

#### 6. Timing Determination
**CAN BE DEFERRED TO PHASE 5/6 (Tier 2)**. Bot protection tokens are wired into the frontend forms during final pre-launch security hardening.

---

## 4. Tier 3: Operational Logistics & Catalog Policies (Deferred to Phase 7)

These three decisions govern physical asset custody, commercial fee schedules, and public catalog imagery. They are deferred until the physical auction intake and catalog launch phases.

---

### DEC-P3-004: Physical Horology Custody, Vaulting & Armored Transit Partner

#### 1. The Decision to be Made
Which world-class secure logistics operator will provide physical inspection, bonded freeport vaulting, and armed transit insurance for consigned timepieces, jewels, and coins?

#### 2. Recommended Option & Rationale
**Option A: Malca-Amit Primary Custody Partner, supplemented by Ferrari Logistics for Consignor Pickups (Recommended)**  
Partner with Malca-Amit for primary bonded vault storage and international shipping, utilizing Ferrari Logistics for white-glove, insured consignor collection.
- **Why this is recommended:**
  - **Gold Standard of Luxury Horology:** Malca-Amit is the preeminent global custodian for high-end watchmakers and international auction houses, with high-security bonded facilities in Geneva, Zurich, London, New York, Hong Kong, and Singapore.
  - **All-Risk Insurance:** Complete, seamless coverage underwritten by Lloyd's of London from the moment an asset is collected until physical delivery to the winning buyer.
  - **Tax-Free Freeport Storage:** Allows international buyers to store purchases in bonded freeports (e.g., Geneva Freeport) without triggering local import VAT until export.

#### 3. Main Alternative & Trade-Offs
- **Option B (Brink’s Global Services):** Immense global armored infrastructure, but less tailored to single-piece bespoke horological handling, condition photography, and specialist inspection appointments.
- **Option C (Ferrari Logistics Exclusively):** Exceptional white-glove watch transit courier, but a smaller international network of bonded freeport vault facilities.

#### 4. Estimated Cost Profile
- **Bonded Vault Storage:** **~0.15% to 0.35% of declared asset value per year** *(Estimated standard industry rate; final pricing subject to formal RFP)*.
- **White-Glove Armored Transit:** **$250 to $1,500 per transit leg** depending on distance, crossing borders, and declared valuation *(Estimated)*.

#### 5. Dependencies, Risks & Professional Reviews Required
- **Dependencies:** Execution of master bailee liability agreements and physical site security audit.
- **Risks:** Customs delays and CITES treaty regulations governing exotic leather watch straps (e.g., alligator, crocodile).
- **Professional Review Required:** Marine cargo / fine art insurance broker review to verify ChronoBid’s secondary contingent liability policy; legal counsel review of consignor bailment agreements.

#### 6. Timing Determination
**CAN BE DEFERRED TO PHASE 7 (Tier 3)**. Physical custody agreements must be signed prior to accepting physical consignments, well after software development is complete.

---

### DEC-P3-008: Buyer's Premium & Commercial Commission Schedule

#### 1. The Decision to be Made
What commercial fee schedule should the automated auction invoicing and settlement engine calculate upon the fall of the hammer?

#### 2. Recommended Option & Rationale
**Option A: Tiered Luxury Auction Industry Standard: 20% / 15% / 10% (Recommended)**  
- **20%** on the hammer price up to **$100,000 USD**.
- **15%** on the portion from **$100,000 to $500,000 USD**.
- **10%** on any portion exceeding **$500,000 USD**.
- *(Consignor seller commissions negotiated between 0% and 8% depending on lot rarity).*
- **Why this is recommended:**
  - **Aligns with Collector Expectations:** Standard structure across major auction houses, providing high revenue margins on mid-tier lots ($10k–$100k) while offering meaningful commission relief to attract ultra-rare marquee timepieces ($500k+).
  - **Proven Commercial Viability:** Guarantees healthy gross margins to cover white-glove photography, insured shipping, and specialist authentication.

#### 3. Main Alternative & Trade-Offs
- **Option B (Flat Competitive Platform Fee — 12.5%):** A flat 12.5% Buyer’s Premium across all price tiers.
  - *Trade-off:* Highly compelling marketing hook to disrupt legacy auction houses, but reduces platform gross margin by ~37% on timepieces selling under $100,000.

#### 4. Estimated Cost Profile
- **Software Implementation Cost:** **$0** *(Verified)*. The fee calculation engine is fully parameterized; changing the fee percentages is a simple configuration update.

#### 5. Dependencies, Risks & Professional Reviews Required
- **Dependencies:** Commercial positioning and marketing strategy.
- **Risks:** Setting rates too high discourages bidders; setting rates too low impairs operating profitability.
- **Professional Review Required:** Independent CPA / tax advisor review to verify sales tax, VAT, and marketplace facilitator withholding rules across target jurisdictions.

#### 6. Timing Determination
**CAN BE DEFERRED TO PHASE 5/7 (Tier 3)**. The settlement engine will support any mathematical formula; the exact percentage constants can be decided prior to publishing the debut auction catalog.

---

### DEC-P3-009: Debut Timepiece Catalog Rights Clearance & Imagery Strategy (ADR-009)

#### 1. The Decision to be Made
How should the provisional demonstration imagery for the initial debut auction catalog be transitioned to production-ready, fully cleared visual assets?

#### 2. Recommended Option & Rationale
**Hybrid Strategy: Commission Authentic Studio Macro-Photography for Marquee Lots + Consignor-Supplied Intake Assets for General Inventory (Recommended)**  
- **Marquee Lots (Top 3–5 flagship timepieces):** Transport physical watches to a specialist horological photo studio for high-resolution macro-photography capturing dial typography, movement finishing, hallmarks, and reference engravings.
- **General Catalog:** Curated, authenticated high-resolution photographs supplied directly by vetted consignors during intake.
- **Prototype Status:** Continue utilizing the approved `#EDE7DC` monogram fallback cards in all demo and sandbox environments until physical photography is completed.
- **Why this is recommended:** Discerning collectors bidding $50,000+ demand to see the exact condition, beveling, and serial numbers of the specific watch being sold, not generic stock images.

#### 3. Main Alternative & Trade-Offs
- **Option B (Licensed Institutional Archive Photography):** Licensing existing photographs from brand museums or foundation archives.
  - *Trade-off:* Costs $500–$2,000 per image, restricts commercial reuse, and fails to show the real physical condition of the consigned timepiece.

#### 4. Estimated Cost Profile
- **Monogram Fallback Cards:** **$0** *(Verified; fully implemented in prototype)*.
- **Professional Studio Macro-Photography:** **~$300 to $750 per timepiece** for a complete 12-to-18 shot studio set including movement teardown and macro angles *(Estimated)*.
- **Archive Image Licensing (Alternative):** **$500 to $2,000 per image** *(Estimated)*.

#### 5. Dependencies, Risks & Professional Reviews Required
- **Dependencies:** Physical possession of consigned timepieces in secure facility.
- **Risks:** Copyright claims if third-party web images are used without written commercial licenses.
- **Professional Review Required:** Standard intellectual property / copyright release agreements signed by photographers and consignors.

#### 6. Timing Determination
**CAN BE DEFERRED TO PHASE 7 (Tier 3)**. The existing prototype functions perfectly with `#EDE7DC` monogram cards; physical photography is executed during pre-auction consignment cataloging.

---

## 5. Master Decision Summary Matrix

The table below summarizes all ten strategic architectural decisions, their recommended options, cost profiles, timing requirements, and key risk dependencies:

| Decision ID | Domain & Subject | Priority Tier | Recommended Option | Cost Profile (Verified vs. Estimated) | Timing Action | Key Professional Review Required |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DEC-P3-001** | Currency & FX Settlement | **Tier 1** | **Option A (Canonical USD-Only Settlement)** | **$0 external cost** *(Verified)* vs. $15k–$30k for FX lock *(Est.)* | **DECIDE NOW** | Indian FEMA/LRS & TCS Tax Counsel Review |
| **DEC-P3-002** | Production Authentication | **Tier 1** | **Option A (Clerk Enterprise Frontrunner / Auth0)** | **$25/mo** Clerk *(Verified)* vs. $700–$3,500/mo Auth0 *(Verified)* | **DECIDE NOW** | Privacy Counsel (EU GDPR & US DPF Transfer) |
| **DEC-P3-007** | Cloud Infrastructure | **Tier 1** | **Option A (AWS Fargate + Aurora PostgreSQL)** | **$250–$450/mo Staging; $600–$1,200/mo Prod** *(Est.)* | **DECIDE NOW** | Independent DevOps & VPC Security Review |
| **DEC-P3-010** | Saleroom WebSocket Engine | **Tier 1** | **Option A (Unified Fastify TypeScript Monolith)** | **$0 extra cost; saves ~$15,000 dev effort** *(Est.)* | **DECIDE NOW** | k6 Simulated High-Concurrency Load Testing |
| **DEC-P3-003** | Payment Gateway & Banking | **Tier 2** | **Hybrid (Adyen/Stripe Cards + Bank Wires)** | **1.1%–2.9% Cards; flat $15–$25 Wires** *(Verified)* | **DEFER TO P5** | Merchant Risk Underwriting & Bank Escrow Review |
| **DEC-P3-005** | Identity AML/KYC Vendor | **Tier 2** | **Option A (Persona)** | **~$1.50 to $3.00 per verified identity** *(Est.)* | **DEFER TO P5** | Written AML/CIP Compliance Policy Counsel |
| **DEC-P3-006** | Anti-Bot & Abuse Security | **Tier 2** | **Option A (Cloudflare Turnstile Pro/Business)** | **$0 Turnstile + $20–$200/mo Cloudflare Plan** *(Verified)* | **DEFER TO P5** | Standard Security Engineering Implementation |
| **DEC-P3-004** | Vault Custody & Transit | **Tier 3** | **Option A (Malca-Amit + Ferrari Logistics)** | **0.15%–0.35% asset value/yr + transit** *(Est.)* | **DEFER TO P7** | Bailee Agreement & Lloyd's Insurance Broker |
| **DEC-P3-008** | Buyer's Premium Schedule | **Tier 3** | **Option A (Tiered 20% / 15% / 10%)** | **$0 technical cost (configuration parameter)** *(Verified)* | **DEFER TO P7** | CPA & International Sales Tax / VAT Advisor |
| **DEC-P3-009** | Debut Catalog Imagery | **Tier 3** | **Hybrid (Studio Macro-Photography + Consignor)** | **$0 Monogram (Verified); $300–$750/watch** *(Est.)* | **DEFER TO P7** | Standard IP / Photographer Copyright Clearance |

---

## 6. Actionable Next Steps for Project Owner

To maintain strict project governance while progressing the ChronoBid Vault technical architecture, the recommended next steps are:

1. **Review and Confirm Tier 1 Preferences:**
   - Confirm concurrence with the four Tier 1 foundation decisions:
     - [ ] **DEC-P3-001:** Option A (Canonical USD-Only Settlement).
     - [ ] **DEC-P3-002:** Option A (Managed Authentication — Clerk Enterprise frontrunner, Auth0 candidate).
     - [ ] **DEC-P3-007:** Option A (AWS Enterprise — Fargate + Aurora PostgreSQL Multi-AZ).
     - [ ] **DEC-P3-010:** Option A (Unified Fastify TypeScript Modular WebSocket Engine).
2. **Authorize Commissioning of External Professional Legal/Tax Reviews:**
   - Authorize engagement of Indian Foreign Exchange (FEMA/LRS/TCS) legal counsel to prepare the statutory bidder advisory for Indian collectors.
   - Authorize engagement of European privacy counsel to review the EU-U.S. Data Privacy Framework (DPF) memorandum regarding Clerk authentication.
3. **Formal Approval Gate (Future Phase):**
   - Upon review of the Tier 1 selections and remediation results in [`PHASE3_ARCHITECTURE_AUDIT_REMEDIATION_REPORT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/PHASE3_ARCHITECTURE_AUDIT_REMEDIATION_REPORT.md), provide formal written sign-off on the Phase 3 Technical Architecture Blueprint.
   - Note: Phase 3 backend coding and Phase 4 production implementation remain **strictly unauthorized** until a separate Phase 4 Implementation Gate is authorized.

---
*Report compiled by Senior Solutions Architect, Senior Financial Systems Analyst, and Project Management Office.*  
*Timestamp: 2026-10-25T05:36:00Z*
