# ChronoBid Vault — Phase 3 Specification
## Production Architecture, Security & Financial Systems Design

> **Document Type:** Production Engineering Blueprint, Security Model & Financial Systems Specification  
> **Project:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Working Directory:** `C:\Users\kbjee\OneDrive\Desktop\omniroute\auction system`  
> **Date:** 20 October 2026  
> **Author:** Senior Project Manager, Principal Software Architect, Chief Information Security Officer (CISO)  
> **Status:** **PROPOSED PHASE 3 ARCHITECTURE PLAN — PENDING OWNER REVIEW & AUTHORIZATION**  
> **Governance Directive:** **CODING AND PRODUCTION SERVICE INTEGRATION STRICTLY PROHIBITED UNTIL AUTHORIZED**  

---

## Executive Summary & Scope

This specification establishes the production architecture, security engineering standards, financial ledger design, and infrastructure roadmap required to transition ChronoBid Vault from the verified **Phase 2 clickable frontend prototype** into an enterprise-grade, high-concurrency, legally compliant international auction platform (**Phase 3 and beyond**).

Phase 2 proved the visual identity, user experience, multi-currency display, and mathematical rules of the **Pre-Funded Vault** and **Soft-Close Anti-Sniping** systems using client-side reactive simulation. Phase 3 replaces all simulation layers with **server-authoritative distributed systems**, **immutable double-entry financial ledgers**, **cryptographic authentication (OAuth 2.0 / OIDC)**, **anti-fraud controls (KYC/AML)**, and **real-time WebSocket bidding engines**.

In strict accordance with project governance rules, **this document is a design and planning specification only**. No production backend code, databases, live payment APIs, or cloud infrastructure may be provisioned until the Project Owner grants explicit, written authorization.

---

## 1. System Architecture & High-Level Technology Decisions

ChronoBid Vault requires sub-millisecond concurrency control, zero financial rounding discrepancies, and 99.99% saleroom availability during live auctions. The system employs a **Modular Monolith core** backed by an **Event-Driven Bidding Gateway** to balance high development velocity with high-performance real-time execution.

```
                                  CHRONOBID VAULT PRODUCTION TOPOLOGY
                                  
   [Web Browser / Mobile Client]                 [Specialist / Admin Client]
                |                                             |
                +----------------------+----------------------+
                                       |
                           [Cloudflare Edge Network]
                           (WAF, DDoS, CDN, Turnstile)
                                       |
                      +----------------+----------------+
                      |                                 |
           (HTTPS REST / GraphQL)                 (WSS Real-Time)
                      |                                 |
                      v                                 v
        [Core API Gateway / Auth]           [Live Saleroom Gateway]
           (Node.js / Fastify)               (Fastify WS Monolith / Go Trigger)
                      |                                 |
                      +----------------+----------------+
                                       |
                                       v
                     +-----------------------------------+
                     |       Internal Service Bus        |
                     |         (Redis Pub/Sub)           |
                     +-----------------------------------+
                       /               |               \
                      /                |                \
                     v                 v                 v
            [Auction Engine]   [Vault Ledger Service]  [Settlement Service]
            - Saleroom State   - Double-Entry Engine   - Invoicing
            - Soft-Close Clock - Balance Holds         - Payouts
            - Sequence Numbers - Bank Reconciliation   - Logistics Custody
                     |                 |                 |
                     +-----------------+-----------------+
                                       |
                         [Aurora PostgreSQL Multi-AZ]
                           (ACID Relational Storage)
```

### 1.1 Technology Decisions & Rationale

