# ChronoBid Vault — Phase 3 Final Approval Corrections Report
## Concurrency Safety Matrix, Reconciliation Truth, Anti-Bot Fairness & Infrastructure Cost Rigor

> **Document Type:** Focused Engineering Corrections, Safety Matrix & Cost Rigor Audit  
> **Project:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Working Directory:** `C:\Users\kbjee\OneDrive\Desktop\omniroute\auction system`  
> **Date:** 20 October 2026  
> **Authors:** Senior Solutions Architect, Security Architect, Financial Systems Analyst & Quality Assurance Lead  
> **Target Audience:** ChronoBid Vault Project Owner & Technical Steering Committee  
> **Current Lifecycle Stage:** Phase 2 Complete (Closure Pending) &rarr; Phase 3 Architecture Final Corrections  
> **Audit Declaration Status:** **READY FOR OWNER REVIEW**  
> **Governance Directive:** **DOCUMENTATION ONLY — ZERO APPLICATION CODE EDITS, ZERO DATABASE PROVISIONING, ZERO LIVE PAYMENTS**

---

## 1. Executive Summary & Governance Affirmation

This report presents the final, focused architectural corrections for the ChronoBid Vault Phase 3 documentation suite. In response to rigorous adversarial review, this document resolves four critical operational and technical domains:
1. **Vault Transaction Safety:** Establishes an exhaustive transaction-by-transaction database locking matrix, formally proving deadlock immunity while explicitly disclaiming that live PostgreSQL concurrency testing remains unperformed.
2. **Bank Reconciliation & Adjustment Integrity:** Replaces proposed automated write-offs with a strict, dual-control exception handling workflow, and establishes an authoritative five-state payment taxonomy where uploaded receipts convey zero financial rights.
3. **Anti-Bot Fairness & Accessibility Accommodations:** Eliminates discriminatory mouse-movement and timing heuristics to ensure full WCAG accessibility compliance for touchscreens, keyboard navigation, and screen readers, replacing them with layered server-side risk scoring.
4. **Infrastructure Cost Realism:** Reframes the preliminary $300–$500 monthly estimate as a baseline compute model, detailing excluded variable expenses (NAT gateways, bandwidth egress, KMS, SaaS per-unit fees, and staging environments).

