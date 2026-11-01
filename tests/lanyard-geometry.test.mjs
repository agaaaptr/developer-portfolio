import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import * as THREE from 'three';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/lanyard-geometry.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const { createBadgeBodyGeometry, createBadgeFaceGeometry, BADGE_WIDTH, BADGE_HEIGHT, BADGE_SLOT_Y } = await import(moduleUrl);

function intersects(geometry, y) {
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.updateMatrixWorld();
  const ray = new THREE.Raycaster(new THREE.Vector3(0, y, 5), new THREE.Vector3(0, 0, -1));
  const hits = ray.intersectObject(mesh).length;
  material.dispose();
  return hits;
}

test('the badge body and both face surfaces have a real through-hole', () => {
  for (const geometry of [createBadgeBodyGeometry(THREE), createBadgeFaceGeometry(THREE)]) {
    assert.equal(intersects(geometry, BADGE_SLOT_Y), 0);
    assert.ok(intersects(geometry, 0) > 0);
    geometry.dispose();
  }
});

test('the extruded badge is thin relative to its width', () => {
  const geometry = createBadgeBodyGeometry(THREE);
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  assert.ok((max.z - min.z) / (max.x - min.x) < 0.03);
  geometry.dispose();
});

test('the portrait badge has the longer proportions of a vertical ID card', () => {
  assert.ok(BADGE_HEIGHT / BADGE_WIDTH >= 1.5, 'The badge should be at least one and a half times as tall as it is wide');
  assert.ok(BADGE_SLOT_Y < BADGE_HEIGHT / 2, 'The slot must remain inside the taller badge');
});

test('the inset face preserves the badge aspect ratio so artwork is not stretched', () => {
  const geometry = createBadgeFaceGeometry(THREE);
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  assert.ok(Math.abs((max.x - min.x) / (max.y - min.y) - BADGE_WIDTH / BADGE_HEIGHT) < 0.00001);
  geometry.dispose();
});
