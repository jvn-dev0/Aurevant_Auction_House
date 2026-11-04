import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function runTests() {
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

  const outDir = 'tests/verification-reversible';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const testReport = {
    testA: {},
    testB: {},
    testC: {},
    testD: {},
    testE: {},
    testF: {},
  };

  // Helper to read video and layout state
  const getMetrics = async () => {
    return await page.evaluate(() => {
      const hero = document.querySelector('section:not([aria-label="Collections"])');
      const collections = document.querySelector('section[aria-label="Collections"]');
      const intro = document.querySelector('section[aria-label="Collections"] h2')?.parentElement;
      const videoWrapper = document.querySelector('section[aria-label="Collections"] video')?.parentElement?.parentElement;
      const video = document.querySelector('section[aria-label="Collections"] video');
      const allVideos = document.querySelectorAll('video');

      const vBox = videoWrapper ? videoWrapper.getBoundingClientRect() : null;
      const iBox = intro ? intro.getBoundingClientRect() : null;
      const hBox = hero ? hero.getBoundingClientRect() : null;
      const cBox = collections ? collections.getBoundingClientRect() : null;

      return {
        scrollY: window.scrollY,
        windowW: window.innerWidth,
        windowH: window.innerHeight,
        docScrollWidth: document.documentElement.scrollWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        url: window.location.href,
        totalVideos: allVideos.length,
        videoPlaying: video ? !video.paused : false,
        videoCurrentTime: video ? video.currentTime : 0,
        heroBottom: hBox ? hBox.bottom : null,
        collectionsTop: cBox ? cBox.top : null,
        gapBetweenHeroAndCollections: (cBox && hBox) ? Math.round(cBox.top - hBox.bottom) : null,
        introOpacity: intro ? parseFloat(window.getComputedStyle(intro).opacity) : null,
        introVisible: intro ? (iBox.top >= 0 && iBox.bottom <= window.innerHeight && parseFloat(window.getComputedStyle(intro).opacity) > 0.1) : false,
        videoWrapper: vBox ? {
          width: Math.round(vBox.width),
          height: Math.round(vBox.height),
          top: Math.round(vBox.top),
          bottom: Math.round(vBox.bottom),
          left: Math.round(vBox.left),
          right: Math.round(vBox.right),
          borderRadius: window.getComputedStyle(videoWrapper).borderRadius,
          boxShadow: window.getComputedStyle(videoWrapper).boxShadow,
        } : null,
      };
    });
  };

  // ─────────────────────────────────────────────────────────────
  // TEST A: Initial Page & Transition from Hero
  // ─────────────────────────────────────────────────────────────
  console.log('\n=== RUNNING TEST A: Initial Page & Hero Transition ===');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: `${outDir}/A1-hero-top.png` });

  // Scroll to Collections start (scrollY = 900)
  await page.evaluate(() => window.scrollTo(0, 900));
  await new Promise(r => setTimeout(r, 600));
  const metricsA = await getMetrics();
  await page.screenshot({ path: `${outDir}/A2-collections-scene01.png` });

  testReport.testA = {
    heroBottom: metricsA.heroBottom,
    collectionsTop: metricsA.collectionsTop,
    gap: metricsA.gapBetweenHeroAndCollections,
    introVisible: metricsA.introVisible,
    introOpacity: metricsA.introOpacity,
    videoWidth: metricsA.videoWrapper?.width,
    videoHeight: metricsA.videoWrapper?.height,
    videoBorderRadius: metricsA.videoWrapper?.borderRadius,
    videoCentered: Math.abs(metricsA.videoWrapper?.left - (metricsA.windowW - metricsA.videoWrapper?.width) / 2) <= 2,
    totalVideosMounted: metricsA.totalVideos,
  };
  console.log('Test A metrics:', JSON.stringify(testReport.testA, null, 2));

  // ─────────────────────────────────────────────────────────────
  // TEST B: Forward Expansion (Milestones 25%, 50%, 75%, 100%)
  // ─────────────────────────────────────────────────────────────
  console.log('\n=== RUNNING TEST B: Forward Continuous Expansion ===');
  const scrollSteps = [
    { label: 'B1-early-25pct', y: 1200 },
    { label: 'B2-mid-50pct', y: 1500 },
    { label: 'B3-near-full-75pct', y: 1800 },
    { label: 'B4-fullscreen-100pct', y: 2100 },
  ];

  testReport.testB.steps = [];
  for (const step of scrollSteps) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), step.y);
    await new Promise(r => setTimeout(r, 400));
    const m = await getMetrics();
    await page.screenshot({ path: `${outDir}/${step.label}.png` });

    testReport.testB.steps.push({
      step: step.label,
      scrollY: m.scrollY,
      width: m.videoWrapper?.width,
      height: m.videoWrapper?.height,
      borderRadius: m.videoWrapper?.borderRadius,
      introOpacity: m.introOpacity,
      isFullScreen: m.videoWrapper?.width >= 1438 && m.videoWrapper?.height >= 898,
      overflow: m.hasHorizontalOverflow,
    });
    console.log(`Step ${step.label}: width=${m.videoWrapper?.width}px, height=${m.videoWrapper?.height}px, radius=${m.videoWrapper?.borderRadius}, introOpacity=${m.introOpacity}`);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST C: Reverse Expansion from 100% Back to 0%
  // ─────────────────────────────────────────────────────────────
  console.log('\n=== RUNNING TEST C: Reverse Contraction to Scene 01 ===');
  const reverseSteps = [
    { label: 'C1-reverse-to-75pct', y: 1800 },
    { label: 'C2-reverse-to-50pct', y: 1500 },
    { label: 'C3-reverse-to-25pct', y: 1200 },
    { label: 'C4-reverse-to-compact', y: 900 },
  ];

  testReport.testC.steps = [];
  for (const step of reverseSteps) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), step.y);
    await new Promise(r => setTimeout(r, 400));
    const m = await getMetrics();
    await page.screenshot({ path: `${outDir}/${step.label}.png` });

    testReport.testC.steps.push({
      step: step.label,
      scrollY: m.scrollY,
      width: m.videoWrapper?.width,
      height: m.videoWrapper?.height,
      borderRadius: m.videoWrapper?.borderRadius,
      introOpacity: m.introOpacity,
      restoredToCompact: step.label === 'C4-reverse-to-compact' && m.videoWrapper?.width <= 845 && m.introOpacity >= 0.9,
    });
    console.log(`Reverse ${step.label}: width=${m.videoWrapper?.width}px, height=${m.videoWrapper?.height}px, radius=${m.videoWrapper?.borderRadius}, introOpacity=${m.introOpacity}`);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST D: Interrupted Scrolling & Direction Reversal
  // ─────────────────────────────────────────────────────────────
  console.log('\n=== RUNNING TEST D: Interrupted Scrolling ===');
  // Scroll to 50%
  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise(r => setTimeout(r, 200));
  const mD1 = await getMetrics();

  // Reverse 100px up
  await page.evaluate(() => window.scrollTo(0, 1400));
  await new Promise(r => setTimeout(r, 200));
  const mD2 = await getMetrics();

  // Forward 300px down
  await page.evaluate(() => window.scrollTo(0, 1700));
  await new Promise(r => setTimeout(r, 200));
  const mD3 = await getMetrics();

  testReport.testD = {
    at1500_width: mD1.videoWrapper?.width,
    at1400_width: mD2.videoWrapper?.width,
    at1700_width: mD3.videoWrapper?.width,
    smoothReversal: mD2.videoWrapper?.width < mD1.videoWrapper?.width && mD3.videoWrapper?.width > mD1.videoWrapper?.width,
  };
  console.log('Test D (Interrupted):', testReport.testD);

  // ─────────────────────────────────────────────────────────────
  // TEST E & F: Navigation, Overflow, URL, Persistence
  // ─────────────────────────────────────────────────────────────
  console.log('\n=== RUNNING TEST E & F: Navigation & Technical Checks ===');
  const finalMetrics = await getMetrics();
  testReport.testE = {
    urlPreserved: finalMetrics.url === 'http://localhost:3001/',
    totalVideosMounted: finalMetrics.totalVideos,
    hasHorizontalOverflow: finalMetrics.hasHorizontalOverflow,
    consoleErrors,
  };

  await browser.close();
  fs.writeFileSync(`${outDir}/test-report.json`, JSON.stringify(testReport, null, 2));
  console.log('\nALL VERIFICATION TESTS COMPLETE! Results written to tests/verification-reversible/test-report.json');
}

runTests().catch(console.error);