### 1.1 Governance Boundary Affirmation
- **Phase 2 Status:** The Next.js App Router prototype at `http://localhost:3000` is stable and verified across all 14 routes with **67/67 automated assertions passing** (`npm test`). **`[VERIFIED BY EXISTING TEST OR EVIDENCE]`** However, formal Phase 2 closure remains pending until the Project Owner executes the acceptance field in [`PHASE2_CLOSURE_REPORT.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE2_CLOSURE_REPORT.md#L305-L330). **`[OWNER DECISION REQUIRED]`**
- **Phase 3 Status:** Architectural design documents are complete, reconciled, and awaiting Project Owner review. **`[DOCUMENTED DESIGN — NOT IMPLEMENTED]`**
- **Phase 4 & Production Status:** **STRICTLY PROHIBITED AND BLOCKED**. No database instances, cloud infrastructure, backend code, or third-party provider accounts have been or will be provisioned without explicit, written owner authorization.

---

## 2. Findings & Architectural Corrections

### 2.1 Correction 1: Vault Transaction Safety & Concurrency Locking Matrix

#### The Concurrency Hierarchy
All transactions in ChronoBid Vault acquire row-level locks strictly adhering to the **Unified Global Lock Acquisition Hierarchy**:

$$\mathbf{Global\ Hierarchy:}\quad \mathtt{lots}\text{ (Sorted Ascending)} \longrightarrow \mathtt{vault\_accounts}\text{ (Sorted Ascending)}$$

#### Comprehensive Transaction-by-Transaction Locking Matrix
The table below specifies every transaction type, the exact database records locked, the lock acquisition sequence, and the mathematical protections against lock-order inversions and bypass paths:

```
+-----------------------------------------------------------------------------------------------------------------------------------------------+
|                                             TRANSACTION-BY-TRANSACTION LOCKING MATRIX                                                         |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| ID | Transaction Type            | Locked Database Rows               | Deterministic Lock Order              | Inversion & Bypass Protection |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T1 | Initial New Bid             | lots(target_lot),                  | 1. lots(target_lot)                   | Validates active countdown    |
|    | (Opening Marquee Bid)       | vault_accounts(bidder_user_id)     | 2. vault_accounts(bidder_user_id)     | before evaluating funds.      |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T2 | Outbid Replacement          | lots(target_lot),                  | 1. lots(target_lot)                   | Multi-account locks sorted by |
|    | (Lead Transfers to New User)| vault_accounts(new_bidder, prev)   | 2. vault_accounts(sorted user_id ASC) | user_id ASC; prevents races.  |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T3 | Multi-Lot Bids (Same User)  | lots(Lot A), lots(Lot B),          | 1. lots(target_lot)                   | Both threads queue on the     |
|    | (Benchmark 2 Concurrency)   | vault_accounts(shared_user_id)     | 2. vault_accounts(shared_user_id)     | user account row; 0 over-bid. |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T4 | Self-Increment Bid Increase | lots(target_lot),                  | 1. lots(target_lot)                   | Re-evaluates delta hold       |
|    | (Current Leader Steps Up)   | vault_accounts(bidder_user_id)     | 2. vault_accounts(bidder_user_id)     | against remaining headroom.   |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T5 | Admin Lot Cancel / Pause    | lots(target_lot),                  | 1. lots(target_lot)                   | Identical hierarchy; releases |
|    | (Emergency Saleroom Stop)   | vault_accounts(active_leader_id)   | 2. vault_accounts(active_leader_id)   | active hold without deadlock. |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T6 | Hammer Fall / Lot Close     | lots(target_lot),                  | 1. lots(target_lot)                   | Converts reserved hold into   |
|    | (Reserve Met vs. Passed)    | vault_accounts(winning_buyer_id)   | 2. vault_accounts(winning_buyer_id)   | settlement escrow hold (1040).|
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T7 | Inbound Wire Clearance      | vault_accounts(recipient_user_id)  | 1. vault_accounts(recipient_user_id)  | Touches NO lots; cannot       |
|    | (Physical Cash Received)    |                                    |    (Lots table untouched)             | deadlock with saleroom bids.  |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T8 | Outbound Wire Payout        | vault_accounts(requesting_user_id) | 1. vault_accounts(requesting_user_id) | Touches NO lots; validates    |
|    | (User Withdrawal Request)   |                                    |    (Lots table untouched)             | unencumbered headroom only.   |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T9 | Consignor Net Settlement    | lots(target_lot),                  | 1. lots(target_lot)                   | Releases escrow hold (1040);  |
|    | (Consignor Payout Release)  | vault_accounts(consignor, buyer)   | 2. vault_accounts(sorted user_id ASC) | recognizes platform revenue.  |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T10| Dispute Refund / Reversal   | lots(target_lot),                  | 1. lots(target_lot)                   | Reverses settlement hold      |
|    | (Authenticity Failure)      | vault_accounts(buyer_user_id)      | 2. vault_accounts(buyer_user_id)      | back to buyer available funds.|
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T11| Account Adjustment (Manual) | vault_accounts(target_user_id)     | 1. vault_accounts(target_user_id)     | Requires dual-control sign-off|
|    | (Discretionary Resolution)  |                                    |    (Lots table untouched)             | with mandatory reason code.   |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
```

#### Database Constraints & Idempotency Controls
To prevent data corruption at the database storage engine layer:
1. **Mathematical Check Constraints:**
   - `CHECK (total_balance_usd >= 0)`
   - `CHECK (reserved_funds_usd >= 0)`
   - `CHECK (applicable_holds_usd >= 0)`
   - `CHECK (available_to_bid_usd >= 0)`
   - `CHECK (available_to_bid_usd = total_balance_usd - reserved_funds_usd - applicable_holds_usd)`
2. **Uniqueness Invariants:**
   - `UNIQUE (idempotency_key)` on `vault_ledger_entries`.
   - `UNIQUE (lot_id, bid_sequence)` on `bids`.
3. **Transaction Rollback & Timeouts:**
   - Standardize on **`READ COMMITTED` isolation**. Transactions execute row locks via `SELECT ... FOR UPDATE`.
   - Configure session safety timeouts: `lock_timeout = '1500ms'` and `statement_timeout = '3000ms'`.
   - If a lock timeout or transient constraint violation occurs, PostgreSQL executes an immediate, complete `ROLLBACK`, releasing all acquired locks.
   - Idempotent retries from clients use the same `Idempotency-Key` UUIDv4. If the prior attempt committed, Redis returns the cached response; if it rolled back, the retry re-evaluates cleanly against updated balances.
4. **Demarcation on Concurrency Testing:**
   > [!IMPORTANT]
   > **CONCURRENCY TESTING TRUTH:** While the relational calculus and wait graphs mathematically demonstrate deadlock immunity, **these guarantees have NOT been executed against an actual PostgreSQL database instance.** In Phase 2, tests were executed exclusively against client-side JavaScript mock state machines. Live PostgreSQL concurrency benchmarks and deadlock stress tests are a mandatory Phase 4 deliverable. **`[DOCUMENTED DESIGN — NOT IMPLEMENTED]`**

---

### 2.2 Correction 2: Bank Reconciliation, Payment Taxonomy & Prohibited Auto-Write-Offs

#### Reassessment & Strict Prohibition on Automatic Expense Write-Offs
Earlier drafts proposed automatically writing off intermediary correspondent wire deductions under $50 USD to a platform expense account. **This proposal is formally revoked.**

```
+---------------------------------------------------------------------------------------------------------+
|                                    BANK RECONCILIATION & ADJUSTMENT RULES                               |
+----+--------------------------------+-------------------------------------------------------------------+
| #  | Governance Invariant           | Mandatory System Enforcement Rule                                 |
+----+--------------------------------+-------------------------------------------------------------------+
| 1  | Zero Auto-Write-Offs           | Unexplained payment shortfalls must NEVER be automatically booked |
|    |                                | as platform expenses or written off without human review.         |
+----+--------------------------------+-------------------------------------------------------------------+
| 2  | Exception Queue Routing        | Any variance between invoice total and cleared cash is routed to  |
|    |                                | the Treasury Exception Queue with status PAYMENT_UNDERPAID.      |
+----+--------------------------------+-------------------------------------------------------------------+
| 3  | Dual-Control Discretionary     | Adjustments <$50 require documented correspondent fee schedules   |
|    | Authorization                  | and co-signatures from Senior Treasury Analyst + Finance Manager. |
+----+--------------------------------+-------------------------------------------------------------------+
| 4  | Top-Up Remittance for >=$50    | Shortfalls >=$50 require the buyer to top up the delta from Vault |
|    |                                | available funds or secondary payment before release.              |
+----+--------------------------------+-------------------------------------------------------------------+
| 5  | Physical Custody Lock          | Physical timepieces NEVER ship or leave Malca-Amit custody while  |
|    |                                | an invoice has an un-cleared variance.                            |
+----+--------------------------------+-------------------------------------------------------------------+
| 6  | Immutable Audit Logging        | Adjustments log: timestamp, invoice_id, amount_invoiced, cleared, |
|    |                                | variance, fee_justification, analyst_id, and approver_id.         |
+----+--------------------------------+-------------------------------------------------------------------+
```

#### Authoritative Payment State Taxonomy
Every payment transaction is strictly classified into one of five mutually exclusive states:

```
                                    PAYMENT LIFECYCLE STATE MACHINE
                                    
       [User / Invoicing] ---> [PENDING] (Deposit request or winning invoice created)
                                   |
                                   v
                             [RECEIVED] (Wire credited at bank, pending treasury matching)
                                   |
                    +--------------+--------------+
                    |                             |
                    v                             v
               [CLEARED]                     [DISPUTED] (SWIFT recall, AML hold, or chargeback)
         (100% Irreversible Cash)                 |
                    |                             v
                    v                        [REVERSED] (Returned to source bank account)
           [FUNDS AVAILABLE]
```

1. **`PENDING`:** An invoice or deposit request has been generated. Zero funds have been confirmed by the bank. **Zero bidding headroom or asset title is granted.**
2. **`RECEIVED`:** An incoming bank wire has arrived at the banking institution, but is held in clearing, automated reference matching, or compliance screening. Funds are un-cleared.
3. **`CLEARED`:** Funds have settled irreversibly into the segregated customer escrow account and matched via MT940/CAMT.053 statement records. Funds are credited to Account 1010 (`User Available Funds`).
4. **`REVERSED`:** An un-cleared incoming wire is rejected, recalled by the originating institution, or canceled.
5. **`DISPUTED`:** An incoming payment is subject to a formal SWIFT recall request, sanctions review, or card dispute. Associated ledger funds are locked in Account 1040 (`Settlement Escrow Holds`) or Account 2050 (`Suspense`), and physical goods are frozen in vault custody.
6. **Uploaded Receipt Truth:**
   > [!CAUTION]
   > An uploaded MT103 wire transfer confirmation slip or banking screenshot is **strictly an unverified customer claim, NOT cleared funds**. Uploading a document creates a `PENDING_CLEARANCE` tracking record only. **Total Vault Balance and Available to Bid remain completely uncredited, and zero goods are released.** **`[DOCUMENTED DESIGN — NOT IMPLEMENTED]`**

---

### 2.3 Correction 3: Anti-Bot Fairness, Multi-Factor Scoring & Accessibility Accommodations

#### Elimination of Discriminatory Heuristics
Earlier challenge drafts suggested that zero mouse movement or sub-50ms reaction times should automatically trigger bot penalties. **This heuristic is formally rejected as a compliance violation.**

- **Accessibility Reality (WCAG 2.2 AA Compliance):** 
  - Mobile collectors using touchscreens (smartphones, tablets) generate zero mouse vector entropy.
  - Collectors using keyboard-only navigation (Tab + Enter) or screen readers (JAWS, NVDA, VoiceOver) emit rapid, discrete input events with zero cursor trajectory.
  - Automatically penalizing or classifying users as bots based solely on mouse telemetry violates accessibility standards and unfairly penalizes legitimate high-net-worth mobile bidders.

#### Layered Server-Side Abuse Signals
Bot mitigation is restructured into a layered, multi-factor risk scoring engine that does not rely on cursor movement:

```
+---------------------------------------------------------------------------------------------------------+
|                                    LAYERED BOT RISK SCORING ENGINE                                      |
+----+--------------------------+--------------------------------------------------+----------------------+
| #  | Telemetry Dimension      | Technical Verification Mechanism                 | Risk Weighting       |
+----+--------------------------+--------------------------------------------------+----------------------+
| 1  | Client Hints Integrity   | Evaluates Sec-CH-UA, Sec-CH-UA-Mobile, and       | High if mismatched   |
|    |                          | Sec-CH-UA-Platform against User-Agent strings.   | with browser headers |
+----+--------------------------+--------------------------------------------------+----------------------+
| 2  | TLS Fingerprinting       | Inspects JA3 / JA4 TLS client fingerprints at    | Critical if matching |
|    |                          | Cloudflare edge (detects python-requests, cURL). | non-browser scripts  |
+----+--------------------------+--------------------------------------------------+----------------------+
| 3  | Automation Environment   | Evaluates navigator.webdriver flags, missing     | High if automated    |
|    | Artifacts                | audio/WebGL contexts, or headless Chrome traits. | runtime detected     |
+----+--------------------------+--------------------------------------------------+----------------------+
| 4  | Saleroom Velocity Limit  | Hard rate limit: Maximum 3 bids per second per   | Immediate throttle   |
|    |                          | authenticated paddle (enforced in Redis).        | and HTTP 429 alert   |
+----+--------------------------+--------------------------------------------------+----------------------+
```

#### Provider Reality vs. Application Logic Demarcation
- **Official Cloudflare Turnstile Facts:** Turnstile tokens (`cf-turnstile-response`) are valid for **exactly 300 seconds (5 minutes)** and are **strictly single-use** (cannot be verified twice). Cloudflare provides *no native concept* of a multi-hour session claim. **`[VERIFIED BY EXISTING TEST OR EVIDENCE]`**
- **Application Logic Construction:** The application maintains an internal `bot_verified:session:{sessionId}` claim in Redis with a 30-minute sliding TTL.
- **Pre-Deadline Background Refresh:** In the final 120 seconds of soft-close, the frontend automatically pre-warms a fresh Turnstile token in the background so that pre-deadline bids submit with a valid token under 300 seconds old without interrupting user interactions.
- **False-Positive Recovery:** If risk scoring flags suspicious telemetry, the application prompts a non-interactive challenge. If an interactive challenge is required, the user's pending bid is held in an active grace queue (+30s buffer) to prevent unfair lockout. **`[DOCUMENTED DESIGN — NOT IMPLEMENTED]`**

---

### 2.4 Correction 4: Infrastructure Cost Modeling & Excluded Expenses

#### Cost Estimate Demarcation
> [!WARNING]
> The baseline estimate of **$300 to $500 per month** represents a preliminary, configuration-dependent architectural model for core compute and database storage in a single AWS region. It is **NOT** a formal quotation. **`[DOCUMENTED DESIGN — NOT IMPLEMENTED]`**

#### Detailed Inventory of Excluded & Variable Operating Expenses
To ensure complete fiscal transparency, the table below lists the operational expenses excluded from the preliminary baseline:

```
+---------------------------------------------------------------------------------------------------------+
|                                    EXCLUDED & VARIABLE INFRASTRUCTURE EXPENSES                          |
+----+--------------------------+--------------------------------------------------+----------------------+
| #  | Expense Category         | Pricing Mechanics & Underlying Assumptions       | Estimated Range      |
+----+--------------------------+--------------------------------------------------+----------------------+
| 1  | AWS NAT Gateways         | $32.40/month per AZ ($64.80/mo for Multi-AZ) +   | ~$65 to $120 / month |
|    |                          | $0.045/GB data processing fees for private VPC.  |                      |
+----+--------------------------+--------------------------------------------------+----------------------+
| 2  | Data Transfer Out (Egress| Bandwidth for high-res 4:5 macro-photography     | ~$50 to $250 / month |
|    | Bandwidth)               | from S3/CloudFront (~$0.085/GB in US/Europe).    | (traffic-dependent)  |
+----+--------------------------+--------------------------------------------------+----------------------+
| 3  | Cross-AZ Data Transit    | Inter-service traffic between ECS containers and | ~$10 to $40 / month  |
|    |                          | Aurora/ElastiCache across AZ boundaries ($0.01/GB|                      |
+----+--------------------------+--------------------------------------------------+----------------------+
| 4  | KMS & Secrets Manager    | Customer Managed Keys ($1/mo/key) + $0.03/10k    | ~$15 to $35 / month  |
|    |                          | operations; Secrets Manager ($0.40/secret/month).|                      |
+----+--------------------------+--------------------------------------------------+----------------------+
| 5  | CloudWatch Logs & APM    | Custom metrics ($0.30/metric) + Log ingestion    | ~$50 to $150 / month |
|    |                          | ($0.50/GB) + Datadog / Sentry APM subscriptions. |                      |
+----+--------------------------+--------------------------------------------------+----------------------+
| 6  | Identity SaaS (Clerk)    | Tiered pricing: ~$0.05 to $0.15 per Monthly      | ~$50 to $500 / month |
|    |                          | Active User (MAU) above free tier limits.        | (scale-dependent)    |
+----+--------------------------+--------------------------------------------------+----------------------+
| 7  | KYC Provider (Persona)   | Usage-based pricing: ~$1.50 to $3.00 per         | ~$150 to $600 / mo   |
|    |                          | completed government ID + PEP/sanctions check.   | (onboarding volume)  |
+----+--------------------------+--------------------------------------------------+----------------------+
| 8  | Multi-Environment Staging| Running isolated Staging and Dev environments    | 1.5x to 2.0x base    |
|    | Multipliers              | alongside Production infrastructure.             | compute spend        |
+----+--------------------------+--------------------------------------------------+----------------------+
```

#### Deferred High-Cost Services
The following enterprise tools remain formally deferred to protect launch capital:
- **Cloudflare Enterprise ($36,000/year minimum):** Defer. Cloudflare Pro ($20/mo) or Business ($200/mo) completely provides WAF, DDoS shielding, and Turnstile.
- **Multi-Shard Redis Cluster:** Defer until active saleroom sockets exceed 25,000 collectors.
- **Go Microservice Extraction:** Defer until Node.js event-loop lag exceeds 25ms.
- **Apache Kafka Event Bus:** Defer; internal Redis Pub/Sub handles message dispatch.

---

## 3. Remaining Technical Risks

1. **Relational Deadlock Verification Risk:** Although the Global Lock Acquisition Hierarchy mathematically eliminates circular dependencies, concurrent PostgreSQL transactions under network latency and query planner locks must be verified with automated k6 stress testing.
2. **Correspondent Bank Intermediary Deductions:** SWIFT wire fee deductions can cause recurring underpayment exceptions, requiring dedicated daily operational treasury review.
3. **Turnstile Token Expiry Under Saleroom Latency:** If a bidder experiences high network jitter (>2,000ms), a background Turnstile refresh token may expire before reaching the verification endpoint.
4. **Third-Party SaaS Outages:** Dependency on external identity (Clerk/Auth0) or anti-bot (Cloudflare) introduces third-party availability risks during live auctions.

---

## 4. Evidence Still Required

Before production commercial operations can commence, the following empirical evidence must be gathered:

```
+---------------------------------------------------------------------------------------------------------+
|                                    REQUIRED FUTURE EMPIRICAL EVIDENCE                                   |
+----+--------------------------------+-------------------------------------------------+-----------------+
| #  | Required Evidence Item         | Generation Methodology                          | Target Phase    |
+----+--------------------------------+-------------------------------------------------+-----------------+
| E1 | PostgreSQL Concurrency Tests   | Automated k6 load tests executing Benchmark 2   | Phase 4         |
|    |                                | against real Aurora PostgreSQL instance.        | Engineering     |
+----+--------------------------------+-------------------------------------------------+-----------------+
| E2 | Bank MT940 / CAMT.053 Ingest   | Commercial bank SFTP statement ingest test      | Phase 5         |
|    |                                | with zero balance variance.                     | Banking Rails   |
+----+--------------------------------+-------------------------------------------------+-----------------+
| E3 | Payment Underwriting Approval  | Written risk committee approval from Adyen or   | Phase 5         |
|    |                                | Stripe for high-ticket online horology.         | Commercial      |
+----+--------------------------------+-------------------------------------------------+-----------------+
| E4 | Legal Regulatory Opinions      | Qualified legal counsel memoranda on money      | Phase 8         |
|    |                                | transmission, escrow, and consumer returns.     | Compliance      |
+----+--------------------------------+-------------------------------------------------+-----------------+
```

---

## 5. Proposed Acceptance Criteria for Future Implementation (Phase 4)

```
+---------------------------------------------------------------------------------------------------------+
|                                    PHASE 4 ACCEPTANCE CRITERIA MATRIX                                   |
+----+--------------------------------+-------------------------------------------------+-----------------+
| #  | Acceptance Criterion           | Verification Condition                          | Pass Threshold  |
+----+--------------------------------+-------------------------------------------------+-----------------+
| A1 | Multi-Lot Concurrency Lock     | 50 simultaneous bids on Lot A & B with ₹1L cap. | 0 over-bids;    |
|    |                                |                                                 | 0 deadlocks.    |
+----+--------------------------------+-------------------------------------------------+-----------------+
| A2 | Double-Entry Zero Variance     | 100,000 automated ledger journal postings.      | Sum Debits ==   |
|    |                                |                                                 | Sum Credits ($0)|
+----+--------------------------------+-------------------------------------------------+-----------------+
| A3 | WebSocket Ticket Single-Use    | Attempt ticket reuse after initial connection.  | Code 4401       |
|    |                                |                                                 | Unauthorized.   |
+----+--------------------------------+-------------------------------------------------+-----------------+
| A4 | WebSocket CSWSH Rejection      | Upgrade request with forged Origin header.      | HTTP 403        |
|    |                                |                                                 | Forbidden.      |
+----+--------------------------------+-------------------------------------------------+-----------------+
| A5 | Turnstile Single-Use Token     | Two bids submitted with identical token.        | 2nd bid HTTP 403|
|    |                                |                                                 | Forbidden.      |
+----+--------------------------------+-------------------------------------------------+-----------------+
| A6 | Wire Receipt Zero Headroom     | Upload MT103 wire transfer confirmation slip.   | Available to Bid|
|    |                                |                                                 | remains $0.00.  |
+----+--------------------------------+-------------------------------------------------+-----------------+
| A7 | Accessible Bid Acceptance      | Keyboard-only (Enter) bid placement (<10ms).    | Bid accepted;   |
|    |                                |                                                 | 0 false block.  |
+----+--------------------------------+-------------------------------------------------+-----------------+
```

---

## 6. Remaining Strategic Decisions Requiring Project Owner Approval

All decisions in [`PHASE3_OWNER_DECISIONS_REGISTER.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_OWNER_DECISIONS_REGISTER.md) remain strictly **`PROPOSED — OWNER APPROVAL REQUIRED`**. To unblock Phase 4, the Project Owner is requested to select options for the four **Tier 1 Foundation Blockers**:

1. **DEC-P3-001 (Currency Settlement Model):**
   - *Option A (Canonical USD-Only Settlement — Recommended for Launch):* Invoices issued in USD. Zero platform balance-sheet FX risk.
   - *Option B (48-Hour Guaranteed FX Rate Lock).*
   - **`[OWNER DECISION REQUIRED]`**
2. **DEC-P3-002 (Authentication Architecture):**
   - *Option A (Managed Enterprise Identity via Clerk/Auth0 — Recommended):* FIDO2 Passkeys, turnkey Google OIDC, offloads credential liability.
   - *Option B (Self-Hosted Identity Service via Fastify Auth / Ory Kratos).*
   - **`[OWNER DECISION REQUIRED]`**
3. **DEC-P3-007 (Primary Cloud Hosting & Database Infrastructure):**
   - *Option A (AWS Enterprise — Fargate + Aurora Multi-AZ + ElastiCache — Recommended).*
   - *Option B (Google Cloud Platform).*
   - **`[OWNER DECISION REQUIRED]`**
4. **DEC-P3-010 (Live Saleroom WebSocket Gateway Engine):**
   - *Option A (Fastify Modular Monolith on Node.js 22 LTS — Recommended).*
   - *Option B (Standalone Go Microservice).*
   - **`[OWNER DECISION REQUIRED]`**

---

## 7. Final Review Status Declaration

The Phase 3 technical architecture, concurrency safety matrix, payment lifecycle taxonomy, anti-bot accessibility model, and infrastructure cost framework have been thoroughly corrected, reconciled, and cleared of internal ambiguities.

The documentation suite is formally declared:

$$\mathbf{READY\ FOR\ OWNER\ REVIEW}$$

> [!IMPORTANT]
> **MANDATORY GOVERNANCE DIRECTIVE:** This design package is **NOT** authorization to implement. Engineering remains strictly prohibited from writing production backend code, scaffolding databases, or provisioning cloud infrastructure until explicit written authorization is received from the Project Owner.

---
*Report submitted by Senior Solutions Architect, Security Architect, Financial Systems Analyst & Quality Assurance Lead.*  
*ChronoBid Vault Architectural Review Board — 20 October 2026.*
