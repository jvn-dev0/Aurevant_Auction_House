import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--window-size=1600,1000', '--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3001');
  await new Promise(r => setTimeout(r, 2000));

  const dialogsBefore = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="dialog"]')).map(el => ({
      tagName: el.tagName,
      className: el.className,
      outerHTML: el.outerHTML.slice(0, 150)
    }));
  });
  console.log('Dialogs BEFORE clicking:', dialogsBefore);

  // Now click Inspect 3D on slot 12
  const clicked = await page.evaluate(() => {
    const cs = document.getElementById('closing-soon');
    if (!cs) return false;
    const btn = Array.from(cs.querySelectorAll('button')).find(b => b.innerText.includes('Inspect 3D'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Button clicked:', clicked);

  await new Promise(r => setTimeout(r, 1000));

  const dialogsAfter = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="dialog"]')).map(el => ({
      tagName: el.tagName,
      className: el.className,
      outerHTML: el.outerHTML.slice(0, 150)
    }));
  });
  console.log('Dialogs AFTER clicking:', dialogsAfter);

  await browser.close();
})();
