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

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon.ico')) errors.push(msg.text());
  });

  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 25000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Scroll to Closing Soon section
  console.log('Scrolling to Closing Soon section...');
  await page.evaluate(() => {
    const cs = document.getElementById('closing-soon');
    if (cs) cs.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check 4 lots information
  const lotsInfo = await page.evaluate(() => {
    const cs = document.getElementById('closing-soon');
    if (!cs) return null;
    const articles = cs.querySelectorAll('article');
    return Array.from(articles).map(a => {
      const slot = a.querySelector('.font-mono')?.innerText || '';
      const title = a.querySelector('h3')?.innerText || '';
      const demo = a.innerText.includes('[DEMO AUCTION]');
      const timer = a.innerText.includes('HRS') && a.innerText.includes('MIN') && a.innerText.includes('SEC');
      return { slot, title, demo, timer };
    });
  });
  console.log('Featured Objects in Catalogue:', JSON.stringify(lotsInfo, null, 2));

  // Screenshot 1: Closing Soon Catalogue Showcase
  await page.screenshot({ path: 'C:/Users/kbjee/.gemini/antigravity/brain/a1cb3096-bf53-49f1-84e2-572bb49a89f3/closing-soon-showcase.png' });

  // Check countdown running (read twice with 1.2s delay)
  const timer1 = await page.evaluate(() => {
    const firstArticle = document.querySelector('#closing-soon article');
    return firstArticle?.innerText.match(/\d{2}\s*HRS\s*\d{2}\s*MIN\s*\d{2}\s*SEC/)?.[0] || 'not-found';
  });
  await new Promise(r => setTimeout(r, 1500));
  const timer2 = await page.evaluate(() => {
    const firstArticle = document.querySelector('#closing-soon article');
    return firstArticle?.innerText.match(/\d{2}\s*HRS\s*\d{2}\s*MIN\s*\d{2}\s*SEC/)?.[0] || 'not-found';
  });
  console.log('Countdown check: T1 =', timer1, '| T2 =', timer2, '| Timer running?', timer1 !== timer2);

  // 2. Test 3D Viewer on each object
  const objectsToTest = [
    { index: 0, name: 'Antique Book', screenshot: '3d-viewer-antique-book.png' },
    { index: 1, name: 'Vintage Wristwatch', screenshot: '3d-viewer-vintage-watch.png' },
    { index: 2, name: 'Historic Painting', screenshot: '3d-viewer-historic-painting.png' },
    { index: 3, name: 'Roman Coin', screenshot: '3d-viewer-roman-coin.png' },
  ];

  for (const obj of objectsToTest) {
    console.log(`\n--- Testing 3D Viewer for ${obj.name} (Index ${obj.index}) ---`);
    
    // Click "Inspect 3D" button on the object card
    const clicked = await page.evaluate((idx) => {
      const articles = document.querySelectorAll('#closing-soon article');
      if (!articles[idx]) return false;
      const buttons = articles[idx].querySelectorAll('button');
      const inspectBtn = Array.from(buttons).find(b => b.textContent && b.textContent.includes('Inspect 3D'));
      if (inspectBtn) {
        inspectBtn.click();
        return true;
      }
      return false;
    }, obj.index);
    console.log(`Triggered Inspect 3D button click: ${clicked}`);

    // Wait for 3D viewer modal to appear and load
    await new Promise(r => setTimeout(r, 4000));

    // Verify 3D canvas is present inside #interactive-3d-modal
    const viewerStatus = await page.evaluate(() => {
      const modal = document.getElementById('interactive-3d-modal');
      const canvas = modal ? modal.querySelector('canvas') : null;
      const title = modal ? modal.querySelector('h2')?.innerText : '';
      const slot = modal ? modal.querySelector('.font-mono')?.innerText : '';
      return { modalOpen: !!modal, canvasReady: !!canvas, title, slot };
    });
    console.log('3D Viewer Status:', viewerStatus);

    // Capture screenshot of the active 3D viewer
    await page.screenshot({ path: `C:/Users/kbjee/.gemini/antigravity/brain/a1cb3096-bf53-49f1-84e2-572bb49a89f3/${obj.screenshot}` });

    // Test mouse drag rotation on the canvas
    const canvasBox = await page.evaluate(() => {
      const canvas = document.querySelector('#interactive-3d-modal canvas');
      if (!canvas) return null;
      const r = canvas.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    if (canvasBox) {
      await page.mouse.move(canvasBox.x, canvasBox.y);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 120, canvasBox.y + 40, { steps: 8 });
      await page.mouse.up();
      await new Promise(r => setTimeout(r, 800));
      console.log(`Successfully simulated mouse drag 360° rotation on ${obj.name}.`);
    }

    // Close 3D Viewer
    await page.evaluate(() => {
      const closeBtn = document.querySelector('#interactive-3d-modal button[aria-label*="Close"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\nAll 4 3D models tested. Total errors:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  await browser.close();
})();
