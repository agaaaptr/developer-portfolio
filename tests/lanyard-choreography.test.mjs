import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/lanyard-choreography.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const { createLanyardChoreography } = await import(moduleUrl);

test('the idle hint holds the visible back for half a second and repeats every eight seconds', () => {
  const choreography = createLanyardChoreography(0);
  assert.equal(choreography.tick(7999), null);
  assert.equal(choreography.tick(8000, false), 'back');
  assert.equal(choreography.tick(8800, false), null);
  assert.equal(choreography.tick(8801, true), null);
  assert.equal(choreography.tick(9300, true), null);
  assert.equal(choreography.tick(9301, true), 'front');
  assert.equal(choreography.tick(15999, false), null);
  assert.equal(choreography.tick(16000, false), 'back');
});

test('a manually opened back stays available until explicitly flipped', () => {
  const choreography = createLanyardChoreography(0);
  assert.equal(choreography.toggle(100), 'back');
  assert.equal(choreography.tick(60000), null);
  assert.equal(choreography.toggle(60100), 'front');
  assert.equal(choreography.tick(68099), null);
  assert.equal(choreography.tick(68100), 'back');
});

test('reduced motion stops hints without disabling manual flip', () => {
  const choreography = createLanyardChoreography(0);
  choreography.setReducedMotion(true, 100);
  assert.equal(choreography.tick(50000), null);
  assert.equal(choreography.toggle(50100), 'back');
  choreography.setReducedMotion(false, 50200);
  assert.equal(choreography.tick(70000), null);
  assert.equal(choreography.toggle(70100), 'front');
});

test('resuming after reduced motion preserves the remaining back-face hold', () => {
  const choreography = createLanyardChoreography(0);
  assert.equal(choreography.tick(8000, false), 'back');
  assert.equal(choreography.tick(8300, true), null);
  choreography.setReducedMotion(true, 8600);
  assert.equal(choreography.tick(20000), null);
  choreography.setReducedMotion(false, 20000);
  assert.equal(choreography.tick(20199, true), null);
  assert.equal(choreography.tick(20200, true), 'front');
});

test('returning onscreen does not turn an automatic hint into a permanent manual back', () => {
  const choreography = createLanyardChoreography(0);
  assert.equal(choreography.tick(8000, false), 'back');
  assert.equal(choreography.tick(8300, true), null);
  choreography.resume(50000);
  assert.equal(choreography.tick(50499, true), null);
  assert.equal(choreography.tick(50500, true), 'front');
});
