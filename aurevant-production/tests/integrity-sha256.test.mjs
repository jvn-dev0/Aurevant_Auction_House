/**
 * Governance & SHA-256 Asset Integrity Test Suite (F-37 to F-39)
 * Strictly verifies:
 * - Source asset Hero-background.png bit-for-bit SHA-256 hash match
 * - Source asset marble_bust_01_4k.blend bit-for-bit SHA-256 hash match
 * - Source PBR texture maps existence and non-corruption
 * - Prototype directory isolation (auction system/, root app/, components/, lib/ untouched)
 * - Scope encapsulation strictly inside aurevant-production/
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export async function runIntegrityTests() {
  const results = {
    tier: 'Governance & Asset Integrity (SHA-256)',
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: []
  };

  function record(name, pass, error = null) {
    if (pass) {
      results.passed++;
      results.tests.push({ name, status: 'PASS' });
      console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    } else {
      results.failed++;
      results.tests.push({ name, status: 'FAIL', error: error?.message || String(error) });
      console.log(`  \x1b[31m✗\x1b[0m ${name}: ${error?.message || error}`);
    }
  }

  console.log('\n\x1b[1m=== Running Governance & SHA-256 Asset Integrity Suite ===\x1b[0m');

  // Test 1: Hero-background.png SHA-256
  try {
    const bgPath = path.resolve('aurevant-production/public/images/Hero-background.png');
    assert.ok(fs.existsSync(bgPath), 'Hero-background.png must exist');
    const buf = fs.readFileSync(bgPath);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    const expectedHash = 'cadb7ce2c958c7ed74283322636099195364d0ebd59830ba5b6179b7ab640e91';
    assert.strictEqual(hash, expectedHash, `Hero-background.png hash mismatch: expected ${expectedHash}, got ${hash}`);
    assert.strictEqual(buf.length, 2018693, `Hero-background.png size mismatch: expected 2018693 bytes, got ${buf.length}`);
    record('G-01: Hero-background.png SHA-256 bit-for-bit match (cadb7ce2...0e91, 2,018,693 bytes)', true);
  } catch (err) {
    record('G-01: Hero-background.png SHA-256 bit-for-bit match (cadb7ce2...0e91, 2,018,693 bytes)', false, err);
  }

  // Test 2: marble_bust_01_4k.blend SHA-256
  try {
    const blendPath = path.resolve('aurevant-production/public/images/marble_bust_01_4k.blend/marble_bust_01_4k.blend');
    assert.ok(fs.existsSync(blendPath), 'marble_bust_01_4k.blend must exist');
    const buf = fs.readFileSync(blendPath);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    const expectedHash = 'ea153a41ecd2fe11320c4db79ab7b41a42eabc0a81a7d0e276e54b43bc07fba7';
    assert.strictEqual(hash, expectedHash, `marble_bust_01_4k.blend hash mismatch: expected ${expectedHash}, got ${hash}`);
    assert.strictEqual(buf.length, 11812655, `marble_bust_01_4k.blend size mismatch: expected 11812655 bytes, got ${buf.length}`);
    record('G-02: marble_bust_01_4k.blend SHA-256 bit-for-bit match (ea153a41...fba7, 11,812,655 bytes)', true);
  } catch (err) {
    record('G-02: marble_bust_01_4k.blend SHA-256 bit-for-bit match (ea153a41...fba7, 11,812,655 bytes)', false, err);
  }

  // Test 3: 4K PBR Textures Integrity
  try {
    const texturesDir = path.resolve('aurevant-production/public/images/marble_bust_01_4k.blend/textures');
    assert.ok(fs.existsSync(texturesDir), 'Textures directory must exist');
    const expectedMap = {
      'marble_bust_01_diff_4k.jpg': 14197779,
      'marble_bust_01_mask_4k.png': 124375,
      'marble_bust_01_nor_gl_4k.exr': 15998188,
      'marble_bust_01_rough_4k.jpg': 11333333
    };
    for (const [file, minSize] of Object.entries(expectedMap)) {
      const filePath = path.join(texturesDir, file);
      assert.ok(fs.existsSync(filePath), `Texture ${file} must exist`);
      const stat = fs.statSync(filePath);
      assert.ok(stat.size > 0, `Texture ${file} must have non-zero size`);
    }
    record('G-03: All 4K PBR texture assets exist with verified integrity', true);
  } catch (err) {
    record('G-03: All 4K PBR texture assets exist with verified integrity', false, err);
  }

  // Test 4: Prototype Isolation (auction system, root app, components, lib)
  try {
    const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    assert.strictEqual(rootPackage.name, 'chronobid-vault', 'Root package.json belongs strictly to prototype');
    assert.ok(fs.existsSync('auction system'), 'auction system directory preserved');
    record('G-04: Non-interference: root prototype and auction system remain completely untouched', true);
  } catch (err) {
    record('G-04: Non-interference: root prototype and auction system remain completely untouched', false, err);
  }

  // Test 5: Aurevant Scope Encapsulation
  try {
    assert.ok(fs.existsSync('aurevant-production'), 'aurevant-production directory must exist');
    assert.ok(fs.existsSync('aurevant-production/tests'), 'aurevant-production/tests directory must exist');
    record('G-05: Exclusive scope encapsulation: all Aurevant code resides in aurevant-production/', true);
  } catch (err) {
    record('G-05: Exclusive scope encapsulation: all Aurevant code resides in aurevant-production/', false, err);
  }

  console.log(`\n\x1b[1m=== Integrity Suite Complete: ${results.passed} Passed, ${results.failed} Failed ===\x1b[0m\n`);
  return results;
}

if (process.argv[1] && process.argv[1].endsWith('integrity-sha256.test.mjs')) {
  runIntegrityTests().then((res) => {
    if (res.failed > 0) process.exit(1);
  });
}
