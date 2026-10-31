import { spawn } from 'node:child_process';
import http from 'node:http';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const debuggingPort = 9333;
const userDataDir = 'C:\\Users\\kbjee\\AppData\\Local\\Temp\\edge_debug_profile';

console.log('Launching Edge with remote debugging...');
const proc = spawn(edgePath, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${debuggingPort}`,
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

// Wait for CDP to be ready
async function getWsUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${debuggingPort}/json/version`);
      const data = await res.json();
      return data.webSocketDebuggerUrl;
    } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error('CDP not ready');
}

const wsUrl = await getWsUrl();
console.log('CDP ready, connecting to:', wsUrl);

// Use built-in WebSocket (available in Node v22+)
const ws = new WebSocket(wsUrl);

ws.onopen = async () => {
  console.log('WebSocket connected. Creating new target for http://127.0.0.1:3002 ...');
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  // Create page target
  const target = await send('Target.createTarget', { url: 'http://127.0.0.1:3002' });
  console.log('Created target:', target.targetId);

  // Connect to target session
  const session = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
  const sessionId = session.sessionId;

  function sendSession(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  // Listen to console and page events
  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER CONSOLE]', msg.params.type, ...msg.params.args.map(a => a.value || a.description));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
    }
    if (msg.method === 'Network.responseReceived') {
      console.log('[BROWSER NETWORK]', msg.params.response.status, msg.params.response.url);
    }
  });

  await sendSession('Runtime.enable');
  await sendSession('Network.enable');
  await sendSession('Page.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Waiting 3 seconds for page rendering...');
  await new Promise(r => setTimeout(r, 3000));

  const doc = await sendSession('Runtime.evaluate', {
    expression: 'document.documentElement.outerHTML.length'
  });
  console.log('Rendered Document length:', doc.result.value);

  const title = await sendSession('Runtime.evaluate', {
    expression: 'document.title'
  });
  console.log('Document Title:', title.result.value);

  const bodyBg = await sendSession('Runtime.evaluate', {
    expression: 'window.getComputedStyle(document.body).backgroundColor'
  });
  console.log('Body background color:', bodyBg.result.value);

  const canvasExists = await sendSession('Runtime.evaluate', {
    expression: '!!document.querySelector("canvas")'
  });
  console.log('Canvas element in DOM:', canvasExists.result.value);

  const heroBgExists = await sendSession('Runtime.evaluate', {
    expression: '!!document.querySelector("img[src*=\'Hero-background\']")'
  });
  console.log('Hero background img in DOM:', heroBgExists.result.value);

  // Capture actual rendered screenshot
  const screenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  const fs = await import('node:fs');
  fs.writeFileSync('c:\\Users\\kbjee\\OneDrive\\Desktop\\omniroute\\.agents\\teamwork\\teamwork_test_writer_e2e_1\\actual-render.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved actual screenshot to actual-render.png, bytes:', Buffer.from(screenshot.data, 'base64').length);

  proc.kill();
  process.exit(0);
};
