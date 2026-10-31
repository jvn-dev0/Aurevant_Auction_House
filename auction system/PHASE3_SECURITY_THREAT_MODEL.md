# ChronoBid Vault — Production Security Threat Model & Control Matrix
## STRIDE Analysis, Authentication Architecture & Defensive Verification

> **Document Type:** Production Security Threat Model, Risk Assessment & Verification Matrix  
> **Project:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Working Directory:** `C:\Users\kbjee\OneDrive\Desktop\omniroute\auction system`  
> **Date:** 20 October 2026  
> **Author:** Chief Information Security Officer (CISO), Security Architect, Senior Project Manager  
> **Status:** **PROPOSED — PENDING PROJECT OWNER APPROVAL**  
> **Compliance Disclaimer:** **DOCUMENTING THESE CONTROLS DOES NOT IMPLY LEGAL OR REGULATORY COMPLIANCE UNTIL QUALIFIED INDEPENDENT AUDIT VERIFICATION IS COMPLETE.**  

---

## 1. Information Assets & Trust Boundaries

ChronoBid Vault secures high-value digital and financial assets across multiple threat perimeters:

```
+---------------------------------------------------------------------------------------------------------+
|                                  TRUST BOUNDARY & ASSET PERIMETER                                       |
|                                                                                                         |
|   [ZONE 0: Untrusted Public Internet]                                                                   |
|   - Anonymous website visitors, bidders, automated web scrapers, malicious botnets                      |
|                                                                                                         |
|   ======= [TRUST BOUNDARY 1: Cloudflare Edge Perimeter (WAF, DDoS, Turnstile)] =======                 |
|                                                                                                         |
|   [ZONE 1: Authenticated Client Sessions]                                                               |
|   - Registered Bidders (Paddle Holders), Verified Consignors, Session Cookies                           |
|                                                                                                         |
|   ======= [TRUST BOUNDARY 2: Application API Gateway (TLS 1.3, JWT Claims, RBAC)] ======                |
|                                                                                                         |
|   [ZONE 2: Internal Application Core (Private Subnet)]                                                 |
|   - Saleroom WebSocket Pods, Core API Fastify Pods, Redis Pub/Sub Cluster                              |
|                                                                                                         |
|   ======= [TRUST BOUNDARY 3: Data & Financial Storage (Encrypted at Rest, KMS)] ======                 |
|                                                                                                         |
|   [ZONE 3: Crown Jewels Storage (Isolated VPC Subnet)]                                                  |
|   - Pre-Funded Vault Double-Entry Ledger, User KYC Documents, Bank Accounts, Audit Logs                |
+---------------------------------------------------------------------------------------------------------+
```

### 1.1 High-Value Assets Identified
1. **Asset A1 — Pre-Funded Vault Balances & Ledger Records:** Tampering or unauthorized balance mutations directly result in catastrophic financial loss or bad-debt auctions.
2. **Asset A2 — Saleroom Auction Clock & Bidding Stream:** Manipulation of countdown timers or sequence numbers enables auction sniping or illegitimate hammer falls.
3. **Asset A3 — Confidential Proxy Bidding Ceilings:** Premature disclosure of a collector's maximum proxy ceiling gives unfair bidding intelligence to competing bidders or corrupt consignors.
4. **Asset A4 — KYC Identity & Banking Documentation:** Government passports, proof of address, and wire details subject to statutory data protection regulations (GDPR, Swiss FADP, CCPA).
5. **Asset A5 — Item Provenance & Condition Vault Dossiers:** Authentication certificates, master watchmaker inspection reports, and serial numbers.

---

## 2. Authentication Evaluation: Managed Provider vs. Self-Hosted

Before implementing authentication, the architecture evaluates managed vs. self-hosted options without prematurely locking into a vendor:

