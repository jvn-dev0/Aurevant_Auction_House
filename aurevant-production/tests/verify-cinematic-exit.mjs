import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('tests/verification-cinematic-exit');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function runVerification() {
  console.log('--- STARTING CINEMATIC EXIT & HANDOFF VERIFICATION ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
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
  await new Promise(r => setTimeout(r, 1500));

  const getMetrics = async () => {
    return await page.evaluate(() => {
      const hero = document.querySelector('section:not([aria-label="Collections"]):not([aria-label="Explore Our Collections"])');
      const collections = document.querySelector('section[aria-label="Collections"]');
      const catalogue = document.querySelector('section[aria-label="Explore Our Collections"]');
      const intro = document.querySelector('section[aria-label="Collections"] h2')?.parentElement;
      const supportingText = document.querySelector('section[aria-label="Collections"] p:last-of-type');
      const videoWrapper = document.querySelector('section[aria-label="Collections"] video')?.parentElement?.parentElement;
      const video = document.querySelector('section[aria-label="Collections"] video');
      const navbar = document.querySelector('header');
      const allVideos = document.querySelectorAll('video');

      const vBox = videoWrapper ? videoWrapper.getBoundingClientRect() : null;
      const iBox = intro ? intro.getBoundingClientRect() : null;
      const sBox = supportingText ? supportingText.getBoundingClientRect() : null;
      const hBox = hero ? hero.getBoundingClientRect() : null;
      const cBox = collections ? collections.getBoundingClientRect() : null;
      const catBox = catalogue ? catalogue.getBoundingClientRect() : null;
      const nBox = navbar ? navbar.getBoundingClientRect() : null;

      const gapIntroVideo = (sBox && vBox) ? Math.round(vBox.top - sBox.bottom) : null;
      const isIntroOverlapping = (sBox && vBox) ? (vBox.top < sBox.bottom) : null;
      const gapVideoCatalogue = (vBox && catBox) ? Math.round(catBox.top - vBox.bottom) : null;

      return {
        scrollY: window.scrollY,
        videoCount: allVideos.length,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        video: vBox ? {
          top: Math.round(vBox.top),
          bottom: Math.round(vBox.bottom),
          left: Math.round(vBox.left),
          right: Math.round(vBox.right),
          width: Math.round(vBox.width),
          height: Math.round(vBox.height),
          vw: Math.round((vBox.width / window.innerWidth) * 100),
          vh: Math.round((vBox.height / window.innerHeight) * 100),
          borderRadius: window.getComputedStyle(videoWrapper).borderRadius,
        } : null,
        intro: iBox ? {
          top: Math.round(iBox.top),
          bottom: Math.round(iBox.bottom),
          opacity: parseFloat(window.getComputedStyle(intro).opacity),
        } : null,
        gapIntroVideo,
        isIntroOverlapping,
        catalogue: catBox ? {
          top: Math.round(catBox.top),
          bottom: Math.round(catBox.bottom),
          visible: catBox.top < window.innerHeight && catBox.bottom > 0,
        } : null,
        gapVideoCatalogue,
        navbar: nBox ? {
          visible: nBox.height > 0 && nBox.bottom > 0,
          height: Math.round(nBox.height),
          bg: window.getComputedStyle(navbar).backgroundColor,
          zIndex: window.getComputedStyle(navbar).zIndex,
        } : null,
        hero: hBox ? {
          bottom: Math.round(hBox.bottom),
        } : null,
      };
    });
  };

  const results = {};

  // Checkpoint A: Collections Intro & Compact Video
  console.log('Testing Checkpoint A: Compact Intro & Video...');
  await page.evaluate(() => window.scrollTo(0, 834));
  await new Promise(r => setTimeout(r, 400));
  results.checkpointA_compact = await getMetrics();
  await page.screenshot({ path: path.join(OUT_DIR, 'A-compact-intro-video.png') });

  // Checkpoint B: Video Beginning Expansion
  console.log('Testing Checkpoint B: Video Beginning Expansion...');
  await page.evaluate(() => window.scrollTo(0, 1150));
  await new Promise(r => setTimeout(r, 300));
  results.checkpointB_expanding = await getMetrics();
  await page.screenshot({ path: path.join(OUT_DIR, 'B-video-expanding.png') });

  // Checkpoint C & D: Video Final Wide Cinematic State & Hold
  console.log('Testing Checkpoint C & D: Final Wide Cinematic State & Hold (50vh)...');
  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise(r => setTimeout(r, 300));
  results.checkpointCD_expandedHold1 = await getMetrics();
  await page.screenshot({ path: path.join(OUT_DIR, 'C-final-expanded-hold.png') });

  await page.evaluate(() => window.scrollTo(0, 1650));
  await new Promise(r => setTimeout(r, 300));
  results.checkpointCD_expandedHold2 = await getMetrics();

  // Checkpoint E: Pin Released cleanly, Video Moves Upward, Next Section Enters Below
  console.log('Testing Checkpoint E: Next Section Handoff directly below video...');
  await page.evaluate(() => window.scrollTo(0, 1850));
  await new Promise(r => setTimeout(r, 400));
  results.checkpointE_handoffEntry = await getMetrics();
  await page.screenshot({ path: path.join(OUT_DIR, 'D-next-section-handoff-entry.png') });

  // Checkpoint E2: Full Catalogue Departments in view
  console.log('Testing Checkpoint E2: Full Explore Collections Section in view...');
  await page.evaluate(() => window.scrollTo(0, 2250));
  await new Promise(r => setTimeout(r, 400));
  results.checkpointE2_catalogueFull = await getMetrics();
  await page.screenshot({ path: path.join(OUT_DIR, 'E-catalogue-departments.png') });

  // Checkpoint G: Reverse Scroll - Next section leaves, video returns to expanded state
  console.log('Testing Checkpoint G: Reverse scroll back to expanded video...');
  await page.evaluate(() => window.scrollTo(0, 1550));
  await new Promise(r => setTimeout(r, 400));
  results.checkpointG_reverseExpanded = await getMetrics();
  await page.screenshot({ path: path.join(OUT_DIR, 'F-reverse-expanded-state.png') });

  // Checkpoint H: Reverse Scroll - Video shrinks back to compact, intro visible
  console.log('Testing Checkpoint H: Reverse scroll back to compact intro & video...');
  await page.evaluate(() => window.scrollTo(0, 834));
  await new Promise(r => setTimeout(r, 400));
  results.checkpointH_reverseCompact = await getMetrics();
  await page.screenshot({ path: path.join(OUT_DIR, 'G-reverse-compact.png') });

  // Checkpoint I: Return to original Hero without page reload
  console.log('Testing Checkpoint I: Return to Hero at top...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 400));
  results.checkpointI_heroRestored = await getMetrics();
  await page.screenshot({ path: path.join(OUT_DIR, 'H-hero-restored.png') });

  // Laptop Width Check (1366x768)
  console.log('Testing Laptop 1366x768 viewport...');
  await page.setViewport({ width: 1366, height: 768 });
  await page.evaluate(() => window.scrollTo(0, 700));
  await new Promise(r => setTimeout(r, 400));
  results.laptopCheck = await getMetrics();
  await page.screenshot({ path: path.join(OUT_DIR, 'I-laptop-compact.png') });

  // Mobile Width Check (390x844)
  console.log('Testing Mobile 390x844 viewport...');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 700));
  await new Promise(r => setTimeout(r, 400));
  results.mobileCheck = await getMetrics();
  await page.screenshot({ path: path.join(OUT_DIR, 'J-mobile-compact.png') });

  results.consoleErrors = consoleErrors;

  fs.writeFileSync(path.join(OUT_DIR, 'verification-summary.json'), JSON.stringify(results, null, 2));
  console.log('--- VERIFICATION FINISHED SUCCESSFULLY ---');
  console.log('Summary output written to', path.join(OUT_DIR, 'verification-summary.json'));

  await browser.close();
}

runVerification().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