| Layer | Recommended Technology | Architectural Justification |
| :--- | :--- | :--- |
| **Frontend Web** | Next.js 14 App Router (React, TypeScript, Tailwind) | Preserves the fully verified Phase 2 UI/UX, design tokens, and components; leverages Server Components for SEO and fast initial paint. |
| **Real-Time Saleroom Gateway** | Fastify WebSocket Monolith (Node.js 22 LTS) with Go Extraction Trigger (ADR-P3-001) | End-to-end TypeScript model sharing with frontend; single CI/CD pipeline; 15k+ socket capacity per node. Pre-defined extraction trigger to Go binary if concurrency exceeds 15k sockets or event-loop lag >25ms. |
| **Core Application API** | Node.js (TypeScript / Fastify) | Type-safe shared models with Next.js frontend; modular monolith architecture containing Auth, Consignment, Catalog, and Account domains. |
| **Primary Relational Store** | Amazon Aurora PostgreSQL (Multi-AZ) | Strict ACID compliance, row-level locking (`SELECT ... FOR UPDATE`), JSONB document support for provenance dossiers, and read replicas. |
| **In-Memory Cache & Pub/Sub** | Amazon ElastiCache for Redis (Cluster Mode) | Distributed locking (Redlock), saleroom channel broadcast, session storage, and microsecond-level rate limiting. |
| **Edge & Security Layer** | Cloudflare Enterprise | Edge DDoS mitigation, Web Application Firewall (WAF), global SSL termination, and Cloudflare Turnstile anti-bot verification. |
| **File & Object Storage** | AWS S3 with CloudFront CDN | Secure storage for high-resolution horological photography, movement macro shots, condition reports, and KYC identity documents (encrypted via KMS). |

---

## 2. Production Authentication, Identity & Account Recovery

Phase 2 implemented client-side mock authentication. Phase 3 replaces this with a hardened, enterprise-grade authentication architecture adhering to **OAuth 2.0**, **OpenID Connect (OIDC)**, and **NIST SP 800-63B** digital identity guidelines.

```
                          PRODUCTION GOOGLE OAUTH 2.0 / OIDC FLOW
                          
User Browser               ChronoBid API Gateway             Google Identity Provider
    |                                |                                   |
    |-- 1. Click "Continue with Google" ->                              |
    |                                |-- 2. Generate PKCE & State -----> |
    |<- 3. Redirect to Google Auth URL (with state, code_challenge) ---|
    |                                                                    |
    |-- 4. User Authenticates & Grants Consent ------------------------->|
    |<- 5. Redirect to /api/auth/callback/google (with code & state) ----|
    |                                |                                   |
    |-- 6. Forward Auth Code & State ->                                 |
    |                                |-- 7. Exchange Code via POST ----->|
    |                                |<- 8. Return ID Token & Access ----|
    |                                |-- 9. Verify Google JWKS Signature |
    |                                |-- 10. Check Account Linking Policy|
    |                                |-- 11. Issue HTTP-Only Session JWT |
    |<- 12. Set-Cookie & Redirect ---|                                   |
```

### 2.1 Google OAuth 2.0 / OIDC Production Implementation
1. **Provider Setup:** Configured within Google Cloud Console under a dedicated corporate Organization; authorized redirect URI strictly bound to `https://vault.chronobid.com/api/auth/callback/google`.
2. **State & PKCE Enforcement:**
   - Every auth initiation generates a cryptographically random, single-use `state` parameter (stored in an encrypted, short-lived HTTP-only cookie) to prevent Cross-Site Request Forgery (CSRF).
   - Generates a cryptographically random `code_verifier` and derives a SHA-256 `code_challenge` (Proof Key for Code Exchange — RFC 7636).
3. **Token Verification:**
   - Upon callback reception, the API gateway exchanges the authorization code for tokens directly over backchannel TLS.
   - The Google ID Token JWT is validated against Google's public JSON Web Key Sets (JWKS) (`https://www.googleapis.com/oauth2/v3/certs`), asserting `iss` (`https://accounts.google.com`), `aud` (`CHRONOBID_GOOGLE_CLIENT_ID`), `exp`, and `email_verified: true`.
4. **Account Linking Policy:**
   - If an existing account matches the verified Google email, identity linking is allowed only if the existing account has verified email ownership.
   - If the existing account was created via password and email was unverified, linking is rejected until the user proves password possession to prevent account hijacking.
5. **Session Management:**
   - On successful validation, the server generates an encrypted, signed session token (256-bit AES-GCM) stored in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie.
   - Sessions are indexed in Redis with sliding-window expiration (30-minute idle timeout, 14-day absolute lifetime).
6. **Error & Edge-Case Handling:**
   - Graceful recovery UI for `access_denied`, `invalid_state`, or network timeouts with clear error banners and retry paths.

