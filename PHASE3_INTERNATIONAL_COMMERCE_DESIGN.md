# ChronoBid Vault — Production International Commerce & Treasury Design
## Multi-Currency Model, Foreign Exchange Risk, Settlement Framework & Legal Compliance

> **Document Type:** Production International Commerce Specification & Regulatory Framework  
> **Project:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Working Directory:** `C:\Users\kbjee\OneDrive\Desktop\omniroute\auction system`  
> **Date:** 20 October 2026  
> **Author:** Senior Financial Systems Analyst, Cross-Border Regulatory Counsel, Senior Project Manager  
> **Status:** **PROPOSED — PENDING OWNER DECISIONS & FORMAL LEGAL/ACCOUNTING VALIDATION**  
> **Legal Disclaimer:** **THIS DOCUMENT OUTLINES REGULATORY & FINANCIAL ARCHITECTURE FOR PLANNING PURPOSES. ALL TAX, MONEY TRANSMISSION, CONSUMER LAW, AND CUSTODY PROPOSALS REQUIRE QUALIFIED JURISDICTIONAL LEGAL COUNSEL.**  

---

## 1. Multi-Currency Architecture & The 4-Tier Model

ChronoBid Vault operates as a cross-border marketplace serving collectors, dealers, and consignors across North America, Europe, Switzerland, the United Kingdom, Japan, Hong Kong, Singapore, and India.

To prevent currency ambiguity, the platform formally segregates currency into four distinct operational tiers (ADR-026):

