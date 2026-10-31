#!/usr/bin/env node
/**
 * Master Automated E2E Test Runner for AUREVANT AUCTION HOUSE
 * Executes Tiers 1 through 4 + Governance & SHA-256 Asset Integrity.
 * 
 * Usage:
 *   node aurevant-production/tests/e2e-runner.mjs
 *   node aurevant-production/tests/e2e-runner.mjs --tier1
 *   node aurevant-production/tests/e2e-runner.mjs --tier2
 *   node aurevant-production/tests/e2e-runner.mjs --tier3
 *   node aurevant-production/tests/e2e-runner.mjs --tier4
 *   node aurevant-production/tests/e2e-runner.mjs --integrity
 *   node aurevant-production/tests/e2e-runner.mjs --url http://localhost:3001
 */

import { runTier1Tests } from './tier1-features.test.mjs';
import { runTier2Tests } from './tier2-boundaries.test.mjs';
import { runTier3Tests } from './tier3-interactions.test.mjs';
import { runTier4Tests } from './tier4-scenarios.test.mjs';
import { runIntegrityTests } from './integrity-sha256.test.mjs';
import { isServerOnline, TEST_BASE_URL } from './test-utils.mjs';

async function main() {
  const args = process.argv.slice(2);
  let runAll = true;
  let runT1 = false;
  let runT2 = false;
  let runT3 = false;
  let runT4 = false;
  let runG = false;

  if (args.includes('--tier1')) { runT1 = true; runAll = false; }
  if (args.includes('--tier2')) { runT2 = true; runAll = false; }
  if (args.includes('--tier3')) { runT3 = true; runAll = false; }
  if (args.includes('--tier4')) { runT4 = true; runAll = false; }
  if (args.includes('--integrity')) { runG = true; runAll = false; }
  if (runAll) {
    runT1 = runT2 = runT3 = runT4 = runG = true;
  }

  const startTime = Date.now();
  console.log('\n\x1b[1;33m' + '═'.repeat(70) + '\x1b[0m');
  console.log('\x1b[1;37m   AUREVANT AUCTION HOUSE — COMPREHENSIVE E2E VERIFICATION SUITE\x1b[0m');
  console.log('\x1b[1;33m' + '═'.repeat(70) + '\x1b[0m');

  const serverUp = await isServerOnline();
  console.log(`\n\x1b[1mTarget Environment:\x1b[0m ${TEST_BASE_URL}`);
  console.log(`\x1b[1mServer Status:\x1b[0m      ${serverUp ? '\x1b[32m● ONLINE (Live HTTP Network Probing)\x1b[0m' : '\x1b[33m○ OFFLINE (Progressive Contract Baseline Verification)\x1b[0m'}`);
  console.log(`\x1b[1mTimestamp:\x1b[0m          ${new Date().toISOString()}`);

  const summary = [];

  // Execute Tier 1
  if (runT1) {
    const t0 = Date.now();
    const res = await runTier1Tests();
    summary.push({ name: res.tier, passed: res.passed, failed: res.failed, duration: Date.now() - t0 });
  }

  // Execute Tier 2
  if (runT2) {
    const t0 = Date.now();
    const res = await runTier2Tests();
    summary.push({ name: res.tier, passed: res.passed, failed: res.failed, duration: Date.now() - t0 });
  }

  // Execute Tier 3
  if (runT3) {
    const t0 = Date.now();
    const res = await runTier3Tests();
    summary.push({ name: res.tier, passed: res.passed, failed: res.failed, duration: Date.now() - t0 });
  }

  // Execute Tier 4
  if (runT4) {
    const t0 = Date.now();
    const res = await runTier4Tests();
    summary.push({ name: res.tier, passed: res.passed, failed: res.failed, duration: Date.now() - t0 });
  }

  // Execute Integrity Suite
  if (runG) {
    const t0 = Date.now();
    const res = await runIntegrityTests();
    summary.push({ name: res.tier, passed: res.passed, failed: res.failed, duration: Date.now() - t0 });
  }

  const totalDuration = Date.now() - startTime;
  let totalPassed = 0;
  let totalFailed = 0;

  console.log('\n\x1b[1;33m' + '─'.repeat(70) + '\x1b[0m');
  console.log('\x1b[1;37m   TEST SUITE EXECUTION SUMMARY\x1b[0m');
  console.log('\x1b[1;33m' + '─'.repeat(70) + '\x1b[0m');
  console.log(
    '  ' +
    'Suite / Tier'.padEnd(42) +
    'Passed'.padEnd(10) +
    'Failed'.padEnd(10) +
    'Time (ms)'
  );
  console.log('  ' + '─'.repeat(66));

  for (const s of summary) {
    totalPassed += s.passed;
    totalFailed += s.failed;
    const statusColor = s.failed === 0 ? '\x1b[32m' : '\x1b[31m';
    console.log(
      '  ' +
      s.name.padEnd(42) +
      `${statusColor}${s.passed}\x1b[0m`.padEnd(19) +
      (s.failed > 0 ? `\x1b[31m${s.failed}\x1b[0m` : '0').padEnd(19) +
      `${s.duration}ms`
    );
  }

  console.log('  ' + '─'.repeat(66));
  console.log(
    '  ' +
    '\x1b[1mTOTAL\x1b[0m'.padEnd(49) +
    `\x1b[1;32m${totalPassed}\x1b[0m`.padEnd(19) +
    (totalFailed > 0 ? `\x1b[1;31m${totalFailed}\x1b[0m` : '0').padEnd(19) +
    `${totalDuration}ms`
  );
  console.log('\x1b[1;33m' + '═'.repeat(70) + '\x1b[0m');

  if (totalFailed === 0) {
    console.log(`\n\x1b[1;32m✓ ALL ${totalPassed} E2E TESTS PASSED SUCCESSFULLY.\x1b[0m\n`);
    process.exit(0);
  } else {
    console.log(`\n\x1b[1;31m✗ ${totalFailed} TEST(S) FAILED.\x1b[0m\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\x1b[31mFatal test runner error:\x1b[0m', err);
  process.exit(1);
});
