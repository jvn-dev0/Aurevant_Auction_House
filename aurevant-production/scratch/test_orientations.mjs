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

  // Inspect the meshes of watch and coin
  // We can open slot 1 (watch) and slot 3 (coin) and check their bounding boxes and orientations
  const testRotations = async (slotIdx, rotations, prefix) => {
    // click button
    await page.evaluate((idx) => {
      const articles = document.querySelectorAll('#closing-soon article');
      const btn = Array.from(articles[idx].querySelectorAll('button')).find(b => b.textContent.includes('Inspect 3D'));
      if (btn) btn.click();
    }, slotIdx);

    await new Promise(r => setTimeout(r, 2500));

    // Try applying rotation to the loaded scene
    for (let i = 0; i < rotations.length; i++) {
      const rot = rotations[i];
      await page.evaluate((r) => {
        // Find three scene root
        // In our component, loadedObject is added to rootGroup in scene
        // We can inspect canvas or find renderer scene
      }, rot);
    }

    // close
    await page.evaluate(() => {
      const closeBtn = document.querySelector('#interactive-3d-modal button[aria-label*="Close"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  };

  await browser.close();
})();
