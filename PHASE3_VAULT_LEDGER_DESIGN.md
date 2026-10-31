# ChronoBid Vault — Production Pre-Funded Vault & Financial Ledger Design
## Double-Entry Accounting, Atomic Concurrency & Balance Eligibility Invariants

> **Document Type:** Production Financial Ledger Specification & Concurrency Architecture  
> **Project:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Working Directory:** `C:\Users\kbjee\OneDrive\Desktop\omniroute\auction system`  
> **Date:** 20 October 2026  
> **Author:** Senior Financial Systems Analyst, Principal Software Architect, Senior Project Manager  
> **Status:** **PROPOSED — PENDING PROJECT OWNER APPROVAL**  
> **Governance Directive:** **THIS SPECIFICATION DEFINES FINANCIAL SYSTEM REQUIREMENTS; NO MONEY MOVED OR INTEGRATIONS CREATED.**  

---

## 1. Executive Summary & Core Product Invariant

The defining operational principle of ChronoBid Vault is that **no bid can be accepted unless backed by financially eligible, verified funds**. The platform eliminates bad-debt bidding, default defaults, and post-hammer insolvency through a pre-funded Vault balance model.

In Phase 2, this was demonstrated client-side using JavaScript state machines and `sessionStorage`. In Phase 3, the Pre-Funded Vault is designed as an **enterprise-grade, bank-compliant double-entry financial ledger** with **sub-millisecond atomic reservation transactions**, **strict concurrency serialization**, and **automated bank statement reconciliation**.

```
+---------------------------------------------------------------------------------------------------------+
|                                  PRE-FUNDED VAULT CORE FORMULA                                          |
|                                                                                                         |
|       Available to Bid = Total Vault Balance - Reserved Funds - Applicable Holds                        |
|                                                                                                         |
|   - Total Vault Balance: Total cleared and recorded funds owned by the collector.                       |
|   - Reserved Funds: Sum of all active leading bids across open lots + won lots awaiting invoice.        |
|   - Applicable Holds: Pending deposit clearance holds, compliance/AML review holds, or dispute holds.   |
|   - Available to Bid: Real-time headroom available to place new bids or increase existing bids.         |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Benchmark Concurrency & Mathematical Scenarios

The production database and application server must mathematically guarantee the two canonical project benchmarks under high-concurrency request conditions:

### 2.1 Benchmark 1: Insufficient Funds Rejection
- **Scenario:** A buyer has ₹1,00,000 available ($1,189 USD @ ₹84.07 rate) and attempts to commit ₹2,00,000 ($2,379 USD).
- **Enforcement:** The system evaluates:
  $$\text{Attempted Bid} (\$2,379) > \text{Available to Bid} (\$1,189)$$
- **Result:** The bid is rejected immediately prior to acceptance. No database state is modified; no ask is updated; no countdown clock extension occurs. The server returns:
  > *"Bid not accepted. Your available Vault balance is insufficient for this bid. Add eligible funds or reduce your bid amount."*

### 2.2 Benchmark 2: Cross-Lot Concurrent Commitment Constraint
- **Scenario:** A buyer has a Total Vault Balance of ₹1,00,000 ($1,189 USD) and no existing commitments. The buyer places a leading bid of ₹70,000 ($833 USD) on Lot A, and simultaneously attempts a ₹60,000 ($714 USD) commitment on Lot B.
- **Enforcement:**
  1. Transaction 1 (Lot A) acquires the lock on the user's `vault_accounts` record:
     $$\text{Available to Bid} = \$1,189 - \$0 = \$1,189 \ge \$833 \implies \text{ACCEPTED}$$
     $$\text{New Reserved Funds} = \$833; \quad \text{New Available to Bid} = \$1,189 - \$833 = \$356 \text{ USD } (\sim\text{₹}30,000)$$
  2. Transaction 2 (Lot B) evaluates against the newly updated record:
     $$\text{Required Bid} = \$714; \quad \text{Available to Bid} = \$356 \implies \$714 > \$356 \implies \text{REJECTED}$$
- **Result:** Lot A succeeds; Lot B is blocked with the insufficient funds alert. The buyer's total commitments cannot exceed ₹1,00,000 under any sequence of concurrent requests.

---

## 3. Server & Database Concurrency Guarantees

To ensure that simultaneous bids across different lots never oversell available funds, and that concurrent bids on the same lot do not cause deadlocks or race conditions, the system employs **pessimistic row-level locking** combined with a **Unified Global Lock Acquisition Hierarchy** under standard **`READ COMMITTED` transaction isolation**.

```
                           CONCURRENT MULTI-LOT BIDDING EXECUTION (BENCHMARK 2)
                           
      [Thread 1: Bid ₹70k on Lot A]                     [Thread 2: Bid ₹60k on Lot B]
                    |                                                 |
                    v                                                 v
          [ACID Transaction A]                              [ACID Transaction B]
                    |                                                 |
      1. SELECT ... FROM lots                           1. SELECT ... FROM lots
         WHERE id = 'LotA' FOR UPDATE                      WHERE id = 'LotB' FOR UPDATE
         (Acquires LotA Row Lock)                          (Acquires LotB Row Lock)
                    |                                                 |
      2. SELECT ... FROM vault_accounts                 2. SELECT ... FROM vault_accounts
         WHERE user_id = $1 FOR UPDATE                     WHERE user_id = $1 FOR UPDATE
         (Acquires User Account Lock)                      (BLOCKS ON USER ACCOUNT LOCK)
                    |                                                 :
      3. Available = ₹1,00,000 >= ₹70,000                             :
         -> Bid Valid                                                 :
      4. INSERT Ledger Entry (Debit Available,                        :
                              Credit Reserved)                        :
      5. UPDATE vault_accounts:                                       :
         Reserved = ₹70k, Available = ₹30k                            :
      6. UPDATE lots SET highest_bidder = $1                          :
      7. COMMIT (Releases LotA & User Account Locks)                  :
                    |                                                 v
                    +===================================> (ACQUIRES USER ACCOUNT LOCK)
                                                        3. Available = ₹30,000 < ₹60,000
                                                           -> INSUFFICIENT FUNDS
                                                        4. ROLLBACK (Releases LotB & Account)
                                                        5. Return 422 Unprocessable Entity
