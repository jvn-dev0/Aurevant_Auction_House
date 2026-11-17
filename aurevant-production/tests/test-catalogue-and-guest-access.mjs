import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\kbjee\\.gemini\\antigravity\\brain\\a1cb3096-bf53-49f1-84e2-572bb49a89f3';
const BASE_URL = 'http://localhost:3001';

async function runTests() {
  console.log('\n=============================================================');
  console.log('  AUREVANT — PUBLIC CATALOGUE & GUEST ACCESS VERIFICATION');
  console.log('=============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--window-size=1600,1000',
      '--no-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--use-angle=d3d11',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: [],
  };

  function assert(condition, message) {
    results.total++;
    if (condition) {
      results.passed++;
      console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
      results.details.push({ status: 'PASS', message });
    } else {
      results.failed++;
      console.log(`  \x1b[31m✖ FAIL:\x1b[0m ${message}`);
      results.details.push({ status: 'FAIL', message });
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Page Load & Section Existence (Guest Mode)
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Homepage & Explore Collections Presence ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    // Clear any previous session
    await page.evaluate(() => {
      sessionStorage.clear();
      document.cookie = 'aurevant_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
    await page.reload({ waitUntil: 'networkidle2' });

    const sectionExists = await page.$('#categories');
    assert(sectionExists !== null, 'Section with id="categories" is present in DOM');

    const headerText = await page.$eval('#categories', el => el.innerText);
    assert(headerText.includes('EXPLORE THE COLLECTIONS'), 'Section contains "EXPLORE THE COLLECTIONS"');
    assert(headerText.includes('Six disciplines. A world of exceptional objects.'), 'Section contains supporting line');

    // -------------------------------------------------------------
    // Test 2: Inspect All 6 Collections and Images
    // -------------------------------------------------------------
    console.log('\n--- 2. Inspecting 6 Disciplines and Local Image Assets ---');
    const cards = await page.$$eval('#categories [data-collection-id]', els =>
      els.map(el => ({
        id: el.getAttribute('data-collection-id'),
        text: el.innerText,
        imgSrc: el.querySelector('img')?.getAttribute('src'),
      }))
    );

    assert(cards.length === 6, `Found exactly 6 collection panels (got ${cards.length})`);

    const expectedCollections = [
      { id: 'fine-art', title: 'Fine Art', dept: '01', img: '/images/painting.jpg' },
      { id: 'horology', title: 'Horology', dept: '02', img: '/images/vintage%20watch.jpg' },
      { id: 'numismatics', title: 'Numismatics', dept: '03', img: '/images/roman%20coin.jpg' },
      { id: 'rare-books', title: 'Rare Books', dept: '04', img: '/images/old%20books.jpg' },
      { id: 'jewellery', title: 'Jewellery', dept: '05', img: '/images/jwellery.jpg' },
      { id: 'antiquities', title: 'Antiquities', dept: '06', img: '/images/vintage%20statue.jpg' },
    ];

    for (const exp of expectedCollections) {
      const card = cards.find(c => c.id === exp.id);
      assert(card !== undefined, `Discipline ${exp.dept} — ${exp.title} (${exp.id}) exists`);
      if (card) {
        assert(card.text.includes(exp.dept), `Card ${exp.id} contains department number ${exp.dept}`);
        assert(card.text.includes(exp.title), `Card ${exp.id} contains title ${exp.title}`);
        assert(card.imgSrc === exp.img, `Card ${exp.id} references correct image ${exp.img}`);
      }
    }

    // Scroll to #categories and verify all images loaded with naturalWidth > 0
    await page.$eval('#categories', el => el.scrollIntoView());
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('#categories img')).every(i => i.complete && i.naturalWidth > 0),
      { timeout: 10000 }
    );

    const imgLoadStatus = await page.$$eval('#categories img', imgs =>
      imgs.map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }))
    );

    let allImagesValid = true;
    for (const img of imgLoadStatus) {
      if (!img.complete || img.naturalWidth === 0) {
        allImagesValid = false;
        console.error('Broken image:', img);
      }
    }
    assert(allImagesValid && imgLoadStatus.length === 6, 'All 6 collection images loaded successfully with naturalWidth > 0');

    // Screenshot of the 6 collection cards
    const sectionElement = await page.$('#categories');
    if (sectionElement) {
      await sectionElement.screenshot({
        path: path.join(ARTIFACT_DIR, 'explore-collections-desktop.png'),
      });
      console.log('  Saved screenshot: explore-collections-desktop.png');
    }

    // -------------------------------------------------------------
    // Test 3: Guest User Interaction & Account Modal Triggering
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Guest Interaction & Private Access Modal ---');

    // Click Fine Art card
    const fineArtCard = await page.$('#categories [data-collection-id="fine-art"]');
    await fineArtCard.click();
    await new Promise(r => setTimeout(r, 400));

    // Verify modal is open
    const modal = await page.$('#guest-access-modal');
    assert(modal !== null, 'Private Access modal is visible on clicking Fine Art as guest');

    const modalText = await page.$eval('#guest-access-modal', el => el.innerText);
    assert(modalText.includes('AUREVANT PRIVATE ACCESS'), 'Modal contains eyebrow "AUREVANT PRIVATE ACCESS"');
    assert(modalText.includes('Discover exceptional collections.'), 'Modal contains heading "Discover exceptional collections."');
    assert(modalText.includes('Create your AUREVANT account to explore our curated catalogue'), 'Modal contains required description');
    assert(modalText.includes('CREATE YOUR ACCOUNT'), 'Modal has primary button "CREATE YOUR ACCOUNT"');
    assert(modalText.includes('SIGN IN'), 'Modal has secondary action "SIGN IN"');
    assert(modalText.toLowerCase().includes('your journey into exceptional collecting begins here'), 'Modal contains reassuring footnote');
    assert(modalText.includes('01 — Fine Art'), 'Modal displays selected target discipline "01 — Fine Art"');

    // Check link destinations with redirect param
    const registerHref = await page.$eval('#guest-access-modal a[href*="register"]', el => el.getAttribute('href'));
    const loginHref = await page.$eval('#guest-access-modal a[href*="login"]', el => el.getAttribute('href'));
    assert(registerHref.includes('redirect=%2Fcollections%2Ffine-art'), `Register link preserves destination: ${registerHref}`);
    assert(loginHref.includes('redirect=%2Fcollections%2Ffine-art'), `Login link preserves destination: ${loginHref}`);

    // Screenshot of the open modal
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'guest-access-modal.png'),
    });
    console.log('  Saved screenshot: guest-access-modal.png');

    // Test Escape key closes modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 300));
    const modalAfterEsc = await page.$('#guest-access-modal');
    assert(modalAfterEsc === null, 'Escape key cleanly dismisses the modal');

    // Test Horology card
    const horologyCard = await page.$('#categories [data-collection-id="horology"]');
    await horologyCard.click();
    await new Promise(r => setTimeout(r, 400));
    const modalHorologyText = await page.$eval('#guest-access-modal', el => el.innerText);
    assert(modalHorologyText.includes('02 — Horology'), 'Clicking Horology triggers modal with "02 — Horology" target');

    // Close via close button
    const closeBtn = await page.$('#guest-access-modal button[aria-label="Close dialog"]');
    await closeBtn.click();
    await new Promise(r => setTimeout(r, 300));
    const modalAfterClose = await page.$('#guest-access-modal');
    assert(modalAfterClose === null, 'Close button cleanly dismisses the modal');

    // Test Numismatics card
    const coinCard = await page.$('#categories [data-collection-id="numismatics"]');
    await coinCard.click();
    await new Promise(r => setTimeout(r, 300));
    assert(await page.$('#guest-access-modal') !== null, 'Clicking Numismatics triggers private access modal');
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 200));

    // Test Rare Books card
    const booksCard = await page.$('#categories [data-collection-id="rare-books"]');
    await booksCard.click();
    await new Promise(r => setTimeout(r, 300));
    assert(await page.$('#guest-access-modal') !== null, 'Clicking Rare Books triggers private access modal');
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 200));

    // Test Jewellery card
    const jewellCard = await page.$('#categories [data-collection-id="jewellery"]');
    await jewellCard.click();
    await new Promise(r => setTimeout(r, 300));
    assert(await page.$('#guest-access-modal') !== null, 'Clicking Jewellery triggers private access modal');
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 200));

    // Test Antiquities card
    const statueCard = await page.$('#categories [data-collection-id="antiquities"]');
    await statueCard.click();
    await new Promise(r => setTimeout(r, 300));
    assert(await page.$('#guest-access-modal') !== null, 'Clicking Antiquities triggers private access modal');
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 200));

    // -------------------------------------------------------------
    // Test 4: View Catalogue Public Action (Section 7 Distinction)
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Public "View Catalogue" Distinction ---');
    const viewCatalogueBtn = await page.$('#categories a[href="/catalogue"]');
    assert(viewCatalogueBtn !== null, 'Public "VIEW CATALOGUE" button exists in section header');

    await viewCatalogueBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    const currentUrl = page.url();
    assert(currentUrl.includes('/catalogue'), `Successfully navigated to public catalogue: ${currentUrl}`);

    const catalogueHeading = await page.$eval('h1', el => el.innerText);
    assert(catalogueHeading.includes('Curated Public Catalogue'), 'Public Catalogue page rendered properly');

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'public-catalogue.png'),
    });
    console.log('  Saved screenshot: public-catalogue.png');

    // -------------------------------------------------------------
    // Test 5: Authentication & Saleroom Redirection
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Saleroom Authentication & Return Destination ---');
    await page.goto(`${BASE_URL}/auth/login?redirect=%2Fcollections%2Ffine-art`, { waitUntil: 'networkidle2' });

    // Click Fill Demo Credentials
    await page.click('button ::-p-text(Fill Demo Credentials)');
    await new Promise(r => setTimeout(r, 200));

    const emailVal = await page.$eval('#login-email', el => el.value);
    const passVal = await page.$eval('#login-password', el => el.value);
    assert(emailVal === 'vance@horologyvault.ch' && passVal === 'Chrono1968', 'Demo credentials successfully populated');

    // Submit sign in
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const postAuthUrl = page.url();
    assert(postAuthUrl.includes('/collections/fine-art'), `Redirected to selected collection after login: ${postAuthUrl}`);

    const saleroomHeading = await page.$eval('h1', el => el.innerText);
    assert(saleroomHeading.includes('Fine Art'), `Fine Art authenticated saleroom header verified: "${saleroomHeading}"`);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'fine-art-saleroom-authenticated.png'),
    });
    console.log('  Saved screenshot: fine-art-saleroom-authenticated.png');

    // -------------------------------------------------------------
    // Test 6: Authenticated User Navigation Without Modal
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Authenticated User Direct Navigation ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    // Click Fine Art card as logged-in user
    const loggedInFineArtCard = await page.$('#categories [data-collection-id="fine-art"]');
    await loggedInFineArtCard.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const directNavUrl = page.url();
    assert(directNavUrl.includes('/collections/fine-art'), `Direct navigation occurred without modal: ${directNavUrl}`);
    const modalWhenAuth = await page.$('#guest-access-modal');
    assert(modalWhenAuth === null, 'No guest modal displayed for authenticated user');

    // -------------------------------------------------------------
    // Test 7: Mobile Viewport & Responsiveness (390px)
    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Mobile Viewport (390px) ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    // Check horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assert(!hasHorizontalOverflow, 'Zero horizontal overflow on mobile viewport (390px)');

    // Screenshot of mobile collections
    const mobileSection = await page.$('#categories');
    if (mobileSection) {
      await mobileSection.screenshot({
        path: path.join(ARTIFACT_DIR, 'explore-collections-mobile-390.png'),
      });
      console.log('  Saved screenshot: explore-collections-mobile-390.png');
    }

    // -------------------------------------------------------------
    // Test 8: Page Console Errors Check
    // -------------------------------------------------------------
    console.log('\n--- 8. Checking Console & Page Errors ---');
    const filteredErrors = pageErrors.filter(e => !e.includes('favicon'));
    assert(filteredErrors.length === 0, `Zero page runtime errors detected (got ${filteredErrors.length})`);
    if (filteredErrors.length > 0) {
      console.error('Page errors:', filteredErrors);
    }

  } catch (err) {
    console.error('Test execution error:', err);
    assert(false, `Unexpected exception during test execution: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n=============================================================');
  console.log(`  VERIFICATION RESULTS: ${results.passed} / ${results.total} PASSED`);
  if (results.failed === 0) {
    console.log('  \x1b[32mALL TEST ASSERTIONS COMPLETED SUCCESSFULLY!\x1b[0m');
  } else {
    console.log(`  \x1b[31m${results.failed} ASSERTIONS FAILED.\x1b[0m`);
  }
  console.log('=============================================================\n');

  return results.failed === 0;
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
});
