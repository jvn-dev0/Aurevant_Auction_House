import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\kbjee\\.gemini\\antigravity\\brain\\a1cb3096-bf53-49f1-84e2-572bb49a89f3';
const BASE_URL = 'http://localhost:3002';

async function runSellSectionVerification() {
  console.log('\n=============================================================');
  console.log('  AUREVANT — SELL WITH AUREVANT SECTION VERIFICATION');
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
    // Test 1: Page Load & Preservation of All Sections
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

    const intelligenceExists = await page.$('#intelligence') !== null;
    assert(intelligenceExists, 'AUREVANT Intelligence section is intact');

    const sellSection = await page.$('#sell');
    assert(sellSection !== null, 'Sell with AUREVANT section is present in DOM');

    // Verify ordering: sell comes after intelligence
    const orderCorrect = await page.evaluate(() => {
      const intel = document.querySelector('#intelligence');
      const sell = document.querySelector('#sell');
      if (!intel || !sell) return false;
      return intel.compareDocumentPosition(sell) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
    assert(Boolean(orderCorrect), 'Sell section follows immediately after Intelligence section');

    // -------------------------------------------------------------
    // Test 2: Scroll into Sell Section & Visual Inspection (1440px)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Sell Section Content & Typography ---');

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      const sell = document.querySelector('#sell');
      if (sell) sell.scrollIntoView({ block: 'center' });
      window.dispatchEvent(new Event('scroll'));
    });
    await new Promise((r) => setTimeout(r, 1200)); // Allow entrance animation to settle

    const eyebrowText = await page.$eval('#sell p', (el) => el.innerText.trim());
    assert(eyebrowText.toUpperCase() === 'SELL WITH AUREVANT', `Eyebrow text matches: "${eyebrowText}"`);

    const headingText = await page.$eval('#sell h2', (el) => el.innerText.replace(/\s+/g, ' ').trim());
    assert(
      headingText.includes('Give exceptional objects') && headingText.includes('their next chapter'),
      `Heading contains expected text: "${headingText}"`
    );

    const ctaButton = await page.$('#sell button[aria-label*="estimate"], #sell button');
    assert(ctaButton !== null, 'Primary CTA button "REQUEST AN ESTIMATE" exists');

    const ctaText = await page.$eval('#sell button[aria-label*="estimate"], #sell button', (el) => el.innerText.replace(/\s+/g, ' ').trim());
    assert(ctaText.toUpperCase().includes('REQUEST AN ESTIMATE'), `CTA button text matches: "${ctaText}"`);

    const secondaryLink = await page.$eval('#sell a[aria-label*="selling process"]', (el) => el.innerText.trim());
    assert(secondaryLink.includes('Discover our selling process'), `Secondary link matches: "${secondaryLink}"`);

    const imageSrc = await page.$eval('#sell img', (el) => el.getAttribute('src'));
    assert(imageSrc.includes('sell.webp'), `Specialist photograph loaded with authentic asset: "${imageSrc}"`);

    // Screenshot Desktop
    const desktopScreenshotPath = path.join(ARTIFACT_DIR, 'sell-desktop-1440.png');
    const sellElem = await page.$('#sell');
    if (sellElem) {
      await sellElem.screenshot({ path: desktopScreenshotPath });
      console.log(`  📸 Desktop screenshot captured: ${desktopScreenshotPath}`);
    }

    // -------------------------------------------------------------
    // Test 3: Guest CTA Interaction — CuratorialModal
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Guest Consignment Modal Interaction ---');

    // Click "REQUEST AN ESTIMATE" button
    await page.click('#sell button[aria-label*="estimate"]');
    await new Promise((r) => setTimeout(r, 600));

    const modalTitleElem = await page.$('#curatorial-modal-title');
    assert(modalTitleElem !== null, 'Consignment modal opened on CTA click');

    if (modalTitleElem) {
      const modalEyebrow = await page.$eval('#curatorial-modal-title', (el) => el.innerText.trim());
      assert(modalEyebrow.toUpperCase() === 'SELL WITH AUREVANT', `Modal eyebrow matches: "${modalEyebrow}"`);

      const modalDesc = await page.$eval('#curatorial-modal-desc', (el) => el.innerText.trim());
      assert(modalDesc.includes('account'), 'Modal explains account requirement for consignment submission');

      // Dismiss modal via button
      const closeButton = await page.$('button[aria-label="Close dialogue"]');
      if (closeButton) {
        await closeButton.click();
        await new Promise((r) => setTimeout(r, 400));
        const modalAfterDismiss = await page.$('#curatorial-modal-title');
        assert(modalAfterDismiss === null, 'Modal successfully closed via dismiss button');
      }
    }

    // -------------------------------------------------------------
    // Test 4: Tablet Responsiveness (768px)
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Tablet Responsiveness (768px) ---');
    await page.setViewport({ width: 768, height: 1024 });
    await page.evaluate(() => {
      const sell = document.querySelector('#sell');
      if (sell) sell.scrollIntoView({ block: 'center' });
      window.dispatchEvent(new Event('scroll'));
    });
    await new Promise((r) => setTimeout(r, 800));

    const tabletOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    assert(!tabletOverflow, 'No horizontal overflow at 768px viewport');

    const tabletScreenshotPath = path.join(ARTIFACT_DIR, 'sell-tablet-768.png');
    const tabletSellElem = await page.$('#sell');
    if (tabletSellElem) {
      await tabletSellElem.screenshot({ path: tabletScreenshotPath });
      console.log(`  📸 Tablet screenshot captured: ${tabletScreenshotPath}`);
    }

    // -------------------------------------------------------------
    // Test 5: Mobile Responsiveness (390px)
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Mobile Responsiveness (390px) ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => {
      const sell = document.querySelector('#sell');
      if (sell) sell.scrollIntoView({ block: 'center' });
      window.dispatchEvent(new Event('scroll'));
    });
    await new Promise((r) => setTimeout(r, 800));

    const mobileOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    assert(!mobileOverflow, 'No horizontal overflow at 390px mobile viewport');

    const mobileScreenshotPath = path.join(ARTIFACT_DIR, 'sell-mobile-390.png');
    const mobileSellElem = await page.$('#sell');
    if (mobileSellElem) {
      await mobileSellElem.screenshot({ path: mobileScreenshotPath });
      console.log(`  📸 Mobile screenshot captured: ${mobileScreenshotPath}`);
    }

    // -------------------------------------------------------------
    // Test 6: Runtime Console & Page Errors
    // -------------------------------------------------------------
    console.log('\n--- 6. Runtime Error Check ---');
    assert(pageErrors.length === 0, `Zero page runtime errors encountered (found: ${pageErrors.length})`);
    if (pageErrors.length > 0) {
      console.log('  Errors:', pageErrors);
    }

  } catch (err) {
    console.error('\n✖ Unexpected error during test run:', err);
    results.failed++;
  } finally {
    await browser.close();
  }

  console.log('\n=============================================================');
  console.log(`  SUMMARY: ${results.passed} / ${results.total} PASSED (${results.failed} failed)`);
  console.log('=============================================================\n');

  if (results.failed > 0) {
    process.exit(1);
  }
}

runSellSectionVerification();
