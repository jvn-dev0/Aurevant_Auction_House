import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const outDir = 'tests/verification';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const stages = [
    { name: '1-hero-bottom', scrollY: 350, desc: 'Bottom of the existing Hero transitioning into Collections' },
    { name: '2-collections-intro', scrollY: 750, desc: 'Beginning of the Collections introduction' },
    { name: '3-initial-compact-video', scrollY: 1000, desc: 'Initial compact centered video preview (Stage A)' },
    { name: '4-midway-expansion', scrollY: 1400, desc: 'Midway through scroll-driven expansion (Stage B/C)' },
    { name: '5-final-expanded-video', scrollY: 1800, desc: 'Final cinematic expanded video presentation (Stage D)' },
    { name: '6-scroll-back-reverse', scrollY: 1100, desc: 'Scrolling backwards from final state back to compact' },
  ];

  const results = [];

  for (const stage of stages) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), stage.scrollY);
    // Allow animation/render to settle
    await new Promise(r => setTimeout(r, 400));

    const metrics = await page.evaluate(() => {
      const videoBox = document.querySelector('section[aria-label="Collections"] video')?.parentElement?.parentElement;
      const intro = document.querySelector('section[aria-label="Collections"] h2');
      const hero = document.querySelector('section:not([aria-label="Collections"])');
      const collections = document.querySelector('section[aria-label="Collections"]');

      return {
        scrollY: window.scrollY,
        video: videoBox ? {
          width: videoBox.getBoundingClientRect().width,
          height: videoBox.getBoundingClientRect().height,
          top: videoBox.getBoundingClientRect().top,
          borderRadius: window.getComputedStyle(videoBox).borderRadius,
          styleWidth: videoBox.style.width,
        } : null,
        heroBottom: hero ? hero.getBoundingClientRect().bottom : null,
        collectionsTop: collections ? collections.getBoundingClientRect().top : null,
        introVisible: intro ? (intro.getBoundingClientRect().top >= 0 && intro.getBoundingClientRect().bottom <= window.innerHeight) : false,
      };
    });

    const screenshotPath = `${outDir}/${stage.name}.png`;
    await page.screenshot({ path: screenshotPath });

    results.push({
      ...stage,
      metrics,
      screenshot: screenshotPath,
    });

    console.log(`Captured ${stage.name}: scrollY=${metrics.scrollY}, videoWidth=${metrics.video?.width}px (${metrics.video?.styleWidth}), radius=${metrics.video?.borderRadius}`);
  }

  // Also capture full hero at scroll 0 to verify hero unchanged
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: `${outDir}/0-hero-full.png` });

  await browser.close();

  fs.writeFileSync(`${outDir}/metrics.json`, JSON.stringify(results, null, 2));
  console.log('Verification completed successfully!');
}

main().catch(console.error);