```

### 3.1 Unified Global Lock Acquisition Hierarchy
Deadlocks occur if separate transactions acquire locks on multiple shared resources in conflicting orders. To prevent deadlocks mathematically, every transaction in ChronoBid Vault must adhere to one immutable global locking hierarchy:

$$\mathbf{Global\ Locking\ Order:}\quad \text{Lots Table First} \longrightarrow \text{Vault Accounts Table Second}$$

1. **Rule 1 — Lots Before Accounts:** Every transaction that inspects or mutates a lot and a vault balance must lock the target `lots` row first (`FOR UPDATE`), and subsequently lock the relevant `vault_accounts` row(s) (`FOR UPDATE`). A transaction that holds a lock on `vault_accounts` is strictly forbidden from acquiring a lock on `lots`.
2. **Rule 2 — Deterministic Multi-Lot Ordering:** If a batch or administrative operation touches multiple lots simultaneously, it must acquire lot locks in strict ascending alphabetical order of primary key:
   ```sql
   SELECT * FROM lots WHERE id IN (:id1, :id2) ORDER BY id ASC FOR UPDATE;
   ```
3. **Rule 3 — Deterministic Multi-Account Ordering (Outbid Handling):** When a new bid outbids an existing leading bidder, the transaction touches two distinct user accounts (reserving funds for New Bidder $A$, releasing funds for Previous Bidder $B$). The transaction must lock both user accounts in strict ascending order of `user_id`:
   ```sql
   SELECT * FROM vault_accounts 
   WHERE user_id IN (:userA, :userB) 
   ORDER BY user_id ASC FOR UPDATE;
   ```
4. **Mathematical Deadlock Proof:** Because all transactions acquire resource locks along the identical directed acyclic path ($\text{Lots Sorted} \rightarrow \text{Vault Accounts Sorted}$), circular wait graphs cannot form. Deadlock is mathematically impossible under this hierarchy.

### 3.2 Comprehensive Transaction-by-Transaction Locking Matrix

The following matrix governs every database transaction that touches lots, financial balances, or ledger records across the ChronoBid Vault platform:

```
+-----------------------------------------------------------------------------------------------------------------------------------------------+
|                                             TRANSACTION-BY-TRANSACTION LOCKING MATRIX                                                         |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| ID | Transaction Type            | Locked Database Rows               | Deterministic Lock Order              | Inversion & Bypass Protection |
+----+-----------------------------+------------------------------------+---------------------------------------+-------------------------------+
| T1 | Initial New Bid             | lots(target_lot),                  | 1. lots(target_lot)                   | Validates active countdown    |
|    | (Uncontested Opening Lead)  | vault_accounts(bidder_user_id)     | 2. vault_accounts(bidder_user_id)     | before evaluating funds.      |
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