| Evaluation Dimension | Managed Identity (Auth0 / Clerk / AWS Cognito) | Self-Hosted Identity (NextAuth / Fastify Auth / Ory) |
| :--- | :--- | :--- |
| **Google OAuth / OIDC** | Turnkey configuration via administrative console; automated JWKS rotation and token exchange. | Requires building and maintaining custom OIDC state/PKCE verification, JWKS caching, and token handling. |
| **Passkeys / WebAuthn** | Built-in FIDO2/WebAuthn biometric support with automated credential sync. | Requires implementing FIDO2 server libraries (`@simplewebauthn/server`) and credential storage. |
| **Security Maintenance** | Security patches, CVE mitigations, and brute-force detection managed 24/7 by vendor SOC. | Engineering team bears 100% responsibility for zero-day vulnerabilities, rate-limiting rules, and session cluster patching. |
| **Compliance Audits** | Inherits vendor SOC 2 Type II, ISO 27001, and HIPAA compliance attestations. | All auth components must be individually audited during independent penetration tests. |
| **Data Sovereignty** | User identity metadata stored in vendor multi-tenant cloud (EU data residency available). | 100% on-premises / private VPC data sovereignty; zero external data transit. |
| **Cost Profile** | Pay-as-you-go: ~$0.02 to $0.10 per Monthly Active User (MAU); ~$500–$2,000/mo at scale. | Zero per-user SaaS license fees; pure infrastructure compute cost. |

### Architectural Recommendation (Option for Owner Decision DEC-P3-002)
- **Primary Recommendation:** **Managed Identity Provider (Clerk Enterprise or Auth0)** for the initial production platform. High-value horology platforms require impeccable, bank-grade authentication with zero friction for wealthy collectors. Offloading OIDC credential handling, Passkey biometrics, and brute-force shielding reduces operational attack surface and accelerated audit readiness.
- **Alternative:** Self-hosted Ory Kratos or Fastify Auth if strict internal enterprise sovereignty policies prohibit third-party user identity stores.

---

## 3. STRIDE Threat Analysis & Production Control Matrix

Every critical security control is detailed below with its targeted threat, required behavior, verification method, and acceptance criterion:

```
+---------------------------------------------------------------------------------------------------------+
|                                       STRIDE THREAT MAPPING                                             |
|                                                                                                         |
|   S - Spoofing Identity          ---> WebAuthn 2FA, Signed OIDC Tokens, PKCE Validation                 |
|   T - Tampering with Data        ---> HMAC Message Signatures, Immutable Double-Entry Ledger, WSS TLS   |
|   R - Repudiation                ---> Write-Once Audit Logs, Signed Bid Sequence Numbers                |
|   I - Information Disclosure     ---> AES-256 Encrypted Proxy Ceilings, Field-Level KYC Redaction       |
|   D - Denial of Service          ---> Cloudflare Edge DDoS Shield, Saleroom WebSocket Rate Limits       |
|   E - Elevation of Privilege     ---> Cryptographically Bound JWT Scopes, Role-Based Access (RBAC)      |
+---------------------------------------------------------------------------------------------------------+
```

### Control 1: Google OAuth 2.0 / OIDC Flow Security (Threat: Spoofing & CSRF)
- **Threat Addressed:** Man-in-the-Middle (MitM) session injection, replay attacks, and cross-site authorization code theft.
- **Required Behavior:**
  1. The API gateway generates a 256-bit cryptographic random `state` nonce and a SHA-256 PKCE `code_challenge`.
  2. The `state` is stored in an encrypted, short-lived HTTP-only cookie (`__Host-cbv-auth-state`).
  3. Upon callback reception at `/api/auth/callback/google`, the backend verifies that the received state matches the cookie nonce.
  4. The Google ID Token JWT is cryptographically validated against Google's public JWKS endpoints, asserting signature, `iss`, `aud`, expiration, and `email_verified: true`.
- **Verification Method:** Automated security integration test simulating mismatched state tokens, expired tokens, forged signatures, and non-verified Google emails.
- **Acceptance Criterion:** Any token with an invalid signature, mismatched state, or unverified email is rejected with HTTP 401 Unauthorized; zero account creation or session issuance occurs (**PASS / FAIL**).

### Control 2: Account Linking & Hijacking Prevention (Threat: Account Takeover)
- **Threat Addressed:** Attacker creates a Google account using a victim's email address and attempts to hijack an existing ChronoBid Vault account that was created via email/password.
- **Required Behavior:**
  1. If an incoming Google OIDC email matches an existing account, the system checks whether the existing account has verified email ownership.
  2. If verified, linking proceeds only if the Google token explicitly asserts `email_verified: true`.
  3. If the existing account email is unverified, automated linking is blocked; the user must log in via password first, and then explicitly link Google via account settings.
  4. Notification: A security alert email is immediately dispatched to the account email notifying them that Google authentication was linked.
- **Verification Method:** Integration test simulating pre-existing unverified email collision against an incoming verified Google token.
- **Acceptance Criterion:** Unverified accounts are protected from automated OAuth takeover; linking requires active credential re-authentication (**PASS / FAIL**).

