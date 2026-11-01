import type { Quaternion, Vector3 } from 'three';
import type { LanyardVector } from './lanyard-physics';

type ThreeModule = typeof import('three');

export function setStrapControlPoints(controls: Vector3[], rope: LanyardVector[]) {
  if (controls.length !== rope.length + 1 || rope.length < 2) {
    throw new RangeError('Strap control points must match the physical rope');
  }
  rope.forEach((point, index) => controls[index + 1].set(point.x, point.y, point.z));
  controls[0].copy(controls[1]);
  controls[0].y += 2;
}

export function createStrapFrames(three: ThreeModule, segments: number) {
  const sides = Array.from({ length: segments + 1 }, () => new three.Vector3());
  const directions = Array.from({ length: segments + 1 }, () => new three.Vector3());
  const previousTangent = new three.Vector3(0, -1, 0);
  const desired = new three.Vector3();
  const cross = new three.Vector3();
  let previousTwist = 0;

  const perpendicular = (side: Vector3, tangent: Vector3) => {
    side.addScaledVector(tangent, -side.dot(tangent));
    if (side.lengthSq() < 0.000001) {
      const { x, y, z } = tangent;
      if (Math.abs(x) <= Math.abs(y) && Math.abs(x) <= Math.abs(z)) side.set(1, 0, 0);
      else if (Math.abs(y) <= Math.abs(z)) side.set(0, 1, 0);
      else side.set(0, 0, 1);
      side.addScaledVector(tangent, -side.dot(tangent));
    }
    return side.normalize();
  };

  return (tangents: Vector3[], connectorRotation: Quaternion) => {
    for (let index = 0; index <= segments; index += 1) {
      const direction = directions[index].copy(tangents[index]);
      if (direction.lengthSq() < 0.000001) direction.copy(index === 0 ? previousTangent : directions[index - 1]);
      direction.normalize();
      // Fixed camera-facing reference (+X) recomputed every frame, stateless. A
      // transient bend in the rope (entrance drop) therefore never accumulates a
      // ribbon fold; only the connector's own rotation twists the ribbon.
      perpendicular(sides[index].set(1, 0, 0), direction);
    }
    previousTangent.copy(directions[0]);

    const tipTangent = directions[segments];
    desired.set(1, 0, 0).applyQuaternion(connectorRotation);
    desired.addScaledVector(tipTangent, -desired.dot(tipTangent));
    if (desired.lengthSq() < 0.000001) {
      desired.copy(sides[segments]).applyAxisAngle(tipTangent, previousTwist);
    } else {
      desired.normalize();
    }
    const angle = Math.atan2(
      tipTangent.dot(cross.crossVectors(sides[segments], desired)),
      sides[segments].dot(desired),
    );
    // Follow the connector continuously so the ribbon and clip always rotate in sync.
    const unfolding = Math.abs(angle) < 0.2;
    const rawTwist = previousTwist + Math.atan2(Math.sin(angle - previousTwist), Math.cos(angle - previousTwist));
    // When the connector returns to front, ease the twist toward its shortest
    // equivalent (unwrap) so the ribbon visibly unfolds over a few frames instead
    // of snapping in one frame (which reads as a bug).
    let twist = rawTwist;
    if (unfolding) {
      const wrapped = Math.atan2(Math.sin(rawTwist), Math.cos(rawTwist));
      twist = previousTwist + (wrapped - previousTwist) * 0.12;
    }
    previousTwist = twist;

    for (let index = 0; index <= segments; index += 1) {
      const t = index / segments;
      const weight = t * t * (3 - 2 * t);
      sides[index].applyAxisAngle(directions[index], twist * weight);
    }
    return { sides, twist, angle };
  };
}