### 3.3 Transaction Boundaries & Isolation Level
- **Isolation Level:** Standard **`READ COMMITTED`**. Pure `SERIALIZABLE` isolation is rejected for high-concurrency bidding because PostgreSQL implements serializable transactions via optimistic SIREAD predicate locks; simultaneous bids on active lots would frequently abort with serialization failures (`40001: could not serialize access`), forcing erratic client retry loops. Under `READ COMMITTED` with explicit `FOR UPDATE` row locks, competing transactions wait cleanly on the lock, evaluate the committed post-lock state, and succeed sequentially.
- **Lock & Statement Timeouts:** To safeguard against stranded worker processes or network partitions:
  - `SET LOCAL lock_timeout = '1500ms';`
  - `SET LOCAL statement_timeout = '3000ms';`
  If a lock cannot be acquired within 1,500ms, the transaction is automatically aborted, all acquired locks are released, and the client receives a standardized `ERR_LOCK_TIMEOUT` error with an HTTP 503 status, prompting an immediate retry with exponential jitter.
- **Uniqueness & Anti-Corruption Constraints:**
  - `UNIQUE (idempotency_key)` on `vault_ledger_entries`.
  - `UNIQUE (lot_id, bid_sequence)` on `bids`.
  - `CHECK (total_balance_usd >= 0)` on `vault_accounts`.
  - `CHECK (reserved_funds_usd >= 0)` on `vault_accounts`.
  - `CHECK (available_to_bid_usd >= 0)` on `vault_accounts`.

### 3.4 Empirical Testing Disclaimer
> [!IMPORTANT]
> **GOVERNANCE NOTICE ON CONCURRENCY CLAIMS:**  
> The locking mechanisms and mathematical guarantees described above represent the **proposed architectural design**. They have been verified through formal relational calculus and client-side simulation fixtures in Phase 2. **They have NOT been executed against an actual PostgreSQL database instance.** Empirical stress testing, deadlock benchmarks, and high-concurrency k6 load tests will be conducted exclusively in Phase 4 upon explicit Project Owner authorization.

---

## 4. Immutable Double-Entry Ledger Design

ChronoBid Vault strictly follows the **Double-Entry Bookkeeping Standard** (GAAP/IFRS compliant). Money is neither created nor destroyed; every balance movement is represented by equal, offsetting debits and credits across platform accounts.

```
+---------------------------------------------------------------------------------------------------------+
|                                      CHART OF ACCOUNTS MATRIX                                           |
|                                                                                                         |
|   Account Code   Account Name                   Account Type   Normal Balance   Description             |
|   ---------------------------------------------------------------------------------------------------   |
|   1010           User Available Funds           Liability      Credit           Funds ready for bidding |
|   1020           User Reserved Funds            Liability      Credit           Funds locked on leads   |
|   1030           User Pending Clearance Holds   Liability      Credit           Deposits in transit     |
|   1040           Settlement Escrow Holds        Liability      Credit           Won lot hammer proceeds |
|   2010           Bank Custody Clearing Account  Asset          Debit            Physical bank cash      |
|   3010           Platform Buyer's Premium       Revenue        Credit           Platform auction fees   |
|   3020           Platform Consignor Commission  Revenue        Credit           Consignment fee margins |
|   4010           Consignor Payout Payable       Liability      Credit           Net proceeds for seller |
+---------------------------------------------------------------------------------------------------------+
```

