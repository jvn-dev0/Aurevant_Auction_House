import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\kbjee\\.gemini\\antigravity\\brain\\a1cb3096-bf53-49f1-84e2-572bb49a89f3';
const BASE_URL = 'http://localhost:3001';

async function runVerification() {
  console.log('\n=============================================================');
  console.log('  AUREVANT — COLLECTIONS VISUAL RECONSTRUCTION & GUEST ACCESS');
  console.log('=============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--window-size=1600,1100',
      '--no-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--use-angle=d3d11',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100 });

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
    // Test 1: Page Load & Closing Soon Section Preservation
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Preservation of Prior Sections ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    const closingSoon = await page.$('#closing-soon');
    assert(closingSoon !== null, 'Closing Soon section remains present and untouched');

    // -------------------------------------------------------------
    // Test 2: Explore the Collections Visual Reconstruction
    // -------------------------------------------------------------
    console.log('\n--- 2. Verifying Exhibition Gallery Reconstructed Design ---');
    const categoriesSection = await page.$('#categories');
    assert(categoriesSection !== null, '#categories section is present in DOM');

    // Scroll to #categories
    await page.$eval('#categories', el => el.scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 600));

    const sectionText = await page.$eval('#categories', el => el.innerText);
    assert(sectionText.includes('CURATED DEPARTMENTS'), 'Contains gold eyebrow "CURATED DEPARTMENTS"');
    assert(sectionText.includes('Explore the collections'), 'Contains editorial heading "Explore the collections"');
    assert(sectionText.includes('SIX DISCIPLINES. A WORLD OF EXCEPTIONAL OBJECTS.'), 'Contains uppercase supporting copy');
    assert(sectionText.includes('View all categories'), 'Contains top right "View all categories →" action');

    // Verify 6 exhibition panels
    const panels = await page.$$eval('#categories [data-collection-id]', els =>
      els.map(el => ({
        id: el.getAttribute('data-collection-id'),
        text: el.innerText,
        imgSrc: el.querySelector('img')?.getAttribute('src'),
      }))
    );

    assert(panels.length === 6, `Found exactly 6 exhibition panels (got ${panels.length})`);

    const expectedPanels = [
      { id: 'fine-art', title: 'Fine Art', sub1: 'Paintings · Drawings', sub2: 'Sculpture · Prints', img: '/images/painting.jpg' },
      { id: 'horology', title: 'Horology', sub1: 'Collectible Watches', sub2: 'Clocks · Instruments', img: '/images/vintage%20watch.jpg' },
      { id: 'numismatics', title: 'Numismatics', sub1: 'Ancient Coins · Medals', sub2: 'Currency · Tokens', img: '/images/roman%20coin.jpg' },
      { id: 'rare-books', title: 'Rare Books', sub1: 'First Editions · Manuscripts', sub2: 'Maps · Documents', img: '/images/old%20books.jpg' },
      { id: 'jewellery', title: 'Jewellery', sub1: 'Fine Jewellery · Gemstones', sub2: 'Signed Pieces', img: '/images/jwellery.jpg' },
      { id: 'antiquities', title: 'Antiquities', sub1: 'Classical · Asian · Egyptian', sub2: 'Historic Objects', img: '/images/vintage%20statue.jpg' },
    ];

    for (const exp of expectedPanels) {
      const p = panels.find(item => item.id === exp.id);
      assert(p !== undefined, `Panel ${exp.title} (${exp.id}) is present`);
      if (p) {
        assert(p.text.includes(exp.title), `Panel ${exp.id} contains title "${exp.title}"`);
        assert(p.text.includes(exp.sub1), `Panel ${exp.id} contains "${exp.sub1}"`);
        assert(p.text.includes(exp.sub2), `Panel ${exp.id} contains "${exp.sub2}"`);
        assert(p.imgSrc === exp.img, `Panel ${exp.id} links to genuine asset "${exp.img}"`);
      }
    }

    // Wait for all 6 images to load with naturalWidth > 0
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('#categories img')).every(i => i.complete && i.naturalWidth > 0),
      { timeout: 10000 }
    );

    const imagesValid = await page.$$eval('#categories [data-collection-id] img', imgs =>
      imgs.every(img => img.complete && img.naturalWidth > 0)
    );
    assert(imagesValid, 'All 6 artwork images loaded cleanly with naturalWidth > 0');

    // Capture desktop screenshot of the reconstructed section
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'reconstructed-collections-gallery.png'),
    });
    console.log('  Saved screenshot: reconstructed-collections-gallery.png');

    // -------------------------------------------------------------
    // Test 3: Guest Interaction & Purely Informational Notice
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Guest Interaction & Pure Informational Notice ---');

    // Click Fine Art panel as guest
    const fineArtPanel = await page.$('#categories [data-collection-id="fine-art"]');
    await fineArtPanel.click();
    await new Promise(r => setTimeout(r, 400));

    const notice = await page.$('#guest-access-notice');
    assert(notice !== null, 'Access notice dialog is opened on clicking a collection');

    const noticeText = await page.$eval('#guest-access-notice', el => el.innerText);
    assert(noticeText.includes('AUREVANT PRIVATE ACCESS'), 'Notice contains eyebrow "AUREVANT PRIVATE ACCESS"');
    assert(
      noticeText.includes('This collection requires an AUREVANT account. Please create an account to continue exploring.'),
      'Notice contains exact requested message'
    );
    assert(noticeText.toLowerCase().includes('dismiss'), 'Notice provides simple Dismiss button');

    // Verify ABSENCE of unrequested auth forms/buttons
    const hasRegisterLinks = await page.$('#guest-access-notice a[href*="register"]');
    const hasLoginLinks = await page.$('#guest-access-notice a[href*="login"]');
    const hasInputs = await page.$('#guest-access-notice input');
    assert(hasRegisterLinks === null, 'Zero signup/registration links in notice (strictly informational)');
    assert(hasLoginLinks === null, 'Zero signin/login links in notice (strictly informational)');
    assert(hasInputs === null, 'Zero input/registration forms in notice');

    // Capture screenshot of the notice plaque
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'guest-access-notice-plaque.png'),
    });
    console.log('  Saved screenshot: guest-access-notice-plaque.png');

    // Dismiss notice via Dismiss button
    const dismissBtn = await page.$('#guest-access-notice button ::-p-text(Dismiss)');
    if (dismissBtn) {
      await dismissBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await new Promise(r => setTimeout(r, 300));
    assert(await page.$('#guest-access-notice') === null, 'Dismiss button dismisses the notice');

    // Test Escape key dismissal
    await fineArtPanel.click();
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 300));
    assert(await page.$('#guest-access-notice') === null, 'Escape key dismisses the notice');

    // -------------------------------------------------------------
    // Test 4: Verify Removal of Unrequested Auth Routes
    // -------------------------------------------------------------
    console.log('\n--- 4. Verifying Removal of Unrequested Auth Routes ---');
    const testRoutes = ['/auth/login', '/auth/register', '/catalogue', '/collections/fine-art'];
    for (const route of testRoutes) {
      const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle2' });
      assert(response.status() === 404, `Unrequested route "${route}" successfully removed (status: 404)`);
    }

    // -------------------------------------------------------------
    // Test 5: Mobile Viewport & Responsiveness (390px)
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Mobile Viewport (390px) ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    await page.$eval('#categories', el => el.scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 400));

    const horizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assert(!horizontalOverflow, 'Zero horizontal document overflow on mobile viewport (390px)');

    // Test mobile click triggers notice cleanly
    const mobilePanel = await page.$('#categories [data-collection-id="fine-art"]');
    await mobilePanel.scrollIntoView();
    await new Promise(r => setTimeout(r, 200));
    await mobilePanel.click();
    await new Promise(r => setTimeout(r, 400));
    assert(await page.$('#guest-access-notice') !== null, 'Notice functions cleanly on mobile touch viewport');

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'reconstructed-collections-mobile-390.png'),
    });
    console.log('  Saved screenshot: reconstructed-collections-mobile-390.png');

    // -------------------------------------------------------------
    // Test 6: Zero Browser Console Errors
    // -------------------------------------------------------------
    console.log('\n--- 6. Checking Page Runtime Errors ---');
    const relevantErrors = pageErrors.filter(e => !e.includes('favicon'));
    assert(relevantErrors.length === 0, `Zero page runtime errors detected (got ${relevantErrors.length})`);
    if (relevantErrors.length > 0) {
      console.error('Page errors:', relevantErrors);
    }

  } catch (err) {
    console.error('Test error:', err);
    assert(false, `Unexpected exception during verification: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n=============================================================');
  console.log(`  VERIFICATION RESULTS: ${results.passed} / ${results.total} PASSED`);
  if (results.failed === 0) {
    console.log('  \x1b[32mALL VERIFICATION CHECKS PASSED PERFECTLY!\x1b[0m');
  } else {
    console.log(`  \x1b[31m${results.failed} CHECKS FAILED.\x1b[0m`);
  }
  console.log('=============================================================\n');

  return results.failed === 0;
}

runVerification().then(success => {
  process.exit(success ? 0 : 1);
});
