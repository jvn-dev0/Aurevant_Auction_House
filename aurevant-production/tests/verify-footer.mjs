import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\kbjee\\.gemini\\antigravity\\brain\\a1cb3096-bf53-49f1-84e2-572bb49a89f3';
const BASE_URL = 'http://localhost:3002';

async function runFooterVerification() {
  console.log('\n=============================================================');
  console.log('  AUREVANT — FINAL FOOTER SECTION VERIFICATION');
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
    // Test 1: Page Load & Preservation of All Prior Sections
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Section Sequencing & Preservation ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 35000 });

    const heroExists = (await page.$('section#about, [aria-label*="saleroom"], header, nav')) !== null;
    assert(heroExists, 'Hero section and Navbar are intact');

    const closingSoonExists = (await page.$('#auctions, [id="closing-soon"]')) !== null;
    assert(closingSoonExists, 'Closing Soon section is intact');

    const collectionsExists = (await page.$('#categories, [aria-label*="collections"]')) !== null;
    assert(collectionsExists, 'Explore Collections gallery is intact');

    const storyExists = (await page.$('#stories, [aria-label*="Beyond the Object"]')) !== null;
    assert(storyExists, 'Beyond the Object section is intact');

    const intelligenceExists = (await page.$('#intelligence')) !== null;
    assert(intelligenceExists, 'AUREVANT Intelligence section is intact');

    const sellExists = (await page.$('#sell')) !== null;
    assert(sellExists, 'Sell with AUREVANT section is intact');

    const footerExists = (await page.$('#footer')) !== null;
    assert(footerExists, 'AUREVANT Footer is mounted in DOM');

    // Verify ordering: footer follows sell
    const orderCorrect = await page.evaluate(() => {
      const sell = document.querySelector('#sell');
      const footer = document.querySelector('#footer');
      if (!sell || !footer) return false;
      return sell.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
    assert(Boolean(orderCorrect), 'Footer follows immediately after Sell section');

    // -------------------------------------------------------------
    // Test 2: Local SVG Asset Loading & Availability from /icons/
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Local SVG Icons from /icons/ ---');
    const svgEndpoints = [
      '/icons/instagram.svg',
      '/icons/x.svg',
      '/icons/facebook.svg',
      '/icons/whatsapp.svg',
    ];

    for (const endpoint of svgEndpoints) {
      const status = await page.evaluate(async (url) => {
        try {
          const res = await fetch(url);
          return res.status;
        } catch (e) {
          return 0;
        }
      }, endpoint);
      assert(status === 200, `SVG endpoint ${endpoint} loads with HTTP 200`);
    }

    // Scroll to footer
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      const footer = document.querySelector('#footer');
      if (footer) footer.scrollIntoView({ block: 'start' });
      window.dispatchEvent(new Event('scroll'));
    });
    await new Promise((r) => setTimeout(r, 1200));

    // -------------------------------------------------------------
    // Test 3: Brand & Real Contact Details
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Brand & Real Contact Details ---');

    const brandWordmark = await page.$eval('#footer .brand-wordmark', (el) => el.innerText.replace(/\s+/g, ' ').trim());
    assert(brandWordmark.includes('AUREVANT') && brandWordmark.includes('AUCTION HOUSE'), `Brand wordmark matches: "${brandWordmark}"`);

    const taglineText = await page.$eval('#footer p', (el) => el.innerText.trim());
    assert(taglineText.toUpperCase().includes('THE ART OF EXCEPTIONAL OWNERSHIP'), `Tagline matches: "${taglineText}"`);

    // Phone link & text
    const phoneHref = await page.$eval('#footer a[href^="tel:"]', (el) => el.getAttribute('href'));
    const phoneText = await page.$eval('#footer a[href^="tel:"]', (el) => el.innerText.trim());
    assert(phoneHref === 'tel:+919342977191', `Phone link matches: "${phoneHref}"`);
    assert(phoneText.includes('+91 93429 77191'), `Phone text matches: "${phoneText}"`);

    // Email link & text
    const emailHref = await page.$eval('#footer a[href^="mailto:"]', (el) => el.getAttribute('href'));
    const emailText = await page.$eval('#footer a[href^="mailto:"]', (el) => el.innerText.trim());
    assert(emailHref === 'mailto:kbjeevanbabu803@gmail.com', `Email link matches: "${emailHref}"`);
    assert(emailText.includes('kbjeevanbabu803@gmail.com'), `Email text matches: "${emailText}"`);

    // WhatsApp link
    const whatsappHref = await page.$eval('#footer a[href*="wa.me"]', (el) => el.getAttribute('href'));
    assert(whatsappHref === 'https://wa.me/919342977191', `WhatsApp link matches: "${whatsappHref}"`);

    // -------------------------------------------------------------
    // Test 4: Navigation Columns & Content
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Navigation Columns ---');

    const footerTextUpper = (await page.$eval('#footer', (el) => el.innerText)).toUpperCase();
    assert(footerTextUpper.includes('AUCTIONS'), 'Auctions column header present');
    assert(footerTextUpper.includes('CATEGORIES'), 'Categories column header present');
    assert(footerTextUpper.includes('ABOUT'), 'About column header present');
    assert(footerTextUpper.includes('SUPPORT'), 'Support column header present');

    assert(footerTextUpper.includes('UPCOMING AUCTIONS'), 'Upcoming Auctions link present');
    assert(footerTextUpper.includes('FINE ART'), 'Fine Art category link present');
    assert(footerTextUpper.includes('OUR STORY'), 'Our Story link present');
    assert(footerTextUpper.includes('HELP CENTER'), 'Help Center link present');

    // -------------------------------------------------------------
    // Test 5: Newsletter Interaction & Validation
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Newsletter Interaction & Validation ---');

    // Test invalid submission
    await page.click('#footer form button[type="submit"]');
    await new Promise((r) => setTimeout(r, 300));
    const errorMsg = await page.$eval('#footer form p', (el) => el.innerText.trim());
    assert(errorMsg.includes('valid email') || errorMsg.includes('enter your email'), `Validation message shown on empty submit: "${errorMsg}"`);

    // Focus and clear input before typing valid email
    await page.focus('#footer form input[type="email"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('#footer form input[type="email"]', 'collector@example.com');
    await page.click('#footer form button[type="submit"]');

    await page.waitForSelector('#curatorial-modal-title', { timeout: 4000 });
    const modalTitle = await page.$('#curatorial-modal-title');
    assert(modalTitle !== null, 'Curatorial newsletter modal opened upon valid submission');

    if (modalTitle) {
      const modalText = await page.$eval('#curatorial-modal-title', (el) => el.innerText.trim());
      assert(modalText === 'AUREVANT DISPATCHES', `Modal eyebrow matches: "${modalText}"`);

      // Dismiss modal
      const closeBtn = await page.$('button[aria-label="Close dialogue"]');
      if (closeBtn) {
        await closeBtn.click();
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    // -------------------------------------------------------------
    // Test 6: Bottom Row & Dynamic Year
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Bottom Row, Legal Links & Year ---');

    const expectedYear = new Date().getFullYear().toString();
    const footerText = await page.$eval('#footer', (el) => el.innerText);
    assert(footerText.includes(expectedYear), `Dynamic copyright year ${expectedYear} present`);

    assert(footerText.includes('Privacy Policy'), 'Privacy Policy link present');
    assert(footerText.includes('Terms & Conditions'), 'Terms & Conditions link present');
    assert(footerText.includes('Cookie Policy'), 'Cookie Policy link present');
    assert(footerText.includes('Modern Slavery Statement'), 'Modern Slavery Statement present');

    assert(footerTextUpper.includes('INTERNATIONAL'), 'International region selector present');
    assert(footerTextUpper.includes('ENGLISH'), 'English language selector present');

    // Desktop screenshot
    const desktopScreenshotPath = path.join(ARTIFACT_DIR, 'footer-desktop-1440.png');
    const footerElem = await page.$('#footer');
    if (footerElem) {
      await footerElem.screenshot({ path: desktopScreenshotPath });
      console.log(`  📸 Desktop screenshot captured: ${desktopScreenshotPath}`);
    }

    // -------------------------------------------------------------
    // Test 7: Tablet Viewport (768px)
    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Tablet Responsiveness (768px) ---');
    await page.setViewport({ width: 768, height: 1024 });
    await page.evaluate(() => {
      const footer = document.querySelector('#footer');
      if (footer) footer.scrollIntoView({ block: 'start' });
      window.dispatchEvent(new Event('scroll'));
    });
    await new Promise((r) => setTimeout(r, 800));

    const tabletOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    assert(!tabletOverflow, 'No horizontal overflow at 768px tablet viewport');

    const tabletScreenshotPath = path.join(ARTIFACT_DIR, 'footer-tablet-768.png');
    const tabletFooterElem = await page.$('#footer');
    if (tabletFooterElem) {
      await tabletFooterElem.screenshot({ path: tabletScreenshotPath });
      console.log(`  📸 Tablet screenshot captured: ${tabletScreenshotPath}`);
    }

    // -------------------------------------------------------------
    // Test 8: Mobile Viewport (390px)
    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Mobile Responsiveness (390px) ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => {
      const footer = document.querySelector('#footer');
      if (footer) footer.scrollIntoView({ block: 'start' });
      window.dispatchEvent(new Event('scroll'));
    });
    await new Promise((r) => setTimeout(r, 800));

    const mobileOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    assert(!mobileOverflow, 'No horizontal overflow at 390px mobile viewport');

    const mobileScreenshotPath = path.join(ARTIFACT_DIR, 'footer-mobile-390.png');
    const mobileFooterElem = await page.$('#footer');
    if (mobileFooterElem) {
      await mobileFooterElem.screenshot({ path: mobileScreenshotPath });
      console.log(`  📸 Mobile screenshot captured: ${mobileScreenshotPath}`);
    }

    // -------------------------------------------------------------
    // Test 9: Zero Page Runtime Errors
    // -------------------------------------------------------------
    console.log('\n--- 9. Runtime Console & Error Check ---');
    assert(pageErrors.length === 0, `Zero page errors encountered (found: ${pageErrors.length})`);
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

runFooterVerification();
