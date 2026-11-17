import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

(async () => {
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
      '--enable-gpu-rasterization'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });
  await page.goto('http://localhost:3001');
  await new Promise(r => setTimeout(r, 2000));

  const targets = [
    { idx: 0, filename: 'antique-book-3d.png' },
    { idx: 1, filename: 'vintage-watch-3d.png' },
    { idx: 2, filename: 'historic-painting-3d.png' },
    { idx: 3, filename: 'roman-coin-3d.png' },
  ];

  const outDir = 'c:/Users/kbjee/OneDrive/Desktop/omniroute/aurevant-production/public/images/collections';

  for (const t of targets) {
    console.log(`Capturing preview for lot index ${t.idx}...`);
    // Click lot
    await page.evaluate((idx) => {
      const articles = document.querySelectorAll('#closing-soon article');
      if (articles[idx]) {
        const btn = articles[idx].querySelector('button') || articles[idx];
        btn.click();
      }
    }, t.idx);

    await new Promise(r => setTimeout(r, 3500));

    // Pause turntable to get a steady angle
    await page.evaluate(() => {
      const pauseBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('PAUSE TURNTABLE'));
      if (pauseBtn) pauseBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Get canvas handle
    const canvasElement = await page.$('#interactive-3d-modal canvas');
    if (canvasElement) {
      const outPath = path.join(outDir, t.filename);
      await canvasElement.screenshot({ path: outPath });
      console.log(`Saved ${outPath}`);
    }

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('#interactive-3d-modal button[aria-label*="Close"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  await browser.close();
  console.log('Finished capturing all 4 authentic previews.');
})();
