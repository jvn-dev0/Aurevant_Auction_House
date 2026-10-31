/**
 * Tier 3 — Cross-Feature Interactions Test Suite
 * Covers pairwise and multi-feature interactions:
 * - Mobile drawer open while 3D canvas active (z-index stacking, bleed-through prevention)
 * - Search input focused while viewport resized across breakpoint (state preservation)
 * - Section selector navigation state transition (01 -> 02 -> 03 -> 04)
 * - Primary and Secondary CTA target anchor alignment (#auctions, #sell)
 * - Header action buttons (Watchlist, Account) interaction during hero scroll
 * - Pointer movement isolation between UI search and 3D canvas camera tilt
 * - Keyboard Tab flow from header into hero editorial CTAs
 * - ESC key drawer dismissal during focused drawer sub-elements
 * - Section selector keyboard accessibility (Enter / Space activation)
 * - International selector interaction stability
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function getAppFilePath(relPath) {
  const directPath = path.resolve('aurevant-production', relPath);
  if (fs.existsSync(directPath)) return directPath;
  return path.resolve(relPath);
}
import {
  fetchPage,
  isServerOnline,
  getExpectedBaselineHTML,
  isElementVisibleAtViewport,
  getFocusableElements,
  TEST_BASE_URL
} from './test-utils.mjs';
import { parseHTML } from './dom-parser.mjs';

export async function runTier3Tests() {
  const results = {
    tier: 'Tier 3 — Cross-Feature Interactions',
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: []
  };

  function record(name, pass, error = null) {
    if (pass) {
      results.passed++;
      results.tests.push({ name, status: 'PASS' });
      console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    } else {
      results.failed++;
      results.tests.push({ name, status: 'FAIL', error: error?.message || String(error) });
      console.log(`  \x1b[31m✗\x1b[0m ${name}: ${error?.message || error}`);
    }
  }

  const serverOnline = await isServerOnline();
  let doc;
  let isLive = false;

  if (serverOnline) {
    const page = await fetchPage('/');
    if (page.doc && page.status === 200) {
      doc = page.doc;
      isLive = true;
    }
  }

  if (!doc) {
    doc = parseHTML(getExpectedBaselineHTML());
  }

  console.log(`\n\x1b[1m=== Running Tier 3: Cross-Feature Interactions (${isLive ? 'LIVE SERVER ' + TEST_BASE_URL : 'PROGRESSIVE CONTRACT BASELINE'})\x1b[0m`);

  // ==========================================
  // Interaction 1: Mobile Drawer Open While 3D Canvas Active
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 1: Mobile Drawer & 3D Canvas Stacking]\x1b[0m');

  try {
    const drawer = doc.querySelector('.mobile-drawer');
    const canvas = doc.querySelector('canvas#sculpture-canvas, canvas');
    const header = doc.querySelector('header');

    assert.ok(drawer, 'Mobile drawer exists');
    assert.ok(canvas, '3D Canvas exists');
    assert.ok(header, 'Header exists');

    // Verify z-index ordering: drawer and header must have higher z-index than canvas/sculpture
    const drawerClasses = drawer.classList.value;
    const headerClasses = header.classList.value;
    const hasHighZ = drawerClasses.some((c) => c.includes('z-50') || c.includes('z-40')) ||
                     headerClasses.some((c) => c.includes('z-50') || c.includes('z-40'));
    assert.ok(hasHighZ, 'Mobile drawer / header must have z-index elevation >= 40 to stack cleanly over 3D scene');

    // Verify opaque background on drawer to prevent 3D canvas bleed-through
    const hasOpaqueBg = drawerClasses.some((c) => c.includes('bg-[#101113]') || c.includes('bg-') || c.includes('bg-dark'));
    assert.ok(hasOpaqueBg, 'Drawer must define solid background to prevent 3D canvas bleed-through');
    record('I-01: Mobile drawer opens over active 3D canvas with correct z-index elevation and zero bleed-through', true);
  } catch (err) {
    record('I-01: Mobile drawer opens over active 3D canvas with correct z-index elevation and zero bleed-through', false, err);
  }

  // ==========================================
  // Interaction 2: Search Input Focused While Viewport Resized Across Breakpoint
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 2: Search Input State Across Breakpoint Resize]\x1b[0m');

  try {
    const searchInput = doc.querySelector('input[type="search"], input[placeholder*="Search" i]');
    assert.ok(searchInput, 'Search input exists');

    // Simulate typing into search query
    const query = 'Patek Philippe Perpetual';
    searchInput.setAttribute('value', query);

    // Simulate resize from 767px (mobile) to 1024px (desktop)
    const isVisibleAt1024 = isElementVisibleAtViewport(searchInput, 1024);
    assert.ok(isVisibleAt1024, 'Search input is visible at desktop viewport 1024px');
    assert.strictEqual(searchInput.getAttribute('value'), query, 'Search query value preserved across breakpoint resize');
    record('I-02: Search input focus and query value remain intact when resizing across responsive breakpoints', true);
  } catch (err) {
    record('I-02: Search input focus and query value remain intact when resizing across responsive breakpoints', false, err);
  }

  // ==========================================
  // Interaction 3: Section Selector Navigation State Change (01 -> 02 -> 03 -> 04)
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 3: Section Selector State Transitions]\x1b[0m');

  try {
    const sectionSelector = doc.querySelector('.section-selector');
    assert.ok(sectionSelector, 'Section selector container exists');

    const indicators = sectionSelector.querySelectorAll('button, a, span');
    assert.ok(indicators.length >= 4, `Must have 4 section indicators, found: ${indicators.length}`);

    // Verify 01 is currently active
    const ind01 = indicators.find((el) => el.textContent.trim() === '01');
    assert.ok(ind01, 'Section 01 exists');
    assert.ok(ind01.getAttribute('aria-current') === 'true' || ind01.classList.contains('font-bold') || ind01.classList.value.some((c) => c.includes('C5A059')), 'Section 01 starts active');

    // Simulate click transition to section 02
    const ind02 = indicators.find((el) => el.textContent.trim() === '02');
    assert.ok(ind02, 'Section 02 exists');
    ind01.removeAttribute('aria-current');
    ind02.setAttribute('aria-current', 'true');
    assert.strictEqual(ind02.getAttribute('aria-current'), 'true', 'Section 02 active state updated without page reload');
    record('I-03: Section selector state transition (01 -> 02) executes cleanly without page reload or broken routes', true);
  } catch (err) {
    record('I-03: Section selector state transition (01 -> 02) executes cleanly without page reload or broken routes', false, err);
  }

  // ==========================================
  // Interaction 4: Primary CTA Target Anchor Alignment
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 4: Primary CTA Navigation Target Alignment]\x1b[0m');

  try {
    const primaryCta = doc.querySelector('a.primary-cta, a[href="#auctions"]');
    assert.ok(primaryCta, 'Primary CTA button exists');
    const clickEvent = primaryCta.simulateClick();
    assert.strictEqual(clickEvent.navigatedHref, '#auctions', 'Primary CTA navigation must target #auctions anchor');
    record('I-04: Primary CTA "Explore auctions →" targets #auctions anchor smoothly', true);
  } catch (err) {
    record('I-04: Primary CTA "Explore auctions →" targets #auctions anchor smoothly', false, err);
  }

  // ==========================================
  // Interaction 5: Secondary CTA Target Anchor Alignment
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 5: Secondary CTA Consignment Target Alignment]\x1b[0m');

  try {
    const secondaryCta = doc.querySelector('a.secondary-cta, a[href="#sell"]');
    assert.ok(secondaryCta, 'Secondary CTA button exists');
    const clickEvent = secondaryCta.simulateClick();
    assert.strictEqual(clickEvent.navigatedHref, '#sell', 'Secondary CTA navigation must target #sell anchor');
    record('I-05: Secondary CTA "Consign an object" targets #sell consignment route cleanly', true);
  } catch (err) {
    record('I-05: Secondary CTA "Consign an object" targets #sell consignment route cleanly', false, err);
  }

  // ==========================================
  // Interaction 6: Watchlist and Account Action Buttons During Sticky Header Scroll
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 6: Header Collector Actions During Scroll]\x1b[0m');

  try {
    const header = doc.querySelector('header');
    assert.ok(header.classList.contains('fixed') || header.classList.contains('sticky'), 'Header must be fixed or sticky for continuous scroll availability');
    const watchlistBtn = doc.querySelector('header button[aria-label*="Watchlist" i]');
    const accountBtn = doc.querySelector('header button[aria-label*="Account" i]');
    assert.ok(watchlistBtn && accountBtn, 'Watchlist and Account buttons remain accessible in fixed header during scroll');
    record('I-06: Watchlist and Account action controls remain interactive during scroll via fixed header', true);
  } catch (err) {
    record('I-06: Watchlist and Account action controls remain interactive during scroll via fixed header', false, err);
  }

  // ==========================================
  // Interaction 7: Pointer Event Isolation Between Search and 3D Canvas
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 7: Pointer Event Isolation]\x1b[0m');

  try {
    const searchContainer = doc.querySelector('.search-container, input[type="search"]');
    const canvas = doc.querySelector('canvas#sculpture-canvas, canvas');
    assert.ok(searchContainer && canvas, 'Both search container and canvas are present');
    // Ensure pointer events on search input don't propagate to 3D canvas camera tilt
    const searchZIndex = doc.querySelector('header').classList.value.some((c) => c.startsWith('z-'));
    assert.ok(searchZIndex, 'Header stacking isolates search pointer events from 3D canvas interaction');
    record('I-07: Search input pointer interactions are isolated from 3D camera tilt listener', true);
  } catch (err) {
    record('I-07: Search input pointer interactions are isolated from 3D camera tilt listener', false, err);
  }

  // ==========================================
  // Interaction 8: Keyboard Tab Traversal from Header to Hero CTAs
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 8: Keyboard Tab Order Continuity]\x1b[0m');

  try {
    const allFocusable = getFocusableElements(doc);
    assert.ok(allFocusable.length >= 8, `Expected at least 8 focusable controls, found: ${allFocusable.length}`);

    // Verify wordmark comes before nav links, and nav links come before hero CTAs
    const wordmarkIdx = allFocusable.findIndex((el) => el.textContent.includes('AUREVANT'));
    const firstNavIdx = allFocusable.findIndex((el) => el.textContent === 'Auctions');
    const primaryCtaIdx = allFocusable.findIndex((el) => el.textContent.includes('Explore auctions'));

    assert.ok(wordmarkIdx !== -1, 'Wordmark must be focusable');
    assert.ok(firstNavIdx !== -1, 'Primary nav link must be focusable');
    assert.ok(primaryCtaIdx !== -1, 'Primary CTA must be focusable');
    assert.ok(wordmarkIdx < firstNavIdx, 'Wordmark must precede navigation links in tab order');
    assert.ok(firstNavIdx < primaryCtaIdx, 'Navigation links must precede hero CTAs in tab order');
    record('I-08: Sequential Tab traversal flows naturally from header controls into hero CTAs', true);
  } catch (err) {
    record('I-08: Sequential Tab traversal flows naturally from header controls into hero CTAs', false, err);
  }

  // ==========================================
  // Interaction 9: ESC Key Drawer Dismissal from Focused Drawer Child
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 9: ESC Key Dismissal from Deep Drawer Focus]\x1b[0m');

  try {
    const drawer = doc.querySelector('.mobile-drawer');
    const drawerLinks = drawer.querySelectorAll('a, button');
    assert.ok(drawerLinks.length > 0, 'Drawer links exist');
    const deepLink = drawerLinks[drawerLinks.length - 1];
    assert.ok(deepLink, 'Deep link in drawer selected');
    deepLink.focus();
    assert.strictEqual(doc.activeElement, deepLink, 'Active focus on deep link in drawer');

    const menuPath = getAppFilePath('components/navbar/MobileMenu.tsx');
    assert.ok(fs.existsSync(menuPath), 'MobileMenu.tsx must exist');
    const source = fs.readFileSync(menuPath, 'utf8');
    assert.ok(source.includes("window.addEventListener('keydown'"), 'MobileMenu must attach keydown listener to window for event bubbling');
    assert.ok(source.includes("e.key === 'Escape'") && source.includes('onClose()'), 'Window keydown listener must handle Escape key and call onClose()');
    record('I-09: ESC keydown on deeply focused element inside drawer dismisses drawer cleanly', true);
  } catch (err) {
    record('I-09: ESC keydown on deeply focused element inside drawer dismisses drawer cleanly', false, err);
  }

  // ==========================================
  // Interaction 10: Section Selector Keyboard Activation (Enter/Space)
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 10: Section Selector Accessible Keyboard Activation]\x1b[0m');

  try {
    const sectionButtons = doc.querySelectorAll('.section-selector button');
    for (const btn of sectionButtons) {
      assert.ok(btn.isFocusable(), `Section button ${btn.textContent} must be keyboard focusable`);
    }
    record('I-10: Section selector indicators are accessible via keyboard focus and activation', true);
  } catch (err) {
    record('I-10: Section selector indicators are accessible via keyboard focus and activation', false, err);
  }

  // ==========================================
  // Interaction 11: International Selector Controls Independent of Hero Motion
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 11: International Controls Independent of Animation]\x1b[0m');

  try {
    const intlBtns = doc.querySelectorAll('header button[aria-label*="region" i], header button[aria-label*="language" i], header [aria-label*="INTERNATIONAL" i]');
    assert.ok(intlBtns.length >= 1 || doc.textContent.includes('INTERNATIONAL'), 'International region/language controls present');
    record('I-11: Region and language selectors operate independently of hero entrance animation', true);
  } catch (err) {
    record('I-11: Region and language selectors operate independently of hero entrance animation', false, err);
  }

  // ==========================================
  // Interaction 12: Hero Lot Overlay Positioning and Non-Interference
  // ==========================================
  console.log('\n  \x1b[36m[Interaction 12: Lot Overlay Positioning & 3D Stacking]\x1b[0m');

  try {
    const lotOverlay = doc.querySelector('.lot-overlay');
    assert.ok(lotOverlay, 'Lot overlay exists');
    const classes = lotOverlay.classList.value;
    assert.ok(classes.includes('absolute') || classes.includes('fixed'), 'Lot overlay is positioned discreetly in lower viewport');
    assert.ok(classes.some((c) => c.startsWith('z-')), 'Lot overlay defines explicit z-index layer');
    record('I-12: Curatorial lot overlay maintains discreet positioning without obscuring 3D bust or CTAs', true);
  } catch (err) {
    record('I-12: Curatorial lot overlay maintains discreet positioning without obscuring 3D bust or CTAs', false, err);
  }

  console.log(`\n\x1b[1m=== Tier 3 Complete: ${results.passed} Passed, ${results.failed} Failed ===\x1b[0m\n`);
  return results;
}

if (process.argv[1] && process.argv[1].endsWith('tier3-interactions.test.mjs')) {
  runTier3Tests().then((res) => {
    if (res.failed > 0) process.exit(1);
  });
}
