import http from 'node:http';

const res = await fetch('http://localhost:3002');
console.log('Status:', res.status);
console.log('Headers:', Object.fromEntries(res.headers.entries()));
const html = await res.text();
console.log('HTML Length:', html.length);
console.log('First 500 chars:\n', html.slice(0, 500));
console.log('\nLast 500 chars:\n', html.slice(-500));

const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]);
const links = [...html.matchAll(/<link[^>]*href="([^"]+)"/g)].map(m => m[1]);

console.log('\nChecking all referenced assets:');
for (const url of [...scripts, ...links]) {
  try {
    const assetRes = await fetch('http://localhost:3002' + url);
    const buf = await assetRes.arrayBuffer();
    console.log(`  ${url} -> ${assetRes.status} (${buf.byteLength} bytes)`);
  } catch (err) {
    console.error(`  ${url} -> FAILED: ${err.message}`);
  }
}
