import http from 'node:http';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INTERNAL_PORT = 3004;
const PUBLIC_PORTS = [3002, 3001];

console.log('[AUREVANT] Starting Next.js production backend on internal port', INTERNAL_PORT, '...');

// 1. Launch Next.js start on internal port
const nextProc = spawn('node', [
  path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next'),
  'start',
  __dirname,
  '-p',
  String(INTERNAL_PORT),
  '-H',
  '127.0.0.1'
], {
  stdio: 'inherit',
  cwd: __dirname,
  env: { ...process.env, NODE_ENV: 'production' }
});

nextProc.on('error', (err) => {
  console.error('[AUREVANT] Next.js process failed to start:', err);
});

// 2. Poll until internal server is responsive
async function waitForInternalServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${INTERNAL_PORT}`);
      if (res.status === 200 || res.status === 304 || res.status === 404) {
        return true;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

const isReady = await waitForInternalServer();
if (!isReady) {
  console.error('[AUREVANT] Internal server failed to become ready in time.');
} else {
  console.log('[AUREVANT] Next.js internal server is active and ready.');
}

// 3. Create dual-stack proxy servers
function createProxy(port) {
  const server = http.createServer((req, res) => {
    const headers = { ...req.headers, host: `localhost:${port}` };
    const proxyReq = http.request({
      hostname: '127.0.0.1',
      port: INTERNAL_PORT,
      path: req.url,
      method: req.method,
      headers
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('AUREVANT Proxy Gateway Error: ' + err.message);
      }
    });

    req.pipe(proxyReq, { end: true });
  });

  server.listen(port, '::', () => {
    console.log(`[AUREVANT] Live Saleroom operational on dual-stack (IPv4 + IPv6):`);
    console.log(`  -> http://localhost:${port}`);
    console.log(`  -> http://127.0.0.1:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[AUREVANT] Port ${port} is occupied, skipping proxy binding for this port.`);
    } else {
      console.error(`[AUREVANT] Proxy error on port ${port}:`, err);
    }
  });

  return server;
}

const activeServers = [];
for (const port of PUBLIC_PORTS) {
  try {
    const s = createProxy(port);
    activeServers.push(s);
  } catch (err) {
    console.warn(`[AUREVANT] Failed to initialize proxy on port ${port}:`, err.message);
  }
}

// 4. Clean exit
function cleanup() {
  console.log('[AUREVANT] Shutting down servers...');
  for (const s of activeServers) {
    try { s.close(); } catch {}
  }
  try { nextProc.kill(); } catch {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