### Control 3: Server-Verified Anti-Bot Protection (Threat: Automated Sniping & DoS)
- **Threat Addressed:** Automated sniper bots flooding the saleroom in the final seconds to starve human collectors of bandwidth or manipulate bids.
- **Provider Capability vs. Application Behavior:**
  1. **Official Provider Capabilities (Cloudflare Turnstile):**
     - Client renders the Turnstile widget, which generates an ephemeral `cf-turnstile-response` token.
     - Backend server validates the token via HTTPS POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with the secret key and client token.
     - **Provider Constraint (Verified by Cloudflare Documentation):** Turnstile tokens are valid for **exactly 300 seconds (5 minutes)** and are **strictly single-use** (cannot be validated twice). Cloudflare provides *no native concept* of an extended "two-hour session claim."
  2. **Proposed Application-Level Verification Architecture:**
     - The "elevated bidding claim" is an **internal application cache construct in Redis**, not a native Turnstile feature.
     - Turnstile tokens are validated by the backend at: (a) registration, (b) login, (c) initial saleroom entry, and (d) before placing bids if the application claim has expired.
     - Upon successful verification of a fresh Turnstile token at saleroom entry, the backend stores an application-level claim in Redis (`bot_verified:session:{sessionId}`) with a 30-minute sliding TTL.
     - **Accessibility Accommodation & Multi-Factor Abuse Scoring:**
       - **Strict Prohibition on Monolithic Mouse/Speed Disqualification:** The platform must **NEVER** classify a user as a bot or block a bid solely because of rapid input dispatch or zero mouse movement. Touchscreen devices (mobile/tablets), keyboard-only navigation (Tab + Enter), and assistive screen readers naturally emit zero mouse vector entropy.
       - Bot risk scoring evaluates a holistic combination of server-side signals:
         1. Missing or inconsistent HTTP client hints (`Sec-CH-UA`).
         2. Non-browser TLS fingerprints (JA3/JA4 signatures matching python-requests, cURL, or Go HTTP clients).
         3. Headless automation environment flags (`navigator.webdriver === true`, missing WebGL vendor).
         4. Saleroom WebSocket rate limits (hard throttle capped at 3 bids/sec per authenticated user).
     - **False-Positive Recovery:** If risk scoring flags suspicious telemetry, the application claim is invalidated to prompt a seamless background non-interactive Turnstile challenge. If an interactive challenge is required, the user's pending bid is held in an active grace queue (+30s soft-close buffer) to prevent unfair lockout.
- **Verification Method:** Headless Playwright script attempting rapid-fire bid submissions with missing, expired (>300s), replayed, and synthetic Turnstile tokens.
- **Acceptance Criterion:** 100% of submissions with invalid, expired, or replayed Turnstile tokens are rejected with HTTP 403 Forbidden (**PASS / FAIL**).

### Control 4: WebSocket Authentication, CSWSH Defense & Ticket Handshake (Threat: Hijacking & Spoofing)
- **Threat Addressed:** Cross-Site WebSocket Hijacking (CSWSH), token leakage via URLs, and unauthorized saleroom stream access.
- **Required Behavior:**
  1. **No Long-Lived Credentials in URLs:** Passwords, JWTs, and session secrets are strictly prohibited in WebSocket query parameters or URLs.
  2. **Short-Lived Ticket Issuance:** An authenticated client performs an HTTPS POST to `/api/auth/ws-ticket`. The server verifies the session and generates a single-use UUIDv4 ticket stored in Redis with a **15-second TTL**, bound to `{ user_id, session_id, client_ip, user_agent_hash }`.
  3. **Strict Origin Header Validation:** During the HTTP `Upgrade` request to `wss://saleroom.chronobid.com/ws?ticket=<UUID>`, the gateway strictly validates the `Origin` header against the allowlist (`https://chronobid.com`). Mismatched or absent `Origin` headers are rejected with HTTP 403 Forbidden.
  4. **Atomic Single-Use Redemption:** The WebSocket server executes an atomic Redis `GETDEL` on the ticket. If found, verified against client IP and user-agent hash, and deleted in the same operation, the connection upgrades. Replayed or expired tickets receive an immediate close frame with status 4401 (`Unauthorized`).
  5. **Session Revocation & Reconnection:** Ticket issuance is rate-limited to 5 requests per user per minute. User logout or administrative ban triggers a Redis Pub/Sub message `SESSION_REVOKED:{sessionId}`, immediately terminating all matching active sockets. Clean client reconnects must request a fresh 15-second ticket via HTTPS.
