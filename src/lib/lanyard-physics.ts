import type * as Rapier from '@dimforge/rapier3d-compat';
import type { LanyardFace } from './lanyard-choreography';
import {
  BADGE_HEIGHT,
  BADGE_RING_ANCHOR_Y,
  BADGE_WIDTH,
  CLIP_HEIGHT,
  CLIP_WIDTH,
  RING_RADIUS,
} from './lanyard-geometry';

export interface LanyardVector {
  x: number;
  y: number;
  z: number;
}

export interface LanyardPose {
  position: LanyardVector;
  rotation: LanyardVector & { w: number };
}

export interface LanyardSnapshot extends LanyardPose {
  rope: LanyardVector[];
  hardware: {
    clip: LanyardPose;
    ring: LanyardPose;
    strapAttachment: LanyardVector;
  };
}

export interface LanyardPhysics {
  snapshot: () => LanyardSnapshot;
  step: (deltaSeconds: number) => void;
  startDrag: () => void;
  moveDrag: (position: LanyardVector) => LanyardVector;
  endDrag: (velocity: LanyardVector, angularVelocity: LanyardVector) => void;
  setFacing: (face: LanyardFace, immediate?: boolean) => void;
  startEntrance: () => void;
  finishEntrance: () => boolean;
  setAmbientEnabled: (enabled: boolean) => void;
  swing: () => void;
  reset: () => void;
  isMoving: () => boolean;
  dispose: () => void;
}

const STEP = 1 / 240;
const SEGMENT_LENGTH = 0.4;
const LINK_COUNT = 3;
// Stiff strap spring. Higher stiffness cuts the static sag (solid feel) while
// the raised force cap still lets it stretch under an unrestricted drag. The
// half-size sub-step keeps the explicit integration stable; damping stays low
// enough that c*dt stays under the lightest body mass.
const TETHER_STIFFNESS = 2500;
const TETHER_DAMPING = 32;
const MAX_TETHER_FORCE = 600;
const ANCHOR_Y = 2.7;
const CLIP_Y = ANCHOR_Y - SEGMENT_LENGTH * (LINK_COUNT + 1) - CLIP_HEIGHT / 2;
const RING_Y = CLIP_Y - CLIP_HEIGHT / 2 - RING_RADIUS;
const CARD_Y = RING_Y - RING_RADIUS - BADGE_RING_ANCHOR_Y;
// The entrance lifts the assembly above its resting pose and lets gravity drop
// it straight down.
const ENTRANCE_OFFSET = 2.5;
const IDENTITY = { x: 0, y: 0, z: 0, w: 1 };
const ZERO = { x: 0, y: 0, z: 0 };

function assertFiniteVector(vector: LanyardVector) {
  if (![vector.x, vector.y, vector.z].every(Number.isFinite)) {
    throw new RangeError('Lanyard vectors must contain finite values');
  }
}

function boundedVector(vector: LanyardVector, limit: number): LanyardVector {
  assertFiniteVector(vector);
  return {
    x: Math.max(-limit, Math.min(limit, vector.x)),
    y: Math.max(-limit, Math.min(limit, vector.y)),
    z: Math.max(-limit, Math.min(limit, vector.z)),
  };
}

function poseOf(body: Rapier.RigidBody): LanyardPose {
  const position = body.translation();
  const rotation = body.rotation();
  return {
    position: { x: position.x, y: position.y, z: position.z },
    rotation: { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w },
  };
}

function pointOnBody(body: Rapier.RigidBody, localY: number): LanyardVector {
  const { position, rotation: { x, y, z, w } } = poseOf(body);
  return {
    x: position.x + localY * 2 * (x * y - z * w),
    y: position.y + localY * (1 - 2 * (x * x + z * z)),
    z: position.z + localY * 2 * (y * z + x * w),
  };
}

function bodyWidthDirection(body: Rapier.RigidBody): LanyardVector {
  const { x, y, z, w } = body.rotation();
  return {
    x: 1 - 2 * (y * y + z * z),
    y: 2 * (x * y + z * w),
    z: 2 * (x * z - y * w),
  };
}

