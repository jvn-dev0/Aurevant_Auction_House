import subprocess
import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ChronoBid Vault — Phase 1 Specification Dossier</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
  }
  * {
    box-sizing: border-box;
  }
  body {
    background-color: #F4F0E8;
    color: #182720;
    font-family: 'Manrope', -apple-system, sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cover-page {
    page-break-after: always;
    height: 94vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24mm 10mm 16mm 10mm;
    border: 1px solid #D8D0C2;
    background: #F4F0E8;
  }

  .cover-header {
    border-bottom: 2px solid #182720;
    padding-bottom: 8mm;
  }
  .brand-mono {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10pt;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #4A5B53;
  }
  .cover-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 40pt;
    line-height: 1.05;
    margin: 12mm 0 4mm 0;
    color: #182720;
    font-weight: 400;
  }
  .cover-title em {
    font-style: italic;
  }
  .cover-subtitle {
    font-size: 13pt;
    color: #374A41;
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  .cover-accent-badge {
    display: inline-block;
    background: #D7E65A;
    color: #182720;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8.5pt;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 2px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 6mm;
  }

  .cover-meta-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20mm;
  }
  .cover-meta-table td {
    padding: 8px 12px;
    border-bottom: 1px solid #D8D0C2;
    font-size: 9.5pt;
  }
  .cover-meta-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8.5pt;
    color: #5C6E66;
    text-transform: uppercase;
    width: 32%;
  }
  .cover-meta-value {
    font-weight: 600;
    color: #182720;
  }

  .cover-footer {
    border-top: 1px solid #D8D0C2;
    padding-top: 6mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8.5pt;
    color: #6C7D75;
  }

  /* Content Pages */
  .page-section {
    page-break-after: auto;
    margin-bottom: 14mm;
  }
  .page-break {
    page-break-after: always;
  }

  h1.section-heading {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 24pt;
    font-weight: 400;
    color: #182720;
    border-bottom: 1px solid #182720;
    padding-bottom: 3mm;
    margin-top: 8mm;
    margin-bottom: 5mm;
  }
  h1.section-heading em {
    font-style: italic;
  }

  h2.sub-heading {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 16pt;
    font-weight: 400;
    color: #182720;
    margin-top: 6mm;
    margin-bottom: 3mm;
  }

  h3.tertiary-heading {
    font-family: 'Manrope', sans-serif;
    font-size: 10.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #273A31;
    margin-top: 4mm;
    margin-bottom: 2mm;
  }

  p {
    margin: 0 0 3mm 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0 0 4mm 0;
    padding-left: 5mm;
  }
  li {
    margin-bottom: 1.5mm;
  }

  /* Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 4mm 0 6mm 0;
    font-size: 9.5pt;
    background: #FAF7F0;
  }
  table.data-table th {
    background-color: #EDE7DC;
    color: #182720;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 7px 10px;
    border: 1px solid #D8D0C2;
    text-align: left;
  }
  table.data-table td {
    padding: 7px 10px;
    border: 1px solid #D8D0C2;
    vertical-align: top;
  }
  table.data-table tr:nth-child(even) td {
    background-color: #F4F0E8;
  }

  /* Swatches */
  .swatch-group {
    display: flex;
    gap: 10px;
    margin: 4mm 0 6mm 0;
  }
  .swatch-card {
    flex: 1;
    border: 1px solid #D8D0C2;
    padding: 8px;
    background: #FAF7F0;
  }
  .swatch-color {
    height: 36px;
    border: 1px solid rgba(0,0,0,0.1);
    margin-bottom: 6px;
  }
  .swatch-name {
    font-weight: 700;
    font-size: 8.5pt;
    color: #182720;
  }
  .swatch-hex {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8pt;
    color: #5C6E66;
  }

  /* Callout box */
  .callout {
    border-left: 3px solid #182720;
    background: #EDE7DC;
    padding: 8px 12px;
    margin: 4mm 0 5mm 0;
    font-size: 9pt;
  }
  .callout strong {
    color: #182720;
  }

  .mono-box {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8.5pt;
    background: #FAF7F0;
    border: 1px solid #D8D0C2;
    padding: 8px 10px;
    margin: 4mm 0;
    line-height: 1.4;
  }

  /* Diagram box */
  .diagram-container {
    background: #FAF7F0;
    border: 1px solid #D8D0C2;
    padding: 10px;
    margin: 4mm 0 6mm 0;
    text-align: center;
  }
  .diagram-svg {
    max-width: 100%;
    height: auto;
  }

  .badge-tag {
    display: inline-block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 7.5pt;
    padding: 2px 6px;
    border-radius: 2px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .badge-approved {
    background: #D7E65A;
    color: #182720;
    font-weight: 600;
  }
  .badge-provisional {
    background: #EDE7DC;
    border: 1px solid #D8D0C2;
    color: #5C6E66;
  }

  .header-running {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6C7D75;
    border-bottom: 1px solid #D8D0C2;
    padding-bottom: 2mm;
    margin-bottom: 6mm;
    display: flex;
    justify-content: space-between;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
  <div class="cover-header">
    <div class="brand-mono">ChronoBid Vault &bull; Curated Horological Auction System</div>
    <div class="cover-title">Phase 1: Requirements &amp; <em>Design Specification</em></div>
    <div class="cover-subtitle">Complete Architecture, User Journeys, Design System Baseline &amp; Governance Rules</div>
    <span class="cover-accent-badge">Milestone Baseline Approved</span>
  </div>

  <table class="cover-meta-table">
    <tr>
      <td class="cover-meta-label">Project Name</td>
      <td class="cover-meta-value">ChronoBid Vault</td>
    </tr>
    <tr>
      <td class="cover-meta-label">Domain Specialization</td>
      <td class="cover-meta-value">Curated Rare Horology &amp; Vintage Timepiece Auctions</td>
    </tr>
    <tr>
      <td class="cover-meta-label">Approved Frontend Stack</td>
      <td class="cover-meta-value">Next.js App Router (React, TypeScript, Tailwind CSS)</td>
    </tr>
    <tr>
      <td class="cover-meta-label">Visual Aesthetic</td>
      <td class="cover-meta-value">Editorial-Parallax, Premium-Light, Monograph Publication</td>
    </tr>
    <tr>
      <td class="cover-meta-label">Status &amp; Signoff Gate</td>
      <td class="cover-meta-value">Phase 1 Requirements Baseline (Pending User Signoff to proceed to Phase 2)</td>
    </tr>
    <tr>
      <td class="cover-meta-label">Document Date</td>
      <td class="cover-meta-value">October 2026</td>
    </tr>
  </table>

  <div class="cover-footer">
    <span>CONFIDENTIAL &bull; INTERNAL PROJECT GOVERNANCE</span>
    <span>CHRONOBID-SPEC-v1.0</span>
  </div>
</div>

<!-- SECTION 1 -->
<div class="page-section">
  <div class="header-running">
    <span>ChronoBid Vault Specification</span>
    <span>Section 1: Requirements &amp; User Roles</span>
  </div>

  <h1 class="section-heading">1. Product Requirements &amp; <em>User Roles</em></h1>

  <h2 class="sub-heading">1.1 Mission &amp; Value Proposition</h2>
  <p>
    <strong>ChronoBid Vault</strong> is an artisanal, highly curated digital auction house dedicated to rare, vintage, and historically significant horological timepieces. Unlike high-volume consumer bidding platforms or generic SaaS marketplaces, ChronoBid Vault merges the quiet dignity, physical inspection standards, and provenance archives of prestigious European salerooms with transparent real-time bidding technology.
  </p>

  <h2 class="sub-heading">1.2 User Roles &amp; Access Hierarchy</h2>
  <p>
    The platform enforces a <strong>unified single-account model</strong> with progressive capability gates:
  </p>

  <div class="diagram-container">
    <svg class="diagram-svg" viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg" style="font-family:'Manrope',sans-serif;">
      <!-- Exploring User -->
      <rect x="20" y="20" width="190" height="200" rx="4" fill="#EDE7DC" stroke="#D8D0C2" stroke-width="1.5"/>
      <rect x="20" y="20" width="190" height="35" rx="4" fill="#182720"/>
      <text x="115" y="42" fill="#F4F0E8" font-size="11" font-weight="600" text-anchor="middle">Exploring User (Guest)</text>
      <text x="32" y="75" fill="#182720" font-size="9.5">&bull; Public Catalog Inspection</text>
      <text x="32" y="98" fill="#182720" font-size="9.5">&bull; Movement Specs &amp; Media</text>
      <text x="32" y="121" fill="#182720" font-size="9.5">&bull; Live Bid Ticker (Read-Only)</text>
      <text x="32" y="144" fill="#182720" font-size="9.5">&bull; Historic Hammer Archives</text>
      <text x="32" y="180" fill="#C8542A" font-size="8.5" font-weight="600">Gate: Bidding / Consigning blocked</text>

      <!-- Registered Member -->
      <rect x="250" y="20" width="200" height="200" rx="4" fill="#FAF7F0" stroke="#182720" stroke-width="2"/>
      <rect x="250" y="20" width="200" height="35" rx="4" fill="#182720"/>
      <text x="350" y="42" fill="#D7E65A" font-size="11" font-weight="600" text-anchor="middle">Unified Registered Member</text>
      <text x="262" y="75" fill="#182720" font-size="9.5" font-weight="600">Buyer Tier (Default):</text>
      <text x="262" y="95" fill="#374A41" font-size="9">&bull; Live Bidding &amp; Max Proxy Bids</text>
      <text x="262" y="115" fill="#374A41" font-size="9">&bull; Watchlist &amp; Outbid Alerts</text>
      <text x="262" y="140" fill="#182720" font-size="9.5" font-weight="600">Consignor Tier (Unlocked):</text>
      <text x="262" y="160" fill="#374A41" font-size="9">&bull; Watch Intake Dossier Submission</text>
      <text x="262" y="180" fill="#374A41" font-size="9">&bull; Appraisal &amp; Reserve Negotiation</text>
      <text x="262" y="200" fill="#374A41" font-size="9">&bull; Settlement &amp; Payout Ledger</text>

      <!-- Specialist / Admin -->
      <rect x="490" y="20" width="190" height="200" rx="4" fill="#EDE7DC" stroke="#D8D0C2" stroke-width="1.5"/>
      <rect x="490" y="20" width="190" height="35" rx="4" fill="#182720"/>
      <text x="585" y="42" fill="#F4F0E8" font-size="11" font-weight="600" text-anchor="middle">Platform Specialist (Admin)</text>
      <text x="502" y="75" fill="#182720" font-size="9.5">&bull; Intake Curation &amp; Provenance</text>
      <text x="502" y="98" fill="#182720" font-size="9.5">&bull; 30-Pt Mechanical Audit Reports</text>
      <text x="502" y="121" fill="#182720" font-size="9.5">&bull; Reserve &amp; Increment Schedules</text>
      <text x="502" y="144" fill="#182720" font-size="9.5">&bull; Auction Room Floor Controller</text>
      <text x="502" y="167" fill="#182720" font-size="9.5">&bull; Dispute &amp; Escrow Adjudication</text>
    </svg>
  </div>

  <table class="data-table">
    <thead>
      <tr>
        <th>Role</th>
        <th>Authentication</th>
        <th>Capabilities</th>
        <th>Restrictions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Exploring User</strong></td>
        <td>None (Guest)</td>
        <td>Browse lots, filter by calibre/era, view live bid stream, read editorial dispatches.</td>
        <td>Cannot place bids, join rooms, save watchlist items, or request consignments.</td>
      </tr>
      <tr>
        <td><strong>Registered Member (Buyer)</strong></td>
        <td>Verified Email + Password / Passkey</td>
        <td>Place live bids, configure automated proxy limits, receive instant outbid alerts, track invoices.</td>
        <td>Subject to lot collateral limits until financial tiering is approved.</td>
      </tr>
      <tr>
        <td><strong>Verified Consignor (Seller)</strong></td>
        <td>Buyer Account + KYC &amp; Settlement Setup</td>
        <td>Submit timepieces for appraisal, propose reserves, track consignment status, view escrow payouts.</td>
        <td>Cannot edit lot specs once appraisal is signed and scheduled for auction.</td>
      </tr>
      <tr>
        <td><strong>Platform Specialist</strong></td>
        <td>Hardware 2FA + Specialist Role Gate</td>
        <td>Lot publication, reserve setting, condition report signoff, auction pausing/adjudication.</td>
        <td>Cannot place personal bids on lots they inspected or curated.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- SECTION 2 & 3 -->
<div class="page-section">
  <div class="header-running">
    <span>ChronoBid Vault Specification</span>
    <span>Section 2 &amp; 3: Journeys &amp; Authentication</span>
  </div>

  <h1 class="section-heading">2. User Journeys &amp; <em>Account Workflows</em></h1>

  <h2 class="sub-heading">2.1 Detailed User Journeys</h2>
  <ul>
    <li>
      <strong>The Exploring Collector:</strong> Lands on editorial homepage &rarr; Observes global horological clocks (Geneva, London, New York, Tokyo) &rarr; Explores the Marquee Lot Parallax &rarr; Clicks into the live vault drop &rarr; Inspects high-res macro photos and timegrapher movement specs &rarr; Triggers "Register to Bid" prompt.
    </li>
    <li>
      <strong>The Active Bidder:</strong> Enters live auction room &rarr; Displays live countdown and current ask in IBM Plex Mono &rarr; Clicks increment button (`+$500`) &rarr; Confirms bid &rarr; Immediate websocket broadcast &rarr; If competing bidder counters within &lt;120s, soft-close timer resets (+120s) &rarr; Hammer drops &rarr; Generates invoice and escrow tracking dossier.
    </li>
    <li>
      <strong>The Consignor (Seller):</strong> Navigates to Consignment Intake &rarr; Fills manufacturer, reference, serial, box/papers status &rarr; Uploads macro photographs of dial, movement, and hallmarks &rarr; Specialist performs 48-hour appraisal &rarr; Digital reserve agreement signed &rarr; Scheduled into upcoming themed drop.
    </li>
  </ul>

  <h1 class="section-heading">3. Authentication, Verification &amp; <em>Seller Onboarding</em></h1>

  <div class="diagram-container">
    <svg class="diagram-svg" viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style="font-family:'Manrope',sans-serif;">
      <rect x="10" y="35" width="130" height="50" rx="3" fill="#EDE7DC" stroke="#182720"/>
      <text x="75" y="64" font-size="9" font-weight="600" text-anchor="middle" fill="#182720">1. Email &amp; Password</text>

      <line x1="140" y1="60" x2="180" y2="60" stroke="#182720" stroke-width="1.5" marker-end="url(#arrow)"/>

      <rect x="180" y="35" width="140" height="50" rx="3" fill="#EDE7DC" stroke="#182720"/>
      <text x="250" y="58" font-size="9" font-weight="600" text-anchor="middle" fill="#182720">2. 6-Digit PIN Verification</text>
      <text x="250" y="73" font-size="7.5" fill="#5C6E66" text-anchor="middle">15-Min Expiring Token</text>

      <line x1="320" y1="60" x2="360" y2="60" stroke="#182720" stroke-width="1.5"/>

      <rect x="360" y="35" width="140" height="50" rx="3" fill="#FAF7F0" stroke="#182720" stroke-width="1.5"/>
      <text x="430" y="58" font-size="9" font-weight="700" text-anchor="middle" fill="#182720">3. Unified Buyer Active</text>
      <text x="430" y="73" font-size="7.5" fill="#278E56" text-anchor="middle">Default Bidding Access</text>

      <line x1="500" y1="60" x2="540" y2="60" stroke="#182720" stroke-width="1.5"/>

      <rect x="540" y="35" width="150" height="50" rx="3" fill="#D7E65A" stroke="#182720"/>
      <text x="615" y="58" font-size="9" font-weight="700" text-anchor="middle" fill="#182720">4. Seller Onboarding</text>
      <text x="615" y="73" font-size="7.5" fill="#182720" text-anchor="middle">KYC + Payout Banking</text>
    </svg>
  </div>

  <table class="data-table">
    <thead>
      <tr>
        <th>Flow</th>
        <th>Input Requirements</th>
        <th>Verification Mechanism</th>
        <th>Security Safeguards</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Registration</strong></td>
        <td>Email address, legal name, strong password (min 10 chars).</td>
        <td>Cryptographic 6-digit one-time PIN dispatched to email.</td>
        <td>Rate limiting (max 5 attempts / 15 mins), IP throttling.</td>
      </tr>
      <tr>
        <td><strong>Password Reset</strong></td>
        <td>Registered email address.</td>
        <td>Signed, single-use, 15-minute token link.</td>
        <td>Invalidates all active sessions upon password replacement.</td>
      </tr>
      <tr>
        <td><strong>Seller Onboarding</strong></td>
        <td>Government ID proofing, residential address, IBAN/SWIFT banking.</td>
        <td>KYC identity verification check (Sandbox mock in Phase 1-5).</td>
        <td>Consignment contract cryptographically signed; payout accounts locked.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- SECTION 4 & 5 -->
<div class="page-section">
  <div class="header-running">
    <span>ChronoBid Vault Specification</span>
    <span>Section 4 &amp; 5: Homepage &amp; Design System</span>
  </div>

  <h1 class="section-heading">4. Homepage Architecture &amp; <em>Visual Specification</em></h1>

  <h2 class="sub-heading">4.1 Complete Section Order</h2>
  <ol>
    <li><strong>Top Masthead &amp; Ticker:</strong> Global horological clocks (Geneva, London, New York, Tokyo) and live hammer realization ticker.</li>
    <li><strong>Editorial Parallax Hero:</strong> Marquee headline (<em>"Curated Timepieces. Provable Provenance."</em>), featured marquee lot, live countdown, and split-column editorial photo layout.</li>
    <li><strong>Curated Vault Drops:</strong> Asymmetric editorial grid of active auction lots with high-res photography, calibre specifications, and real-time bid asks.</li>
    <li><strong>The ChronoBid Standard:</strong> 3-column physical audit showcase: Escrow Custody, 30-Point Mechanical Audit, and Archival Provenance Dossier.</li>
    <li><strong>Historic Hammer Archive:</strong> Interactive retrospective realization ledger showing historic hammer prices vs. catalog estimates.</li>
    <li><strong>Consignment Invitation:</strong> Understated luxury editorial callout (<em>"Entrust Your Timepiece"</em>) with direct appraisal calculator link.</li>
    <li><strong>Horological Journal / Dispatches:</strong> Long-form essays on movement calibres, horological history, and independent watchmakers.</li>
    <li><strong>Vault Footer &amp; Disclaimers:</strong> Transparent sandbox simulation disclosures, currency switcher (USD/EUR/CHF/GBP), and regulatory links.</li>
  </ol>

  <h1 class="section-heading">5. Design Tokens &amp; <em>Component Library</em></h1>

  <h2 class="sub-heading">5.1 Approved Color Palette Tokens</h2>
  <div class="swatch-group">
    <div class="swatch-card">
      <div class="swatch-color" style="background:#F4F0E8;"></div>
      <div class="swatch-name">Warm Paper</div>
      <div class="swatch-hex">#F4F0E8 (Base Canvas)</div>
    </div>
    <div class="swatch-card">
      <div class="swatch-color" style="background:#182720;"></div>
      <div class="swatch-name">Deep Forest</div>
      <div class="swatch-hex">#182720 (Typography)</div>
    </div>
    <div class="swatch-card">
      <div class="swatch-color" style="background:#D7E65A;"></div>
      <div class="swatch-name">Acid Lime</div>
      <div class="swatch-hex">#D7E65A (Action Accent)</div>
    </div>
    <div class="swatch-card">
      <div class="swatch-color" style="background:#D8D0C2;"></div>
      <div class="swatch-name">Stone</div>
      <div class="swatch-hex">#D8D0C2 (Hairline Borders)</div>
    </div>
  </div>

  <h2 class="sub-heading">5.2 Approved Typography Hierarchy</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th>Role</th>
        <th>Font Family</th>
        <th>Weight</th>
        <th>Size Clamp</th>
        <th>Application</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Display / Headings</strong></td>
        <td><code>Instrument Serif</code></td>
        <td>400 / Italic</td>
        <td>2.5rem – 4.5rem</td>
        <td>Section headlines, marquee titles, editorial pull-quotes.</td>
      </tr>
      <tr>
        <td><strong>Interface / Body</strong></td>
        <td><code>Manrope</code></td>
        <td>400, 500, 600</td>
        <td>0.875rem – 1.125rem</td>
        <td>Navigation, descriptive copy, button labels, form inputs.</td>
      </tr>
      <tr>
        <td><strong>Technical / Data</strong></td>
        <td><code>IBM Plex Mono</code></td>
        <td>400, 600</td>
        <td>0.75rem – 0.9375rem</td>
        <td>Timers, reference numbers, calibre IDs, bid prices, currencies.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="sub-heading">5.3 Reusable Base Component Inventory</h2>
  <ul>
    <li><code>LotCard</code>: Editorial card displaying watch photo, brand/reference, live countdown, current bid in mono, and quick-bid button.</li>
    <li><code>CountdownClock</code>: High-precision tick timer rendered in IBM Plex Mono with urgency color-shift (&lt;5m, &lt;2m soft-close).</li>
    <li><code>BidButton</code>: Tactile button with audio/visual feedback trigger and mandatory accessible name.</li>
    <li><code>SpecGrid</code>: Monospace technical specification table (Calibre, Jewels, Case Diameter, Power Reserve, Frequency).</li>
    <li><code>ConditionPill</code>: Curated grading badge (<em>Mint / Unworn</em>, <em>Serviced Vintage</em>, <em>Honest Patina</em>).</li>
  </ul>
</div>

<div class="page-break"></div>

<!-- SECTION 6 & 7 -->
<div class="page-section">
  <div class="header-running">
    <span>ChronoBid Vault Specification</span>
    <span>Section 6 &amp; 7: Sitemap &amp; Auction Mechanics</span>
  </div>

  <h1 class="section-heading">6. Sitemap &amp; <em>Navigation Architecture</em></h1>

  <div class="mono-box">
/ (Editorial Parallax Homepage)
├── /auctions
│   ├── /auctions/live              (Active live bidding rooms)
│   ├── /auctions/upcoming          (Preview catalog &amp; pre-registration)
│   └── /auctions/lots/[lotSlug]    (Deep lot inspection &amp; live bidding)
├── /archives                       (Historical realization ledger &amp; hammer trends)
├── /consign                        (Timepiece intake dossier &amp; appraisal estimator)
├── /journal                        (Horological dispatches &amp; movement teardowns)
├── /account                        (Unified collector portal: bids, watchlist, consignments)
└── /auth                           (Login, Register, PIN Verification, Password Reset)
  </div>

  <h1 class="section-heading">7. Auction Lifecycle &amp; <em>Simulation Integrity</em></h1>

  <div class="diagram-container">
    <svg class="diagram-svg" viewBox="0 0 700 100" xmlns="http://www.w3.org/2000/svg" style="font-family:'Manrope',sans-serif;">
      <rect x="5" y="30" width="85" height="40" rx="3" fill="#EDE7DC" stroke="#D8D0C2"/>
      <text x="47" y="55" font-size="8.5" text-anchor="middle" fill="#182720">1. Draft</text>

      <line x1="90" y1="50" x2="110" y2="50" stroke="#182720" stroke-width="1.5"/>

      <rect x="110" y="30" width="95" height="40" rx="3" fill="#EDE7DC" stroke="#D8D0C2"/>
      <text x="157" y="55" font-size="8.5" text-anchor="middle" fill="#182720">2. Published</text>

      <line x1="205" y1="50" x2="225" y2="50" stroke="#182720" stroke-width="1.5"/>

      <rect x="225" y="30" width="105" height="40" rx="3" fill="#FAF7F0" stroke="#182720" stroke-width="1.5"/>
      <text x="277" y="55" font-size="8.5" font-weight="700" text-anchor="middle" fill="#182720">3. Bidding Open</text>

      <line x1="330" y1="50" x2="350" y2="50" stroke="#182720" stroke-width="1.5"/>

      <rect x="350" y="30" width="115" height="40" rx="3" fill="#D7E65A" stroke="#182720"/>
      <text x="407" y="50" font-size="8" font-weight="700" text-anchor="middle" fill="#182720">4. Soft-Close (&lt;120s)</text>
      <text x="407" y="62" font-size="7" text-anchor="middle" fill="#182720">+120s Extension</text>

      <line x1="465" y1="50" x2="485" y2="50" stroke="#182720" stroke-width="1.5"/>

      <rect x="485" y="30" width="100" height="40" rx="3" fill="#EDE7DC" stroke="#182720"/>
      <text x="535" y="55" font-size="8.5" font-weight="700" text-anchor="middle" fill="#182720">5. Hammer Drop</text>

      <line x1="585" y1="50" x2="605" y2="50" stroke="#182720" stroke-width="1.5"/>

      <rect x="605" y="30" width="90" height="40" rx="3" fill="#EDE7DC" stroke="#D8D0C2"/>
      <text x="650" y="55" font-size="8.5" text-anchor="middle" fill="#182720">6. Settlement</text>
    </svg>
  </div>

  <h2 class="sub-heading">7.1 Soft-Close Anti-Sniping Algorithm</h2>
  <p>
    When any valid bid is submitted during the final 120 seconds of an auction lot, the closing time is automatically extended by an additional 120 seconds. This mirrors traditional saleroom mechanics where a lot remains open until all competing paddles have ceased, preventing programmatic last-second snipers from disenfranchising human collectors.
  </p>

  <h2 class="sub-heading">7.2 Strict Demo vs. Real Operational Boundaries</h2>
  <div class="callout">
    <strong>Mandatory Project Governance Rule:</strong> Under no circumstances may simulated bidding, test authentication, dummy escrow, or demonstration listings be represented as real financial transactions. All demonstration components carry permanent, explicit <code>[SANDBOX SIMULATION]</code> and <code>[DEMO LISTING]</code> tags.
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 8, 9, 10 -->
<div class="page-section">
  <div class="header-running">
    <span>ChronoBid Vault Specification</span>
    <span>Section 8, 9 &amp; 10: Governance, Testing &amp; Status</span>
  </div>

  <h1 class="section-heading">8. Accessibility, Security &amp; <em>Performance</em></h1>
  <ul>
    <li><strong>Accessibility (WCAG 2.1 AA):</strong> Primary typography (#182720 on #F4F0E8) achieves an exceptional contrast ratio of <strong>12.87:1</strong> (standard requires &ge;4.5:1). Active states on Acid Lime (#D7E65A) with dark text achieve <strong>11.4:1</strong>. ARIA-live polite regions for real-time bid feeds and timer changes. 100% accessible names on all Lucide icon controls.</li>
    <li><strong>Security:</strong> Strict sanitization of consignment intake forms, maximum bid increment caps to prevent fat-finger submissions, HTTP-only secure cookie sessions.</li>
    <li><strong>Performance (Core Web Vitals):</strong> LCP &lt; 1.2s via next-gen image preloading, CLS &lt; 0.02 using rigid aspect-ratio image containers, INP &lt; 80ms for tactile bidding controls.</li>
  </ul>

  <h1 class="section-heading">9. Testing Strategy &amp; <em>Acceptance Criteria</em></h1>
  <table class="data-table">
    <thead>
      <tr>
        <th>Suite</th>
        <th>Framework</th>
        <th>Target Scope</th>
        <th>Success Metric</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Unit Tests</strong></td>
        <td>Vitest</td>
        <td>Bid increments, soft-close calculations, currency converters, reserve algorithms.</td>
        <td>100% pass on core auction logic.</td>
      </tr>
      <tr>
        <td><strong>Component &amp; a11y</strong></td>
        <td>Testing Library + axe</td>
        <td>Keyboard focus traps, accessible names, countdown ARIA updates.</td>
        <td>0 automated WCAG AA violations.</td>
      </tr>
      <tr>
        <td><strong>End-to-End</strong></td>
        <td>Playwright / Browser</td>
        <td>Complete buyer bidding flow, simulated counter-bid loop, intake form submission.</td>
        <td>Zero layout shifts; complete flow completion.</td>
      </tr>
    </tbody>
  </table>

  <h1 class="section-heading">10. Decisions, Rules &amp; <em>Phase 1 Signoff</em></h1>

  <h2 class="sub-heading">10.1 Confirmed Requirements vs. Provisional Models</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th>Item</th>
        <th>Status</th>
        <th>Specification Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Visual Identity</strong></td>
        <td><span class="badge-tag badge-approved">Approved</span></td>
        <td>Editorial-parallax, Instrument Serif + Manrope + IBM Plex Mono, Warm Paper palette.</td>
      </tr>
      <tr>
        <td><strong>Frontend Stack</strong></td>
        <td><span class="badge-tag badge-approved">Approved</span></td>
        <td>Next.js App Router (React, TypeScript, Tailwind CSS).</td>
      </tr>
      <tr>
        <td><strong>Account Architecture</strong></td>
        <td><span class="badge-tag badge-approved">Approved</span></td>
        <td>Unified single account (buyer baseline, consignor unlocked via KYC onboarding).</td>
      </tr>
      <tr>
        <td><strong>Demo Data Labeling</strong></td>
        <td><span class="badge-tag badge-approved">Approved</span></td>
        <td>Universal persistent <code>[DEMO DATA]</code> badge across all sample lots, bids, and prices.</td>
      </tr>
      <tr>
        <td><strong>Provisional Watch Catalog</strong></td>
        <td><span class="badge-tag badge-provisional">Provisional</span></td>
        <td>6 models (Patek 3520D, AP 5402ST, Daytona 6239, Speedy 2915, Tank Cintrée, Datograph) provisional pending asset rights verification.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="sub-heading">10.2 Next Phase Gating</h2>
  <p>
    Upon explicit user review and confirmation of this document:
    <br>&bull; <strong>Phase 1 is declared Complete.</strong>
    <br>&bull; <strong>Phase 2 commences:</strong> Scaffolding the Next.js App Router project structure, configuring custom Tailwind tokens, and building the base component library.
  </p>
</div>

</body>
</html>
"""

html_path = r"c:\Users\kbjee\OneDrive\Desktop\omniroute\auction system\specification_dossier.html"
pdf_path = r"c:\Users\kbjee\OneDrive\Desktop\omniroute\auction system\ChronoBid_Vault_Phase1_Specification.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML generated successfully. Compiling PDF via Edge...")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print(f"Edge process completed with exit code: {res.returncode}")
if os.path.exists(pdf_path):
    print(f"PDF successfully created at: {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
else:
    print("PDF creation failed.")