### 4.1 Sample Double-Entry Journal Postings

#### Event 1: User Funds Vault with $150,000 USD via Bank Wire
```text
Debit:  Account 2010 (Bank Custody Clearing Account)    $150,000.00 USD  [Asset increases]
Credit: Account 1010 (User Available Funds)            $150,000.00 USD  [Liability increases]
Memo: Cleared Fedwire transfer Ref #WIRE-982144
```

#### Event 2: User Bids $40,000 USD on Lot 01 (Becomes Leading Bidder)
```text
Debit:  Account 1010 (User Available Funds)             $40,000.00 USD  [Available decreases]
Credit: Account 1020 (User Reserved Funds)              $40,000.00 USD  [Reserved increases]
Memo: Leading bid reservation on Lot #01 (Paddle #4102)
```

#### Event 3: User Outbid by Bot/Competitor ($42,500 USD)
```text
Debit:  Account 1020 (User Reserved Funds)              $40,000.00 USD  [Reserved decreases]
Credit: Account 1010 (User Available Funds)             $40,000.00 USD  [Available restored]
Memo: Outbid fund release on Lot #01; outbid by Paddle #7821
```

#### Event 4: Incremental Bid Increase on Same Lot ($40,000 -> $45,000 USD)
```text
Debit:  Account 1010 (User Available Funds)              $5,000.00 USD  [Delta deducted]
Credit: Account 1020 (User Reserved Funds)               $5,000.00 USD  [Delta reserved]
Memo: Self-increment bid delta ($40k -> $45k); total reserved on Lot 01 is now $45k
```

#### Event 5: Auction Closes — User Wins Lot for $45,000 USD + 20% Buyer's Premium ($9,000)
```text
Debit:  Account 1020 (User Reserved Funds)              $45,000.00 USD  [Reserved extinguished]
Debit:  Account 1010 (User Available Funds)              $9,000.00 USD  [Premium paid]
Credit: Account 1040 (Settlement Escrow Holds)          $45,000.00 USD  [Hammer held in escrow]
Credit: Account 3010 (Platform Buyer's Premium)          $9,000.00 USD  [Revenue recognized]
Memo: Hammer fall settlement invoice #INV-2026-001 on Lot #01
```

---

## 5. Financial Operations Lifecycle & Edge-Case Handling

```
+---------------------------------------------------------------------------------------------------------+
|                                     VAULT BALANCE STATE MACHINE                                         |
|                                                                                                         |
|       [Deposit] ---> [Pending Clearance Hold] ---> [Available to Bid]                                  |
|                                                          |                                              |
|                                            +-------------+-------------+                                |
|                                            |                           |                                |
|                                     (Place Bid)                 (Request Payout)                        |
|                                            v                           v                                |
|                                    [Reserved Funds]           [Withdrawal Hold]                         |
|                                            |                           |                                |
|                             +--------------+--------------+            v                                |
|                             |                             |     [Bank Wire Out]                         |
|                         (Outbid)                       (Wins)                                           |
|                             v                             v                                             |
|                    [Available to Bid]           [Settlement Escrow]                                     |
|                                                           |                                             |
|                                                           v                                             |
|                                                [Disbursement to Seller]                                 |
+---------------------------------------------------------------------------------------------------------+
```

### 5.1 Idempotency & Duplicate Prevention
- Every financial request (bid, deposit, withdrawal) requires an `Idempotency-Key` HTTP header containing a client-generated UUIDv4.
- The API Gateway caches processed idempotency keys in Redis with a 24-hour TTL:
  - If a duplicate key arrives while a transaction is in-flight, it returns `HTTP 409 Conflict`.
  - If a duplicate key arrives after completion, it returns the cached result without re-executing.
- Database unique constraint: `UNIQUE (idempotency_key)` on `vault_ledger_entries`.

### 5.2 Failure Recovery Protocols
- **Network Timeout on Bid Submission:** Client retries with the same `Idempotency-Key`. The server returns the confirmed bid without double-reserving funds.
- **Saleroom System Crash During Active Auction:** All uncommitted in-memory states are discarded. The server re-hydrates balances strictly from the `vault_ledger_entries` journal upon restart.

