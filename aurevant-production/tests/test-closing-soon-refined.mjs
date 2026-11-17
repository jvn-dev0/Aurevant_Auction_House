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
    if (msg.type() === 'error' && !msg.text().includes('favicon.ico')) {
      errors.push(msg.text());
    }
  });

  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 25000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Scroll to Closing Soon section
  console.log('Scrolling to Closing Soon...');
  await page.evaluate(() => {
    const cs = document.getElementById('closing-soon');
    if (cs) cs.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));

  // 2. Verify Single Row Desktop Layout
  const layoutCheck = await page.evaluate(() => {
    const cs = document.getElementById('closing-soon');
    const articles = cs ? Array.from(cs.querySelectorAll('article')) : [];
    if (articles.length !== 4) return { count: articles.length, singleRow: false };

    const rects = articles.map(a => a.getBoundingClientRect());
    // In a single horizontal row, all 4 cards have approximately the same top offset (within 5px)
    const tops = rects.map(r => Math.round(r.top));
    const isSingleRow = tops.every(t => Math.abs(t - tops[0]) < 8);

    // Check for any INTERACT 3D or INSPECT 3D overlay text
    const textContent = cs.innerText;
    const hasInteract3D = textContent.includes('INTERACT 3D') || textContent.includes('Interact 3D');
    const hasInspect3D = textContent.includes('INSPECT 3D') || textContent.includes('Inspect 3D');

    // Check thumbnail image paths
    const imgPaths = articles.map(a => a.querySelector('img')?.getAttribute('src'));

    return {
      count: articles.length,
      rects,
      singleRow: isSingleRow,
      hasInteract3D,
      hasInspect3D,
      imgPaths
    };
  });
  console.log('Desktop Layout Check:', JSON.stringify(layoutCheck, null, 2));

  // Capture Screenshot: Desktop Single Row Showcase
  await page.screenshot({ path: 'C:/Users/kbjee/.gemini/antigravity/brain/a1cb3096-bf53-49f1-84e2-572bb49a89f3/closing-soon-single-row-desktop.png' });
  console.log('Captured closing-soon-single-row-desktop.png');

  // 3. Test Mechanical Rolling Countdown Digits
  console.log('\nTesting mechanical countdown progression...');
  const getTimes = async () => {
    return await page.evaluate(() => {
      const articles = document.querySelectorAll('#closing-soon article');
      return Array.from(articles).map(a => {
        const clock = a.querySelector('[data-testid="countdown-clock"]');
        if (!clock) return null;
        const digits = Array.from(clock.querySelectorAll('[aria-label]')).map(el => el.getAttribute('aria-label')).join('');
        return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4, 6)}`;
      });
    });
  };

  const timeSample1 = await getTimes();
  await new Promise(r => setTimeout(r, 1600));
  const timeSample2 = await getTimes();

  console.log('Countdown Sample 1:', timeSample1);
  console.log('Countdown Sample 2:', timeSample2);
  const timersRunning = timeSample1.every((t, i) => t && timeSample2[i] && t !== timeSample2[i]);
  console.log('Are all 4 countdowns actively decrementing?', timersRunning);

  // 4. Test Selecting Each Object Image to Open 3D Viewer & Verify Asset Match
  const testObjects = [
    { idx: 0, name: 'Antique Book', file: 'verified-3d-book.png' },
    { idx: 1, name: 'Vintage Watch', file: 'verified-3d-watch.png' },
    { idx: 2, name: 'Historic Painting', file: 'verified-3d-painting.png' },
    { idx: 3, name: 'Roman Coin', file: 'verified-3d-coin.png' },
  ];

  for (const obj of testObjects) {
    console.log(`\nOpening 3D viewer for ${obj.name}...`);
    // Click the image directly
    await page.evaluate((idx) => {
      const articles = document.querySelectorAll('#closing-soon article');
      const img = articles[idx]?.querySelector('img');
      if (img) img.click();
    }, obj.idx);

    await new Promise(r => setTimeout(r, 3500));

    // Check modal status
    const status = await page.evaluate(() => {
      const modal = document.getElementById('interactive-3d-modal');
      const canvas = modal?.querySelector('canvas');
      const title = modal?.querySelector('h2')?.innerText;
      return { modalOpen: !!modal, canvasReady: !!canvas, title };
    });
    console.log(`Modal status for ${obj.name}:`, status);

    // Capture screenshot of 3D viewer
    await page.screenshot({ path: `C:/Users/kbjee/.gemini/antigravity/brain/a1cb3096-bf53-49f1-84e2-572bb49a89f3/${obj.file}` });
    console.log(`Captured ${obj.file}`);

    // If Roman Coin, test rotation to verify thin edge profile
    if (obj.idx === 3) {
      const canvasBox = await page.evaluate(() => {
        const canvas = document.querySelector('#interactive-3d-modal canvas');
        if (!canvas) return null;
        const r = canvas.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      });
      if (canvasBox) {
        await page.mouse.move(canvasBox.x, canvasBox.y);
        await page.mouse.down();
        await page.mouse.move(canvasBox.x + 90, canvasBox.y - 20, { steps: 8 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 800));
        await page.screenshot({ path: 'C:/Users/kbjee/.gemini/antigravity/brain/a1cb3096-bf53-49f1-84e2-572bb49a89f3/verified-3d-coin-rotated.png' });
        console.log('Captured verified-3d-coin-rotated.png');
      }
    }

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('#interactive-3d-modal button[aria-label*="Close"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
  }

  // 5. Test Mobile Viewport (390px)
  console.log('\nTesting mobile layout at 390px...');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const cs = document.getElementById('closing-soon');
    if (cs) cs.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const mobileCheck = await page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    return { docW, winW, hasHorizontalOverflow: docW > winW };
  });
  console.log('Mobile overflow check:', mobileCheck);
  await page.screenshot({ path: 'C:/Users/kbjee/.gemini/antigravity/brain/a1cb3096-bf53-49f1-84e2-572bb49a89f3/closing-soon-mobile-390.png' });
  console.log('Captured closing-soon-mobile-390.png');

  console.log('\nRefinement verification complete. Errors:', errors);
  await browser.close();
})();
