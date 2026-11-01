import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import * as THREE from 'three';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/lanyard-strap.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const { createStrapFrames, setStrapControlPoints } = await import(moduleUrl);

test('the ribbon extends above the page and terminates exactly at the physical clip', () => {
  assert.equal(typeof setStrapControlPoints, 'function', 'The rendered ribbon must use the physical attachment points');
  const rope = [
    { x: 0, y: 2.7, z: 0 },
    { x: 0.3, y: 2.1, z: 0 },
    { x: 2, y: 1.2, z: 0.2 },
    { x: 5, y: -2, z: 0.3 },
    { x: 12, y: -7, z: 0.5 },
  ];
  const controls = Array.from({ length: rope.length + 1 }, () => new THREE.Vector3());
  setStrapControlPoints(controls, rope);
  assert.ok(controls[0].y > rope[0].y + 0.5);
  assert.deepEqual(controls[1].toArray(), [rope[0].x, rope[0].y, rope[0].z]);
  const curve = new THREE.CatmullRomCurve3(controls, false, 'centripetal');
  assert.deepEqual(curve.getPoint(1).toArray(), [rope.at(-1).x, rope.at(-1).y, rope.at(-1).z]);
});

test('ribbon width changes continuously as the connector rotates through 180 degrees', () => {
  const segments = 24;
  const solve = createStrapFrames(THREE, segments);
  const tangents = Array.from({ length: segments + 1 }, () => new THREE.Vector3(0, -1, 0));
  let previous;
  for (let degrees = 160; degrees <= 200; degrees += 1) {
    const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(degrees));
    const side = solve(tangents, rotation).sides[segments / 2].clone();
    if (previous) assert.ok(previous.dot(side) > 0.99, `Ribbon flipped near ${degrees} degrees`);
    previous = side;
  }
});

test('equivalent positive and negative quaternions produce the same ribbon orientation', () => {
  const segments = 8;
  const solve = createStrapFrames(THREE, segments);
  const tangents = Array.from({ length: segments + 1 }, () => new THREE.Vector3(0, -1, 0));
  const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 1.2);
  const first = solve(tangents, rotation).sides.map((side) => side.clone());
  const equivalent = new THREE.Quaternion(-rotation.x, -rotation.y, -rotation.z, -rotation.w);
  const second = solve(tangents, equivalent).sides;
  first.forEach((side, index) => assert.ok(side.dot(second[index]) > 0.99999));
});

test('ribbon width stays perpendicular when the rope points along the original width axis', () => {
  const segments = 8;
  const solve = createStrapFrames(THREE, segments);
  const tangents = Array.from({ length: segments + 1 }, () => new THREE.Vector3(1, 0, 0));
  const sides = solve(tangents, new THREE.Quaternion()).sides;
  sides.forEach((side, index) => {
    assert.ok(Math.abs(side.length() - 1) < 0.00001);
    assert.ok(Math.abs(side.dot(tangents[index])) < 0.00001);
  });
});