- **Verification Method:** Security test attempting cross-origin WebSocket connections, replayed tickets, expired tickets (>15s), and connections from mismatched IP addresses.
- **Acceptance Criterion:** Cross-origin handshakes and replayed tickets are rejected 100% of the time; tickets expire definitively after 15 seconds (**PASS / FAIL**).

### Control 5: Saleroom WebSocket Concurrency & Race Condition Defense (Threat: Tampering & Desync)
- **Threat Addressed:** Two competing bids submitted at the identical millisecond producing split-brain state, negative Vault balances, or improper extension counters.
- **Required Behavior:**
  1. Every incoming bid must acquire a distributed Redis lock (`lock:lot:[lotId]`) with a 500ms safety lease.
  2. Concurrently, PostgreSQL executes the **Global Lock Acquisition Hierarchy**:
     - Lock target lot first: `SELECT current_bid_usd, status, soft_close_deadline, extension_count FROM lots WHERE lot_id = $1 FOR UPDATE`.
     - Lock relevant user account(s) second in ascending `user_id` order: `SELECT * FROM vault_accounts WHERE user_id IN ($2, $3) ORDER BY user_id ASC FOR UPDATE`.
  3. The server compares its authoritative NTP timestamp against the lot's `soft_close_deadline`.
  4. Bids arriving strictly after `soft_close_deadline` (<= 0ms) are rejected with `BID_REJECTED_AUCTION_CLOSED`.
  5. Valid bids with <120s remaining reset the deadline to `server_now + 120s` and increment the extension counter, capped at 10 extensions (ADR-012).
- **Verification Method:** Load testing via k6 simulating 50 concurrent bid requests arriving within a 10-millisecond window at 00:00:05 before deadline.
- **Acceptance Criterion:** Exactly one bid is awarded the lead; subsequent bids are evaluated against the newly established ask; zero race conditions; clock extends exactly per ADR-012 (**PASS / FAIL**).

### Control 6: Pre-Funded Vault Atomic Balance Enforcement (Threat: Financial Tampering & Over-Commitment)
- **Threat Addressed:** Malicious or rapid concurrent bidding committing funds beyond the buyer's available Vault balance across multiple lots.
- **Required Behavior:**
  1. Bidding triggers an atomic PostgreSQL transaction at **`READ COMMITTED` isolation with row-level locks** (`FOR UPDATE`).
  2. The target lot is locked first, followed by the user's `vault_accounts` record locked second (Global Lock Hierarchy).
  3. Formula: $\text{Available to Bid} = \text{Total Balance} - \text{Reserved Funds} - \text{Holds}$.
  4. The required incremental reservation is compared against `Available to Bid`.
  5. If insufficient, transaction rolls back immediately and emits an `INSUFFICIENT_FUNDS` alert; no ask is updated.
- **Verification Method:** Automated concurrency test executing simultaneous $70,000 bid on Lot A and $60,000 bid on Lot B against a ₹1,00,000 (~$1,189 USD) balance.
- **Acceptance Criterion:** First bid succeeds; second bid is rejected with 100% consistency; balance cannot drop below zero (**PASS / FAIL**).

### Control 7: Immutable Double-Entry Ledger & Anti-Repudiation (Threat: Repudiation & Fraud)
- **Threat Addressed:** Rogue administrator or compromised worker directly altering balance integers; winning bidder falsely repudiating commitment.
- **Required Behavior:**
  1. The database strictly disallows `UPDATE` and `DELETE` queries on the `vault_ledger_entries` table via PostgreSQL table rules / trigger constraints.
  2. Balance state is derived strictly from append-only journal records.
  3. Every bid log entry records the bidder's paddle, client IP, TLS fingerprint, server NTP timestamp, and sequence number.
  4. Daily automated reconciliation script verifies $\sum \text{Debits} - \sum \text{Credits} = 0.00$.
- **Verification Method:** Automated database test attempting an `UPDATE` on a ledger entry; automated daily reconciliation dry-run with injected imbalance.
- **Acceptance Criterion:** Any attempt to update a ledger entry raises a SQL exception; any imbalance > $0.00 triggers an automated P1 security alert to the engineering team (**PASS / FAIL**).