### 2.2 Production Email PIN Verification & CAPTCHA Service
- **Production CAPTCHA:** Replace the Phase 2 demonstration checkbox with **Cloudflare Turnstile** (or Google reCAPTCHA Enterprise). Frontend embeds the invisible or interactive widget; backend validates the Turnstile response token via secret key POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify` before processing credentials.
- **Production 6-Digit Email PIN:**
  - PIN generation uses cryptographically secure pseudorandom number generators (`crypto.randomInt(100000, 999999)`).
  - PINs are hashed using SHA-256 before storage in Redis with a strict 15-minute Time-To-Live (TTL).
  - Transmission via enterprise transactional email infrastructure (Postmark / SendGrid) with enforced SPF, DKIM, and DMARC alignment.
  - Rate limiting: Maximum 3 attempts per PIN; maximum 3 PIN requests per IP/email per hour.

### 2.3 Account Recovery & Password Reset
- Password reset generates a 256-bit cryptographically secure random token with a 15-minute expiration.
- Reset links use format: `https://vault.chronobid.com/auth/reset-password?token=[TOKEN]`.
- Submitting a new password enforces:
  - Minimum 10 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character.
  - Checks password against the HaveIBeenPwned Compromised Passwords API (k-anonymity model).
  - Hashing using **Argon2id** (memory cost 64MB, 3 iterations, parallelism 1).
  - Invalidation: Changing a password immediately revokes all existing sessions across all devices in Redis.

---

## 3. Server-Authoritative Live Auction & Bidding Architecture

In production, client-side timers and mock bot loops are prohibited. All bidding logic, timer countdowns, soft-close extensions, and lot closures are strictly server-authoritative.

```
                              SERVER-AUTHORITATIVE BIDDING PIPELINE
                              
[Bidder Client]                [Saleroom Gateway]               [Redis / Postgres]
       |                                |                               |
       |-- 1. Submit Bid (WSS Message) ->                              |
       |    {lotId, amount, paddle}     |-- 2. Acquire Distributed Lock |
       |                                |      (Redlock on lotId) ----->|
       |                                |                               |
       |                                |-- 3. Fetch Server NTP Time ---|
       |                                |-- 4. Validate Vault Available |
       |                                |      (Check Redis Ledger) --->|
       |                                |-- 5. Validate Bid Ladder (Tier)
       |                                |                               |
       |                                |-- 6. Evaluate Soft-Close Clock:
       |                                |      - If remaining < 120s    |
       |                                |        & extensions < 10:     |
       |                                |        reset to 120s          |
       |                                |      - If extensions >= 10:   |
       |                                |        no reset (closes at 0) |
       |                                |                               |
       |                                |-- 7. Persist Bid (ACID Tx) -->|
       |                                |      UPDATE lots, bids, holds |
       |                                |-- 8. Release Lock ----------->|
       |                                |                               |
       |<-- 9. WSS Broadcast: New Bid --+-- Broadcast to all Saleroom Clients
       |    {currentBid, nextMin, timer}|                               |
```

### 3.1 Network Time Protocol (NTP) Synchronization
- All saleroom gateway and backend server nodes synchronize their system clocks via AWS Time Sync Service (or Cloudflare Time Services) using PTP/NTP, guaranteeing sub-millisecond clock drift across instances.
- The client receives the server's authoritative epoch timestamp on every WebSocket ping-pong packet to calculate local rendering offsets without drifting.

### 3.2 High-Concurrency Serialization & Distributed Locking
- Multiple bids submitted within the same millisecond are serialized using a **Redis-backed distributed lock (Redlock)** keyed by `lock:lot:[lotId]` with a 500ms safety lease.
- Concurrently, PostgreSQL executes row-level locking:
  ```sql
  SELECT current_bid_usd, status, soft_close_deadline, extension_count 
  FROM lots 
  WHERE lot_id = $1 FOR UPDATE;
  ```
- This guarantees zero race conditions: only one bid can establish the new high ask at any given moment.

### 3.3 Strict Soft-Close Anti-Sniping Enforcement (ADR-012)
The server evaluates incoming bids against the exact rules approved in Phase 1:
```typescript
const nowMs = Date.now();
const deadlineMs = lot.softCloseDeadline.getTime();
const remainingMs = deadlineMs - nowMs;

if (remainingMs <= 0) {
  throw new SaleroomError('BID_REJECTED_AUCTION_CLOSED', 'Auction has closed for this lot.');
}

if (remainingMs < 120000 && lot.extensionCount < 10) {
  // Trigger soft-close reset
  const newDeadline = new Date(nowMs + 120000);
  lot.softCloseDeadline = newDeadline;
  lot.extensionCount += 1;
  broadcastEvent('AUCTION_EXTENDED', { newDeadline, extensionCount: lot.extensionCount });
} else if (remainingMs === 120000) {
  // Boundary condition: accepted, no reset
} else if (lot.extensionCount >= 10) {
  // Hard cap enforced: bid accepted, no reset, definitive close at 00:00:00
}
```

