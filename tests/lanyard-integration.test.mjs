import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import Rapier from '@dimforge/rapier3d-compat';
import ts from 'typescript';

await Rapier.init();
const compile = (source) => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const geometry = moduleUrl(compile(await readFile(new URL('../src/lib/lanyard-geometry.ts', import.meta.url), 'utf8')));
const physicsSource = compile(await readFile(new URL('../src/lib/lanyard-physics.ts', import.meta.url), 'utf8'))
  .replace("from './lanyard-geometry'", `from '${geometry}'`);
const choreographySource = compile(await readFile(new URL('../src/lib/lanyard-choreography.ts', import.meta.url), 'utf8'));
const { createLanyardPhysics } = await import(moduleUrl(physicsSource));
const { createLanyardChoreography } = await import(moduleUrl(choreographySource));

test('the simulated idle preview holds the visible QR side for half a second and repeats at eight seconds', () => {
  const physics = createLanyardPhysics(Rapier);
  const choreography = createLanyardChoreography(0);
  const transitions = [];
  let visibleAt = null;
  let hiddenDuringHold = 0;
  try {
    physics.setAmbientEnabled(true);
    for (let frame = 0; frame <= 1050; frame += 1) {
      const time = frame * 1000 / 60;
      const { rotation } = physics.snapshot();
      const backVisible = 1 - 2 * (rotation.x ** 2 + rotation.y ** 2) < -0.97;
      if (transitions.length === 1 && visibleAt === null && backVisible) visibleAt = time;
      if (transitions.length === 1 && visibleAt !== null && !backVisible) hiddenDuringHold += 1;
      const face = choreography.tick(time, backVisible);
      if (face) {
        transitions.push({ face, time });
        physics.setAmbientEnabled(face === 'front');
        physics.setFacing(face);
      }
      physics.step(1 / 60);
    }
    assert.deepEqual(transitions.map(({ face }) => face), ['back', 'front', 'back', 'front']);
    assert.equal(transitions[0].time, 8000);
    assert.ok(visibleAt !== null);
    assert.equal(hiddenDuringHold, 0, 'The QR side should remain facing the viewer during its half-second hold');
    assert.ok(transitions[1].time - visibleAt >= 500 && transitions[1].time - visibleAt < 520);
    assert.equal(transitions[2].time, 16000);
  } finally {
    physics.dispose();
  }
});
