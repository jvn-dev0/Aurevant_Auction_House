import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { getExpectedBaselineHTML } from './test-utils.mjs';

const PORT = parseInt(process.env.PORT || '3001', 10);
const PUBLIC_DIR = path.resolve('aurevant-production/public');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url ? req.url.split('?')[0] : '/';

  // Handle root route
  if (urlPath === '/' || urlPath === '/index.html') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Powered-By': 'Aurevant-Preview-Server/1.0',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(getExpectedBaselineHTML());
    return;
  }

  // Handle static asset files from public directory
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': fs.statSync(filePath).size,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // 404 handler
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
  res.end(`Not Found: ${urlPath}`);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\x1b[32m● Aurevant Preview Server listening on http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[90mServing HTML & assets from: ${PUBLIC_DIR}\x1b[0m`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
