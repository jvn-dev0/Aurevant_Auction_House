import puppeteer from 'puppeteer-core';

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

  // Click slot 3 (Roman coin)
  const clicked = await page.evaluate(() => {
    const articles = document.querySelectorAll('#closing-soon article');
    if (!articles[3]) return false;
    // Click the image directly or button
    const imgOrBtn = articles[3].querySelector('button') || articles[3];
    imgOrBtn.click();
    return true;
  });
  console.log('Clicked coin:', clicked);

  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'C:/Users/kbjee/.gemini/antigravity/brain/a1cb3096-bf53-49f1-84e2-572bb49a89f3/test-coin-thin.png' });
  console.log('Saved test-coin-thin.png');

  // Rotate coin slightly to inspect edge thickness
  const canvasBox = await page.evaluate(() => {
    const canvas = document.querySelector('#interactive-3d-modal canvas');
    if (!canvas) return null;
    const r = canvas.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (canvasBox) {
    // Drag horizontally to rotate 45 degrees
    await page.mouse.move(canvasBox.x, canvasBox.y);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 80, canvasBox.y, { steps: 6 });
    await page.mouse.up();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:/Users/kbjee/.gemini/antigravity/brain/a1cb3096-bf53-49f1-84e2-572bb49a89f3/test-coin-edge-view.png' });
    console.log('Saved test-coin-edge-view.png');
  }

  await browser.close();
})();