```
+---------------------------------------------------------------------------------------------------------+
|                                    4-TIER CURRENCY ARCHITECTURE                                         |
|                                                                                                         |
|   1. Canonical Saleroom Auction Currency (USD)                                                          |
|      - The definitive currency of the auction hammer, bid ladder, reserve price, and contract.          |
|                                                                                                         |
|   2. Vault Funding & Collateral Currency (USD, EUR, GBP, CHF)                                           |
|      - The currency deposited into the collector's pre-funded Vault account.                            |
|                                                                                                         |
|   3. Local Display Currency (USD, EUR, GBP, CHF, JPY, HKD, SGD, INR)                                    |
|      - Real-time estimation currency displayed in UI; strictly tagged with [EST. DEMO] / [ESTIMATE].    |
|                                                                                                         |
|   4. Consignor Settlement Currency (USD, EUR, GBP, CHF)                                                 |
|      - The agreed disbursement currency wired to the seller upon completed provenance handover.        |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Foreign Exchange (FX) Rate Ingestion, Precision & Rounding

### 2.1 Authoritative Rate Feeds & Ingestion Schedule
- In production, exchange rates are ingested hourly from dual-redundant institutional data feeds:
  1. **Primary Feed:** European Central Bank (ECB) Reference Rates via official Eurostat SDMX API.
  2. **Secondary / Redundant Feed:** OpenExchangeRates (or OANDA Institutional Rates).
  3. **INR Reference:** Reserve Bank of India (RBI) reference rate feed.
- Every ingested rate is recorded in an immutable `exchange_rates` database table with:
  - `base_currency` (USD)
  - `target_currency` (EUR, GBP, CHF, JPY, HKD, SGD, INR)
  - `multiplier` (numeric with 6 decimal places, e.g. `0.888700`)
  - `source` (`ECB`, `OER`, `RBI`)
  - `effective_timestamp` (UTC)
  - `valid_until_timestamp` (UTC)

### 2.2 Mathematical Precision & Rounding Rules
- **Internal Calculations:** Multipliers maintain 6 decimal places of precision internally.
- **Display Rounding:** Converted display amounts round to the nearest whole integer for fiat currencies with no sub-units in auction contexts (JPY, INR, USD, EUR, GBP, CHF, SGD, HKD), using `Math.round()` / standard half-up rounding.
- **Dual-Currency Invariant (TC-VLT-09):** Converted estimates are always rendered alongside the canonical USD price:
  ```text
  ₹18,49,540 [ESTIMATE] / $22,000 USD
  ```
- **Fallback Rule (TC-VLT-10):** If exchange rate feeds fail or latency exceeds 4 hours, the system renders `$[Amount] [CONVERSION UNAVAILABLE]` without disrupting auction bidding.

---

## 3. Settlement Models & Foreign Exchange Risk Allocation

Between the fall of the auction hammer and final invoice settlement (typically 48–72 hours for international bank wires), foreign exchange rates fluctuate. The platform cannot adopt an arbitrary policy without Project Owner selection and financial validation:

```
+---------------------------------------------------------------------------------------------------------+
|                                  SETTLEMENT MODEL COMPARISON                                            |
|                                                                                                         |
|   [MODEL A: USD-Only Settlement]             [MODEL B: Guaranteed 48-Hour Lock]    [MODEL C: Multi-Currency]
|   - Canonical hammer in USD                  - Converted total locked at hammer    - Bids in local currency |
|   - Buyer wires USD (Bank converts)          - Platform absorbs or hedges FX       - Complex local books    |
|   - Zero platform FX risk                    - 1.25% buffer or Adyen FX Lock       - Extreme complexity     |
+---------------------------------------------------------------------------------------------------------+
```

### 3.1 Model Analysis & Trade-Offs

| Dimension | Model A: USD-Only Settlement (Recommended for Launch) | Model B: Guaranteed 48-Hour FX Lock | Model C: Multi-Currency Bidding |
| :--- | :--- | :--- | :--- |
| **Mechanics** | Invoices issued strictly in USD. Buyer instructs bank to wire USD; buyer's bank executes conversion. | Displayed converted amount locked at hammer. ChronoBid absorbs variance or hedges via Adyen. | Lots are listed and bid in multiple local currencies simultaneously. |
| **Platform FX Risk** | **Zero Risk.** ChronoBid balance sheet is 100% insulated from currency movements. | **Managed Risk.** Platform exposed to downside currency moves unless hedged. | **High Risk.** Multi-currency order book arbitrage risks. |
| **Accounting Complexity** | **Low.** Single base currency ledger; standard bank wire reconciliation. | **Medium.** Requires FX variance ledger accounts and hedging reconciliations. | **Extremely High.** Complex multi-currency ledger and daily mark-to-market. |
| **Buyer Friction** | Minor friction for international buyers whose banks charge wire FX spreads (1–2%). | **Zero Friction.** Buyer pays exact familiar local currency amount seen on screen. | Variable friction across different catalog items. |
| **Legal Feasibility** | Globally recognized and accepted across major international auction houses (Christie's, Sotheby's, Phillips). | Requires commercial rate-lock contract with payment acquirer (Adyen/Stripe). | Severe tax and customs reporting complications across jurisdictions. |

### 3.2 Recommendation & Unresolved Owner Decision
- **Settlement Policy Status:** **PROPOSED — OWNER APPROVAL REQUIRED (DEC-P3-001).**
- **Provisional Architecture Recommendation:** **Model A (USD-Only Settlement)** for Phase 4 through Phase 6 initial launch. This matches traditional fine art and horology auction standards, avoids financial balance-sheet hedging liabilities, and simplifies tax reporting.
- **Critical Wire Verification & Clearing Invariant:**
  - An uploaded MT103 wire receipt is **strictly an unverified claim, not cleared funds**.
  - International SWIFT wires typically require 24 to 72 business hours to credit the platform's trust account.
  - While an uploaded receipt extends the administrative invoice cancellation window by 72 hours (`SETTLEMENT_WIRE_PENDING`), **zero physical goods are dispatched or title transferred until funds have 100% cleared irreversibly**.
- **Future Roadmap:** Transition to **Model B** in Phase 7/8 once international payment acquirer agreements (e.g., Adyen Guaranteed FX) are formally contracted and treasury hedging models are legally vetted.

---

## 4. Fee Structures, Taxes, Customs & Consignor Payouts

### 4.1 Fee Calculations
When an auction closes, the automated settlement engine generates an itemized invoice based on the approved commercial schedule:
$$\text{Total Invoice Amount} = \text{Hammer Price} + \text{Buyer's Premium} + \text{Applicable Taxes} + \text{Insured Transit Fee}$$

- **Buyer's Premium Schedule (Proposed DEC-P3-008 — OWNER APPROVAL REQUIRED):**
  - Up to $100,000 USD: **20%**
  - $100,001 to $500,000 USD: **15%**
  - Above $500,000 USD: **10%**
- **Consignor Commission:** Deducted from hammer price before seller disbursement (typically 0% to 10% depending on consignment agreement).

### 4.2 Cross-Border Tax, Customs & Jurisdiction-Specific Obligations

> [!IMPORTANT]
> **SPECIALIST OPINION NOTICE:** All tax rates, customs codes, and foreign exchange restrictions documented below are for architectural design and workflow modeling only. They must be formally audited and verified by qualified jurisdictional legal and tax counsel before launch.

1. **India-Specific Remittance & Import Duties (RBI / FEMA / Customs):**
   - **Liberalised Remittance Scheme (LRS):** Indian resident individuals may remit up to **$250,000 USD per financial year** under RBI FEMA regulations. Marquee purchases exceeding $250,000 require prior RBI approval or corporate treasury remittance channels.
   - **Form A2 & Banking Documentation:** Outward remittances require submitting Form A2 and a FEMA declaration to an Authorized Dealer (AD) Category-I bank, accompanied by the ChronoBid Vault pro-forma invoice.
   - **20% Tax Collected at Source (TCS):** Under Section 206C(1G) of the Indian Income Tax Act, outward foreign remittances exceeding ₹7,00,000 in a financial year incur a **20% TCS withholding** by the remitting bank (adjustable against final tax liability, but requiring higher upfront liquidity).
   - **Customs Import Duties:** Importing luxury horological timepieces into India incurs Basic Customs Duty (BCD ~20%), Social Welfare Surcharge (SWS 10% on BCD), and Integrated Goods and Services Tax (IGST 28% on landed value), resulting in an effective cumulative import tariff burden often exceeding **40% to 50% of the CIF value**. Invoices must accurately declare movement calibres and case metals.
2. **Value Added Tax (VAT / GST in EU, UK & Switzerland):**
   - **EU / UK Margin Scheme:** If timepieces are consigned by private collectors, VAT applies exclusively to the **Buyer's Premium** (service fee), not the entire hammer price. Timepieces imported into the UK or EU from third countries incur statutory import VAT (e.g. 20% UK, 19% Germany, 8.1% Switzerland) on total landed cost.
   - **United States Marketplace Facilitator Laws:** Sales tax collection is governed by economic nexus thresholds under the *South Dakota v. Wayfair* doctrine. Automated nexus evaluation must integrate via specialized tax engines (TaxJar or Avalara).
3. **CITES Compliance (Exotic Leather Straps):**
   - Vintage and modern luxury timepieces equipped with exotic reptile leather straps (alligator, crocodile, lizard) are governed by the **Convention on International Trade in Endangered Species (CITES)**.
   - Exporting across international borders without CITES export/import permits is illegal and results in customs seizure. Physical logistics standard operating procedure: **Straps manufactured from regulated species must be removed and retained in custody prior to cross-border shipping unless formal CITES re-export certificates are obtained.**

---

## 5. Cross-Border Payouts, Refunds & Dispute Handling

### 5.1 Consignor Disbursement Lifecycle
1. **Settlement Hold:** Buyer payment arrives in platform escrow account.
2. **Physical Inspection Verification:** Consignor payout is locked in `PENDING_HANDOVER` until the buyer receives the specimen and the statutory inspection period (e.g., 48 hours for mechanical inspection) expires without a valid authenticity dispute.
3. **Automated Disbursement:** Net proceeds ($\text{Hammer Price} - \text{Consignor Commission} - \text{Consignment Fees}$) are disbursed via international wire transfer (Fedwire/SWIFT) to the consignor's verified KYC bank account.

### 5.2 Refunds & Return Policy Boundaries
- **Authenticity Disputes:** If an authenticated physical inspection by an accredited master horologist demonstrates material unoriginality (e.g., counterfeit dial, replacement non-OEM movement) within 14 days of receipt, the buyer receives a 100% refund of hammer price and premium.
- **FX Loss on Refund:** If a refund is issued in Model A, the refund is executed in USD; the buyer assumes currency fluctuation risk between payment date and refund date.

---

## 6. Jurisdiction-Dependent Regulatory Decision Checklist

The following regulatory checklist must be submitted to qualified legal, tax, and accounting counsel before production commercial launch:

| Jurisdiction Domain | Specific Regulatory Requirement | Operational Impact on ChronoBid Vault | Qualified Legal Review Status |
| :--- | :--- | :--- | :--- |
| **Auction Consumer Law** | **EU / UK Consumer Rights Directive (Directive 2011/83/EU)** | Live public auctions with in-person attendance options are exempt from the 14-day statutory right of withdrawal. Pure online-only marketplaces may be subject to 14-day consumer returns unless structured as auctions under local commercial codes. | **REQUIRED — Pending Legal Opinion** |
| **Payment Transmission** | **US FinCEN Money Transmitter Rules / EU PSD2** | Escrow holding of customer funds may classify ChronoBid as a Money Services Business (MSB) or Payment Institution unless funds are held in fiduciary custody by a licensed partner bank or trust company. | **REQUIRED — Pending Banking Counsel** |
| **Anti-Money Laundering** | **EU 5th AML Directive (5AMLD) / UK MLR / US BSA** | Mandatory KYC verification and suspicious activity reporting (SAR) for high-value artwork and luxury goods transactions exceeding €10,000 / $10,000 USD. | **REQUIRED — Pending AML Compliance Audit** |
| **Sanctions & Screening** | **OFAC (US) / UK HMT / EU Consolidated Lists** | Automated real-time screening of all registered bidders, consignors, and beneficial owners against global sanctions lists. | **REQUIRED — Pre-Integrated into Persona KYC** |
| **Data Protection & Privacy** | **GDPR (EU) / UK GDPR / Swiss FADP / CCPA (US)** | Right to erasure, data minimization, cryptographic encryption of KYC records, cross-border data transfer mechanisms (Standard Contractual Clauses). | **REQUIRED — Pending Privacy Impact Assessment** |
| **Marketplace Sales Tax** | **US Supreme Court Wayfair Ruling / EU VAT E-Commerce** | Registration and automated calculation of sales tax across US states where economic nexus thresholds ($100k / 200 transactions) are exceeded. | **REQUIRED — Integrate TaxJar / Avalara** |
| **CITES Wildlife Compliance** | **Convention on International Trade in Endangered Species** | Exporting vintage timepieces with exotic leather straps (alligator, crocodile, lizard) requires CITES re-export certificates. Straps must be removed prior to shipping if permits are unavailable. | **REQUIRED — Physical Logistics SOP** |
| **Physical Bailment & Transit** | **International Commercial Terms (Incoterms 2020)** | Terms of sale must define exact risk transfer point (e.g., CIF vs. DAP); carrier liability limits under CMR / Warsaw-Montreal conventions for air cargo. | **REQUIRED — Bound in Terms of Service** |

---

## 7. Status & Approval Governance

> **COMMERCE SPECIFICATION STATUS:** **PROPOSED — PENDING OWNER DECISIONS & LEGAL COUNSEL**  
> **NEXT GOVERNANCE ACTION:** Review of Model A vs. Model B settlement selection in Decisions Register.  
> **BINDING DISCLAIMER:** ChronoBid Vault engineering will not deploy live cross-border payment processing or contractual escrow holds until qualified legal counsel has approved the commercial terms and regulatory structure.

---
*Certified by Senior Financial Systems Analyst & Cross-Border Counsel, ChronoBid Vault.*  
*Timestamp: 2026-10-20T06:15:00Z*