### 5.3 Automated Bank Reconciliation Engine
- Daily scheduled job (03:00 UTC) ingests bank statement feeds (MT940 / CAMT.053 XML format) via SFTP from banking partners.
- Ingestion worker compares:
  $$\text{Bank Statement Cash Balance} \stackrel{?}{=} \sum \text{Ledger User Balances} + \text{Escrow Holds} + \text{Undisbursed Payouts}$$
- Discrepancy threshold: **$0.00 tolerance**. Any discrepancy halts automated withdrawals and triggers an immediate P1 alert to finance and engineering leadership.

### 5.4 Bank Wire Transfers, MT103 Receipt Disclaimers & Settlement Obligations

> [!CAUTION]
> **CRITICAL LEGAL & FINANCIAL INVARIANT: UPLOADED RECEIPTS ARE NOT CLEARED FUNDS.**  
> An uploaded MT103 wire transfer slip, customer payment receipt, or banking screenshot uploaded by a user is **strictly a customer-submitted claim, NOT verified or received funds**. Digital receipts are easily fabricated, altered, subject to recall, or drawn on accounts with insufficient funds.

1. **Zero Balance or Bidding Privileges on Receipt Upload:**
   - Uploading an MT103 or wire confirmation creates a record in `vault_deposit_requests` with status `PENDING_CLEARANCE`.
   - **Under no circumstances does an uploaded receipt increase `Total Vault Balance`, `Available to Bid`, or grant bidding headroom.**
   - Funds are only credited to Account 1010 (`User Available Funds`) when the incoming bank wire physically settles into the platform's segregated bank account and is verified via:
     - Automated MT940 / CAMT.053 bank statement ingest matching the transaction's unique virtual IBAN / payment reference, OR
     - Dual-control manual verification by two authorized corporate treasury officers directly within the financial institution's online commercial banking portal.
2. **Settlement Grace Period & Asset Retention:**
   - For winning auction invoices, uploading an MT103 wire confirmation within the mandatory 48-hour post-auction payment window transitions the invoice status from `PAYMENT_PENDING` to `SETTLEMENT_WIRE_PENDING`.
   - This extends the invoice cancellation deadline by an administrative grace window of up to 72 hours to accommodate international interbank clearing latencies (SWIFT / Fedwire).
   - **Physical Asset Invariant:** The won timepiece remains 100% secured in physical custody at the bonded vault facility (`SETTLEMENT_ESCROW_HOLD`). **Zero physical handover, shipping dispatch, or legal title transfer occurs until incoming wire funds have 100% cleared and settled irreversibly.**
3. **Fraud, Chargebacks & Settlement Edge Cases:**
   - *Fake Receipt Fraud:* If an uploaded receipt is followed by zero funds arrival within the 72-hour grace period, the invoice is voided, the buyer account is permanently blacklisted, and the lot is re-offered to the runner-up bidder or returned to the consignor.
   - *SWIFT gpi Recall / Wire Fraud Stops:* If an incoming bank wire is recalled before final payout, platform funds held in Account 1040 (`Settlement Escrow Holds`) are frozen immediately, halting consignor disbursement.
   - *Credit Card Chargebacks:* Credit card rails are restricted strictly to small registration identity verification holds (e.g., $1,000 to $5,000 maximum). Credit cards are prohibited for marquee hammer settlement. Any disputed credit card deposit immediately debits Account 1010, places the user account on administrative freeze, and initiates formal collections.
   - *Overpayments & Unidentified Transfers:* Incoming transfers with missing or mismatched reference numbers are credited to Account 2050 (`Unidentified Clearing Suspense`) and held until KYC verification matches the remitter's verified identity. Refunds are returned *exclusively* to the originating bank account to comply with global AML anti-layering rules.
4. **Specialist Review Requirements:**
   - *Banking Review Required:* Confirmation with corporate banking partner (JPMorgan, BofA, or Barclays) regarding automated incoming Fedwire/SWIFT webhook notifications and MT940 SFTP delivery availability.
   - *Legal & Tax Review Required:* Legal qualification of fiduciary escrow accounts under state money transmitter laws and EU PSD2/PSD3 directives.

