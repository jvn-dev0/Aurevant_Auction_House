import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const consoleMsgs = [];
  page.on('console', msg => consoleMsgs.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => consoleMsgs.push(`PAGEERROR: ${err.message}`));

  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait 2 seconds for GSAP and 3D
  await new Promise(r => setTimeout(r, 2000));

  console.log('--- Console Messages ---');
  console.log(consoleMsgs.join('\n') || 'None');

  // Inspect elements
  const layout = await page.evaluate(() => {
    const hero = document.querySelector('section');
    const heroRect = hero ? hero.getBoundingClientRect() : null;
    const collections = document.querySelector('section[aria-label="Collections"]');
    const collectionsRect = collections ? collections.getBoundingClientRect() : null;
    const pinSpacer = document.querySelector('.pin-spacer');
    const pinSpacerRect = pinSpacer ? pinSpacer.getBoundingClientRect() : null;
    const allSections = Array.from(document.querySelectorAll('section, main > *')).map(el => ({
      tag: el.tagName,
      className: el.className,
      id: el.id,
      rect: {
        top: el.getBoundingClientRect().top + window.scrollY,
        bottom: el.getBoundingClientRect().bottom + window.scrollY,
        height: el.getBoundingClientRect().height,
        width: el.getBoundingClientRect().width,
      }
    }));

    return {
      windowHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      scrollY: window.scrollY,
      heroRect,
      collectionsRect,
      pinSpacerRect,
      allSections
    };
  });

  console.log('--- Layout Inspection ---');
  console.log(JSON.stringify(layout, null, 2));

  // Take initial screenshot
  await page.screenshot({ path: 'tests/diag-initial.png' });

  // Scroll to 500px
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'tests/diag-scroll-500.png' });

  // Scroll to 900px
  await page.evaluate(() => window.scrollTo(0, 900));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'tests/diag-scroll-900.png' });

  // Scroll to 1400px
  await page.evaluate(() => window.scrollTo(0, 1400));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'tests/diag-scroll-1400.png' });

  await browser.close();
  console.log('Diagnostics complete!');
}

main().catch(console.error);