export function createLanyardPhysics(rapier: typeof Rapier): LanyardPhysics {
  const world = new rapier.World({ x: 0, y: -50, z: 0 });
  world.timestep = STEP;
  world.numSolverIterations = 12;

  const anchor = world.createRigidBody(rapier.RigidBodyDesc.fixed().setTranslation(0, ANCHOR_Y, 0));
  const links = Array.from({ length: LINK_COUNT }, (_, index) => {
    const body = world.createRigidBody(
      rapier.RigidBodyDesc.dynamic()
        .setTranslation(0, ANCHOR_Y - (index + 1) * SEGMENT_LENGTH, 0)
        .setLinearDamping(2.4)
        .setAngularDamping(3),
    );
    world.createCollider(rapier.ColliderDesc.ball(0.06).setMass(0.2).setCollisionGroups(0), body);
    return body;
  });

  const clip = world.createRigidBody(
    rapier.RigidBodyDesc.dynamic()
      .setTranslation(0, CLIP_Y, 0)
      .setLinearDamping(2.5)
      .setAngularDamping(5),
  );
  world.createCollider(
    rapier.ColliderDesc.cuboid(CLIP_WIDTH / 2, CLIP_HEIGHT / 2, 0.04).setMass(0.16).setCollisionGroups(0),
    clip,
  );
  const ring = world.createRigidBody(
    rapier.RigidBodyDesc.dynamic()
      .setTranslation(0, RING_Y, 0)
      .setLinearDamping(2.5)
      .setAngularDamping(5),
  );
  world.createCollider(rapier.ColliderDesc.ball(RING_RADIUS).setMass(0.12).setCollisionGroups(0), ring);
  world.createImpulseJoint(
    rapier.JointData.spherical({ x: 0, y: -CLIP_HEIGHT / 2, z: 0 }, { x: 0, y: RING_RADIUS, z: 0 }),
    clip,
    ring,
    true,
  );

  const card = world.createRigidBody(
    rapier.RigidBodyDesc.dynamic()
      .setTranslation(0, CARD_Y, 0)
      .setLinearDamping(0.4)
      .setAngularDamping(5),
  );
  world.createCollider(
    rapier.ColliderDesc.cuboid(BADGE_WIDTH / 2, BADGE_HEIGHT / 2, 0.03).setMass(0.62).setCollisionGroups(0),
    card,
  );
  world.createImpulseJoint(
    rapier.JointData.spherical({ x: 0, y: -RING_RADIUS, z: 0 }, { x: 0, y: BADGE_RING_ANCHOR_Y, z: 0 }),
    ring,
    card,
    true,
  );

  let accumulator = 0;
  let dragging = false;
  let dragPosition: LanyardVector | null = null;
  let pendingDragMove = false;
  let disposed = false;
  let targetYaw = 0;
  let yawUnwrapped = 0;
  let yawInitialized = false;
  let entranceActive = false;
  let ambientEnabled = false;
  let ambientTime = 0;

  const ensureActive = () => {
    if (disposed) throw new Error('Lanyard physics has already been disposed');
  };

  const applyTetherForces = () => {
    let previous = anchor;
    for (const link of [...links, clip]) {
      const a = previous.translation();
      const b = link === clip ? pointOnBody(clip, CLIP_HEIGHT / 2) : link.translation();
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const distance = Math.hypot(dx, dy, dz);
      if (distance > SEGMENT_LENGTH) {
        const direction = { x: dx / distance, y: dy / distance, z: dz / distance };
        const firstVelocity = previous.linvel();
        const secondVelocity = link.linvel();
        const angularVelocity = link.angvel();
        const center = link.translation();
        const offset = { x: b.x - center.x, y: b.y - center.y, z: b.z - center.z };
        const velocityAtAttachment = {
          x: secondVelocity.x + angularVelocity.y * offset.z - angularVelocity.z * offset.y,
          y: secondVelocity.y + angularVelocity.z * offset.x - angularVelocity.x * offset.z,
          z: secondVelocity.z + angularVelocity.x * offset.y - angularVelocity.y * offset.x,
        };
        const separationSpeed =
          (velocityAtAttachment.x - firstVelocity.x) * direction.x +
          (velocityAtAttachment.y - firstVelocity.y) * direction.y +
          (velocityAtAttachment.z - firstVelocity.z) * direction.z;
        const force = Math.max(0, Math.min(
          MAX_TETHER_FORCE,
          TETHER_STIFFNESS * (distance - SEGMENT_LENGTH) + TETHER_DAMPING * separationSpeed,
        ));
        const impulse = { x: direction.x * force * STEP, y: direction.y * force * STEP, z: direction.z * force * STEP };
        const opposite = { x: -impulse.x, y: -impulse.y, z: -impulse.z };
        if (link === clip) link.applyImpulseAtPoint(opposite, b, true);
        else link.applyImpulse(opposite, true);
        if (previous !== anchor) previous.applyImpulse(impulse, true);
      }
      previous = link;
    }
  };

  const applyHardwareTwist = () => {
    const clipPosition = clip.translation();
    const ringPosition = ring.translation();
    const dx = clipPosition.x - ringPosition.x;
    const dy = clipPosition.y - ringPosition.y;
    const dz = clipPosition.z - ringPosition.z;
    const length = Math.hypot(dx, dy, dz);
    if (length < 0.0001) return;
    const axis = { x: dx / length, y: dy / length, z: dz / length };

    const couple = (parent: Rapier.RigidBody, child: Rapier.RigidBody, stiffness: number, damping: number) => {
      const project = (vector: LanyardVector) => {
        const along = vector.x * axis.x + vector.y * axis.y + vector.z * axis.z;
        const projected = {
          x: vector.x - along * axis.x,
          y: vector.y - along * axis.y,
          z: vector.z - along * axis.z,
        };
        const magnitude = Math.hypot(projected.x, projected.y, projected.z);
        return magnitude < 0.0001 ? null : {
          x: projected.x / magnitude,
          y: projected.y / magnitude,
          z: projected.z / magnitude,
        };
      };
      const first = project(bodyWidthDirection(parent));
      const second = project(bodyWidthDirection(child));
      if (!first || !second) return;
      const cross = {
        x: second.y * first.z - second.z * first.y,
        y: second.z * first.x - second.x * first.z,
        z: second.x * first.y - second.y * first.x,
      };
      const angle = Math.atan2(
        axis.x * cross.x + axis.y * cross.y + axis.z * cross.z,
        first.x * second.x + first.y * second.y + first.z * second.z,
      );
      const parentVelocity = parent.angvel();
      const childVelocity = child.angvel();
      const relativeSpeed =
        (parentVelocity.x - childVelocity.x) * axis.x +
        (parentVelocity.y - childVelocity.y) * axis.y +
        (parentVelocity.z - childVelocity.z) * axis.z;
      const torque = Math.max(-5, Math.min(5, stiffness * angle + damping * relativeSpeed));
      if (Math.abs(torque) < 0.00001) return;
      const impulse = { x: axis.x * torque * STEP, y: axis.y * torque * STEP, z: axis.z * torque * STEP };
      child.applyTorqueImpulse(impulse, true);
      parent.applyTorqueImpulse({ x: -impulse.x, y: -impulse.y, z: -impulse.z }, true);
    };

    couple(card, ring, 10, 0.1);
    couple(ring, clip, 10, 0.1);
  };

  const reset = () => {
    ensureActive();
    dragging = false;
    dragPosition = null;
    pendingDragMove = false;
    accumulator = 0;
    targetYaw = 0;
    yawUnwrapped = 0;
    yawInitialized = false;
    entranceActive = false;
    ambientEnabled = false;
    ambientTime = 0;
    anchor.setTranslation({ x: 0, y: ANCHOR_Y, z: 0 }, false);
    card.setBodyType(rapier.RigidBodyType.Dynamic, true);
    card.setTranslation({ x: 0, y: CARD_Y, z: 0 }, false);
    card.setRotation(IDENTITY, false);
    card.setLinvel(ZERO, false);
    card.setAngvel(ZERO, false);
    for (const [body, y] of [[clip, CLIP_Y], [ring, RING_Y]] as const) {
      body.setTranslation({ x: 0, y, z: 0 }, false);
      body.setRotation(IDENTITY, false);
      body.setLinvel(ZERO, false);
      body.setAngvel(ZERO, false);
      body.sleep();
    }
    links.forEach((link, index) => {
      link.setTranslation({ x: 0, y: ANCHOR_Y - (index + 1) * SEGMENT_LENGTH, z: 0 }, false);
      link.setRotation(IDENTITY, false);
      link.setLinvel(ZERO, false);
      link.setAngvel(ZERO, false);
      link.sleep();
    });
    card.sleep();
  };

  reset();

  return {
    snapshot() {
      ensureActive();
      const strapAttachment = pointOnBody(clip, CLIP_HEIGHT / 2);
      return {
        ...poseOf(card),
        rope: [...[anchor, ...links].map((body) => {
          const point = body.translation();
          return { x: point.x, y: point.y, z: point.z };
        }), strapAttachment],
        hardware: { clip: poseOf(clip), ring: poseOf(ring), strapAttachment },
      };
    },
    step(deltaSeconds) {
      ensureActive();
      if (!Number.isFinite(deltaSeconds)) throw new RangeError('Frame time must be finite');
      accumulator += Math.max(0, Math.min(deltaSeconds, 1 / 10));
      while (accumulator >= STEP) {
        if (ambientEnabled && !dragging) {
          ambientTime += STEP;
          card.applyImpulse({
            x: (0.16 * Math.sin(ambientTime * 1.5) + 0.08 * Math.sin(ambientTime * 2.5)) * STEP,
            y: 0,
            z: 0.04 * Math.sin(ambientTime * 1.2) * STEP,
          }, true);
        }
        if (!dragging) {
          const rotation = card.rotation();
          const rawYaw = Math.atan2(
            2 * (rotation.w * rotation.y + rotation.x * rotation.z),
            1 - 2 * (rotation.y * rotation.y + rotation.z * rotation.z),
          );
          if (!yawInitialized) {
            // Reconcile the continuous yaw and the accumulated target after a jump
            // (reset or a drag) so a flip always starts from the card's current angle.
            yawUnwrapped = rawYaw;
            const targetIsBack = (Math.round(targetYaw / Math.PI) & 1) !== 0;
            let turns = Math.round(rawYaw / Math.PI);
            if (((turns & 1) !== 0) !== targetIsBack) {
              turns += rawYaw - turns * Math.PI >= 0 ? 1 : -1;
            }
            targetYaw = turns * Math.PI;
            yawInitialized = true;
          } else {
            yawUnwrapped += Math.atan2(Math.sin(rawYaw - yawUnwrapped), Math.cos(rawYaw - yawUnwrapped));
          }
          const error = targetYaw - yawUnwrapped;
          const angularVelocity = card.angvel();
          if (Math.abs(error) > 0.002 || Math.abs(angularVelocity.y) > 0.02) {
            const torque = Math.max(-45, Math.min(45, 26 * error - 8 * angularVelocity.y));
            card.applyTorqueImpulse({ x: 0, y: torque * STEP, z: 0 }, true);
          }
          // Keep the badge upright (top edge up) so a drag can never leave it
          // tumbling upside-down. Torque about cross(localUp, worldUp).
          const localUp = {
            x: 2 * (rotation.x * rotation.y - rotation.w * rotation.z),
            y: 1 - 2 * (rotation.x * rotation.x + rotation.z * rotation.z),
            z: 2 * (rotation.w * rotation.x + rotation.y * rotation.z),
          };
          // Proportional + damped correction so the badge settles upright instead
          // of rocking/tumbling after an inverted drag.
          card.applyTorqueImpulse({
            x: (-localUp.z * 14 - angularVelocity.x * 5) * STEP,
            y: 0,
            z: (localUp.x * 14 - angularVelocity.z * 5) * STEP,
          }, true);
        }
        applyTetherForces();
        // The torsional couple only matters for keeping the ring/clip aligned
        // during a flip. During a drag the card's orientation is frozen and the
        // ring can invert above the clip, which makes the couple's angle flip
        // sign each step and the tiny hardware masses flicker. Skip it while
        // dragging; it re-engages on release.
        if (!dragging) applyHardwareTwist();
        world.step();
        if (dragging) pendingDragMove = false;
        accumulator -= STEP;
      }
    },
    startDrag() {
      ensureActive();
      if (dragging) return;
      dragging = true;
      pendingDragMove = false;
      dragPosition = poseOf(card).position;
      card.setBodyType(rapier.RigidBodyType.KinematicPositionBased, true);
      card.setLinvel(ZERO, true);
      card.setAngvel(ZERO, true);
      links.forEach((link) => link.wakeUp());
      clip.wakeUp();
      ring.wakeUp();
    },
    moveDrag(position) {
      ensureActive();
      if (!dragging || !dragPosition) throw new Error('Start dragging before moving the lanyard');
      assertFiniteVector(position);
      const target = { x: position.x, y: position.y, z: position.z };
      const delta = {
        x: target.x - dragPosition.x,
        y: target.y - dragPosition.y,
        z: target.z - dragPosition.z,
      };
      for (const body of [clip, ring]) {
        const current = body.translation();
        body.setTranslation({ x: current.x + delta.x, y: current.y + delta.y, z: current.z + delta.z }, true);
      }
      card.setTranslation(target, true);
      card.setNextKinematicTranslation(target);
      dragPosition = target;
      pendingDragMove = true;
      links.forEach((link) => link.wakeUp());
      return target;
    },
    endDrag(velocity, angularVelocity) {
      ensureActive();
      if (!dragging) return;
      if (pendingDragMove) {
        applyTetherForces();
        world.step();
        pendingDragMove = false;
        accumulator = 0;
      }
      dragging = false;
      dragPosition = null;
      card.setBodyType(rapier.RigidBodyType.Dynamic, true);
      card.setLinvel(boundedVector(velocity, 4), true);
      card.setAngvel(boundedVector(angularVelocity, 1.5), true);
      yawInitialized = false;
    },
    setFacing(face, immediate = false) {
      ensureActive();
      const currentFace = (Math.round(targetYaw / Math.PI) & 1) === 0 ? 'front' : 'back';
      if (face !== currentFace) {
        // Advance a half-turn in the opposite direction of the previous flip so
        // consecutive flips alternate left/right instead of always spinning one way.
        targetYaw += (face === 'back' ? 1 : -1) * Math.PI;
      }
      if (immediate) {
        const previousAttachment = pointOnBody(card, BADGE_RING_ANCHOR_Y);
        card.setRotation({ x: 0, y: Math.sin(targetYaw / 2), z: 0, w: Math.cos(targetYaw / 2) }, true);
        card.setAngvel(ZERO, true);
        const nextAttachment = pointOnBody(card, BADGE_RING_ANCHOR_Y);
        for (const body of [clip, ring]) {
          const current = body.translation();
          body.setTranslation({
            x: current.x + nextAttachment.x - previousAttachment.x,
            y: current.y + nextAttachment.y - previousAttachment.y,
            z: current.z + nextAttachment.z - previousAttachment.z,
          }, true);
        }
      } else {
        card.wakeUp();
      }
    },
    startEntrance() {
      reset();
      entranceActive = true;
      links.forEach((link, index) => {
        link.setTranslation({ x: 0, y: ANCHOR_Y - (index + 1) * SEGMENT_LENGTH + ENTRANCE_OFFSET, z: 0 }, false);
      });
      clip.setTranslation({ x: 0, y: CLIP_Y + ENTRANCE_OFFSET, z: 0 }, false);
      ring.setTranslation({ x: 0, y: RING_Y + ENTRANCE_OFFSET, z: 0 }, false);
      card.setTranslation({ x: 0, y: CARD_Y + ENTRANCE_OFFSET, z: 0 }, false);
      links.forEach((link) => link.wakeUp());
      clip.wakeUp();
      ring.wakeUp();
      card.wakeUp();
    },
    finishEntrance() {
      ensureActive();
      if (!entranceActive) return false;
      reset();
      return true;
    },
    setAmbientEnabled(enabled) {
      ensureActive();
      ambientEnabled = enabled;
      if (enabled) card.wakeUp();
    },
    swing() {
      ensureActive();
      if (dragging) return;
      const velocity = card.linvel();
      const angularVelocity = card.angvel();
      card.setLinvel(boundedVector({ x: velocity.x + 1.6, y: velocity.y + 0.1, z: velocity.z + 0.25 }, 4), true);
      card.setAngvel(boundedVector({ x: angularVelocity.x, y: angularVelocity.y + 0.25, z: angularVelocity.z - 0.6 }, 3), true);
    },
    reset,
    isMoving() {
      ensureActive();
      return dragging || ambientEnabled || entranceActive || !card.isSleeping() ||
        !clip.isSleeping() || !ring.isSleeping() || links.some((link) => !link.isSleeping());
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      world.free();
    },
  };
}
