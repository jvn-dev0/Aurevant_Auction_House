const http = require('http');

const routes = [
  '/',
  '/auctions/live',
  '/auctions/upcoming',
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/reset-password',
  '/transparency',
  '/consign',
  '/account/settings',
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      res.on('error', reject);
    });
  });
}

async function run() {
  console.log('===============================================================');
  console.log('CHRONOBID VAULT CSS & FONT ASSET VERIFICATION');
  console.log('===============================================================');

  let allPassed = true;

  for (const route of routes) {
    const pageUrl = `http://localhost:3000${route}`;
    const page = await fetch(pageUrl);

    if (page.status !== 200) {
      console.log(`[FAIL] Route ${route} returned HTTP ${page.status}`);
      allPassed = false;
      continue;
    }

    // Extract all <link rel="stylesheet"> hrefs
    const cssMatches = [...page.body.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)];
    if (cssMatches.length === 0) {
      console.log(`[FAIL] Route ${route} has no stylesheet link in rendered HTML!`);
      allPassed = false;
      continue;
    }

    for (const match of cssMatches) {
      const cssHref = match[1];
      const cssAsset = await fetch(`http://localhost:3000${cssHref}`);

      const is200 = cssAsset.status === 200;
      const isCssMime = (cssAsset.headers['content-type'] || '').includes('text/css');
      const hasTailwindTokens =
        cssAsset.body.includes('bg-paper') &&
        cssAsset.body.includes('text-forest') &&
        (cssAsset.body.includes('selection:bg-lime') || cssAsset.body.includes('selection\\:bg-lime'));
      const hasFontDefinitions =
        cssAsset.body.includes('Instrument_Serif') ||
        cssAsset.body.includes('Manrope') ||
        cssAsset.body.includes('IBM_Plex_Mono');

      const pass = is200 && isCssMime && hasTailwindTokens && hasFontDefinitions;

      if (!pass) {
        allPassed = false;
        console.log(`[FAIL] ${route} -> ${cssHref}`);
        console.log(`       Status: ${cssAsset.status}, MIME: ${cssAsset.headers['content-type']}, Size: ${cssAsset.body.length}B`);
        console.log(`       Tailwind Tokens: ${hasTailwindTokens}, Fonts: ${hasFontDefinitions}`);
      } else {
        console.log(`[PASS] ${route} -> ${cssHref} (HTTP ${cssAsset.status}, ${cssAsset.body.length}B, MIME: ${cssAsset.headers['content-type']}, Tokens: OK, Fonts: OK)`);
      }
    }
  }

  // Also verify JavaScript runtime chunks
  const home = await fetch('http://localhost:3000/');
  const jsMatches = [...home.body.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js(?:\?[^"]*)?)"/g)];
  console.log(`\nVerifying ${jsMatches.length} JavaScript runtime chunks on homepage...`);
  for (const m of jsMatches) {
    const jsHref = m[1];
    const jsAsset = await fetch(`http://localhost:3000${jsHref}`);
    const jsPass = jsAsset.status === 200 && (jsAsset.headers['content-type'] || '').includes('javascript');
    if (!jsPass) {
      allPassed = false;
      console.log(`[FAIL] JS Chunk ${jsHref}: Status ${jsAsset.status}, MIME: ${jsAsset.headers['content-type']}`);
    } else {
      console.log(`[PASS] JS Chunk ${jsHref}: HTTP 200, ${jsAsset.body.length}B`);
    }
  }

  console.log('===============================================================');
  console.log(`OVERALL ASSET VERIFICATION: ${allPassed ? 'ALL PASSED' : 'FAILURES DETECTED'}`);
  console.log('===============================================================');

  process.exit(allPassed ? 0 : 1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