### 5.5 Formal Payment State Taxonomy & Reconciliation Protocol

To ensure institutional financial integrity, every payment across ChronoBid Vault is governed by an immutable state lifecycle and a strict reconciliation protocol:

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

1. **Explicit Payment State Definitions:**
   - **`PENDING`:** An invoice or deposit ticket has been generated. Zero funds have been confirmed by the bank. No bidding headroom or asset title is granted.
   - **`RECEIVED`:** An incoming bank wire has arrived at the banking institution, but is held in clearing, automated reference matching, or compliance screening. Funds are un-cleared.
   - **`CLEARED`:** Funds have settled irreversibly into the segregated customer escrow account and matched via MT940/CAMT.053 statement records. Funds are credited to Account 1010 (`User Available Funds`).
   - **`REVERSED`:** An un-cleared incoming wire is rejected, recalled by the originating institution, or canceled.
   - **`DISPUTED`:** An incoming payment is subject to a formal SWIFT recall request, sanctions review, or card dispute. Associated ledger funds are locked in Account 1040 (`Settlement Escrow Holds`) or Account 2050 (`Suspense`), and physical goods are frozen in vault custody.
2. **Strict Prohibition on Automatic Expense Write-Offs:**
   - The platform strictly **prohibits automated write-offs** of payment shortfalls or wire variances.
   - Any discrepancy between invoiced settlement totals and received bank wires—regardless of amount—is classified as an **Unreconciled Variance** and routed to the **Treasury Exception Queue**.
   - **Audit & Authorization Policy:**
     - Discrepancies < $50 USD (e.g., correspondent bank wire deductions): A Senior Treasury Analyst investigates the wire fee schedule. If justified by correspondent fees, an adjustment request is submitted requiring **Dual-Control Authorization** from the Finance Manager before any entry is posted.
     - Discrepancies &ge; $50 USD: The invoice remains in `PAYMENT_UNDERPAID_EXCEPTION`. The buyer is notified to remit the balance from their Vault available funds or via secondary payment.
     - **Physical Asset Invariant:** The physical lot remains locked in `SETTLEMENT_ESCROW_HOLD` at the vault custody facility until the invoice is 100% cleared and reconciled.
     - **Structured Audit Logging:** Every exception adjustment generates an immutable audit record: `{ timestamp, invoice_id, amount_invoiced, amount_received, discrepancy_delta, fee_justification, analyst_id, approver_id }`.

---

## 6. Demarcation: Prototype Simulation vs. Production System

| Dimension | Phase 2 Clickable Prototype (Current) | Phase 3 Production Financial System (Proposed) |
| :--- | :--- | :--- |
| **Storage Engine** | Client-side `sessionStorage` in browser memory | Aurora PostgreSQL Multi-AZ with continuous point-in-time recovery |
| **Accounting Standard** | Single-integer balance calculation in React state | Full double-entry bookkeeping ledger (`vault_ledger_entries`) |
| **Concurrency Control** | Single-threaded JavaScript event loop in client | Pessimistic row-level database locking (`SELECT ... FOR UPDATE`) |
| **Bank Connections** | One-click simulated fixtures ($150,000 USD / ₹1,00,000) | Real Fedwire, CHAPS, SEPA, and Adyen payment rails with webhook clearing |
| **Security Boundaries** | Client-side input validation only | Server-authoritative validation, PKCE OAuth, Turnstile, and TLS 1.3 |
| **Legal Status** | Demonstration Sandbox (`[DEMO DATA]` badges) | Real fiduciary escrow accounts held at licensed trust banks |

---

## 7. Status & Approval Governance

> **VAULT SPECIFICATION STATUS:** **PROPOSED — PENDING OWNER APPROVAL**  
> **NEXT GOVERNANCE ACTION:** Project Owner review of double-entry ledger design and concurrency model.  
> **LEGAL DISCLAIMER:** Implementation of production ledger systems requires legal qualification regarding escrow custody and money-transmission licensing in operating jurisdictions.

---
*Certified by Senior Financial Systems Analyst, ChronoBid Vault.*  
*Timestamp: 2026-10-20T06:10:00Z*
