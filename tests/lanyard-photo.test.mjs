import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import ts from 'typescript';

const personal = JSON.parse(await readFile(new URL('../src/data/personal.json', import.meta.url), 'utf8'));
const source = await readFile(new URL('../src/lib/lanyard-photo.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const { getPortraitPlacement, getVisiblePortraitBounds } = await import(moduleUrl);

test('the profile photo is configured as an existing local image', async () => {
  assert.equal(typeof personal.profileImage, 'string', 'A profile image must be configured');
  assert.match(personal.profileImage, /^\/images\/[^/]+\.(jpg|jpeg|png|webp)$/);
  await access(new URL(`../public${personal.profileImage}`, import.meta.url));
});

test('the configured portrait has a transparent background', async () => {
  assert.match(personal.profileImage, /\.webp$/);
  const data = await readFile(new URL(`../public${personal.profileImage}`, import.meta.url));
  assert.equal(data.toString('ascii', 0, 4), 'RIFF');
  assert.equal(data.toString('ascii', 8, 12), 'WEBP');
  assert.ok(data.includes(Buffer.from('ALPH')), 'The portrait must include an alpha channel');
});

test('portrait photos fit entirely inside the panel without stretching', () => {
  const placement = getPortraitPlacement(844, 1500, 824, 700);
  assert.equal(placement.y, 0);
  assert.equal(placement.height, 700);
  assert.ok(Math.abs(placement.width - 844 * 700 / 1500) < 0.000001);
  assert.ok(Math.abs(placement.x - (824 - placement.width) / 2) < 0.000001);
});

test('landscape photos fit entirely and remain centered vertically', () => {
  assert.deepEqual(getPortraitPlacement(1200, 600, 500, 500), {
    x: 0,
    y: 125,
    width: 500,
    height: 250,
  });
});

test('invalid image dimensions are rejected', () => {
  assert.throws(() => getPortraitPlacement(0, 600, 500, 500), RangeError);
  assert.throws(() => getPortraitPlacement(800, 600, Number.NaN, 500), RangeError);
});

test('only fully transparent margins are trimmed from the portrait', () => {
  const rgba = new Uint8ClampedArray(4 * 4 * 4);
  rgba[(1 * 4 + 1) * 4 + 3] = 1;
  rgba[(3 * 4 + 2) * 4 + 3] = 255;
  assert.deepEqual(getVisiblePortraitBounds(rgba, 4, 4), {
    x: 1,
    y: 1,
    width: 2,
    height: 3,
  });
});

test('empty or malformed portrait pixel buffers are rejected', () => {
  assert.throws(() => getVisiblePortraitBounds(new Uint8ClampedArray(16), 2, 2), RangeError);
  assert.throws(() => getVisiblePortraitBounds(new Uint8ClampedArray(15), 2, 2), RangeError);
});

test('the configured portrait fits its panel with every nontransparent pixel retained', async () => {
  const { data, info } = await sharp(fileURLToPath(new URL(`../public${personal.profileImage}`, import.meta.url)))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
  const bounds = getVisiblePortraitBounds(rgba, info.width, info.height);
  const placement = getPortraitPlacement(bounds.width, bounds.height, 820, 810);
  assert.ok(placement.x >= 0 && placement.y >= 0);
  assert.ok(placement.x + placement.width <= 820.000001);
  assert.ok(placement.y + placement.height <= 810.000001);
  assert.ok(Math.abs(placement.width / placement.height - bounds.width / bounds.height) < 0.000001);
  let visiblePixelsOutsideBounds = 0;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (x >= bounds.x && x < bounds.x + bounds.width && y >= bounds.y && y < bounds.y + bounds.height) continue;
      if (rgba[(y * info.width + x) * 4 + 3] !== 0) visiblePixelsOutsideBounds += 1;
    }
  }
  assert.equal(visiblePixelsOutsideBounds, 0);
});
