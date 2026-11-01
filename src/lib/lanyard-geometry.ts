type ThreeModule = typeof import('three');

export const BADGE_WIDTH = 2.4;
export const BADGE_HEIGHT = 3.75;
export const BADGE_DEPTH = 0.04;
export const BADGE_BEVEL = 0.008;
export const BADGE_SLOT_Y = BADGE_HEIGHT / 2 - 0.17;
export const RING_RADIUS = 0.135;
export const RING_WIRE_RADIUS = 0.05;
export const CLIP_WIDTH = 0.48;
export const CLIP_HEIGHT = 0.2;
export const BADGE_RING_ANCHOR_Y = BADGE_SLOT_Y;

export function createRoundedShape(three: ThreeModule, width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new three.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function createBadgeShape(three: ThreeModule, width: number, height: number) {
  const shape = createRoundedShape(three, width, height, 0.12);
  const hole = new three.Path();
  const left = -0.3;
  const bottom = BADGE_SLOT_Y - 0.07;
  const right = 0.3;
  const top = BADGE_SLOT_Y + 0.07;
  const radius = 0.07;
  hole.moveTo(left + radius, bottom);
  hole.lineTo(right - radius, bottom);
  hole.quadraticCurveTo(right, bottom, right, bottom + radius);
  hole.quadraticCurveTo(right, top, right - radius, top);
  hole.lineTo(left + radius, top);
  hole.quadraticCurveTo(left, top, left, top - radius);
  hole.quadraticCurveTo(left, bottom, left + radius, bottom);
  shape.holes.push(hole);
  return shape;
}

export function createBadgeBodyGeometry(three: ThreeModule) {
  const geometry = new three.ExtrudeGeometry(createBadgeShape(three, BADGE_WIDTH, BADGE_HEIGHT), {
    depth: BADGE_DEPTH,
    bevelEnabled: true,
    bevelThickness: BADGE_BEVEL,
    bevelSize: BADGE_BEVEL,
    bevelSegments: 3,
    curveSegments: 12,
  });
  geometry.translate(0, 0, -BADGE_DEPTH / 2);
  return geometry;
}

export function createBadgeFaceGeometry(three: ThreeModule) {
  const width = BADGE_WIDTH - 0.1;
  const height = BADGE_HEIGHT * width / BADGE_WIDTH;
  const geometry = new three.ShapeGeometry(createBadgeShape(three, width, height), 12);
  const positions = geometry.getAttribute('position');
  const uvs = geometry.getAttribute('uv');
  for (let index = 0; index < positions.count; index += 1) {
    uvs.setXY(index, positions.getX(index) / width + 0.5, positions.getY(index) / height + 0.5);
  }
  uvs.needsUpdate = true;
  return geometry;
}
