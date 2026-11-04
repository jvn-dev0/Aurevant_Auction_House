import puppeteer from 'puppeteer-core';

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

  for (const scrollY of [0, 500, 900, 1000, 1200, 1500, 2000]) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await new Promise(r => setTimeout(r, 200));

    const info = await page.evaluate(() => {
      const col = document.querySelector('section[aria-label="Collections"]');
      const spacer = document.querySelector('.pin-spacer');
      const hero = document.querySelector('section:not([aria-label="Collections"])');
      const getBox = el => el ? {
        top: el.getBoundingClientRect().top,
        bottom: el.getBoundingClientRect().bottom,
        height: el.getBoundingClientRect().height,
        position: window.getComputedStyle(el).position,
        visibility: window.getComputedStyle(el).visibility,
        opacity: window.getComputedStyle(el).opacity,
        transform: window.getComputedStyle(el).transform,
      } : null;

      return {
        scrollY: window.scrollY,
        col: getBox(col),
        spacer: getBox(spacer),
      };
    });

    console.log(`scrollY: ${scrollY}`, JSON.stringify(info));
  }

  await browser.close();
}

main().catch(console.error);