### 3.4 Bid Increment Schedule & Option B Ladder Enforcement (ADR-019)
The server validates bids against the 5-tier schedule (<$10k: +$250; $10k–$49,999: +$1,000; $50k–$99,999: +$2,500; $100k–$249,999: +$5,000; $250k+: +$10,000). Custom bids must land on an exact multiple of the destination tier increment anchored at its lower boundary.

---

## 4. Pre-Funded Vault Financial Ledger & Atomic Reservations

The Pre-Funded Vault prevents default and bad-debt bidding by strictly enforcing that no bid can be submitted unless backed by cleared or eligible funds. In production, this requires an **immutable double-entry bookkeeping ledger** with real-time balance reservations.

```
                              DOUBLE-ENTRY VAULT LEDGER SCHEMA
                              
   [User Vault Balance]                               [Escrow Holding Account]
       $150,000 USD                                         $0 USD
            |                                                 |
            |--- User Bids $40,000 on Lot 01 (Lead) --------->|
            |    Debit: User Available Funds                  |
            |    Credit: User Reserved Funds                  |
            |                                                 |
       $110,000 Available                                 $40,000 Reserved
            |                                                 |
            |<-- Bot Outbids User ($42,500) -------------------|
            |    Debit: User Reserved Funds                   |
            |    Credit: User Available Funds                 |
            |                                                 |
       $150,000 Available                                 $0 Reserved
```

### 4.1 Double-Entry Bookkeeping Principles
- Every financial movement creates two offsetting journal entries (`debit` and `credit`).
- The system balance must always sum to zero: $\sum \text{Debits} - \sum \text{Credits} = 0$.
- Balance rows are never directly mutated with arbitrary updates. Balances represent the materialized aggregate of immutable ledger transactions.

### 4.2 Atomic Reservation & Bid Authorization Transaction
When a user submits a bid, the database transaction executes strictly under **`READ COMMITTED` isolation** adhering to the **Unified Global Lock Acquisition Hierarchy** ($\text{Lots Sorted ASC} \rightarrow \text{Vault Accounts Sorted ASC}$) with session safety timeouts (`lock_timeout = '1500ms'`, `statement_timeout = '3000ms'`):

```sql
BEGIN;
SET LOCAL lock_timeout = '1500ms';
SET LOCAL statement_timeout = '3000ms';

-- 1. Lock target lot first (Hierarchy Level 1: Lots Table)
SELECT current_bid_usd, status, soft_close_deadline, highest_bidder_id 
FROM lots 
WHERE id = $1 FOR UPDATE;

-- 2. Lock relevant vault accounts in strict ascending order of user_id (Hierarchy Level 2)
-- (Locks new bidder and, if applicable, previous leading bidder for outbid fund release)
SELECT user_id, total_balance_usd, reserved_funds_usd, applicable_holds_usd, available_to_bid_usd 
FROM vault_accounts 
WHERE user_id IN ($2, $3) 
ORDER BY user_id ASC FOR UPDATE;

-- 3. Calculate Available to Bid:
-- Available = Total Balance - Reserved Funds - Applicable Holds
-- If attempting incremental reservation > available_to_bid:
-- ROLLBACK immediately and RAISE EXCEPTION 'INSUFFICIENT_VAULT_FUNDS'

-- 4. Post immutable double-entry ledger journal entries
INSERT INTO vault_ledger_entries (id, idempotency_key, account_id, lot_id, amount_usd, entry_type, created_at)
VALUES (gen_random_uuid(), $idempotency_key, $2, $1, $incremental_hold, 'BID_RESERVATION', NOW());

-- 5. Update materialized balance summary
UPDATE vault_accounts 
SET reserved_funds_usd = reserved_funds_usd + $incremental_hold,
    available_to_bid_usd = available_to_bid_usd - $incremental_hold
WHERE user_id = $2;

-- 6. Update lot highest bidder and ask
UPDATE lots 
SET current_bid_usd = $new_bid_usd, 
    highest_bidder_id = $2 
WHERE id = $1;

COMMIT;
```

