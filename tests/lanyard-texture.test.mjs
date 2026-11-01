import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/lanyard-texture.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const { createBadgeCanvasTexture } = await import(moduleUrl);

class FakeTexture {
  constructor(canvas) {
    this.canvas = canvas;
    this.anisotropy = 1;
    this.disposed = false;
  }

  dispose() {
    this.disposed = true;
  }
}

test('resizing replaces and disposes the GPU texture rather than changing it in place', () => {
  const canvas = { width: 900, height: 1200 };
  const artwork = createBadgeCanvasTexture({ CanvasTexture: FakeTexture, SRGBColorSpace: 'srgb' }, canvas);
  const first = artwork.texture;
  first.anisotropy = 8;
  assert.equal(artwork.resize(2), true);
  assert.equal(first.disposed, true);
  assert.notEqual(artwork.texture, first);
  assert.equal(artwork.texture.anisotropy, 8);
  assert.deepEqual(canvas, { width: 1800, height: 2400 });
  const second = artwork.texture;
  assert.equal(artwork.resize(2), false);
  assert.equal(second.disposed, false);
  artwork.dispose();
  assert.equal(second.disposed, true);
});

test('resizing preserves the source dimensions and aspect ratio of a taller badge', () => {
  const canvas = { width: 960, height: 1500 };
  const artwork = createBadgeCanvasTexture({ CanvasTexture: FakeTexture, SRGBColorSpace: 'srgb' }, canvas);
  assert.equal(artwork.resize(1), false);
  assert.equal(artwork.resize(2), true);
  assert.deepEqual(canvas, { width: 1920, height: 3000 });
  assert.equal(artwork.resize(1), true);
  assert.deepEqual(canvas, { width: 960, height: 1500 });
  artwork.dispose();
});
