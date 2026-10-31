import subprocess
import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ChronoBid Vault — Phase 1 Specification (v2.0 Draft)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
  }
  * { box-sizing: border-box; }
  body {
    background-color: #F4F0E8;
    color: #182720;
    font-family: 'Manrope', -apple-system, sans-serif;
    font-size: 10pt;
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
    padding: 22mm 10mm 16mm 10mm;
    border: 1px solid #D8D0C2;
    background: #F4F0E8;
  }
  .cover-header { border-bottom: 2px solid #182720; padding-bottom: 8mm; }
  .brand-mono {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9.5pt;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #4A5B53;
  }
  .cover-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 38pt;
    line-height: 1.05;
    margin: 10mm 0 4mm 0;
    color: #182720;
    font-weight: 400;
  }
  .cover-title em { font-style: italic; }
  .cover-subtitle { font-size: 12.5pt; color: #374A41; }
  .cover-badge-pending {
    display: inline-block;
    background: #182720;
    color: #F4F0E8;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8.5pt;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 2px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 6mm;
  }
  .cover-meta-table { width: 100%; border-collapse: collapse; margin-top: 16mm; }
  .cover-meta-table td { padding: 8px 12px; border-bottom: 1px solid #D8D0C2; font-size: 9pt; }
  .cover-meta-label { font-family: 'IBM Plex Mono', monospace; font-size: 8.5pt; color: #5C6E66; text-transform: uppercase; width: 34%; }
  .cover-meta-value { font-weight: 600; color: #182720; }
  .cover-footer {
    border-top: 1px solid #D8D0C2;
    padding-top: 6mm;
    display: flex;
    justify-content: space-between;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8pt;
    color: #6C7D75;
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
  h1.section-heading {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 22pt;
    font-weight: 400;
    color: #182720;
    border-bottom: 1px solid #182720;
    padding-bottom: 2.5mm;
    margin-top: 6mm;
    margin-bottom: 4mm;
  }
  h1.section-heading em { font-style: italic; }
  h2.sub-heading {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 15pt;
    font-weight: 400;
    color: #182720;
    margin-top: 5mm;
    margin-bottom: 2.5mm;
  }
  p { margin: 0 0 3mm 0; text-align: justify; }
  ul, ol { margin: 0 0 3.5mm 0; padding-left: 5mm; }
  li { margin-bottom: 1.5mm; }

  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 3mm 0 5mm 0;
    font-size: 8.5pt;
    background: #FAF7F0;
  }
  table.data-table th {
    background-color: #EDE7DC;
    color: #182720;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 6px 8px;
    border: 1px solid #D8D0C2;
    text-align: left;
  }
  table.data-table td { padding: 6px 8px; border: 1px solid #D8D0C2; vertical-align: top; }
  table.data-table tr:nth-child(even) td { background-color: #F4F0E8; }

  .callout {
    border-left: 3px solid #182720;
    background: #EDE7DC;
    padding: 8px 12px;
    margin: 3.5mm 0 4.5mm 0;
    font-size: 8.5pt;
  }
  .mono-box {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8pt;
    background: #FAF7F0;
    border: 1px solid #D8D0C2;
    padding: 6px 8px;
    margin: 3mm 0;
    line-height: 1.35;
  }
  .page-break { page-break-after: always; }
  .badge-tag {
    display: inline-block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 7pt;
    padding: 2px 6px;
    border-radius: 2px;
    text-transform: uppercase;
  }
  .badge-approved { background: #D7E65A; color: #182720; font-weight: 600; }
  .badge-pending { background: #EDE7DC; border: 1px solid #D8D0C2; color: #5C6E66; }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
  <div class="cover-header">
    <div class="brand-mono">ChronoBid Vault &bull; Curated Horological Auction System</div>
    <div class="cover-title">Phase 1: Requirements &amp; <em>Design Specification</em></div>
    <div class="cover-subtitle">Revised Draft v2.0 &bull; Approved 11-Section Sequence, Token Scales &amp; Operational Boundaries</div>
    <span class="cover-badge-pending">DRAFT FOR USER REVIEW — PHASE 1 SIGN-OFF PENDING</span>
  </div>

  <table class="cover-meta-table">
    <tr>
      <td class="cover-meta-label">Governance Notice</td>
      <td class="cover-meta-value"><strong>Phase 2 is NOT authorised.</strong> Progression requires explicit user review and sign-off.</td>
    </tr>
    <tr>
      <td class="cover-meta-label">Target Architecture</td>
      <td class="cover-meta-value">Next.js App Router (React, TypeScript, Tailwind CSS)</td>
    </tr>
    <tr>
      <td class="cover-meta-label">Visual Direction</td>
      <td class="cover-meta-value">Editorial-Parallax, Premium-Light, Monograph Publication Aesthetic</td>
    </tr>
    <tr>
      <td class="cover-meta-label">Approved Sequence</td>
      <td class="cover-meta-value">11 Homepage Sections (Announcement &rarr; Header &rarr; Hero &rarr; Intro &rarr; Collection &rarr; Interlude &rarr; Saleroom &rarr; How It Works &rarr; Trust &rarr; Invitation &rarr; Footer)</td>
    </tr>
    <tr>
      <td class="cover-meta-label">Document Version</td>
      <td class="cover-meta-value">Version 2.0 (Revised Draft &bull; October 2026)</td>
    </tr>
  </table>

  <div class="cover-footer">
    <span>STRICTLY CONFIDENTIAL &bull; SPECIFICATION REVISION ONLY</span>
    <span>CHRONOBID-VAULT-v2.0-DRAFT</span>
  </div>
</div>

<!-- SECTION 1 & 2 -->
<div>
  <div class="header-running">
    <span>ChronoBid Vault Specification v2.0</span>
    <span>Section 1 &amp; 2: Scope &amp; Confirmed Decisions</span>
  </div>

  <h1 class="section-heading">1. Product Mission &amp; <em>Scope Boundaries</em></h1>
  <p>
    <strong>ChronoBid Vault</strong> is an artisanal, highly curated digital auction house dedicated to rare, vintage, and historically significant horological timepieces. The system balances the tactile dignity, provenance-first presentation, and quiet luxury of prestigious European salerooms with modern web accessibility.
  </p>
  <p>
    <strong>Prototype vs. Production Boundary:</strong> The Phase 1–5 scope delivers a complete, high-fidelity frontend prototype with realistic client-side demonstration bidding, simulated counter-bidding bots, soft-close extensions, and an intake dossier form. Real payment escrow, bank identity verification, and multi-region distributed websocket clusters are deferred to Phase 6 backend architecture.
  </p>

  <h1 class="section-heading">2. Confirmed Requirements vs. <em>Unresolved Decisions</em></h1>
  <table class="data-table">
    <thead>
      <tr>
        <th>Specification Dimension</th>
        <th>Governance Status</th>
        <th>Specification Summary</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Project Identity &amp; Domain</strong></td>
        <td><span class="badge-tag badge-approved">Approved</span></td>
        <td>ChronoBid Vault &bull; Curated rare horology and vintage timepiece auctions.</td>
      </tr>
      <tr>
        <td><strong>Frontend Tech Stack</strong></td>
        <td><span class="badge-tag badge-approved">Approved</span></td>
        <td>Next.js App Router, React, TypeScript, Tailwind CSS (Component-based, typed).</td>
      </tr>
      <tr>
        <td><strong>Visual Identity &amp; Colors</strong></td>
        <td><span class="badge-tag badge-approved">Approved</span></td>
        <td>Warm Paper (<code>#F4F0E8</code>), Deep Forest (<code>#182720</code>), Acid Lime (<code>#D7E65A</code>), Stone (<code>#D8D0C2</code>).</td>
      </tr>
      <tr>
        <td><strong>Typography Hierarchy</strong></td>
        <td><span class="badge-tag badge-approved">Approved</span></td>
        <td><code>Instrument Serif</code> (Display), <code>Manrope</code> (Body/UI), <code>IBM Plex Mono</code> (Technical/Timers).</td>
      </tr>
      <tr>
        <td><strong>Homepage Section Sequence</strong></td>
        <td><span class="badge-tag badge-approved">Approved</span></td>
        <td>Approved 11-section order (Announcement &rarr; Header &rarr; Hero &rarr; Intro &rarr; Collection &rarr; Interlude &rarr; Saleroom &rarr; How It Works &rarr; Trust &rarr; Invitation &rarr; Footer).</td>
      </tr>
      <tr>
        <td><strong>Universal Demo Tagging</strong></td>
        <td><span class="badge-tag badge-approved">Approved</span></td>
        <td>Permanent, high-contrast <code>[DEMO DATA]</code> indicators on all fictional lots, prices, and bids.</td>
      </tr>
      <tr>
        <td><strong>Provisional Watch Catalog</strong></td>
        <td><span class="badge-tag badge-pending">Provisional</span></td>
        <td>6 references (Patek 3520D, AP 5402ST, Rolex 6239, Omega 2915, Cartier Tank Cintrée, Lange Datograph) remain strictly provisional until exact references, details, and image rights are checked.</td>
      </tr>
      <tr>
        <td><strong>Anti-Sniping Soft-Close</strong></td>
        <td><span class="badge-tag badge-pending">Pending Approval</span></td>
        <td>Proposed 120-second timer reset on bids placed in final 120s is a configurable business rule.</td>
      </tr>
      <tr>
        <td><strong>Optional Showcase Features</strong></td>
        <td><span class="badge-tag badge-pending">Pending Approval</span></td>
        <td>World clocks, live hammer ticker, historic hammer archive, journal, appraisal calculator are marked as optional proposals requiring explicit approval.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- SECTION 3 & 4 & 5 -->
<div>
  <div class="header-running">
    <span>ChronoBid Vault Specification v2.0</span>
    <span>Section 3, 4 &amp; 5: Roles, Journeys &amp; Onboarding</span>
  </div>

  <h1 class="section-heading">3. User Roles &amp; <em>Account Model</em></h1>
  <p>
    The platform enforces a single unified account structure for all participants. Guests have read-only access. Registered members default to buyer privileges (placing simulated bids, managing watchlists). Consignor privileges (submitting intake dossiers, negotiating reserves) are unlocked through onboarding verification within the same account. Platform specialists operate under isolated security gates.
  </p>

  <h1 class="section-heading">4. User Journeys &amp; <em>Intent Selection</em></h1>
  <ul>
    <li><strong>Guest Browsing:</strong> Public discovery of editorial content and catalog without blockers. Any state persistence triggers an accessible authentication modal.</li>
    <li><strong>Buyer Intent:</strong> Collector enrolls in live saleroom demo, views current ask in mono, places bids, experiences soft-close extension, receives accessible outbid alerts.</li>
    <li><strong>Seller Intent:</strong> Collector accesses consignment intake dossier, inputs reference specs, uploads proof imagery (mocked), receives a 48h appraisal ticket.</li>
    <li><strong>Exploring User Intent:</strong> Visitor selects "Just exploring" during post-signup onboarding; application tailors experience without aggressive conversion triggers.</li>
  </ul>

  <h1 class="section-heading">5. Login, Signup &amp; <em>Account Onboarding</em></h1>
  <div class="callout">
    <strong>Post-Signup Intent Routing:</strong> After signup, users choose between: <em>"Bid on objects"</em>, <em>"Sell my objects"</em>, <em>"Both"</em>, or <em>"Just exploring"</em>. This is a changeable UI routing preference and does NOT grant privileged administrative permissions. Real identity documents or bank accounts are strictly prohibited in the demo prototype.
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 6: HOMEPAGE ARCHITECTURE -->
<div>
  <div class="header-running">
    <span>ChronoBid Vault Specification v2.0</span>
    <span>Section 6: Approved 11-Section Homepage Sequence</span>
  </div>

  <h1 class="section-heading">6. Homepage Architecture &amp; <em>Interaction Design</em></h1>

  <table class="data-table">
    <thead>
      <tr>
        <th>Seq</th>
        <th>Section Name</th>
        <th>Content Hierarchy &amp; Aesthetics</th>
        <th>Primary Action</th>
        <th>Responsive Behaviour</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>01</strong></td>
        <td><strong>Announcement Strip</strong></td>
        <td>Eyebrow banner in Deep Forest (<code>#182720</code>) with Warm Paper mono text. Highlights drop status and demo disclosure.</td>
        <td>Link to upcoming drop preview.</td>
        <td>Fixed 36px desktop / 42px mobile.</td>
      </tr>
      <tr>
        <td><strong>02</strong></td>
        <td><strong>Header &amp; Navigation</strong></td>
        <td>Brand wordmark, primary links (Catalog, How It Works, Transparency), currency switcher, watchlist icon, Sign In button.</td>
        <td>Sign In / Register modal trigger.</td>
        <td>Sticky on scroll with 8px glass blur; collapses to slide-over sheet &lt;768px.</td>
      </tr>
      <tr>
        <td><strong>03</strong></td>
        <td><strong>Editorial Hero: "Objects worth waiting for."</strong></td>
        <td>Hero headline in <code>Instrument Serif</code> (88–112px desktop / 46–58px mobile), 2-sentence manifesto, featured marquee timepiece photo, mono spec strip.</td>
        <td><code>Explore Current Lots</code> (Acid Lime CTA).</td>
        <td>12-column grid at 1440px; single stacked column at 390px. Text reveal 450–650ms.</td>
      </tr>
      <tr>
        <td><strong>04</strong></td>
        <td><strong>Editorial Introduction</strong></td>
        <td>Monograph philosophy statement (32–44px serif), 2-column editorial copy on horological provenance and physical custody ethics.</td>
        <td><code>Learn About Our Standards</code> (text link).</td>
        <td>2 columns desktop; single column mobile with 96px vertical padding.</td>
      </tr>
      <tr>
        <td><strong>05</strong></td>
        <td><strong>Featured Collection &amp; Category Filters</strong></td>
        <td>Section title (52–68px), reactive filter tabs (Chronographs, Dress, Divers, Complications), 3-column asymmetric lot cards with 4:5 portrait photos.</td>
        <td>Filter tabs (cross-fade 180–260ms); card click opens lot room.</td>
        <td>3 cols &ge;1280px; 2 cols at 1024px/768px; 1 col with horizontal scroll at 390px.</td>
      </tr>
      <tr>
        <td><strong>06</strong></td>
        <td><strong>Full-Width Editorial Interlude</strong></td>
        <td>Edge-to-edge Deep Forest container (<code>#182720</code>), macro mechanical escapement visual, pull quote in italic serif (40–56px).</td>
        <td>None (Visual atmosphere &amp; breathing room).</td>
        <td>Constrained height 480px desktop, 320px mobile.</td>
      </tr>
      <tr>
        <td><strong>07</strong></td>
        <td><strong>Featured Auction Room</strong></td>
        <td>Live saleroom split-pane: left pane displays studio macro angles; right pane displays live countdown (mono), current ask, live paddle feed, bid button.</td>
        <td>Interactive demonstration bid trigger.</td>
        <td>Split-pane desktop; vertical stacked panes on mobile with sticky bottom bid bar.</td>
      </tr>
      <tr>
        <td><strong>08</strong></td>
        <td><strong>How It Works</strong></td>
        <td>4-step numbered architectural sequence: 1. Curated Vetting, 2. Verified Bidding, 3. Escrow Custody, 4. Insured Transit.</td>
        <td><code>View Full Collector Guide</code>.</td>
        <td>4 columns desktop; 2x2 tablet; vertical step accordion mobile.</td>
      </tr>
      <tr>
        <td><strong>09</strong></td>
        <td><strong>Trust &amp; Transparency</strong></td>
        <td>3 core truthfulness pillars: Provable Provenance, Independent Condition Audit, Sandbox Honesty.</td>
        <td><code>Inspect Sample Condition Dossier</code>.</td>
        <td>3 balanced columns; stacked mobile.</td>
      </tr>
      <tr>
        <td><strong>10</strong></td>
        <td><strong>Final Invitation</strong></td>
        <td>Dual conversion callout: Buyer Card (Register for Drops) and Consignor Card (Request Valuation).</td>
        <td>Register to Bid (Acid Lime CTA).</td>
        <td>2 columns desktop; stacked cards mobile.</td>
      </tr>
      <tr>
        <td><strong>11</strong></td>
        <td><strong>Footer</strong></td>
        <td>Wordmark, navigation columns, persistent demo disclosure banner, currency switcher, WCAG 2.2 AA statement.</td>
        <td>Navigation &amp; legal links.</td>
        <td>Multi-column desktop; accordion mobile.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- SECTION 7 & 8: TOKENS, ASSETS & MOTION -->
<div>
  <div class="header-running">
    <span>ChronoBid Vault Specification v2.0</span>
    <span>Section 7 &amp; 8: Design Tokens &amp; Motion</span>
  </div>

  <h1 class="section-heading">7. Typography, Layout Tokens &amp; <em>Breakpoints</em></h1>
  <table class="data-table">
    <thead>
      <tr>
        <th>Typographic Role</th>
        <th>Font Family</th>
        <th>Desktop Scale (&ge;1024px)</th>
        <th>Mobile Scale (&lt;768px)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Hero Display</td>
        <td><code>Instrument Serif</code></td>
        <td>88px – 112px</td>
        <td>46px – 58px</td>
      </tr>
      <tr>
        <td>Main Section Heading</td>
        <td><code>Instrument Serif</code></td>
        <td>52px – 68px</td>
        <td>34px – 42px</td>
      </tr>
      <tr>
        <td>Collection Heading</td>
        <td><code>Instrument Serif</code></td>
        <td>32px – 44px</td>
        <td>27px – 34px</td>
      </tr>
      <tr>
        <td>Auction Item Title</td>
        <td><code>Manrope</code> (SemiBold)</td>
        <td>24px – 30px</td>
        <td>22px – 27px</td>
      </tr>
      <tr>
        <td>Large Auction Price</td>
        <td><code>IBM Plex Mono</code> (Bold)</td>
        <td>32px – 40px</td>
        <td>28px – 34px</td>
      </tr>
      <tr>
        <td>Body Text</td>
        <td><code>Manrope</code> (Regular)</td>
        <td>16px – 18px</td>
        <td>At least 16px (prevents iOS form zoom)</td>
      </tr>
      <tr>
        <td>Navigation Links</td>
        <td><code>Manrope</code> (Medium)</td>
        <td>13px – 15px</td>
        <td>15px – 16px in mobile drawer</td>
      </tr>
      <tr>
        <td>Button Labels</td>
        <td><code>Manrope</code> (SemiBold)</td>
        <td>14px – 15px</td>
        <td>14px – 15px</td>
      </tr>
      <tr>
        <td>Technical Labels &amp; Badges</td>
        <td><code>IBM Plex Mono</code></td>
        <td>10px – 12px</td>
        <td>10px – 11px</td>
      </tr>
    </tbody>
  </table>

  <h2 class="sub-heading">Approved Responsive Breakpoints</h2>
  <div class="mono-box">
  1440px (Wide Desktop, 1360px max-width)  &bull;  1280px (Standard Desktop, 1200px max-width)
  1024px (Small Desktop/Tablet, 960px)   &bull;  768px  (Tablet Portrait, 720px)
  390px  (Mobile Large, 100% width)       &bull;  360px  (Mobile Compact, 100% width)
  </div>

  <h1 class="section-heading">8. Images, Icons &amp; <em>Motion Parameters</em></h1>
  <table class="data-table">
    <thead>
      <tr>
        <th>Motion Element</th>
        <th>Approved Duration Range</th>
        <th>Easing / Dynamic Behavior</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Hero Text Reveal</td>
        <td><code>450ms – 650ms</code></td>
        <td><code>cubic-bezier(0.16, 1, 0.3, 1)</code>, translateY 16px &rarr; 0</td>
      </tr>
      <tr>
        <td>Hero Image Reveal</td>
        <td><code>900ms – 1200ms</code></td>
        <td>Opacity fade &amp; subtle scale 1.04 &rarr; 1.0</td>
      </tr>
      <tr>
        <td>Scroll Reveals</td>
        <td><code>450ms – 650ms</code></td>
        <td>12px – 20px vertical movement</td>
      </tr>
      <tr>
        <td>Navigation Hover</td>
        <td><code>160ms – 220ms</code></td>
        <td>Subtle opacity and underline transition</td>
      </tr>
      <tr>
        <td>Button Interaction</td>
        <td><code>150ms – 200ms</code></td>
        <td>Background &amp; border color shift; scale(0.98) on active</td>
      </tr>
      <tr>
        <td>Image Hover Scale</td>
        <td><code>350ms – 500ms</code></td>
        <td>Strictly limited to <code>1.02 – 1.035</code></td>
      </tr>
      <tr>
        <td>Category Filters</td>
        <td><code>180ms – 260ms</code></td>
        <td>Cross-fade opacity on grid items</td>
      </tr>
      <tr>
        <td>Modals &amp; Drawers</td>
        <td><code>180ms – 250ms</code></td>
        <td>Slide and fade; focus trapped</td>
      </tr>
    </tbody>
  </table>
  <div class="callout">
    <strong>Reduced Motion Mandate:</strong> Under <code>@media (prefers-reduced-motion: reduce)</code>, all transform parallax and scale zooms are disabled. Transitions convert to instantaneous or minimal opacity fades (&lt;150ms).
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 9 & 10: GOVERNANCE & GATING -->
<div>
  <div class="header-running">
    <span>ChronoBid Vault Specification v2.0</span>
    <span>Section 9 &amp; 10: Testing, Compliance &amp; Sign-Off Gate</span>
  </div>

  <h1 class="section-heading">9. Accessibility, Security &amp; <em>Testing Matrix</em></h1>
  <ul>
    <li><strong>Accessibility:</strong> Proposed target is <strong>WCAG 2.2 AA</strong>. Contrast ratio of Deep Forest on Warm Paper is <strong>12.87:1</strong>. All icon buttons must have explicit accessible names via <code>aria-label</code>. Dynamic auction updates use <code>aria-live="polite"</code>.</li>
    <li><strong>Performance Targets:</strong> LCP &lt; 1.5s, CLS &lt; 0.02 (rigid aspect-ratio image containers), INP &lt; 100ms. All performance figures are targets to measure, not achieved claims.</li>
    <li><strong>Testing Demarcation:</strong> Frontend tests (Vitest unit calculations, React Testing Library a11y, Playwright responsive audits) are conducted during frontend phases. Backend tests (concurrency race conditions, distributed websocket latency) are deferred to Phase 6.</li>
  </ul>

  <h1 class="section-heading">10. Explicit Sign-Off Gate</h1>
  <div class="callout" style="border-left: 4px solid #182720; background: #EDE7DC;">
    <h3 style="margin-top:0; color:#182720; font-family:'Instrument Serif', serif; font-size:16pt;">Governance Checkpoint: Phase 1 Sign-Off Pending</h3>
    <p>
      <strong>PHASE 2 IS NOT AUTHORISED.</strong><br>
      No Next.js scaffolding, component creation, or website implementation may proceed until the user reviews this revised specification and grants explicit written authorization.
    </p>
  </div>
</div>

</body>
</html>
"""

html_path = r"c:\Users\kbjee\OneDrive\Desktop\omniroute\auction system\specification_dossier_v2.html"
pdf_path = r"c:\Users\kbjee\OneDrive\Desktop\omniroute\auction system\ChronoBid_Vault_Phase1_Specification_v2.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

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
if os.path.exists(pdf_path):
    print(f"Revised PDF successfully created at: {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
else:
    print("PDF creation failed.")
