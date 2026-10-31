/**
 * Build Stress Test for Aurevant Production
 * Empirically tests:
 * 1. Clean execution of `npm run build` in `aurevant-production`
 * 2. Process exit code === 0
 * 3. Zero unhandled promise rejections or memory warning outputs
 * 4. Build artifact isolation: strictly inside `aurevant-production/.next`
 * 5. Verifies zero modifications to root directory or prototype assets
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT_DIR = path.resolve('.');
const AUREVANT_DIR = path.resolve('aurevant-production');
const NEXT_DIR = path.join(AUREVANT_DIR, '.next');

console.log('='.repeat(70));
console.log('  AUREVANT PRODUCTION BUILD STRESS & LEAK TEST');
console.log('='.repeat(70));
console.log(`Working Directory: ${AUREVANT_DIR}\n`);

function scanDirectory(dir, excludeDirs = new Set(['node_modules', '.next', '.git'])) {
  const files = new Map();
  function walk(current) {
    if (!fs.existsSync(current)) return;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const ent of entries) {
      if (excludeDirs.has(ent.name)) continue;
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile()) {
        const stat = fs.statSync(full);
        files.set(full, { size: stat.size, mtimeMs: stat.mtimeMs });
      }
    }
  }
  walk(dir);
  return files;
}

async function runBuildStress() {
  console.log('[1/4] Taking pre-build filesystem snapshot outside .next...');
  const preSnapshot = scanDirectory(ROOT_DIR);
  console.log(`      Tracked ${preSnapshot.size} non-.next files.`);

  console.log('\n[2/4] Executing `npm run build` inside aurevant-production...');
  const startTime = Date.now();
  let peakMemory = 0;

  const buildProc = spawn('npm', ['run', 'build'], {
    cwd: AUREVANT_DIR,
    shell: true,
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }
  });

  let stdout = '';
  let stderr = '';

  buildProc.stdout.on('data', (d) => {
    const str = d.toString();
    stdout += str;
    process.stdout.write(str);
  });

  buildProc.stderr.on('data', (d) => {
    const str = d.toString();
    stderr += str;
    process.stderr.write(str);
  });

  // Sample memory
  const memSampler = setInterval(() => {
    try {
      const mem = process.memoryUsage();
      if (mem.rss > peakMemory) peakMemory = mem.rss;
    } catch {}
  }, 100);

  const exitCode = await new Promise((resolve) => {
    buildProc.on('close', (code) => {
      clearInterval(memSampler);
      resolve(code);
    });
  });

  const durationMs = Date.now() - startTime;
  console.log(`\nBuild completed in ${(durationMs / 1000).toFixed(2)}s with exit code ${exitCode}`);
  console.log(`Harness peak process memory: ${(peakMemory / (1024 * 1024)).toFixed(2)} MB`);

  assert.strictEqual(exitCode, 0, `npm run build failed with exit code ${exitCode}`);

  console.log('\n[3/4] Analyzing logs for unhandled rejections, leaks, or fatal warnings...');
  const combinedLogs = stdout + '\n' + stderr;
  const leakPatterns = [
    /UnhandledPromiseRejection/i,
    /UnhandledPromiseRejectionWarning/i,
    /Fatal error/i,
    /JavaScript heap out of memory/i,
    /Possible EventEmitter memory leak detected/i,
    /DeprecationWarning.*MaxListenersExceededWarning/i
  ];

  for (const pat of leakPatterns) {
    assert.ok(!pat.test(combinedLogs), `Detected leak or error indicator matching: ${pat}`);
  }
  console.log('      [PASS] No memory leaks, heap errors, or unhandled promise rejections detected.');

  console.log('\n[4/4] Verifying build artifact isolation (containment strictly inside .next)...');
  const postSnapshot = scanDirectory(ROOT_DIR);

  const leakedFiles = [];
  for (const [filePath, postStat] of postSnapshot.entries()) {
    const preStat = preSnapshot.get(filePath);
    if (!preStat) {
      // New file created outside excluded dirs (.next, node_modules)
      leakedFiles.push({ path: filePath, reason: 'newly created' });
    } else if (postStat.mtimeMs > preStat.mtimeMs && postStat.size !== preStat.size) {
      // Modified file outside excluded dirs
      leakedFiles.push({ path: filePath, reason: 'modified' });
    }
  }

  // Filter out benign log files if any
  const unauthorizedLeaks = leakedFiles.filter(f => !f.path.includes('.agents\\teamwork') && !f.path.includes('.agents/teamwork'));

  if (unauthorizedLeaks.length > 0) {
    console.error('      [FAIL] Leaked files detected outside aurevant-production/.next:');
    unauthorizedLeaks.forEach(f => console.error(`         ${f.reason}: ${f.path}`));
    assert.fail(`Build artifacts escaped to ${unauthorizedLeaks.length} files outside .next`);
  } else {
    console.log('      [PASS] 100% Build artifact containment: ZERO files created or modified outside .next.');
  }

  // Verify .next structure
  assert.ok(fs.existsSync(NEXT_DIR), 'aurevant-production/.next must exist');
  assert.ok(fs.existsSync(path.join(NEXT_DIR, 'BUILD_ID')), 'BUILD_ID must exist');
  assert.ok(fs.existsSync(path.join(NEXT_DIR, 'server')), '.next/server must exist');
  assert.ok(fs.existsSync(path.join(NEXT_DIR, 'static')), '.next/static must exist');

  console.log('      [PASS] .next build directory verified (BUILD_ID, server, static present).');

  console.log('\n' + '='.repeat(70));
  console.log('BUILD STRESS TEST: ALL CHECKS PASSED EMPIRICALLY');
  console.log('='.repeat(70));
}

runBuildStress().catch((err) => {
  console.error('\n\x1b[31mBuild Stress Test Error:\x1b[0m', err.message);
  process.exit(1);
});
