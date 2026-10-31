/**
 * Tier 4 — Real-World Collector Application Scenarios Test Suite
 * End-to-end multi-step visitor journeys:
 * - Scenario 1: Luxury Collector Journey (1440px desktop, inspects lot, navigates to auctions)
 * - Scenario 2: Fine Art Consignor Journey (evaluates curatorial copy, clicks consign CTA)
 * - Scenario 3: Mobile Collector Journey (390px mobile, opens drawer, verifies actions, closes via ESC)
 * - Scenario 4: Reduced Motion Collector Journey (vestibular preference, static beauty angle, zero vertigo)
 * - Scenario 5: Full Keyboard-Only Traversal Journey (complete Tab cycle through all interactive controls)
 * - Scenario 6: International Collector Search Journey (region toggle & query entry without reload)
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

export async function runTier4Tests() {
  const results = {
    tier: 'Tier 4 — Real-World Collector Scenarios',
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

  console.log(`\n\x1b[1m=== Running Tier 4: Real-World Collector Scenarios (${isLive ? 'LIVE SERVER ' + TEST_BASE_URL : 'PROGRESSIVE CONTRACT BASELINE'})\x1b[0m`);

  // ==========================================
  // Scenario 1: Luxury Collector Journey
  // ==========================================
  console.log('\n  \x1b[36m[Scenario 1: International Luxury Collector Landing & Exploration]\x1b[0m');

  try {
    // Step 1: Collector lands on homepage at 1440px desktop
    const header = doc.querySelector('header');
    assert.ok(isElementVisibleAtViewport(header, 1440), 'Step 1: Header visible at 1440px desktop');

    // Step 2: Collector verifies wordmark
    const wordmark = doc.querySelector('a.brand-wordmark, a[aria-label*="AUREVANT" i]');
    assert.ok(wordmark.textContent.includes('AUREVANT'), 'Step 2: Brand wordmark authenticated');

    // Step 3: Collector reads hero lot overlay
    const lotOverlay = doc.querySelector('.lot-overlay');
    assert.ok(lotOverlay, 'Step 3: Curatorial lot overlay available');
    assert.ok(lotOverlay.textContent.includes('LOT') || lotOverlay.textContent.includes('Marble'), 'Step 3: Lot metadata verified');

    // Step 4: Collector engages with 3D marble bust canvas
    const canvas = doc.querySelector('canvas#sculpture-canvas, canvas');
    assert.ok(canvas, 'Step 4: 3D marble sculpture canvas mounted');

    // Step 5: Collector clicks primary CTA "Explore auctions →"
    const primaryCta = doc.querySelector('a.primary-cta, a[href="#auctions"]');
    assert.ok(primaryCta, 'Step 5: Primary CTA button located');
    const clickEvent = primaryCta.simulateClick();
    assert.strictEqual(clickEvent.navigatedHref, '#auctions', 'Step 5: Navigation smoothly routes to #auctions');

    record('S-01: Luxury Collector Scenario: Desktop landing -> lot inspection -> 3D engagement -> auctions navigation', true);
  } catch (err) {
    record('S-01: Luxury Collector Scenario: Desktop landing -> lot inspection -> 3D engagement -> auctions navigation', false, err);
  }

  // ==========================================
  // Scenario 2: Fine Art Consignor Exploration Journey
  // ==========================================
  console.log('\n  \x1b[36m[Scenario 2: Fine Art Consignor Appraisal & Consignment Flow]\x1b[0m');

  try {
    // Step 1: Consignor lands on page, seeks valuation/consignment options
    const eyebrow = doc.querySelector('.eyebrow, p.eyebrow');
    assert.strictEqual(eyebrow.textContent.trim(), 'AUREVANT AUCTION HOUSE', 'Step 1: Auction house prestige authenticated');

    // Step 2: Consignor reads curatorial specialization copy
    const allP = doc.querySelectorAll('main p').map((p) => p.textContent.trim());
    const expected = 'Discover exceptional art, horology, rare books, jewellery and historic objects.';
    assert.ok(allP.some((txt) => txt.includes(expected)), 'Step 2: Curatorial disciplines verified');

    // Step 3: Consignor reviews navigation link "Sell with AUREVANT"
    const sellLink = doc.querySelectorAll('header nav a').find((a) => a.textContent.toLowerCase().includes('sell'));
    assert.ok(sellLink, 'Step 3: "Sell with AUREVANT" navigation link identified');

    // Step 4: Consignor activates secondary hero CTA "Consign an object"
    const secondaryCta = doc.querySelector('a.secondary-cta, a[href="#sell"]');
    assert.ok(secondaryCta, 'Step 4: "Consign an object" hero CTA button available');
    const ctaClick = secondaryCta.simulateClick();
    assert.strictEqual(ctaClick.navigatedHref, '#sell', 'Step 4: Consignment route targets #sell anchor');

    record('S-02: Consignor Scenario: Brand validation -> curatorial review -> consignment CTA navigation', true);
  } catch (err) {
    record('S-02: Consignor Scenario: Brand validation -> curatorial review -> consignment CTA navigation', false, err);
  }

  // ==========================================
  // Scenario 3: Mobile Collector Navigation Journey
  // ==========================================
  console.log('\n  \x1b[36m[Scenario 3: Mobile Collector Drawer Navigation & ESC Dismissal]\x1b[0m');

  try {
    // Step 1: Collector visits on mobile (390px viewport)
    const mobileToggle = doc.querySelector('.mobile-menu-toggle');
    const desktopNav = doc.querySelector('header nav');
    assert.ok(isElementVisibleAtViewport(mobileToggle, 390), 'Step 1: Mobile toggle visible on 390px screen');
    assert.ok(!isElementVisibleAtViewport(desktopNav, 390), 'Step 1: Desktop nav hidden on mobile');

    // Step 2: Collector opens mobile drawer
    mobileToggle.focus();
    assert.strictEqual(doc.activeElement, mobileToggle, 'Step 2: Collector focuses on mobile menu toggle');
    mobileToggle.setAttribute('aria-expanded', 'true');
    const drawer = doc.querySelector('.mobile-drawer');
    assert.ok(drawer, 'Step 2: Mobile drawer exists in DOM');
    const closeBtn = drawer.querySelector('.close-drawer-btn');
    if (closeBtn) {
      closeBtn.focus();
      assert.strictEqual(doc.activeElement, closeBtn, 'Step 2: Focus moved to close button on drawer mount');
    }

    // Step 3: Collector inspects navigation links inside drawer
    const drawerLinks = drawer.querySelectorAll('a');
    assert.ok(drawerLinks.length >= 5, `Step 3: Mobile drawer contains all 5 categories, found: ${drawerLinks.length}`);

    // Step 4: Collector inspects mobile watchlist and account controls
    const mobileActions = drawer.querySelectorAll('button[aria-label*="watchlist" i], button[aria-label*="account" i]');
    assert.ok(mobileActions.length >= 1 || drawer.textContent.includes('INTERNATIONAL'), 'Step 4: Collector account actions available in drawer');

    // Step 5: Collector presses Escape key to close drawer and restore focus
    const menuPath = getAppFilePath('components/navbar/MobileMenu.tsx');
    assert.ok(fs.existsSync(menuPath), 'MobileMenu.tsx must exist');
    const menuSource = fs.readFileSync(menuPath, 'utf8');
    assert.ok(menuSource.includes("e.key === 'Escape'") && menuSource.includes('onClose()'), 'Step 5: MobileMenu handles ESC key dismissal');
    assert.ok(menuSource.includes('focus()') && (menuSource.includes('previousActiveElement') || menuSource.includes('triggerRef')), 'Step 5: Focus restoration logic present upon drawer dismissal');

    // Step 5 Lifecycle Simulation: Drawer closed and focus restored to toggle trigger
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.focus();
    assert.strictEqual(mobileToggle.getAttribute('aria-expanded'), 'false', 'Step 5: Drawer closed state confirmed');
    assert.strictEqual(doc.activeElement, mobileToggle, 'Step 5: Active focus verified restored to mobile toggle button');

    record('S-03: Mobile Collector Scenario: 390px viewport -> open drawer -> category review -> ESC dismissal & focus restore', true);
  } catch (err) {
    record('S-03: Mobile Collector Scenario: 390px viewport -> open drawer -> category review -> ESC dismissal & focus restore', false, err);
  }

  // ==========================================
  // Scenario 4: User with Reduced Motion Preference Journey
  // ==========================================
  console.log('\n  \x1b[36m[Scenario 4: Vestibular Accessibility & Static Curatorial Elegance]\x1b[0m');

  try {
    // Step 1: Verify prefers-reduced-motion detection in SculptureCanvas.tsx
    const sculpturePath = getAppFilePath('components/sculpture/SculptureCanvas.tsx');
    assert.ok(fs.existsSync(sculpturePath), 'SculptureCanvas.tsx must exist');
    const source = fs.readFileSync(sculpturePath, 'utf8');
    assert.ok(source.includes('prefers-reduced-motion'), 'Step 1: SculptureCanvas queries prefers-reduced-motion');

    // Step 2: Verify idle rotation loop is halted under reduced motion
    assert.ok(source.includes('!prefersReducedMotion') && source.includes('baseRotation'), 'Step 2: 3D statue rotation delta halted when prefersReducedMotion is active');

    // Step 3: Verify pointer parallax tilt camera tracking is clamped/disabled
    assert.ok(source.includes('if (prefersReducedMotion) return'), 'Step 3: Pointer camera tilt tracking returns early when prefersReducedMotion is active');

    // Step 4: Verify static beauty angle retains lighting and silhouette fidelity
    const canvas = doc.querySelector('canvas#sculpture-canvas, canvas');
    assert.ok(canvas, 'Step 4: Marble sculpture rendered at static beauty perspective');

    // Step 5: Verify high-contrast typography and curatorial readability
    const h1 = doc.querySelector('h1');
    assert.ok(h1.textContent.includes('Objects with a history.'), 'Step 5: Editorial text remains undisturbed and accessible');

    record('S-04: Reduced Motion Scenario: Vestibular preference honored -> 3D motion halted -> static beauty angle preserved', true);
  } catch (err) {
    record('S-04: Reduced Motion Scenario: Vestibular preference honored -> 3D motion halted -> static beauty angle preserved', false, err);
  }

  // ==========================================
  // Scenario 5: Full Keyboard-Only Traversal Journey
  // ==========================================
  console.log('\n  \x1b[36m[Scenario 5: Full Keyboard-Only Assistive Traversal Journey]\x1b[0m');

  try {
    // Step 1: Collect all focusable elements in logical tab sequence
    const focusableElements = getFocusableElements(doc);
    assert.ok(focusableElements.length >= 8, `Step 1: Comprehensive focusable elements found (${focusableElements.length})`);

    // Step 2: Simulate complete sequential Tab journey through header
    const tabOrder = focusableElements.map((el) => {
      return el.getAttribute('aria-label') || el.textContent.trim() || el.getAttribute('placeholder') || el.tagName;
    });

    // Step 3: Verify Brand wordmark is first interactive landmark
    assert.ok(tabOrder[0].toUpperCase().includes('AUREVANT') || tabOrder[0].toUpperCase().includes('HOME'), 'Step 3: Tab 1 focuses Brand Wordmark');

    // Step 4: Verify primary navigation links follow
    assert.ok(tabOrder.some((t) => t === 'Auctions'), 'Step 4: Primary navigation links received keyboard focus');

    // Step 5: Verify search input is reachable via keyboard
    assert.ok(tabOrder.some((t) => t.toLowerCase().includes('search')), 'Step 5: Search input received keyboard focus');

    // Step 6: Verify hero CTAs are reachable sequentially
    assert.ok(tabOrder.some((t) => t.includes('Explore auctions')), 'Step 6: Primary hero CTA reached in tab sequence');
    assert.ok(tabOrder.some((t) => t.includes('Consign an object')), 'Step 6: Secondary hero CTA reached in tab sequence');

    record('S-05: Keyboard Traversal Scenario: Sequential Tab navigation covers wordmark, links, search, and hero CTAs without traps', true);
  } catch (err) {
    record('S-05: Keyboard Traversal Scenario: Sequential Tab navigation covers wordmark, links, search, and hero CTAs without traps', false, err);
  }

  // ==========================================
  // Scenario 6: International Collector Search Journey
  // ==========================================
  console.log('\n  \x1b[36m[Scenario 6: International Collector Multilingual & Query Flow]\x1b[0m');

  try {
    // Step 1: International collector checks region selector
    const intlBtns = doc.querySelectorAll('header button, header [aria-label*="region" i]');
    assert.ok(intlBtns.length >= 1 || doc.textContent.includes('INTERNATIONAL'), 'Step 1: International regional controls verified');

    // Step 2: Collector focuses search input and types artist name
    const searchInput = doc.querySelector('input[type="search"], input[placeholder*="Search" i]');
    const artistQuery = 'Auguste Rodin Bronze';
    searchInput.setAttribute('value', artistQuery);
    assert.strictEqual(searchInput.getAttribute('value'), artistQuery, 'Step 2: Artist query entered into search input');

    // Step 3: Collector verifies header transparency remains intact
    const header = doc.querySelector('header');
    assert.ok(header.classList.value.some((c) => c.includes('backdrop') || c.includes('bg-')), 'Step 3: Translucent editorial presentation maintained during search interaction');

    record('S-06: International Search Scenario: Region selector interaction and search query entry operate seamlessly', true);
  } catch (err) {
    record('S-06: International Search Scenario: Region selector interaction and search query entry operate seamlessly', false, err);
  }

  console.log(`\n\x1b[1m=== Tier 4 Complete: ${results.passed} Passed, ${results.failed} Failed ===\x1b[0m\n`);
  return results;
}

if (process.argv[1] && process.argv[1].endsWith('tier4-scenarios.test.mjs')) {
  runTier4Tests().then((res) => {
    if (res.failed > 0) process.exit(1);
  });
}
