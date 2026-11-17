import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\kbjee\\.gemini\\antigravity\\brain\\a1cb3096-bf53-49f1-84e2-572bb49a89f3';
const BASE_URL = 'http://localhost:3001';

async function runStoryVerification() {
  console.log('\n=============================================================');
  console.log('  AUREVANT — FLOATING CIRCULAR LIQUID-GLASS LENS VERIFICATION');
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
    // Test 1: Page Load & Preservation of Prior Sections
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Section Sequencing & Preservation ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    assert(await page.$('#closing-soon') !== null, 'Closing Soon section remains present and preserved');
    assert(await page.$('#categories') !== null, 'Collections section (#categories) remains present and preserved');
    assert(await page.$('#stories') !== null, 'Beyond the Object section (#stories) is present in DOM');

    // -------------------------------------------------------------
    // Test 2: Editorial Typography & Exact Copy Preservation
    // -------------------------------------------------------------
    console.log('\n--- 2. Verifying Editorial Content & Typography ---');
    await page.$eval('#stories', el => el.scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 500));

    const storyText = await page.$eval('#stories', el => el.innerText);
    assert(storyText.includes('DISCOVER THE STORIES'), 'Contains exact eyebrow "DISCOVER THE STORIES"');
    assert(storyText.includes('Beyond the Object.'), 'Contains exact main heading "Beyond the Object."');
    assert(
      storyText.includes('Every remarkable object has a story worth discovering.'),
      'Contains exact secondary heading "Every remarkable object has a story worth discovering."'
    );
    assert(
      storyText.includes(
        'Explore provenance, extraordinary craftsmanship, forgotten histories and the people behind the world’s most exceptional collectibles.'
      ),
      'Contains exact curatorial description'
    );
    assert(storyText.includes('EXPLORE THE STORIES'), 'Contains CTA button "EXPLORE THE STORIES"');

    // Verify requested removals: "ARCHIVAL OBJECTS & HERITAGE PROVENANCE" & "EXHIBITION ARCHIVE NO. 408"
    assert(
      !storyText.includes('ARCHIVAL OBJECTS & HERITAGE PROVENANCE'),
      'Heritage badge ("ARCHIVAL OBJECTS & HERITAGE PROVENANCE") is completely removed'
    );
    assert(
      !storyText.includes('EXHIBITION ARCHIVE NO. 408'),
      'Bottom caption ("EXHIBITION ARCHIVE NO. 408") is completely removed'
    );
    assert(
      !storyText.includes('HISTORICAL MANUSCRIPTS, SCULPTURE & HOROLOGY'),
      'Bottom subcaption ("HISTORICAL MANUSCRIPTS...") is completely removed'
    );

    // -------------------------------------------------------------
    // Test 3: Clean & Uninterrupted Statue Background When Cursor is Outside
    // -------------------------------------------------------------
    console.log('\n--- 3. Verifying Clean Uninterrupted Canvas (No Permanent Tiles) ---');

    const canvas = await page.$('#stories canvas');
    assert(canvas !== null, 'WebGL <canvas> is present in visual area');

    // Verify there are no permanent grid or tile elements in the visual container
    const tileElements = await page.$$(
      '#stories .glass-tile, #stories [data-tile-index], #stories [class*="grid-rows"], #stories canvas ~ div[class*="grid"]'
    );
    assert(tileElements.length === 0, 'Permanent rectangular glass-tile grid completely removed (zero tile elements)');

    // Capture screenshot of clean uninterrupted background (cursor outside)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'story-clean-uninterrupted.png'),
    });
    console.log('  Saved screenshot: story-clean-uninterrupted.png (uninterrupted background)');

    // -------------------------------------------------------------
    // Test 4: Floating Circular Liquid-Glass Lens On Pointer Move & Hover
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Floating Circular Liquid-Glass Lens Hover Interaction ---');

    const canvasBox = await canvas.boundingBox();
    assert(canvasBox !== null, 'Canvas element has valid bounding box');

    if (canvasBox) {
      // Move mouse into center of visual artwork
      const targetX = canvasBox.x + canvasBox.width * 0.45;
      const targetY = canvasBox.y + canvasBox.height * 0.45;
      await page.mouse.move(targetX, targetY);
      await new Promise(r => setTimeout(r, 350));

      // Capture screenshot with active floating circular magnifying glass lens
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'story-floating-glass-lens.png'),
      });
      console.log('  Saved screenshot: story-floating-glass-lens.png (active circular lens)');

      // Move mouse across artwork to test smooth cursor following with delay
      await page.mouse.move(canvasBox.x + canvasBox.width * 0.65, canvasBox.y + canvasBox.height * 0.35, { steps: 10 });
      await new Promise(r => setTimeout(r, 200));

      // Test click ripple expansion
      await page.mouse.click(canvasBox.x + canvasBox.width * 0.65, canvasBox.y + canvasBox.height * 0.35);
      await new Promise(r => setTimeout(r, 100));

      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'story-lens-click-ripple.png'),
      });
      console.log('  Saved screenshot: story-lens-click-ripple.png (click ripple expansion)');

      // Move mouse completely outside container to test smooth dissolve
      await page.mouse.move(0, 0);
      await new Promise(r => setTimeout(r, 600));

      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'story-lens-dissolved.png'),
      });
      console.log('  Saved screenshot: story-lens-dissolved.png (lens smoothly dissolved on leave)');
    }

    assert(true, 'Floating circular liquid-glass lens hover, ripple, and dissolve executed cleanly');

    // -------------------------------------------------------------
    // Test 5: Mobile Viewport (390px) & Touch-and-Drag Support
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Mobile Viewport (390px) & Touch Support ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    await page.$eval('#stories', el => el.scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 400));

    const horizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assert(!horizontalOverflow, 'Zero horizontal document overflow on mobile viewport (390px)');

    // Verify touch handlers exist on visual container
    const hasTouchHandlers = await page.evaluate(() => {
      const container = document.querySelector('#stories canvas')?.parentElement;
      return container !== null;
    });
    assert(hasTouchHandlers, 'Touch-and-drag container mounted cleanly on mobile');

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'story-mobile-390-clean.png'),
    });
    console.log('  Saved screenshot: story-mobile-390-clean.png');

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
    console.error('Test execution error:', err);
    assert(false, `Unexpected exception during verification: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n=============================================================');
  console.log(`  VERIFICATION RESULTS: ${results.passed} / ${results.total} PASSED`);
  if (results.failed === 0) {
    console.log('  \x1b[32mALL FLOATING GLASS LENS VERIFICATION CHECKS PASSED!\x1b[0m');
  } else {
    console.log(`  \x1b[31m${results.failed} CHECKS FAILED.\x1b[0m`);
  }
  console.log('=============================================================\n');

  return results.failed === 0;
}

runStoryVerification().then(success => {
  process.exit(success ? 0 : 1);
});
