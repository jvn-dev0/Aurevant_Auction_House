import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function verifyFinalJourney() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const outDir = 'tests/verification-final';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const getMetrics = async () => {
    return await page.evaluate(() => {
      const hero = document.querySelector('section:not([aria-label="Collections"]):not([aria-label="Explore Our Collections"])');
      const collections = document.querySelector('section[aria-label="Collections"]');
      const catalogue = document.querySelector('section[aria-label="Explore Our Collections"]');
      const videoWrapper = document.querySelector('section[aria-label="Collections"] video')?.parentElement?.parentElement;
      const video = document.querySelector('section[aria-label="Collections"] video');
      const intro = document.querySelector('section[aria-label="Collections"] h2')?.parentElement;
      const cards = document.querySelectorAll('section[aria-label="Explore Our Collections"] a');

      const vBox = videoWrapper ? videoWrapper.getBoundingClientRect() : null;
      const hBox = hero ? hero.getBoundingClientRect() : null;
      const cBox = collections ? collections.getBoundingClientRect() : null;
      const catBox = catalogue ? catalogue.getBoundingClientRect() : null;

      return {
        scrollY: window.scrollY,
        windowW: window.innerWidth,
        windowH: window.innerHeight,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        heroBottom: hBox ? Math.round(hBox.bottom) : null,
        collectionsTop: cBox ? Math.round(cBox.top) : null,
        catalogueTop: catBox ? Math.round(catBox.top) : null,
        catalogueVisible: catBox ? (catBox.top < window.innerHeight && catBox.bottom > 0) : false,
        totalCatalogueCards: cards.length,
        videoPlaying: video ? !video.paused : false,
        videoCurrentTime: video ? video.currentTime : 0,
        introOpacity: intro ? parseFloat(window.getComputedStyle(intro).opacity) : null,
        videoWrapper: vBox ? {
          width: Math.round(vBox.width),
          height: Math.round(vBox.height),
          widthVw: Math.round((vBox.width / window.innerWidth) * 100),
          heightVh: Math.round((vBox.height / window.innerHeight) * 100),
          borderRadius: window.getComputedStyle(videoWrapper).borderRadius,
          top: Math.round(vBox.top),
          bottom: Math.round(vBox.bottom),
        } : null,
      };
    });
  };

  const results = {};

  // 1. Initial Hero State (scrollY = 0)
  console.log('\n--- 1. Hero State ---');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: `${outDir}/1-hero-intact.png` });
  results.hero = await getMetrics();

  // 2. Collections Scene 01 (Compact video preview at scrollY = 900)
  console.log('\n--- 2. Collections Scene 01 (Compact) ---');
  await page.evaluate(() => window.scrollTo(0, 900));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${outDir}/2-collections-compact.png` });
  results.collectionsCompact = await getMetrics();

  // 3. Stage 4 Final Expanded Video Composition (90-95vw, ~50vh, scrollY = 1650)
  console.log('\n--- 3. Stage 4 Final Expanded Video (92vw, 50vh) ---');
  await page.evaluate(() => window.scrollTo(0, 1650));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${outDir}/3-video-stage4-expanded.png` });
  results.videoStage4 = await getMetrics();

  // 4. Clean Pin Release & Transition into Explore Our Collections (scrollY = 2500)
  console.log('\n--- 4. Pin Released & Explore Our Collections Revealed ---');
  await page.evaluate(() => window.scrollTo(0, 2500));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${outDir}/4-catalogue-departments.png` });
  results.catalogue = await getMetrics();

  // 5. Reverse Scrolling: Up to Stage 4 expanded video (scrollY = 1650)
  console.log('\n--- 5. Reverse Scroll: Back to Stage 4 Video ---');
  await page.evaluate(() => window.scrollTo(0, 1650));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${outDir}/5-reverse-stage4.png` });
  results.reverseStage4 = await getMetrics();

  // 6. Reverse Scrolling: Up to Compact Scene 01 (scrollY = 900)
  console.log('\n--- 6. Reverse Scroll: Back to Compact Collections ---');
  await page.evaluate(() => window.scrollTo(0, 900));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${outDir}/6-reverse-compact.png` });
  results.reverseCompact = await getMetrics();

  // 7. Reverse Scrolling: All the way back to Hero (scrollY = 0)
  console.log('\n--- 7. Reverse Scroll: Back to Hero ---');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${outDir}/7-reverse-hero.png` });
  results.reverseHero = await getMetrics();

  // 8. Mobile Viewport Verification (390px width)
  console.log('\n--- 8. Mobile Viewport Verification (390px) ---');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 844));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${outDir}/8-mobile-compact.png` });
  results.mobileCompact = await getMetrics();

  await page.evaluate(() => window.scrollTo(0, 1600));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${outDir}/9-mobile-expanded.png` });
  results.mobileExpanded = await getMetrics();

  await page.evaluate(() => window.scrollTo(0, 2400));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${outDir}/10-mobile-catalogue.png` });
  results.mobileCatalogue = await getMetrics();

  results.consoleErrors = consoleErrors;

  await browser.close();
  fs.writeFileSync(`${outDir}/verification-results.json`, JSON.stringify(results, null, 2));
  console.log('\nFinal scroll journey verification completed successfully!');
}

verifyFinalJourney().catch(console.error);
