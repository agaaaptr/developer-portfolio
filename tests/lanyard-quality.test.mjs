import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/lanyard-quality.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const { getLanyardPixelRatio, getBadgeTextureScale } = await import(moduleUrl);

test('a standard Retina lanyard renders at device pixel ratio two', () => {
  assert.equal(getLanyardPixelRatio(2, 460, 540), 2);
  assert.equal(getLanyardPixelRatio(3, 460, 540), 2);
});

test('a full desktop hero remains sharp on a Retina display', () => {
  assert.equal(getLanyardPixelRatio(2, 1440, 900), 2);
});

test('large canvases stay within the render pixel budget', () => {
  const ratio = getLanyardPixelRatio(3, 2000, 2000);
  assert.ok(2000 * 2000 * ratio * ratio <= 6_000_001);
});

test('badge artwork scales for Retina without exceeding twice its base size', () => {
  assert.equal(getBadgeTextureScale(1), 1);
  assert.equal(getBadgeTextureScale(2), 2);
  assert.equal(getBadgeTextureScale(3), 2);
});

test('invalid render dimensions are rejected', () => {
  assert.throws(() => getLanyardPixelRatio(2, 0, 540), RangeError);
});
