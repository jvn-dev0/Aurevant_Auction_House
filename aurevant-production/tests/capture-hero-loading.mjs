import puppeteer from 'puppeteer-core';

async function captureHeroLoading() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const toBox = el => el ? {
      width: Math.round(el.getBoundingClientRect().width),
      height: Math.round(el.getBoundingClientRect().height),
      top: Math.round(el.getBoundingClientRect().top),
      left: Math.round(el.getBoundingClientRect().left),
    } : null;

    const img = document.querySelector('.sculpture-fallback img');
    const canvas = document.querySelector('#sculpture-canvas');
    const container = document.querySelector('.sculpture-container');
    const fallbackDiv = document.querySelector('.sculpture-container > div:first-child');
    const canvasDiv = document.querySelector('.sculpture-container > div:nth-child(2)');

    return {
      container: toBox(container),
      img: toBox(img),
      canvas: toBox(canvas),
      fallbackDiv: toBox(fallbackDiv),
      fallbackOpacity: fallbackDiv ? window.getComputedStyle(fallbackDiv).opacity : null,
      canvasOpacity: canvasDiv ? window.getComputedStyle(canvasDiv).opacity : null,
    };
  });

  console.log('Hero Sculpture Layout:', JSON.stringify(data, null, 2));

  // Take screenshot of Hero right now
  await page.screenshot({ path: 'tests/hero-current.png' });

  await browser.close();
}

captureHeroLoading().catch(console.error);
