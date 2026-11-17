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
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log(`HTTP ${res.status()}: ${res.url()}`);
    }
  });

  await page.goto('http://localhost:3001');
  await new Promise(r => setTimeout(r, 2000));

  // Check WebGL support in headless page
  const webglSupport = await page.evaluate(() => {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    return {
      hasGL: !!gl,
      renderer: gl ? gl.getParameter(gl.RENDERER) : null,
      vendor: gl ? gl.getParameter(gl.VENDOR) : null,
    };
  });
  console.log('Headless WebGL support:', webglSupport);

  // Click slot 0 Inspect 3D
  await page.evaluate(() => {
    const btn = document.querySelector('#closing-soon article button');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 3000));

  const modalInfo = await page.evaluate(() => {
    const modal = document.getElementById('interactive-3d-modal');
    if (!modal) return { open: false };
    const err = modal.querySelector('.text-red-400, .text-amber-400, p')?.textContent;
    return {
      open: true,
      text: modal.innerText.slice(0, 300)
    };
  });
  console.log('Modal info:', modalInfo);

  await browser.close();
})();