### Control 8: Self-Consignment & Shill Bidding Prevention (Threat: Market Manipulation)
- **Threat Addressed:** A watch consignor bidding on their own timepiece to artificially inflate the hammer price.
- **Required Behavior:**
  1. When a bid is submitted, the system checks the lot's `consignor_id`.
  2. If `bidder_id === consignor_id`, the bid is instantly rejected with `SHILL_BID_PROHIBITED`.
  3. Secondary check: Cross-references user identity records, tax IDs, payout bank account IBAN/routing numbers, and matching IP/device fingerprints between consignor and bidder.
- **Verification Method:** Integration test where a registered consignor attempts to place a bid on their approved lot using both their primary paddle and a secondary linked account.
- **Acceptance Criterion:** 100% of self-bidding attempts are blocked prior to saleroom broadcast; incident logged in security audit stream (**PASS / FAIL**).

### Control 9: Secrets Management & Cryptographic Hygiene (Threat: Information Disclosure)
- **Threat Addressed:** Leakage of database credentials, OAuth client secrets, or private keys in source code or server logs.
- **Required Behavior:**
  1. Zero plain-text secrets in repository code or environment files.
  2. Secrets managed via **AWS Secrets Manager** or **HashiCorp Vault** with automated 90-day rotation.
  3. Sensitive customer fields (passwords, bank account IBANs, tax IDs) are encrypted at rest using AES-256 with keys managed in AWS KMS.
  4. Passwords hashed strictly with **Argon2id** (memory cost 64MB, 3 iterations, 1 parallelism).
- **Verification Method:** Automated CI secret scanning (TruffleHog / GitGuardian) and automated KMS decryption test.
- **Acceptance Criterion:** Zero detected secrets in codebase; unauthorized access to raw database yields encrypted cipher text (**PASS / FAIL**).

---

## 4. Role-Based Access Control (RBAC) & Administrative Guardrails

The production system enforces four strictly segregated authorization roles:

| Role Name | Permissions & Capabilities | Security Guardrails & Restrictions |
| :--- | :--- | :--- |
| **Exploring User (Guest)** | Read catalog, inspect lots, simulate currency, view live saleroom stream. | Zero bidding; zero watchlist writes; zero consignment submissions. |
| **Registered Buyer** | All Guest permissions + submit bids (subject to Vault eligibility), fund Vault, save watchlists. | Blocked from specialist inspection tools; blocked from bidding on own consignments. |
| **Verified Consignor** | All Buyer permissions + submit items for consignment, review appraisal tickets, agree to reserve prices. | Requires completed Tier 2 KYC; blocked from bidding on own consignments. |
| **Specialist / Administrator** | Manage catalog, approve reserves, oversee saleroom pauses, issue manual reconciliation entries. | **Mandatory Hardware Token MFA (YubiKey / WebAuthn)**; IP allowlisted; all actions logged to immutable write-once audit log; blocked from placing bids on platform. |

---

## 5. Security Logging, Auditing & Incident Response Protocol

### 5.1 Centralized Structured Audit Logging
- Every authentication attempt, bid submission, Vault balance change, and administrative action emits a structured JSON log to **AWS CloudWatch Logs / Datadog**.
- Log schema contains: `timestamp`, `trace_id`, `event_type`, `user_id`, `paddle_number`, `ip_address`, `user_agent`, `lot_id`, `amount_usd`, `result_status`.
- Sensitive data masking: Credit card numbers, passwords, and raw identity documents are strictly redacted prior to log emission.

### 5.2 Automated Security Alerts
Real-time monitoring triggers P1 Slack/PagerDuty alerts upon:
1. Five consecutive failed logins on an administrative account within 10 minutes.
2. Any ledger discrepancy where debits do not equal credits.
3. NTP clock drift exceeding 25ms between saleroom gateway nodes.
4. Bidding velocity exceeding 3 bids per second from a single IP address.

---

## 6. Security Assurance & Governance Sign-Off

> **THREAT MODEL STATUS:** **PROPOSED — PENDING OWNER APPROVAL**  
> **NEXT GOVERNANCE ACTION:** Review of security control matrix and selection of managed vs. self-hosted auth.  
> **LEGAL NOTE:** This threat model outlines defensive architecture; formal compliance with PCI-DSS, SOC 2, and 5AMLD requires independent accredited third-party auditing.

---
*Certified by Chief Information Security Officer (CISO), ChronoBid Vault.*  
*Timestamp: 2026-10-20T06:05:00Z*