### 4.3 Multi-Lot Global Affordability Enforcement
Under the Unified Global Lock Acquisition Hierarchy, transactions competing for a bidder's balance across distinct lots (e.g., Lot A and Lot B) lock their respective lot first, and then deterministically serialize on the user's `vault_accounts` record. This guarantees that concurrent bids evaluate sequentially against remaining `available_to_bid_usd`, perfectly executing **Benchmark 2** (₹1,00,000 balance accepts ₹70,000 on Lot A, rejecting concurrent ₹60,000 on Lot B) with zero over-commitment and zero deadlocks. (Detailed relational wait graphs, 11-row locking matrix, and edge-case handling are specified in [`PHASE3_VAULT_LEDGER_DESIGN.md`](file:///c:/Users/kbjee/OneDrive/Desktop/omniroute/auction%20system/PHASE3_VAULT_LEDGER_DESIGN.md#L94-L170)).

### 4.4 Outbid Release & Settlement Holding Lifecycle
- **Outbid Event:** When an incoming bid establishes a new highest bidder, an event `BID_OUTBID` is emitted to the internal message bus. The Vault worker immediately executes an atomic transaction releasing the outbid user's hold back to `Available to Bid` within <100ms.
- **Winning Lot Closure:** When a lot expires at 00:00:00, the winning bidder's reserved funds convert from `BID_RESERVATION` into a permanent `SETTLEMENT_ESCROW_HOLD`. Funds remain held until the invoice is settled or wire funds clear.

---

## 5. International Currencies, Settlement Rules & FX Hedging

ChronoBid Vault operates as a global marketplace with bidders from North America, Europe, Switzerland, the United Kingdom, Japan, Hong Kong, Singapore, and India.

### 5.1 The 4-Tier Currency Model (ADR-026)
1. **Saleroom Auction Currency:** **USD (United States Dollar).** The canonical currency of the auction hammer. All bids, increments, reserves, and catalog baselines exist in USD.
2. **Vault Funding Currency:** The currency deposited by the bidder (USD, EUR, GBP, CHF, etc.).
3. **Display Currency:** The viewer's chosen estimation currency (USD, EUR, GBP, CHF, JPY, HKD, SGD, INR).
4. **Seller Settlement Currency:** The agreed disbursement currency wired to the consignor upon completed sale.

### 5.2 Foreign Exchange (FX) Rate Ingestion Architecture
- In production, display conversion rates are ingested hourly via dual-redundant financial feeds (European Central Bank API + OpenExchangeRates/OANDA).
- Rates are stored in a versioned `exchange_rates` table with validity timestamps.
- **Dual-Currency Invariant:** Converted estimates are always accompanied by the base USD figure:
  ```text
  ₹18,49,540 [EST. DEMO] / $22,000 USD
  ```
- If exchange rate feeds experience network degradation, the display automatically falls back to `[CONVERSION UNAVAILABLE]` while preserving base USD functionality (**TC-VLT-10**).

### 5.3 Settlement Slippage & Owner Decision Requirement
Between the fall of the hammer and final bank wire clearance (typically 48–72 hours), foreign currency rates fluctuate. The Project Owner must formally select one of two production settlement models:
- **Model A (USD Settlement Only):** International buyers settle invoices strictly in USD. The buyer's bank handles foreign conversion, meaning the buyer bears 100% of currency fluctuation risk.
- **Model B (Guaranteed FX Rate Lock):** ChronoBid Vault locks the converted rate displayed at the fall of the hammer for 48 hours. To mitigate downside risk, ChronoBid charges a 1.25% currency risk buffer or utilizes payment gateway forward rate locking (Adyen Guaranteed FX).

---

## 6. Payment Gateways, Custodial Escrow & Armored Transit Evaluation

The platform requires infrastructure capable of handling high-value transactions ($10,000 to $1,000,000+ per timepiece). Standard credit card processing is unsuitable for high-ticket horology due to interchange fees (2.9%), chargeback fraud, and credit limits.

### 6.1 Payment Provider Evaluation Matrix

| Provider | Supported Rails | Best Suited For | Processing Fees | Risk & Fraud Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Adyen** | Global Cards, SEPA, iDEAL, ACH, Wire, Multi-Currency Accounts | International buyers, card deposits under $25,000, European bank rails | ~1.1% + €0.10 for EU cards; 0.5% for bank transfers | Advanced RevenueProtect, behavioral risk profiling, 3DS2 |
| **Stripe (Connect + Treasury)** | Cards, ACH Direct Debit, Financial Connections | US buyer deposits, instant bank verification | 0.8% ($5 cap) on ACH; 2.9% on cards | Stripe Radar, identity verification integration |
| **Modern Treasury** | Fedwire, Real-Time Payments (RTP), ACH, CHIPS | High-value settlement wires ($50,000 to $1,000,000+) | Flat fee per wire ($10–$25) | Direct integration into major money-center banks (JPMorgan, BofA) |
| **Escrow.com API** | Licensed Escrow Wire & Custody | Buyers demanding third-party fiduciary protection | 0.89% to 3.25% depending on volume | Licensed, bonded escrow agent; statutory buyer inspection periods |

### 6.2 Physical Custody & Armored Logistics Evaluation
In compliance with ADR-017, custody and transit were classified as proposed future services in Phase 2. For Phase 3 implementation, partnership agreements must be established with accredited fine horology logistics operators:

| Custody Partner | Operational Capabilities | Vault Locations | Insurance & Underwriting |
| :--- | :--- | :--- | :--- |
| **Malca-Amit** | Ultra-high-security vaulting, specialist horological handling, bonded freeports | Geneva, London, New York, Zurich, Singapore, Hong Kong | Lloyd's of London full all-risk coverage from intake to buyer handover |
| **Brink's Global Services** | Armed armored transit, secure warehousing, customs clearance | Global network across 100+ countries | Comprehensive bullion and high-value precious cargo insurance |
| **Ferrari Logistics** | Bespoke luxury watch and jewelry white-glove transport | Global horology hubs | Specialized fine watch transit insurance and customs ATA Carnet management |

---

## 7. Security Threat Model, Anti-Fraud & Regulatory Compliance

ChronoBid Vault's high transaction values make it a prime target for automated snipers, money laundering, credential stuffing, and shill bidding.

### 7.1 STRIDE Threat Analysis & Mitigations

| Threat Domain | Specific Threat Vector | Production Countermeasure |
| :--- | :--- | :--- |
| **Spoofing** | Compromised user paddle; fake bidder accounts | WebAuthn/FIDO2 hardware keys, mandatory 2FA on bids >$25,000, Cloudflare Turnstile anti-bot checks. |
| **Tampering** | Intercepting WebSocket bid messages to forge asks | WSS mutual TLS, HMAC-SHA256 request signing using session key, server-authoritative validation. |
| **Repudiation** | Winning bidder claims they did not submit the bid | Immutable, write-once append-only audit trail logging client IP, User-Agent, TLS fingerprint, and timestamp. |
| **Information Disclosure** | Competitors scraping confidential proxy bidding ceilings | Proxy ceilings are encrypted at rest (AES-256) and never broadcast via WebSocket or public APIs. |
| **Denial of Service** | DDoS attacks during final 2 minutes of auction | Cloudflare Magic Transit, DDoS edge rate limiting, dedicated WebSocket origin shielding. |
| **Elevation of Privilege** | Buyer exploiting API to unlock specialist appraisal tools | Role-Based Access Control (RBAC) enforced via cryptographically signed JWT claims with database permission checks. |

### 7.2 Anti-Fraud & Shill Bidding Prevention
- **Self-Consignment Bidding Prohibition:** Consignors and their verified corporate affiliates are mathematically blocked from bidding on their own lots by cross-referencing KYC tax IDs, physical addresses, bank account numbers, and IP/device fingerprints.
- **Bid Velocity Limits:** The saleroom gateway restricts individual paddles to a maximum of 1 bid per 2.0 seconds, preventing algorithmic flooding designed to crowd out human bidders.

### 7.3 KYC / AML & Regulatory Compliance Framework
To comply with the **EU 5th Anti-Money Laundering Directive (5AMLD)**, the **US Bank Secrecy Act / FinCEN regulations on antiquities and high-value goods**, and **UK Money Laundering Regulations**, ChronoBid Vault enforces tiered Know-Your-Customer verification:
- **Tier 1 (Bidding up to $10,000 USD):** Standard email and phone verification + basic credit card identity check.
- **Tier 2 (Bidding $10,000 to $100,000 USD):** Automated government ID verification (passport/driving license) + biometric liveness check via **Persona** or **Stripe Identity**.
- **Tier 3 (Bidding $100,000+ USD):** Enhanced Due Diligence (EDD) including proof of address (utility bill <3 months old), Source of Wealth documentation, and manual compliance officer review against global PEP (Politically Exposed Persons) and OFAC sanctions lists.

---

## 8. Relational Data Model & Infrastructure Specification

### 8.1 Core PostgreSQL Relational Schema Architecture

```sql
-- Core User & Identity
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable for pure OAuth users
    paddle_number VARCHAR(10) UNIQUE NOT NULL,
    kyc_tier INT DEFAULT 1,
    is_consignor_enabled BOOLEAN DEFAULT FALSE,
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-Funded Vault Materialized Account
CREATE TABLE vault_accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(user_id),
    total_balance NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
    reserved_funds NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
    applicable_holds NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    version INT DEFAULT 1, -- Optimistic locking counter
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immutable Double-Entry Ledger
CREATE TABLE vault_ledger_entries (
    entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES vault_accounts(account_id),
    lot_id UUID, -- Nullable for direct deposits/withdrawals
    entry_type VARCHAR(50) NOT NULL, -- DEPOSIT, WITHDRAWAL, BID_RESERVATION, BID_RELEASE, SETTLEMENT_PAYMENT
    amount NUMERIC(16, 2) NOT NULL,
    running_balance NUMERIC(16, 2) NOT NULL,
    reference_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saleroom Lots & Soft-Close State
CREATE TABLE lots (
    lot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Horology, Fine Art, Rare Spirits, Jewelry
    starting_bid_usd NUMERIC(16, 2) NOT NULL,
    current_bid_usd NUMERIC(16, 2) NOT NULL,
    highest_bidder_id UUID REFERENCES users(user_id),
    soft_close_deadline TIMESTAMPTZ NOT NULL,
    extension_count INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'UPCOMING', -- UPCOMING, LIVE, CLOSED_SOLD, CLOSED_UNSOLD
    consignor_id UUID REFERENCES users(user_id),
    reserve_price_usd NUMERIC(16, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authoritative Bid Stream
CREATE TABLE bids (
    bid_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_id UUID REFERENCES lots(lot_id),
    bidder_id UUID REFERENCES users(user_id),
    amount_usd NUMERIC(16, 2) NOT NULL,
    server_timestamp TIMESTAMPTZ DEFAULT NOW(),
    is_extension_trigger BOOLEAN DEFAULT FALSE,
    sequence_number BIGSERIAL NOT NULL
);
```

### 8.2 Production Cloud Infrastructure Layout (AWS Deployment)
- **VPC Configuration:** Multi-AZ Virtual Private Cloud across 3 Availability Zones (`eu-central-1` Frankfurt or `us-east-1` N. Virginia).
- **Public Subnet:** Cloudflare-shielded Application Load Balancers (ALB) terminating HTTPS and WSS traffic.
- **Private App Subnet:** Containerized services running on **AWS ECS Fargate** with auto-scaling based on CPU and WebSocket connection count.
- **Private Data Subnet:** Isolated database subnet housing **Amazon Aurora PostgreSQL Multi-AZ** cluster and **ElastiCache Redis Cluster**.
- **Observability:** Centralized structured logging via **Datadog** (or AWS CloudWatch), distributed APM tracing, and real-time alerts for saleroom clock jitter >50ms.

---

## 9. Comprehensive Testing Strategy & Quality Assurance

Transitioning to production requires an exhaustive quality verification matrix:

1. **Unit & Mathematical Testing:** 100% test coverage over ledger math, currency multipliers, bid increment tier boundaries, and soft-close edge branches.
2. **Integration Testing (Testcontainers):** Automated integration suites running against real Dockerized PostgreSQL and Redis instances, verifying transaction rollbacks on concurrent bids.
3. **High-Concurrency Load Testing (k6 / Artillery):**
   - Simulated stress test: 10,000 concurrent WebSocket connections observing a saleroom.
   - 500 concurrent bids submitted within a 100ms window preceding a soft-close deadline.
   - Acceptance threshold: Zero deadlocks, zero negative balances, 99.9th percentile latency < 150ms.
4. **Chaos Engineering & Resilience:** Simulating sudden Redis node failover during an active auction; asserting that Aurora PostgreSQL retains the authoritative state and recovers live countdowns without auction disruption.
5. **Independent Penetration Testing:** Third-party CREST-accredited security audit evaluating OWASP Top 10, authentication bypass, and rate-limiting evasion.

---

## 10. Proposed Implementation Roadmap & Phase Sequencing

Phase 3 establishes the architectural blueprint. Subsequent execution is broken down into structured, sequential phases:

```
+---------------------------------------------------------------------------------------------------------+
|                                    CHRONOBID VAULT ROADMAP PHASES                                       |
|                                                                                                         |
|  [Phase 1 & 1.5] -> [Phase 2] -> [Phase 3] -> [Phase 4] -> [Phase 5] -> [Phase 6] -> [Phase 7] -> [Phase 8]
|     Approved          Closure       Design        Auth &      Ledger &      Saleroom     Logistics    Audit &
|     Baseline          Handoff      Blueprint     Database     Payments      Gateway       Custody     Launch
+---------------------------------------------------------------------------------------------------------+
```

| Phase | Phase Title | Deliverables | Governance Exit Criteria |
| :--- | :--- | :--- | :--- |
| **Phase 3** *(Current)* | Production Architecture, Security & Financial Systems Design | Architecture blueprints, threat models, ledger schemas, decision registers. | Formal Owner approval of Phase 3 design; zero code generated. |
| **Phase 4** | Core Services, Auth & Database Implementation | PostgreSQL schemas, migrations, OAuth 2.0 / OIDC services, Turnstile CAPTCHA. | Automated test suite passes; zero mock auth remaining. |
| **Phase 5** | Pre-Funded Vault Ledger, Payment Rails & Banking | Double-entry ledger engine, Adyen/Stripe integration, bank wire webhooks. | Financial reconciliation tests pass with 0.00% rounding error. |
| **Phase 6** | Real-Time Saleroom Engine & WebSocket Gateway | Go/Node WebSocket cluster, NTP clock sync, Redlock serialization, live soft-close. | k6 load test passes with 10k concurrent users and 0 race conditions. |
| **Phase 7** | Consignment, Custody & Physical Provenance | Malca-Amit/Brink's API integration, condition report vaulting, automated payouts. | Logistics partner sign-off and live transit tracking tests. |
| **Phase 8** | Security Audits, Pen Testing & Pilot Auction | Third-party CREST pen test, SOC2 audit readiness, private dry-run pilot auction. | Zero critical/high CVEs; formal owner authorization for public launch. |

---

## 11. Workstream Summary: Deliverables, Dependencies & Owner Gates

| Workstream | Key Deliverable | Technical Dependencies | Decisions Required from Owner | Exit Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **WS-1: Authentication** | Production OIDC & Session Engine | Google Cloud OAuth Credentials | Confirm Auth0/Clerk vs. Custom Fastify/NextAuth | Automated OAuth & PIN tests pass 100% |
| **WS-2: Vault Ledger** | ACID Double-Entry Ledger Engine | PostgreSQL Aurora Cluster | Choose primary banking rails (Adyen vs. Stripe) | Zero balance discrepancy across 100k transactions |
| **WS-3: Live Saleroom** | Server-Authoritative WSS Cluster | Redis ElastiCache Multi-AZ | Confirm 120s extension & 10-cap for production | Sub-150ms broadcast latency under 10k connections |
| **WS-4: Currency & FX** | Live Exchange Rate Ingestion Worker | ECB / OANDA API Accounts | Select Model A (USD settlement) vs. Model B (FX Lock) | Automatic rate updates & fallback assertions |
| **WS-5: Custody & Escrow**| Physical Custody Tracking Service | Malca-Amit / Brink's Contracts | Select primary physical vault partner | Provenance documentation workflow operational |

---
*Blueprint compiled and submitted by the Senior Project Manager, ChronoBid Vault.*  
*Timestamp: 2026-10-20T05:37:00Z*
