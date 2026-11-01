import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import Rapier from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import ts from 'typescript';

await Rapier.init();
const geometrySource = await readFile(new URL('../src/lib/lanyard-geometry.ts', import.meta.url), 'utf8');
const geometryCompiled = ts.transpileModule(geometrySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const geometryUrl = `data:text/javascript;base64,${Buffer.from(geometryCompiled).toString('base64')}`;
const { BADGE_HEIGHT, BADGE_RING_ANCHOR_Y, CLIP_HEIGHT, RING_RADIUS } = await import(geometryUrl);
const source = await readFile(new URL('../src/lib/lanyard-physics.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText.replace("from './lanyard-geometry'", `from '${geometryUrl}'`);
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const { createLanyardPhysics } = await import(moduleUrl);

function withPhysics(assertion) {
  const physics = createLanyardPhysics(Rapier);
  try {
    assertion(physics);
  } finally {
    physics.dispose();
  }
}

function worldPoint(pose, localY) {
  return new THREE.Vector3(0, localY, 0)
    .applyQuaternion(new THREE.Quaternion(pose.rotation.x, pose.rotation.y, pose.rotation.z, pose.rotation.w))
    .add(new THREE.Vector3(pose.position.x, pose.position.y, pose.position.z));
}

function assertHardwareConnected(state, tolerance = 0.08) {
  assert.ok(state.hardware?.clip && state.hardware?.ring, 'The clip and ring must have their own physical poses');
  const { clip, ring, strapAttachment } = state.hardware;
  assert.ok(strapAttachment, 'The physical clip must expose its strap attachment');
  assert.ok(worldPoint(state, BADGE_RING_ANCHOR_Y).distanceTo(worldPoint(ring, -RING_RADIUS)) < tolerance);
  assert.ok(worldPoint(ring, RING_RADIUS).distanceTo(worldPoint(clip, -CLIP_HEIGHT / 2)) < tolerance);
  assert.ok(worldPoint(clip, CLIP_HEIGHT / 2).distanceTo(new THREE.Vector3(
    strapAttachment.x, strapAttachment.y, strapAttachment.z,
  )) < 0.001);
  assert.deepEqual(state.rope.at(-1), strapAttachment);
}

test('the card hangs from an anchored chain with bounded links', () => withPhysics((physics) => {
  physics.swing();
  for (let frame = 0; frame < 180; frame += 1) physics.step(1 / 60);
  const { rope } = physics.snapshot();
  assert.equal(rope.length, 5);
  assert.ok(Math.abs(rope[0].x) < 0.0001 && Math.abs(rope[0].y - 2.7) < 0.0001);
  for (let index = 1; index < rope.length; index += 1) {
    const a = rope[index - 1];
    const b = rope[index];
    assert.ok(Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < 0.7);
  }
}));

test('dragging follows the pointer and release produces spatial rotation', () => withPhysics((physics) => {
  physics.startDrag();
  physics.moveDrag({ x: 0.6, y: -0.2, z: 0.2 });
  physics.step(1 / 60);
  const held = physics.snapshot();
  assert.ok(Math.abs(held.position.x - 0.6) < 0.03);
  assert.ok(Math.abs(held.position.z - 0.2) < 0.03);
  physics.endDrag({ x: 1.2, y: 0.2, z: 0.4 }, { x: 0.3, y: 0.4, z: -1 });
  let maxRotation = 0;
  for (let frame = 0; frame < 60; frame += 1) {
    physics.step(1 / 60);
    const { x, y, z } = physics.snapshot().rotation;
    maxRotation = Math.max(maxRotation, Math.abs(x) + Math.abs(y) + Math.abs(z));
  }
  const released = physics.snapshot();
  assert.ok(Math.hypot(released.position.x - held.position.x, released.position.y - held.position.y) > 0.05);
  assert.ok(maxRotation > 0.08);
}));

test('a quick drag is applied even when release happens before the next animation frame', () => withPhysics((physics) => {
  physics.startDrag();
  const target = physics.moveDrag({ x: 0.5, y: -0.5, z: 0 });
  physics.endDrag({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
  const position = physics.snapshot().position;
  assert.ok(Math.hypot(position.x - target.x, position.y - target.y, position.z - target.z) < 0.03);
}));

test('reset restores the still, front-facing badge for reduced motion', () => withPhysics((physics) => {
  const restingPosition = physics.snapshot().position;
  physics.swing();
  for (let frame = 0; frame < 30; frame += 1) physics.step(1 / 60);
  physics.reset();
  const state = physics.snapshot();
  assert.deepEqual(state.position, restingPosition);
  assert.deepEqual(state.rotation, { x: 0, y: 0, z: 0, w: 1 });
  assert.equal(physics.isMoving(), false);
}));

test('large or negative frame gaps do not destabilize the simulation', () => withPhysics((first) => {
  withPhysics((second) => {
    first.swing();
    second.swing();
    first.step(1);
    second.step(1 / 10);
    const a = first.snapshot();
    const b = second.snapshot();
    assert.ok(Math.hypot(a.position.x - b.position.x, a.position.y - b.position.y) < 0.00001);
    first.step(-1);
    assert.deepEqual(first.snapshot(), a);
  });
}));

test('a 20fps frame advances the same physical time as three 60fps steps', () => withPhysics((first) => {
  withPhysics((second) => {
    first.swing();
    second.swing();
    first.step(1 / 20);
    for (let frame = 0; frame < 3; frame += 1) second.step(1 / 60);
    const a = first.snapshot();
    const b = second.snapshot();
    assert.ok(Math.hypot(a.position.x - b.position.x, a.position.y - b.position.y) < 0.00001);
  });
}));

test('the card flips to either face while the rope remains attached', () => withPhysics((physics) => {
  physics.setFacing('back');
  for (let frame = 0; frame < 180; frame += 1) physics.step(1 / 60);
  const back = physics.snapshot();
  assert.ok(1 - 2 * (back.rotation.x ** 2 + back.rotation.y ** 2) < -0.9);
  assertHardwareConnected(back);

  physics.setFacing('front');
  for (let frame = 0; frame < 180; frame += 1) physics.step(1 / 60);
  const front = physics.snapshot().rotation;
  assert.ok(1 - 2 * (front.x ** 2 + front.y ** 2) > 0.9);
}));

test('reduced motion can switch faces without a running animation', () => withPhysics((physics) => {
  physics.setFacing('back', true);
  const rotation = physics.snapshot().rotation;
  assert.ok(1 - 2 * (rotation.x ** 2 + rotation.y ** 2) < -0.99);
}));

test('the entrance starts above the hanging position and falls to settle', () => withPhysics((physics) => {
  physics.startEntrance();
  const start = physics.snapshot();
  assert.ok(start.position.y > 0, 'The badge should start in the upper half');
  for (let frame = 0; frame < 60; frame += 1) physics.step(1 / 60);
  const falling = physics.snapshot();
  assert.ok(falling.position.y < start.position.y - 1);
  for (let frame = 0; frame < 180; frame += 1) physics.step(1 / 60);
  const settled = physics.snapshot();
  assert.ok(Math.abs(settled.position.x) < 1);
  assert.ok(settled.position.y < 0);
}));

test('interrupting the entrance places the card at its accessible resting position', () => withPhysics((physics) => {
  const restingPosition = physics.snapshot().position;
  physics.startEntrance();
  physics.step(1 / 30);
  assert.equal(physics.finishEntrance(), true);
  const state = physics.snapshot();
  assert.deepEqual(state.position, restingPosition);
  assert.ok(Math.abs(state.rope[0].y - 2.7) < 0.0001);
  assert.equal(physics.finishEntrance(), false);
}));

test('enabled ambient motion keeps the hanging card subtly moving', () => withPhysics((physics) => {
  physics.setAmbientEnabled(true);
  for (let frame = 0; frame < 600; frame += 1) physics.step(1 / 60);
  const first = physics.snapshot();
  for (let frame = 0; frame < 90; frame += 1) physics.step(1 / 60);
  const second = physics.snapshot();
  assert.ok(Math.hypot(
    second.position.x - first.position.x,
    second.position.y - first.position.y,
    second.position.z - first.position.z,
  ) > 0.002);
  assert.ok(Math.abs(second.position.x) < 0.5);
}));

test('dragging beyond the tether reach does not tear the final attachment', () => withPhysics((physics) => {
  physics.startDrag();
  physics.moveDrag({ x: 4, y: 0, z: 0 });
  for (let frame = 0; frame < 120; frame += 1) physics.step(1 / 60);
  assertHardwareConnected(physics.snapshot());
}));

test('dragging follows finite pointer positions beyond the viewport in every direction', () => withPhysics((physics) => {
  physics.startDrag();
  for (const target of [
    { x: 6, y: -4, z: 0 },
    { x: -12, y: 8, z: 0.5 },
  ]) {
    const accepted = physics.moveDrag(target);
    assert.deepEqual(accepted, target, 'Dragging must not clamp the pointer to a fixed tether or viewport');
    physics.step(1 / 60);
    const state = physics.snapshot();
    const position = state.position;
    assert.ok(Math.hypot(position.x - target.x, position.y - target.y, position.z - target.z) < 0.03);
    assertHardwareConnected(state, 0.12);
  }
}));

test('the strap ends at a rigid clip and ring fixed to the badge', () => withPhysics((physics) => {
  assertHardwareConnected(physics.snapshot());
  physics.setFacing('back');
  for (let frame = 0; frame < 30; frame += 1) physics.step(1 / 60);
  const { rotation: cardRotation, hardware: { ring } } = physics.snapshot();
  const dot = Math.abs(
    cardRotation.x * ring.rotation.x + cardRotation.y * ring.rotation.y +
    cardRotation.z * ring.rotation.z + cardRotation.w * ring.rotation.w,
  );
  assert.ok(dot > 0.99, 'The ring must stay rigidly fixed to the badge');
}));

test('the connector stays rigid with the card through a flip', () => withPhysics((physics) => {
  physics.setFacing('back');
  for (let frame = 0; frame < 30; frame += 1) physics.step(1 / 60);
  const halfway = physics.snapshot();
  const card = halfway.rotation;
  const clip = halfway.hardware.clip.rotation;
  const relative = Math.abs(card.x * clip.x + card.y * clip.y + card.z * clip.z + card.w * clip.w);
  assert.ok(relative > 0.99, 'The connector must stay rigidly locked to the card');
  for (let frame = 0; frame < 60; frame += 1) physics.step(1 / 60);
  const turnedClip = physics.snapshot().hardware.clip.rotation;
  assert.ok(Math.abs(turnedClip.y) > 0.1, 'The strap connector must also turn during a card flip');
}));

test('connector rotation stays continuous through interrupted flips', () => withPhysics((physics) => {
  let previous = physics.snapshot().hardware.clip.rotation;
  physics.setFacing('back');
  for (let frame = 0; frame < 180; frame += 1) {
    if (frame === 70) physics.setFacing('front');
    if (frame === 120) physics.setFacing('back');
    physics.step(1 / 60);
    const current = physics.snapshot().hardware.clip.rotation;
    const dot = Math.min(1, Math.abs(
      previous.x * current.x + previous.y * current.y +
      previous.z * current.z + previous.w * current.w,
    ));
    assert.ok(2 * Math.acos(dot) < 0.3, `Connector jumped at frame ${frame}`);
    previous = current;
  }
}));

test('a stretched tether pulls the card back without producing non-finite values', () => withPhysics((physics) => {
  physics.startDrag();
  physics.moveDrag({ x: 9, y: -7, z: 0.5 });
  for (let frame = 0; frame < 30; frame += 1) physics.step(1 / 60);
  physics.endDrag({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
  for (let frame = 0; frame < 600; frame += 1) {
    physics.step(1 / 60);
    const state = physics.snapshot();
    assert.ok([...Object.values(state.position), ...state.rope.flatMap(Object.values)].every(Number.isFinite));
  }
  const { rope } = physics.snapshot();
  assert.ok(Math.hypot(
    rope.at(-1).x - rope[0].x,
    rope.at(-1).y - rope[0].y,
    rope.at(-1).z - rope[0].z,
  ) < 3);
}));

test('a manual flip reaches the back within one second', () => withPhysics((physics) => {
  physics.setFacing('back');
  for (let frame = 0; frame < 60; frame += 1) physics.step(1 / 60);
  const { x, y } = physics.snapshot().rotation;
  assert.ok(1 - 2 * (x * x + y * y) < -0.9);
}));

test('with ambient motion disabled, a manually opened back settles for scanning', () => withPhysics((physics) => {
  physics.setFacing('back');
  for (let frame = 0; frame < 360; frame += 1) physics.step(1 / 60);
  const first = physics.snapshot().position;
  for (let frame = 0; frame < 60; frame += 1) physics.step(1 / 60);
  const last = physics.snapshot().position;
  assert.ok(Math.hypot(last.x - first.x, last.y - first.y, last.z - first.z) < 0.03);
}));

test('the falling entrance reaches its anchor within three quarters of a second', () => withPhysics((physics) => {
  physics.startEntrance();
  for (let frame = 0; frame < 45; frame += 1) physics.step(1 / 60);
  assert.ok(Math.abs(physics.snapshot().rope[0].y - 2.7) < 0.05);
}));
