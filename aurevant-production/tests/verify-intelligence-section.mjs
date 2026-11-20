import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\kbjee\\.gemini\\antigravity\\brain\\a1cb3096-bf53-49f1-84e2-572bb49a89f3';
const BASE_URL = 'http://localhost:3002';

async function runIntelligenceVerification() {
  console.log('\n=============================================================');
  console.log('  AUREVANT — INTELLIGENCE SEARCH SECTION VERIFICATION');
  console.log('=============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--window-size=1440,900',
      '--no-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  const results = { total: 0, passed: 0, failed: 0 };

  function assert(condition, message) {
    results.total++;
    if (condition) {
      results.passed++;
      console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
    } else {
      results.failed++;
      console.log(`  \x1b[31m✖ FAIL:\x1b[0m ${message}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Page Load & Preservation of Previous Sections
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Section Sequencing & Preservation ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    const heroExists = await page.$('section#about, [aria-label*="saleroom"], header, nav') !== null;
    assert(heroExists, 'Hero section and Navbar are intact and mounted');

    const closingSoonExists = await page.$('#auctions, [id="closing-soon"]') !== null;
    assert(closingSoonExists, 'Closing Soon section is intact');

    const collectionsExists = await page.$('#categories, [aria-label*="collections"]') !== null;
    assert(collectionsExists, 'Explore Collections gallery is intact');

    const storyExists = await page.$('#stories, [aria-label*="Beyond the Object"]') !== null;
    assert(storyExists, 'Beyond the Object section is intact');

    const intelligenceSection = await page.$('#intelligence');
    assert(intelligenceSection !== null, 'AUREVANT Intelligence section is present in DOM');

    // -------------------------------------------------------------
    // Test 2: Scroll into Intelligence & Visual Inspection (1440px)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Intelligence Section Content & Typography ---');
    
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      const form = document.querySelector('#intelligence form');
      if (form) form.scrollIntoView({ block: 'center' });
      window.dispatchEvent(new Event('scroll'));
    });
    await new Promise((r) => setTimeout(r, 1000)); // Allow entrance animation to settle

    const eyebrowText = await page.$eval('#intelligence p', (el) => el.innerText.trim());
    assert(eyebrowText === 'AUREVANT INTELLIGENCE', `Eyebrow text matches: "${eyebrowText}"`);

    const headingText = await page.$eval('#intelligence h2', (el) => el.innerText.replace(/\s+/g, ' ').trim());
    assert(
      headingText.includes('A more intelligent way') && headingText.includes('discover.'),
      `Heading contains expected text: "${headingText}"`
    );

    const headingHTML = await page.$eval('#intelligence h2', (el) => el.innerHTML);
    assert(
      headingHTML.includes('discover') && headingHTML.includes('#F16B59'),
      'Heading contains highlighted "discover" and coral-red punctuation'
    );

    const placeholder = await page.$eval('#intelligence input[type="search"]', (el) => el.getAttribute('placeholder'));
    assert(
      placeholder === 'Find a mid-century painting with a documented exhibition history...',
      `Search input placeholder matches exact prompt requirement`
    );

    const buttonText = await page.$eval('#intelligence form button[type="submit"]', (el) => el.innerText.trim());
    assert(buttonText === 'SEARCH', `Search button label is "${buttonText}" (uppercase)`);

    const featureTitles = await page.$$eval('#intelligence h3', (els) => els.map((e) => e.innerText.trim()));
    assert(
      featureTitles.includes('Curated discoveries') &&
      featureTitles.includes('Provenance insights') &&
      featureTitles.includes('Specialist perspective'),
      `All 3 feature titles verified: ${featureTitles.join(', ')}`
    );

    const featureIcons = await page.$$eval('#intelligence h3 svg', (els) => els.length);
    assert(featureIcons === 0, 'No icons rendered inside features area (text-only specification respected)');

    // -------------------------------------------------------------
    // Test 3: Search Interaction (Focus & Submit)
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Search Input Focus & Submission ---');

    await page.focus('#intelligence input[type="search"]');
    await new Promise((r) => setTimeout(r, 200));

    await page.type('#intelligence input[type="search"]', '1960s gold chronograph watch with exhibition records');
    await new Promise((r) => setTimeout(r, 300));
    
    // Take focused screenshot
    const desktopScreenshotPath = path.join(ARTIFACT_DIR, 'intelligence-desktop-1440.png');
    await page.screenshot({ path: desktopScreenshotPath, fullPage: false });
    console.log(`  Saved desktop screenshot: ${desktopScreenshotPath}`);

    // Take full element screenshot
    const sectionElement = await page.$('#intelligence');
    if (sectionElement) {
      await sectionElement.screenshot({ path: path.join(ARTIFACT_DIR, 'intelligence-section-full.png') });
      console.log(`  Saved full element screenshot: intelligence-section-full.png`);
    }

    // Submit form
    await page.click('#intelligence form button[type="submit"]');
    await new Promise((r) => setTimeout(r, 800)); // Wait for modal

    const modalVisible = await page.$('[role="dialog"]') !== null;
    assert(modalVisible, 'CuratorialModal opened successfully upon search submission');

    // Dismiss modal by clicking Close dialogue or Acknowledge button
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close dialogue"]');
      if (closeBtn) {
        closeBtn.click();
      } else {
        const ackBtn = Array.from(document.querySelectorAll('button')).find(
          (b) => b.textContent && b.textContent.includes('Acknowledge')
        );
        if (ackBtn) ackBtn.click();
      }
    });
    await new Promise((r) => setTimeout(r, 600));
    const modalClosed = (await page.$('#curatorial-modal-title')) === null;
    assert(modalClosed, 'CuratorialModal dismissed successfully');

    // -------------------------------------------------------------
    // Test 4: Tablet Viewport (768 x 1024)
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Tablet Viewport (768x1024) ---');
    await page.setViewport({ width: 768, height: 1024 });
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      const form = document.querySelector('#intelligence form');
      if (form) form.scrollIntoView({ block: 'center' });
      window.dispatchEvent(new Event('scroll'));
    });
    await new Promise((r) => setTimeout(r, 600));

    const tabletScreenshotPath = path.join(ARTIFACT_DIR, 'intelligence-tablet-768.png');
    await page.screenshot({ path: tabletScreenshotPath, fullPage: false });
    console.log(`  Saved tablet screenshot: ${tabletScreenshotPath}`);

    // -------------------------------------------------------------
    // Test 5: Mobile Viewport (390 x 844)
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Mobile Viewport (390x844) ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      const form = document.querySelector('#intelligence form');
      if (form) form.scrollIntoView({ block: 'center' });
      window.dispatchEvent(new Event('scroll'));
    });
    await new Promise((r) => setTimeout(r, 600));

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assert(!hasHorizontalOverflow, 'No horizontal scroll overflow on 390px mobile viewport');

    const mobileScreenshotPath = path.join(ARTIFACT_DIR, 'intelligence-mobile-390.png');
    await page.screenshot({ path: mobileScreenshotPath, fullPage: false });
    console.log(`  Saved mobile screenshot: ${mobileScreenshotPath}`);

    assert(pageErrors.length === 0, `Zero page runtime errors detected (Actual: ${pageErrors.length})`);

  } catch (err) {
    console.error('Verification error:', err);
    results.failed++;
  } finally {
    await browser.close();
  }

  console.log('\n-------------------------------------------------------------');
  console.log(`  SUMMARY: ${results.passed}/${results.total} Passed, ${results.failed} Failed`);
  console.log('=============================================================\n');

  if (results.failed > 0) {
    process.exit(1);
  }
}

runIntelligenceVerification();
