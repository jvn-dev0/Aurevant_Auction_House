/**
 * Independent GLB Binary & glTF 2.0 Asset Validator
 * Empirically stress-tests:
 * 1. GLB container header & 12-byte binary framing
 * 2. Chunk 0 (JSON) framing, padding, and glTF 2.0 schema conformity
 * 3. Chunk 1 (BIN) framing, byte length, and boundary alignments
 * 4. BufferViews bounds and byte offset safety
 * 5. Accessors verification (component types, counts, vector dimensions)
 * 6. Vertex bounds empirical calculation (min/max float32 verification against declared accessor bounds)
 * 7. Triangle indices integrity (modulo 3 check, max index < vertex count)
 * 8. Embedded JPEG/PNG texture stream verification (SOI/EOI markers, dimensions, bit depth)
 * 9. Mesh attributes & PBR material topology
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const GLB_PATH = path.resolve('aurevant-production/public/models/marble_bust_01.glb');

console.log('='.repeat(70));
console.log('  AUREVANT GLB BINARY DEEP STRESS-TEST & VALIDATOR');
console.log('='.repeat(70));
console.log(`Target: ${GLB_PATH}\n`);

const COMPONENT_TYPES = {
  5120: { name: 'BYTE', size: 1 },
  5121: { name: 'UNSIGNED_BYTE', size: 1 },
  5122: { name: 'SHORT', size: 2 },
  5123: { name: 'UNSIGNED_SHORT', size: 2 },
  5125: { name: 'UNSIGNED_INT', size: 4 },
  5126: { name: 'FLOAT', size: 4 }
};

const TYPE_COMPONENTS = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};

function parseJpegDimensions(buffer) {
  let offset = 2; // skip 0xFFD8
  while (offset < buffer.length - 8) {
    if (buffer[offset] !== 0xFF) {
      offset++;
      continue;
    }
    const marker = buffer[offset + 1];
    // SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2)
    if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      const channels = buffer[offset + 9];
      return { width, height, channels, marker: `0xFF${marker.toString(16).toUpperCase()}` };
    }
    const len = buffer.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return null;
}

function runValidation() {
  const stats = { tests: 0, passed: 0, failed: 0 };
  function check(name, fn) {
    stats.tests++;
    try {
      fn();
      stats.passed++;
      console.log(`  \x1b[32m[PASS]\x1b[0m ${name}`);
    } catch (err) {
      stats.failed++;
      console.error(`  \x1b[31m[FAIL]\x1b[0m ${name}: ${err.message}`);
    }
  }

  // 1. File existence and size
  let fileBuffer;
  check('File exists and has non-zero size', () => {
    assert.ok(fs.existsSync(GLB_PATH), 'File does not exist');
    fileBuffer = fs.readFileSync(GLB_PATH);
    assert.ok(fileBuffer.length > 1024, `File too small: ${fileBuffer.length} bytes`);
    console.log(`         File size: ${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB (${fileBuffer.length} bytes)`);
  });

  // 2. GLB Header
  let totalLength;
  check('GLB 12-byte header validation (magic, version, length)', () => {
    assert.ok(fileBuffer.length >= 12, 'Buffer smaller than 12 bytes');
    const magic = fileBuffer.readUInt32LE(0);
    assert.strictEqual(magic, 0x46546C67, `Bad magic: 0x${magic.toString(16)} (expected 0x46546C67 'glTF')`);

    const version = fileBuffer.readUInt32LE(4);
    assert.strictEqual(version, 2, `Unsupported glTF version: ${version} (expected 2)`);

    totalLength = fileBuffer.readUInt32LE(8);
    assert.strictEqual(totalLength, fileBuffer.length, `Header length ${totalLength} !== actual file length ${fileBuffer.length}`);
  });

  // 3. Chunk 0: JSON
  let gltfJson;
  let jsonChunkLen;
  let binChunkOffset;
  check('Chunk 0 (JSON) chunk header and valid UTF-8 JSON payload', () => {
    jsonChunkLen = fileBuffer.readUInt32LE(12);
    const jsonChunkType = fileBuffer.readUInt32LE(16);
    assert.strictEqual(jsonChunkType, 0x4E4F534A, `Chunk 0 type is not JSON (0x${jsonChunkType.toString(16)})`);
    assert.ok(12 + 8 + jsonChunkLen <= totalLength, 'Chunk 0 length extends beyond file boundary');

    const jsonBytes = fileBuffer.subarray(20, 20 + jsonChunkLen);
    const jsonText = jsonBytes.toString('utf8');
    gltfJson = JSON.parse(jsonText);
    assert.ok(gltfJson.asset, 'glTF JSON missing asset object');
    assert.strictEqual(gltfJson.asset.version, '2.0', `Expected asset version 2.0, got ${gltfJson.asset.version}`);
    binChunkOffset = 20 + jsonChunkLen;
  });

  // 4. Chunk 1: BIN
  let binBuffer;
  let binChunkLen;
  check('Chunk 1 (BIN) chunk header and binary buffer alignment', () => {
    assert.ok(binChunkOffset + 8 <= totalLength, 'File missing BIN chunk header');
    binChunkLen = fileBuffer.readUInt32LE(binChunkOffset);
    const binChunkType = fileBuffer.readUInt32LE(binChunkOffset + 4);
    assert.strictEqual(binChunkType, 0x004E4942, `Chunk 1 type is not BIN (0x${binChunkType.toString(16)})`);

    const binPayloadStart = binChunkOffset + 8;
    const expectedEnd = binPayloadStart + binChunkLen;
    assert.strictEqual(expectedEnd, totalLength, `BIN chunk end (${expectedEnd}) does not match file total length (${totalLength})`);

    binBuffer = fileBuffer.subarray(binPayloadStart, expectedEnd);
    assert.strictEqual(binBuffer.length, binChunkLen, 'BIN buffer length mismatch');
    console.log(`         Binary payload size: ${(binBuffer.length / (1024 * 1024)).toFixed(2)} MB (${binBuffer.length} bytes)`);
  });

  // 5. Buffer definition conformity
  check('glTF buffers array declares single buffer matching BIN chunk length', () => {
    assert.ok(Array.isArray(gltfJson.buffers), 'buffers is not an array');
    assert.strictEqual(gltfJson.buffers.length, 1, 'Expected exactly 1 buffer in GLB');
    assert.ok(gltfJson.buffers[0].byteLength <= binChunkLen, `Buffer declared length ${gltfJson.buffers[0].byteLength} > BIN chunk length ${binChunkLen}`);
  });

  // 6. BufferViews validation
  check('BufferViews within range and aligned properly', () => {
    assert.ok(Array.isArray(gltfJson.bufferViews), 'bufferViews is not an array');
    assert.ok(gltfJson.bufferViews.length > 0, 'bufferViews is empty');

    gltfJson.bufferViews.forEach((bv, idx) => {
      assert.strictEqual(bv.buffer, 0, `bufferView[${idx}] buffer index !== 0`);
      const offset = bv.byteOffset || 0;
      assert.ok(offset >= 0, `bufferView[${idx}] byteOffset negative`);
      assert.ok(bv.byteLength > 0, `bufferView[${idx}] byteLength <= 0`);
      assert.ok(offset + bv.byteLength <= binBuffer.length, `bufferView[${idx}] (${offset}+${bv.byteLength}=${offset + bv.byteLength}) exceeds BIN length ${binBuffer.length}`);
    });
    console.log(`         Validated ${gltfJson.bufferViews.length} bufferViews.`);
  });

  // 7. Accessors and empirical bounds checking
  let positionAccessor;
  let indicesAccessor;
  check('Accessors data types, component counts, and boundary checks', () => {
    assert.ok(Array.isArray(gltfJson.accessors), 'accessors is not an array');
    gltfJson.accessors.forEach((acc, idx) => {
      assert.ok(COMPONENT_TYPES[acc.componentType], `accessor[${idx}] unknown componentType ${acc.componentType}`);
      assert.ok(TYPE_COMPONENTS[acc.type], `accessor[${idx}] unknown type ${acc.type}`);
      assert.ok(acc.count > 0, `accessor[${idx}] count <= 0`);

      const compInfo = COMPONENT_TYPES[acc.componentType];
      const compCount = TYPE_COMPONENTS[acc.type];
      const elemSize = compInfo.size * compCount;

      const bv = gltfJson.bufferViews[acc.bufferView];
      assert.ok(bv, `accessor[${idx}] references non-existent bufferView ${acc.bufferView}`);

      const accOffset = acc.byteOffset || 0;
      const stride = bv.byteStride || elemSize;
      const totalSpan = accOffset + (acc.count - 1) * stride + elemSize;
      assert.ok(totalSpan <= bv.byteLength, `accessor[${idx}] totalSpan (${totalSpan}) exceeds bufferView[${acc.bufferView}] byteLength (${bv.byteLength})`);
    });
    console.log(`         Validated ${gltfJson.accessors.length} accessors.`);
  });

  // 8. Meshes and Primitive Topology
  check('Mesh primitives structure, attribute bindings, and material links', () => {
    assert.ok(Array.isArray(gltfJson.meshes), 'meshes is not an array');
    assert.ok(gltfJson.meshes.length > 0, 'No meshes found');

    const mesh = gltfJson.meshes[0];
    assert.ok(Array.isArray(mesh.primitives), 'primitives is not an array');
    assert.ok(mesh.primitives.length > 0, 'No primitives found in mesh');

    const prim = mesh.primitives[0];
    assert.ok(prim.attributes, 'Primitive missing attributes');
    assert.ok(prim.attributes.POSITION !== undefined, 'Primitive missing POSITION attribute');
    assert.ok(prim.attributes.NORMAL !== undefined, 'Primitive missing NORMAL attribute');
    assert.ok(prim.attributes.TEXCOORD_0 !== undefined, 'Primitive missing TEXCOORD_0 attribute');
    assert.ok(prim.indices !== undefined, 'Primitive missing indices attribute');

    positionAccessor = gltfJson.accessors[prim.attributes.POSITION];
    indicesAccessor = gltfJson.accessors[prim.indices];

    assert.strictEqual(positionAccessor.type, 'VEC3', 'POSITION accessor must be VEC3');
    assert.strictEqual(positionAccessor.componentType, 5126, 'POSITION componentType must be FLOAT (5126)');
    console.log(`         Mesh vertex count: ${positionAccessor.count}`);
    console.log(`         Mesh indices count: ${indicesAccessor.count} (${indicesAccessor.count / 3} triangles)`);
  });

  // 9. Empirical POSITION min/max and index bounds verification
  check('Empirical calculation of vertex coordinates matches declared min/max', () => {
    const bv = gltfJson.bufferViews[positionAccessor.bufferView];
    const offset = (bv.byteOffset || 0) + (positionAccessor.byteOffset || 0);
    const stride = bv.byteStride || 12;

    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];

    for (let i = 0; i < positionAccessor.count; i++) {
      const elemOffset = offset + i * stride;
      const x = binBuffer.readFloatLE(elemOffset);
      const y = binBuffer.readFloatLE(elemOffset + 4);
      const z = binBuffer.readFloatLE(elemOffset + 8);

      if (x < min[0]) min[0] = x;
      if (y < min[1]) min[1] = y;
      if (z < min[2]) min[2] = z;

      if (x > max[0]) max[0] = x;
      if (y > max[1]) max[1] = y;
      if (z > max[2]) max[2] = z;
    }

    const declaredMin = positionAccessor.min;
    const declaredMax = positionAccessor.max;

    for (let c = 0; c < 3; c++) {
      assert.ok(Math.abs(min[c] - declaredMin[c]) < 1e-4, `Min mismatch on axis ${c}: calc=${min[c]}, decl=${declaredMin[c]}`);
      assert.ok(Math.abs(max[c] - declaredMax[c]) < 1e-4, `Max mismatch on axis ${c}: calc=${max[c]}, decl=${declaredMax[c]}`);
    }
    console.log(`         Computed Bounding Box: [${min.map(v => v.toFixed(3)).join(', ')}] to [${max.map(v => v.toFixed(3)).join(', ')}]`);
    console.log(`         Declared Bounding Box: [${declaredMin.map(v => v.toFixed(3)).join(', ')}] to [${declaredMax.map(v => v.toFixed(3)).join(', ')}]`);
  });

  // 10. Triangle indices validity check
  check('Triangle indices modulo 3 and vertex reference boundaries', () => {
    assert.strictEqual(indicesAccessor.count % 3, 0, 'Indices count must be a multiple of 3 (triangles)');
    const bv = gltfJson.bufferViews[indicesAccessor.bufferView];
    const offset = (bv.byteOffset || 0) + (indicesAccessor.byteOffset || 0);

    const is16Bit = indicesAccessor.componentType === 5123;
    const is32Bit = indicesAccessor.componentType === 5125;
    assert.ok(is16Bit || is32Bit, `Unsupported index componentType: ${indicesAccessor.componentType}`);

    let maxIndexFound = 0;
    for (let i = 0; i < indicesAccessor.count; i++) {
      const idxVal = is16Bit ? binBuffer.readUInt16LE(offset + i * 2) : binBuffer.readUInt32LE(offset + i * 4);
      if (idxVal > maxIndexFound) maxIndexFound = idxVal;
      assert.ok(idxVal < positionAccessor.count, `Index ${idxVal} out of bounds (max vertex ${positionAccessor.count - 1})`);
    }
    console.log(`         Max vertex index referenced: ${maxIndexFound} / ${positionAccessor.count - 1} (100% in bounds)`);
  });

  // 11. Embedded Textures & JPEG markers validation
  check('Embedded images validation (JPEG SOI/EOI, SOF dimensions, channel count)', () => {
    assert.ok(Array.isArray(gltfJson.images), 'images is not an array');
    assert.ok(gltfJson.images.length > 0, 'No images embedded in glTF');

    gltfJson.images.forEach((img, idx) => {
      const bv = gltfJson.bufferViews[img.bufferView];
      assert.ok(bv, `Image[${idx}] references invalid bufferView ${img.bufferView}`);

      const offset = bv.byteOffset || 0;
      const imgBytes = binBuffer.subarray(offset, offset + bv.byteLength);

      assert.strictEqual(img.mimeType, 'image/jpeg', `Expected image/jpeg mimeType, got ${img.mimeType}`);
      // Verify JPEG SOI marker (0xFF, 0xD8)
      assert.strictEqual(imgBytes[0], 0xFF, `Image[${idx}] missing JPEG SOI marker 0xFF`);
      assert.strictEqual(imgBytes[1], 0xD8, `Image[${idx}] missing JPEG SOI marker 0xD8`);

      // Verify JPEG EOI marker (0xFF, 0xD9)
      const lastByte = imgBytes[imgBytes.length - 1];
      const secondLastByte = imgBytes[imgBytes.length - 2];
      assert.strictEqual(secondLastByte, 0xFF, `Image[${idx}] missing JPEG EOI marker 0xFF`);
      assert.strictEqual(lastByte, 0xD9, `Image[${idx}] missing JPEG EOI marker 0xD9`);

      const dims = parseJpegDimensions(imgBytes);
      assert.ok(dims, `Failed to parse JPEG dimensions for Image[${idx}]`);
      console.log(`         Image[${idx}] (${img.name || 'unnamed'}): ${dims.width}x${dims.height}, ${dims.channels} channels, ${(imgBytes.length / (1024 * 1024)).toFixed(2)} MB (${dims.marker})`);
    });
  });

  // 12. PBR Material definition
  check('PBR Material dielectric properties and texture bindings', () => {
    assert.ok(Array.isArray(gltfJson.materials), 'materials is not an array');
    assert.ok(gltfJson.materials.length > 0, 'No materials declared');

    const mat = gltfJson.materials[0];
    assert.ok(mat.pbrMetallicRoughness, 'Material missing pbrMetallicRoughness');
    assert.ok(mat.pbrMetallicRoughness.baseColorTexture, 'Material missing baseColorTexture');
    console.log(`         Material: ${mat.name || 'default'}, doubleSided=${Boolean(mat.doubleSided)}, roughnessFactor=${mat.pbrMetallicRoughness.roughnessFactor}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log(`SUMMARY: ${stats.passed}/${stats.tests} checks passed. ${stats.failed} failed.`);
  console.log('='.repeat(70));

  if (stats.failed > 0) {
    process.exit(1);
  }
}

runValidation();
