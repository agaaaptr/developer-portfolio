import { createLanyardPhysics, type LanyardVector } from './lanyard-physics';
import { createLanyardChoreography, type LanyardFace } from './lanyard-choreography';
import { getPortraitPlacement, getVisiblePortraitBounds } from './lanyard-photo';
import { getBadgeTextureScale, getLanyardPixelRatio } from './lanyard-quality';
import { createBadgeCanvasTexture } from './lanyard-texture';
import { createStrapFrames, setStrapControlPoints } from './lanyard-strap';
import {
  BADGE_BEVEL,
  BADGE_DEPTH,
  BADGE_HEIGHT,
  BADGE_WIDTH,
  CLIP_HEIGHT,
  CLIP_WIDTH,
  RING_RADIUS,
  RING_WIRE_RADIUS,
  createBadgeBodyGeometry,
  createBadgeFaceGeometry,
  createRoundedShape,
} from './lanyard-geometry';

type ThreeModule = typeof import('three');

const ART_WIDTH = 960;
const ART_HEIGHT = 1500;
const STAGE_WORLD_HEIGHT = 5.75;

interface BadgeContent {
  name: string;
  title: string;
  location: string;
}

interface SceneOptions {
  reducedMotion: boolean;
  stage: HTMLElement;
  hitArea: HTMLElement;
  onFaceChange: (face: LanyardFace) => void;
  onContextLost: () => void;
  signal?: AbortSignal;
}

export interface LanyardScene {
  setPortrait: (image: HTMLImageElement) => void;
  clearPortrait: () => void;
  setLogo: (image: HTMLImageElement) => void;
  setQr: (image: HTMLImageElement) => void;
  setQrUnavailable: () => void;
  flip: () => void;
  setReducedMotion: (reduced: boolean) => void;
  dispose: () => void;
}

function createTextureCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D is not available');
  return { canvas, context };
}

export function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => Array.from(part)[0]).join('').toUpperCase();
}

function tintLogo(image: HTMLImageElement, color: string) {
  const tinted = createTextureCanvas(64, 64);
  tinted.context.drawImage(image, 0, 0, 64, 64);
  tinted.context.globalCompositeOperation = 'source-in';
  tinted.context.fillStyle = color;
  tinted.context.fillRect(0, 0, 64, 64);
  tinted.context.globalCompositeOperation = 'source-over';
  return tinted.canvas;
}

const STICKER_PHRASES = [
  'SHIP IT', 'TODO: LATER', 'BLAME CACHE', '404: SLEEP', 'YOLO DEPLOY',
  'GIT PUSH -F', 'TABS > SPACES', 'WORKS ON MINE', 'NOT A BUG', 'BREAK PROD',
  'NULL !== UNDEF', '0 BUGS TODAY', 'FIX LATER', 'A FEATURE', 'GIT BLAME', 'DON\'T LOOK',
  'IT COMPILES', 'SHIP NOW', 'HOT RELOAD', 'MERGE CONFLICT', 'LEGACY CODE',
  'REWRITE IT', 'CONSOLE.LOG', 'DONE > PERFECT',
];

function drawSticker(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  angleDeg: number,
  bg: string,
  fg: string,
  ink: string,
  monoFont: string,
  scale = 1,
) {
  context.save();
  const fontSize = Math.round(38 * scale);
  context.font = `700 ${fontSize}px ${monoFont}`;
  const textWidth = context.measureText(text).width;
  const w = textWidth + 32 * scale;
  const h = 58 * scale;
  context.translate(x, y);
  context.rotate((angleDeg * Math.PI) / 180);
  // Hard offset shadow, rotated with the block so it stays aligned (an unrotated
  // shadow detaches from vertical/diagonal stickers and reads as a leftover block).
  context.fillStyle = ink;
  context.beginPath();
  context.roundRect(6 - w / 2, 6 - h / 2, w, h, 4);
  context.fill();
  // Block.
  context.fillStyle = bg;
  context.beginPath();
  context.roundRect(-w / 2, -h / 2, w, h, 4);
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = ink;
  context.stroke();
  context.fillStyle = fg;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 0, 0);
  context.restore();
}

function drawStickerWall(context: CanvasRenderingContext2D) {
  const styles = getComputedStyle(document.documentElement);
  const monoFont = styles.getPropertyValue('--font-jetbrains-mono').trim() || 'monospace';
  const violet = styles.getPropertyValue('--color-violet').trim() || '#7f3aed';
  const ink = '#111111';
  const white = '#ffffff';
  const palette = [
    { bg: violet, fg: white },
    { bg: white, fg: violet },
    { bg: ink, fg: white },
  ];
  // Deterministic pseudo-random so redraws (resize, portrait, fonts) reproduce
  // the exact same wall.
  const rnd = (i: number, salt: number) => {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  // Dense, randomly scattered, overlapping stickers filling the lime panel (a
  // sticker-bombed surface). No grid — positions are pseudo-random so the wall
  // reads as abstract. The portrait is drawn on top and occludes the middle.
  for (let i = 0; i < 80; i += 1) {
    const col = i % 10;
    const row = Math.floor(i / 10);
    const x = col * 96 + rnd(i, 1) * 96;
    const y = 290 + row * 110 + rnd(i, 2) * 110;
    const angle = [0, 45, 90, -45][i % 4] + (rnd(i, 3) - 0.5) * 14;
    const scale = 0.8 + rnd(i, 4) * 0.8;
    const color = palette[i % palette.length];
    drawSticker(
      context,
      STICKER_PHRASES[i % STICKER_PHRASES.length],
      x, y, angle,
      color.bg, color.fg, ink, monoFont, scale,
    );
  }
}

function makeBadgeTexture(three: ThreeModule, content: BadgeContent) {
  const { canvas, context } = createTextureCanvas(ART_WIDTH, ART_HEIGHT);
  const artwork = createBadgeCanvasTexture(three, canvas);
  const styles = getComputedStyle(document.documentElement);
  const displayFont = styles.getPropertyValue('--font-archivo-black').trim() || 'sans-serif';
  const lime = styles.getPropertyValue('--color-lime').trim() || '#c6ff34';
  const cardInk = '#111111';
  const light = '#f2f2f2';
  const grey = '#8fa0a0';
  const initials = getInitials(content.name);
  let portrait: { image: HTMLImageElement; bounds: ReturnType<typeof getVisiblePortraitBounds> } | null = null;
  let logo: HTMLCanvasElement | null = null;

  const draw = () => {
    context.setTransform(canvas.width / ART_WIDTH, 0, 0, canvas.height / ART_HEIGHT, 0, 0);
    context.imageSmoothingQuality = 'high';
    context.fillStyle = cardInk;
    context.fillRect(0, 0, ART_WIDTH, ART_HEIGHT);

    if (logo) {
      context.drawImage(logo, 44, 160, 60, 60);
    } else {
      context.fillStyle = lime;
      context.fillRect(42, 158, 64, 64);
      context.fillStyle = cardInk;
      context.font = `400 28px ${displayFont}`;
      context.fillText(initials, 48, 202, 52);
    }
    context.fillStyle = light;
    context.font = `400 35px ${displayFont}`;
    context.fillText(content.name.toUpperCase(), 122, 202, 450);
    context.textAlign = 'right';
    context.fillStyle = grey;
    context.font = 'bold 23px monospace';
    context.fillText('PORTFOLIO ID', 916, 200, 320);
    context.textAlign = 'left';

    context.fillStyle = lime;
    context.fillRect(0, 280, ART_WIDTH, 900);
    context.save();
    context.beginPath();
    context.rect(0, 280, ART_WIDTH, 900);
    context.clip();
    drawStickerWall(context);
    if (portrait) {
      const { image, bounds } = portrait;
      const placement = getPortraitPlacement(bounds.width, bounds.height, ART_WIDTH, 900);
      // Soft offset shadow so the cutout photo separates from the lime panel.
      context.shadowColor = cardInk;
      context.shadowOffsetX = 10;
      context.shadowOffsetY = 12;
      context.shadowBlur = 16;
      context.drawImage(
        image, bounds.x, bounds.y, bounds.width, bounds.height,
        placement.x, 280 + placement.y, placement.width, placement.height,
      );
      context.shadowColor = 'transparent';
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 0;
    } else {
      context.fillStyle = cardInk;
      context.textAlign = 'center';
      context.font = `400 370px ${displayFont}`;
      context.fillText(initials, ART_WIDTH / 2, 925, 700);
      context.textAlign = 'left';
    }
    context.restore();

    context.fillStyle = light;
    context.font = `400 70px ${displayFont}`;
    context.fillText(content.name.toUpperCase(), 44, 1302, 565);
    context.fillStyle = grey;
    context.font = 'bold 27px monospace';
    context.fillText(content.title.toUpperCase(), 46, 1358, 565);
    context.fillStyle = grey;
    context.font = 'bold 21px monospace';
    context.fillText('BASED IN', 626, 1285);
    context.fillStyle = light;
    context.font = 'bold 25px monospace';
    context.fillText(content.location.toUpperCase(), 626, 1326, 290);
    context.fillStyle = '#ffffff';
    context.font = 'bold 23px monospace';
    context.fillText('ID: AP-2026', 44, 1478);
    artwork.texture.needsUpdate = true;
  };

  draw();
  return {
    get texture() {
      return artwork.texture;
    },
    draw,
    setScale(scale: number) {
      if (!artwork.resize(scale)) return false;
      draw();
      return true;
    },
    setPortrait(image: HTMLImageElement) {
      if (portrait?.image === image) return;
      const source = createTextureCanvas(image.naturalWidth, image.naturalHeight);
      source.context.drawImage(image, 0, 0);
      const pixels = source.context.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
      const full = getVisiblePortraitBounds(pixels.data, pixels.width, pixels.height);
      // Show the upper half (head + torso) larger, like a professional ID photo.
      const cropHeight = Math.round(full.height * 0.55);
      portrait = {
        image,
        bounds: { x: full.x, y: full.y, width: full.width, height: cropHeight },
      };
      draw();
    },
    clearPortrait() {
      portrait = null;
      draw();
    },
    setLogo(image: HTMLImageElement) {
      logo = tintLogo(image, lime);
      draw();
    },
    dispose: artwork.dispose,
  };
}

function makeBackBadgeTexture(three: ThreeModule, content: BadgeContent) {
  const { canvas, context } = createTextureCanvas(ART_WIDTH, ART_HEIGHT);
  const artwork = createBadgeCanvasTexture(three, canvas);
  const styles = getComputedStyle(document.documentElement);
  const displayFont = styles.getPropertyValue('--font-archivo-black').trim() || 'sans-serif';
  const lime = styles.getPropertyValue('--color-lime').trim() || '#c6ff34';
  const violet = styles.getPropertyValue('--color-violet').trim() || '#7f3aed';
  const cardInk = '#111111';
  const light = '#f2f2f2';
  const grey = '#8fa0a0';
  const initials = getInitials(content.name);
  let qr: HTMLImageElement | null = null;
  let qrUnavailable = false;
  let logo: HTMLCanvasElement | null = null;

  const draw = () => {
    context.setTransform(canvas.width / ART_WIDTH, 0, 0, canvas.height / ART_HEIGHT, 0, 0);
    context.fillStyle = cardInk;
    context.fillRect(0, 0, ART_WIDTH, ART_HEIGHT);
    if (logo) {
      context.drawImage(logo, 44, 160, 60, 60);
    } else {
      context.fillStyle = lime;
      context.fillRect(42, 158, 64, 64);
      context.fillStyle = cardInk;
      context.font = `400 27px ${displayFont}`;
      context.fillText(initials, 49, 202, 50);
    }
    context.fillStyle = light;
    context.font = `400 35px ${displayFont}`;
    context.fillText(content.name.toUpperCase(), 122, 202, 450);
    context.textAlign = 'right';
    context.fillStyle = grey;
    context.font = 'bold 23px monospace';
    context.fillText('LINK HUB', 916, 200);
    context.textAlign = 'left';
    context.fillStyle = cardInk;
    context.fillRect(0, 280, ART_WIDTH, 1220);
    context.fillStyle = light;
    context.font = `400 70px ${displayFont}`;
    context.fillText('SCAN TO', 54, 390, 850);
    context.fillStyle = lime;
    context.fillText('CONNECT', 54, 475, 850);
    context.save();
    context.beginPath();
    context.roundRect(80, 520, 800, 800, 32);
    context.clip();
    context.fillStyle = '#ffffff';
    context.fill();
    if (qr) {
      context.imageSmoothingEnabled = false;
      context.drawImage(qr, 90, 530, 780, 780);
    } else {
      context.fillStyle = cardInk;
      context.textAlign = 'center';
      context.font = 'bold 30px monospace';
      context.fillText(qrUnavailable ? 'QR UNAVAILABLE' : 'LOADING QR', ART_WIDTH / 2, 930);
      context.textAlign = 'left';
    }
    context.restore();
    context.fillStyle = light;
    context.font = 'bold 27px monospace';
    context.fillText(content.title.toUpperCase(), 54, 1382, 550);
    context.textAlign = 'right';
    context.fillStyle = violet;
    context.fillText('SOCIAL LINKS', 906, 1382, 340);
    context.textAlign = 'left';
    context.fillStyle = lime;
    context.fillRect(0, 1438, ART_WIDTH, 62);
    context.fillStyle = cardInk;
    context.font = 'bold 23px monospace';
    context.fillText('GITHUB / LINKEDIN / MORE', 54, 1478);
    artwork.texture.needsUpdate = true;
  };

  draw();
  return {
    get texture() {
      return artwork.texture;
    },
    draw,
    setScale(scale: number) {
      if (!artwork.resize(scale)) return false;
      draw();
      return true;
    },
    setQr(image: HTMLImageElement) {
      qr = image;
      qrUnavailable = false;
      draw();
    },
    setQrUnavailable() {
      qr = null;
      qrUnavailable = true;
      draw();
    },
    setLogo(image: HTMLImageElement) {
      logo = tintLogo(image, lime);
      draw();
    },
    dispose: artwork.dispose,
  };
}

function makeStrapTexture(three: ThreeModule, name: string) {
  const { canvas, context } = createTextureCanvas(256, 2048);
  const styles = getComputedStyle(document.documentElement);
  const lime = styles.getPropertyValue('--color-lime').trim() || '#c6ff34';
  const violet = styles.getPropertyValue('--color-violet').trim() || '#7f3aed';
  // Woven charcoal base, lighter than pure ink so the weave reads under light.
  context.fillStyle = '#1a1a1a';
  context.fillRect(0, 0, 256, 2048);
  // Vertical weave threads (alternating light/dark columns).
  for (let x = 16; x < 240; x += 16) {
    context.fillStyle = (x / 16) % 2 ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.28)';
    context.fillRect(x, 0, 8, 2048);
  }
  // Diagonal cross-hatch — the lanyard weave.
  context.strokeStyle = 'rgba(255, 255, 255, 0.24)';
  context.lineWidth = 1.5;
  for (let y = -256; y < 2048; y += 20) {
    context.beginPath();
    context.moveTo(16, y);
    context.lineTo(240, y + 224);
    context.stroke();
    context.beginPath();
    context.moveTo(240, y);
    context.lineTo(16, y + 224);
    context.stroke();
  }
  // Horizontal ribbing for a woven-band feel.
  for (let y = 0; y < 2048; y += 36) {
    context.fillStyle = 'rgba(0, 0, 0, 0.24)';
    context.fillRect(16, y, 224, 14);
    context.fillStyle = 'rgba(255, 255, 255, 0.10)';
    context.fillRect(16, y + 14, 224, 4);
  }
  // Edge stripes.
  context.fillStyle = lime;
  context.fillRect(8, 0, 8, 2048);
  context.fillStyle = violet;
  context.fillRect(240, 0, 8, 2048);
  // Brand text, sized and positioned to stay readable without running under the clip.
  context.fillStyle = 'rgba(255, 255, 255, 0.75)';
  context.font = 'bold 56px monospace';
  context.save();
  context.translate(150, 650);
  context.rotate(Math.PI / 2);
  context.fillText(`${name.toUpperCase()}  /  SOFTWARE ENGINEER`, 0, 0, 1500);
  context.restore();

  const texture = new three.CanvasTexture(canvas);
  texture.colorSpace = three.SRGBColorSpace;
  texture.wrapS = three.RepeatWrapping;
  texture.wrapT = three.RepeatWrapping;
  return texture;
}

export async function createLanyardScene(
  canvas: HTMLCanvasElement,
  content: BadgeContent,
  options: SceneOptions,
): Promise<LanyardScene> {
  const [three, rapier] = await Promise.all([
    import('three'),
    import('@dimforge/rapier3d-compat'),
  ]);
  await rapier.init();
  if (options.signal?.aborted) throw new DOMException('Lanyard initialization cancelled', 'AbortError');
  const badgeArtwork = makeBadgeTexture(three, content);
  const backArtwork = makeBackBadgeTexture(three, content);
  const strapTexture = makeStrapTexture(three, content.name);
  const renderer = new three.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = three.SRGBColorSpace;
  // PBR Neutral keeps the white badge white (no grey/hue shift) and compresses only
  // the highlight tail, so the clearcoat specular rolls off instead of clipping.
  renderer.toneMapping = three.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  badgeArtwork.texture.anisotropy = anisotropy;
  backArtwork.texture.anisotropy = anisotropy;
  strapTexture.anisotropy = anisotropy;
  let physics: ReturnType<typeof createLanyardPhysics>;
  try {
    physics = createLanyardPhysics(rapier);
  } catch (error) {
    badgeArtwork.dispose();
    backArtwork.dispose();
    strapTexture.dispose();
    renderer.dispose();
    throw error;
  }

  const resources: Array<{ dispose: () => void }> = [badgeArtwork, backArtwork, strapTexture];
  const track = <T extends { dispose: () => void }>(resource: T): T => {
    resources.push(resource);
    return resource;
  };

  const scene = new three.Scene();
  // Procedural studio environment: a dark room with softbox panels baked to a PMREM, so
  // the clearcoat gets a soft moving highlight as the badge swings — with no localized
  // point source bright enough to overexpose it.
  const environment = new three.Scene();
  // Mid-grey room so the metal ring/clip (metalness 1) have something to reflect;
  // a near-black room is why the hardware read as flat dark.
  environment.background = new three.Color(0x444444);
  // HDR softbox panels baked once to a PMREM. The key strip is well above 1.0
  // linear so the clearcoat/metal has a real highlight to catch — the old sRGB
  // 1.0 panels put the strongest specular at ~0.02 linear, which is invisible.
  const studioPanels = [
    { w: 7, h: 3, x: 0, y: 5, z: 3, color: new three.Color(3, 3, 3) },         // key strip (above)
    { w: 8, h: 5, x: -7, y: 1.5, z: 2, color: new three.Color(3, 3, 3) },      // side softbox
    { w: 6, h: 4, x: 0, y: -4, z: 3, color: new three.Color(0.6, 0.6, 0.7) },  // below bounce
    { w: 5, h: 3, x: -3, y: 3, z: -6, color: new three.Color(5, 5, 5) },       // back strip
  ];
  const studioResources = studioPanels.map((panel) => {
    const geometry = new three.PlaneGeometry(panel.w, panel.h);
    const material = new three.MeshBasicMaterial({ color: panel.color, side: three.DoubleSide });
    const mesh = new three.Mesh(geometry, material);
    mesh.position.set(panel.x, panel.y, panel.z);
    mesh.lookAt(0, 0, 0);
    environment.add(mesh);
    return { geometry, material };
  });
  let pmrem: InstanceType<ThreeModule['PMREMGenerator']> | null = null;
  try {
    pmrem = new three.PMREMGenerator(renderer);
    const environmentTarget = track(pmrem.fromScene(environment, 0.04));
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = 1.15;
  } catch (error) {
    physics.dispose();
    resources.forEach((resource) => resource.dispose());
    renderer.dispose();
    throw error;
  } finally {
    pmrem?.dispose();
    studioResources.forEach(({ geometry, material }) => {
      geometry.dispose();
      material.dispose();
    });
  }
  let worldHeight = STAGE_WORLD_HEIGHT;
  const cameraDistance = 9;
  const fieldOfView = 2 * Math.atan(worldHeight / (2 * cameraDistance)) * 180 / Math.PI;
  const camera = new three.PerspectiveCamera(fieldOfView, 1, 0.1, 30);
  camera.position.set(0, 0.15, cameraDistance);
  camera.lookAt(0, 0.15, 0);
  // Soft fill only: a hemisphere carries no specular and flattens the card, so
  // keep it low and let the environment + key light own the highlights.
  // Soft ambient floor so the shadow side never goes black; the directional rig
  // above still provides the 3D shading. Higher than a "contrasty" value so the
  // dark body/strap stay readable even when facing away from the key light.
  scene.add(new three.HemisphereLight(0xf0f0ff, 0x2e2e2e, 0.45));

  const badge = new three.Group();
  scene.add(badge);
  // World-fixed key light. The badge's own swing makes the clearcoat highlight
  // travel across the face; the light itself stays put. Directional (not
  // point/spot) for zero falloff cost, and no shadows — nothing receives them.
  // r155+ intensities are unitless, so ~2 is a normal key value.
  // A few static lights: a front-left key (so the clearcoat specular reflects
  // toward the camera), a cool fill from the right, and a rim from behind.
  const keyLight = new three.DirectionalLight(0xffffff, 3.0);
  keyLight.position.set(-3, 2.5, 6.5);
  keyLight.target = badge;
  scene.add(keyLight);
  const fillLight = new three.DirectionalLight(0x8fb3ff, 0.5);
  fillLight.position.set(3, 1.5, 5);
  fillLight.target = badge;
  scene.add(fillLight);
  const rimLight = new three.DirectionalLight(0xe4e4ff, 1.5);
  rimLight.position.set(-3, 4, -6);
  rimLight.target = badge;
  scene.add(rimLight);
  const bodyGeometry = track(createBadgeBodyGeometry(three));
  const bodyMaterial = track(new three.MeshStandardMaterial({ color: '#111111', roughness: 0.5 }));
  const body = new three.Mesh(bodyGeometry, bodyMaterial);
  badge.add(body);

  const frontGeometry = track(createBadgeFaceGeometry(three));
  const frontMaterial = track(new three.MeshPhysicalMaterial({
    map: badgeArtwork.texture,
    color: 0xffffff,
    metalness: 0,
    roughness: 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    specularIntensity: 1.0,
  }));
  const front = new three.Mesh(frontGeometry, frontMaterial);
  front.position.z = BADGE_DEPTH / 2 + BADGE_BEVEL + 0.001;
  badge.add(front);
  const backMaterial = track(new three.MeshPhysicalMaterial({
    map: backArtwork.texture,
    roughness: 0.4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    emissive: '#ffffff',
    emissiveMap: backArtwork.texture,
    emissiveIntensity: 0.15,
  }));
  const back = new three.Mesh(frontGeometry, backMaterial);
  back.position.z = -BADGE_DEPTH / 2 - BADGE_BEVEL - 0.001;
  back.rotation.y = Math.PI;
  badge.add(back);

  const metal = track(new three.MeshStandardMaterial({
    color: '#f4f4f0',
    metalness: 1,
    roughness: 0.12,
  }));
  const ringGroup = new three.Group();
  scene.add(ringGroup);
  const ringGeometry = track(new three.TorusGeometry(RING_RADIUS, RING_WIRE_RADIUS, 16, 48));
  const ring = new three.Mesh(ringGeometry, metal);
  ring.rotation.y = Math.PI / 2;
  ringGroup.add(ring);
  const clipGroup = new three.Group();
  scene.add(clipGroup);
  const clipGeometry = track(new three.ExtrudeGeometry(createRoundedShape(three, CLIP_WIDTH, CLIP_HEIGHT, 0.045), {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 8,
  }));
  clipGeometry.translate(0, 0, -0.035);
  const clip = new three.Mesh(clipGeometry, metal);
  clipGroup.add(clip);

  const segments = 24;
  const positions = new Float32Array((segments + 1) * 2 * 3);
  const uvs = new Float32Array((segments + 1) * 2 * 2);
  const indices: number[] = [];
  for (let index = 0; index <= segments; index += 1) {
    const vertex = index * 2;
    uvs.set([0, 1 - index / segments, 1, 1 - index / segments], vertex * 2);
    if (index < segments) {
      indices.push(vertex, vertex + 1, vertex + 2, vertex + 1, vertex + 3, vertex + 2);
    }
  }
  const STRAP_UV_LENGTH = 1.7;
  const strapGeometry = track(new three.BufferGeometry());
  const positionAttribute = new three.BufferAttribute(positions, 3);
  positionAttribute.setUsage(three.DynamicDrawUsage);
  strapGeometry.setAttribute('position', positionAttribute);
  const uvAttribute = new three.BufferAttribute(uvs, 2);
  uvAttribute.setUsage(three.DynamicDrawUsage);
  strapGeometry.setAttribute('uv', uvAttribute);
  strapGeometry.setIndex(indices);
  const strapMaterial = track(new three.MeshStandardMaterial({
    map: strapTexture,
    side: three.DoubleSide,
    roughness: 0.55,
  }));
  const strap = new three.Mesh(strapGeometry, strapMaterial);
  strap.frustumCulled = false;
  scene.add(strap);

  let worldWidth = 4;
  let anchorScreenX = 0;
  let pixelsPerWorldUnit = 1;
  let reducedMotion = options.reducedMotion;
  let currentFace: LanyardFace = 'front';
  const choreography = createLanyardChoreography(performance.now());
  choreography.setReducedMotion(reducedMotion, performance.now());
  let disposed = false;
  let contextLost = false;
  let visible = true;
  let frame: number | null = null;
  let previousFrame = 0;
  let drag: {
    pointerId: number;
    startX: number;
    startY: number;
    origin: LanyardVector;
    lastPosition: LanyardVector;
    velocity: LanyardVector;
    grabOffset: LanyardVector;
    lastTime: number;
    started: boolean;
    moved: boolean;
  } | null = null;
  const ropePoints = Array.from({ length: 6 }, () => new three.Vector3());
  const ropeCurve = new three.CatmullRomCurve3(ropePoints, false, 'centripetal');
  const ropePoint = new three.Vector3();
  const ropeTangents = Array.from({ length: segments + 1 }, () => new three.Vector3());
  const ropeCenters = Array.from({ length: segments + 1 }, () => new three.Vector3());
  const getStrapFrames = createStrapFrames(three, segments);
  const corners = Array.from({ length: 4 }, () => new three.Vector3());

  const updateStrap = (points: LanyardVector[]) => {
    // Extend the ribbon's last point a little way into the clip along the
    // incoming direction, so it stays centred in the clip even as the hook
    // tilts, without poking through the solid ring below.
    const extended = points.slice();
    const last = points[points.length - 1];
    const before = points[points.length - 2];
    let dx = last.x - before.x;
    let dy = last.y - before.y;
    let dz = last.z - before.z;
    const length = Math.hypot(dx, dy, dz) || 1;
    dx /= length; dy /= length; dz /= length;
    const reach = CLIP_HEIGHT * 0.5;
    extended[extended.length - 1] = {
      x: last.x + dx * reach,
      y: last.y + dy * reach,
      z: last.z + dz * reach,
    };
    setStrapControlPoints(ropePoints, extended);
    for (let index = 0; index <= segments; index += 1) {
      ropeCurve.getTangent(index / segments, ropeTangents[index]);
    }
    const { sides, twist, angle } = getStrapFrames(ropeTangents, clipGroup.quaternion);
    for (let index = 0; index <= segments; index += 1) {
      const t = index / segments;
      ropeCurve.getPoint(t, ropePoint);
      ropeCenters[index].copy(ropePoint);
      const ropeSide = sides[index].multiplyScalar(0.24);
      positions.set([
        ropePoint.x - ropeSide.x, ropePoint.y - ropeSide.y, ropePoint.z - ropeSide.z,
        ropePoint.x + ropeSide.x, ropePoint.y + ropeSide.y, ropePoint.z + ropeSide.z,
      ], index * 6);
    }
    // Arc-length V so the weave keeps its world-space density (and the brand
    // text tiles) instead of stretching when the strap is pulled long.
    let arc = 0;
    for (let index = segments; index >= 0; index -= 1) {
      if (index < segments) arc += ropeCenters[index].distanceTo(ropeCenters[index + 1]);
      const v = arc / STRAP_UV_LENGTH;
      uvAttribute.setY(index * 2, v);
      uvAttribute.setY(index * 2 + 1, v);
    }
    uvAttribute.needsUpdate = true;
    positionAttribute.needsUpdate = true;
    strapGeometry.computeVertexNormals();
    // Rotate the clip with the ribbon's tip twist, smoothly blended by how far
    // the connector is from front. The twist is about the strap's downward
    // tangent (opposite the clip's yaw), so it must fade out as the card turns —
    // otherwise it would cancel the yaw and stall the clip mid-flip.
    const unfoldBlend = Math.max(0, Math.min(1, 1 - Math.abs(angle) / 0.3));
    clipGroup.rotateOnAxis(ropeTangents[segments], twist * unfoldBlend);
  };

  const render = () => {
    if (disposed || contextLost) return;
    const state = physics.snapshot();
    badge.position.set(state.position.x, state.position.y, state.position.z);
    badge.quaternion.set(state.rotation.x, state.rotation.y, state.rotation.z, state.rotation.w);
    ringGroup.position.set(state.hardware.ring.position.x, state.hardware.ring.position.y, state.hardware.ring.position.z);
    ringGroup.quaternion.set(
      state.hardware.ring.rotation.x, state.hardware.ring.rotation.y,
      state.hardware.ring.rotation.z, state.hardware.ring.rotation.w,
    );
    clipGroup.position.set(state.hardware.clip.position.x, state.hardware.clip.position.y, state.hardware.clip.position.z);
    clipGroup.quaternion.set(
      state.hardware.clip.rotation.x, state.hardware.clip.rotation.y,
      state.hardware.clip.rotation.z, state.hardware.clip.rotation.w,
    );
    updateStrap(state.rope);
    badge.updateMatrixWorld(true);
    const { width, height } = canvas.getBoundingClientRect();
    const localCorners = [
      [-BADGE_WIDTH / 2, BADGE_HEIGHT / 2],
      [BADGE_WIDTH / 2, BADGE_HEIGHT / 2],
      [BADGE_WIDTH / 2, -BADGE_HEIGHT / 2],
      [-BADGE_WIDTH / 2, -BADGE_HEIGHT / 2],
    ];
    const projected = localCorners.map(([x, y], index) => {
      const point = corners[index].set(x, y, 0).applyMatrix4(badge.matrixWorld).project(camera);
      return { x: (point.x + 1) * width / 2, y: (1 - point.y) * height / 2 };
    });
    const left = Math.min(...projected.map((point) => point.x));
    const top = Math.min(...projected.map((point) => point.y));
    const hitWidth = Math.max(...projected.map((point) => point.x)) - left;
    const hitHeight = Math.max(...projected.map((point) => point.y)) - top;
    if ([left, top, hitWidth, hitHeight].every(Number.isFinite)) {
      const width = Math.max(44, hitWidth);
      const height = Math.max(44, hitHeight);
      const paddedLeft = left - (width - hitWidth) / 2;
      const paddedTop = top - (height - hitHeight) / 2;
      options.hitArea.style.display = 'block';
      options.hitArea.style.transform = `translate3d(${paddedLeft}px, ${paddedTop}px, 0)`;
      options.hitArea.style.width = `${width}px`;
      options.hitArea.style.height = `${height}px`;
      options.hitArea.style.clipPath = hitWidth < 44 || hitHeight < 44 ? 'none' :
        `polygon(${projected.map((point) =>
          `${(point.x - paddedLeft) / width * 100}% ${(point.y - paddedTop) / height * 100}%`,
        ).join(', ')})`;
    } else {
      options.hitArea.style.display = 'none';
    }
    renderer.render(scene, camera);
  };

  const stop = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousFrame = 0;
  };

  const tick = (time: number) => {
    frame = null;
    if (disposed || contextLost || !visible || document.hidden) return;
    if (reducedMotion && !drag?.started) return;
    const delta = previousFrame === 0 ? 1 / 60 : (time - previousFrame) / 1000;
    previousFrame = time;
    if (!reducedMotion && !drag) {
      const { rotation } = physics.snapshot();
      const backVisible = 1 - 2 * (rotation.x ** 2 + rotation.y ** 2) < -0.97;
      const nextFace = choreography.tick(time, backVisible);
      if (nextFace) applyFace(nextFace);
    }
    if (drag?.started || physics.isMoving()) {
      physics.step(delta);
      render();
    }
    if (!reducedMotion || drag?.started) {
      if (frame === null) frame = requestAnimationFrame(tick);
    } else {
      previousFrame = 0;
    }
  };

  const start = () => {
    if (frame === null && !disposed && !contextLost && visible && !document.hidden &&
      (!reducedMotion || drag?.started)) {
      previousFrame = 0;
      frame = requestAnimationFrame(tick);
    }
  };

  const applyFace = (face: LanyardFace) => {
    currentFace = face;
    physics.setAmbientEnabled(!reducedMotion && face === 'front');
    physics.setFacing(face, reducedMotion);
    options.onFaceChange(face);
    render();
    start();
  };

  const flip = () => {
    if (disposed || contextLost) return;
    applyFace(choreography.toggle(performance.now()));
  };

  const resize = () => {
    const canvasRect = canvas.getBoundingClientRect();
    const { width, height } = canvasRect;
    const stageRect = options.stage.getBoundingClientRect();
    if (!width || !height || disposed || contextLost) return;
    if (!stageRect.height) return;
    pixelsPerWorldUnit = stageRect.height / STAGE_WORLD_HEIGHT;
    anchorScreenX = stageRect.left + stageRect.width / 2 - canvasRect.left;
    worldHeight = height / pixelsPerWorldUnit;
    worldWidth = width / pixelsPerWorldUnit;
    camera.aspect = width / height;
    camera.fov = 2 * Math.atan(worldHeight / (2 * cameraDistance)) * 180 / Math.PI;
    camera.position.set(
      (width / 2 - anchorScreenX) / pixelsPerWorldUnit,
      2.7 - worldHeight / 2,
      cameraDistance,
    );
    camera.lookAt(camera.position.x, camera.position.y, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const pixelRatio = getLanyardPixelRatio(window.devicePixelRatio || 1, width, height);
    const textureScale = Math.min(getBadgeTextureScale(pixelRatio), renderer.capabilities.maxTextureSize / ART_HEIGHT);
    if (badgeArtwork.setScale(textureScale)) {
      frontMaterial.map = badgeArtwork.texture;
      frontMaterial.needsUpdate = true;
    }
    if (backArtwork.setScale(textureScale)) {
      backMaterial.map = backArtwork.texture;
      backMaterial.emissiveMap = backArtwork.texture;
      backMaterial.needsUpdate = true;
    }
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    render();
  };

  const raycaster = new three.Raycaster();
  const pointer = new three.Vector2();
  const hitBadge = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(body)[0] ?? null;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (contextLost || drag || event.button !== 0) return;
    const hit = hitBadge(event);
    if (!hit) return;
    event.preventDefault();
    choreography.interact(performance.now());
    const origin = physics.snapshot().position;
    const grabOffset = hit.point.clone().sub(badge.position);
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin,
      lastPosition: origin,
      velocity: { x: 0, y: 0, z: 0 },
      grabOffset: { x: grabOffset.x, y: grabOffset.y, z: grabOffset.z },
      lastTime: event.timeStamp,
      started: false,
      moved: false,
    };
    options.hitArea.setPointerCapture(event.pointerId);
    options.hitArea.style.cursor = 'grabbing';
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!drag) {
      if (event.pointerType === 'mouse') {
        options.hitArea.style.cursor = !contextLost && hitBadge(event) ? 'grab' : 'default';
      }
      return;
    }
    if (event.pointerId !== drag.pointerId) return;
    if (!drag.started && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6) {
      drag.moved = true;
      if (reducedMotion) return;
      choreography.interact(performance.now());
      physics.startDrag();
      drag.started = true;
    }
    if (!drag.started) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const position = physics.moveDrag({
      x: drag.origin.x + (event.clientX - drag.startX) / rect.width * worldWidth,
      y: drag.origin.y - (event.clientY - drag.startY) / rect.height * worldHeight,
      z: drag.origin.z,
    });
    const delta = Math.max((event.timeStamp - drag.lastTime) / 1000, 1 / 120);
    drag.velocity = {
      x: Math.max(-4, Math.min(4, (position.x - drag.lastPosition.x) / delta)),
      y: Math.max(-4, Math.min(4, (position.y - drag.lastPosition.y) / delta)),
      z: 0,
    };
    drag.lastPosition = position;
    drag.lastTime = event.timeStamp;
    start();
  };

  const releaseDrag = (preserveMomentum = false) => {
    if (drag) {
      const current = drag;
      drag = null;
      const velocity = preserveMomentum ? current.velocity : { x: 0, y: 0, z: 0 };
      const angularVelocity = {
        x: Math.max(-1.2, Math.min(1.2, -velocity.y * 0.2)),
        y: Math.max(-1.2, Math.min(1.2, velocity.x * 0.25)),
        z: Math.max(-2.5, Math.min(2.5, (current.grabOffset.x * velocity.y - current.grabOffset.y * velocity.x) * 0.8)),
      };
      if (current.started) {
        physics.endDrag(velocity, angularVelocity);
        render();
      }
      if (options.hitArea.hasPointerCapture(current.pointerId)) options.hitArea.releasePointerCapture(current.pointerId);
    }
    options.hitArea.style.cursor = 'grab';
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const shouldFlip = event.type !== 'pointercancel' && !drag.moved;
    releaseDrag(event.type !== 'pointercancel' && event.timeStamp - drag.lastTime <= 90);
    if (shouldFlip) flip();
    else start();
  };

  const onPointerLeave = () => {
    if (!drag) options.hitArea.style.cursor = 'default';
  };

  const onLostPointerCapture = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    releaseDrag();
    start();
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      stop();
      releaseDrag();
    } else {
      choreography.resume(performance.now());
      start();
    }
  };

  const onWindowBlur = () => {
    releaseDrag();
    start();
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    stop();
    releaseDrag();
    options.onContextLost();
  };

  options.hitArea.addEventListener('pointerdown', onPointerDown);
  options.hitArea.addEventListener('pointermove', onPointerMove);
  options.hitArea.addEventListener('pointerup', onPointerUp);
  options.hitArea.addEventListener('pointercancel', onPointerUp);
  options.hitArea.addEventListener('pointerleave', onPointerLeave);
  options.hitArea.addEventListener('lostpointercapture', onLostPointerCapture);
  canvas.addEventListener('webglcontextlost', onContextLost);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('resize', resize);

  const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
  resizeObserver?.observe(canvas);
  resizeObserver?.observe(options.stage);
  const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
    if (disposed || contextLost) return;
    visible = entry.isIntersecting;
    if (!visible) {
      stop();
      releaseDrag();
    } else {
      choreography.resume(performance.now());
      start();
    }
  }, { threshold: 0.01 });
  intersectionObserver?.observe(canvas);

  if (!reducedMotion) {
    physics.startEntrance();
    physics.setAmbientEnabled(true);
  }
  resize();
  start();
  void document.fonts.ready.then(() => {
    if (!disposed && !contextLost) {
      badgeArtwork.draw();
      backArtwork.draw();
      render();
    }
  });

  return {
    setPortrait(image) {
      if (disposed || contextLost) return;
      badgeArtwork.setPortrait(image);
      render();
    },
    clearPortrait() {
      if (disposed || contextLost) return;
      badgeArtwork.clearPortrait();
      render();
    },
    setLogo(image) {
      if (disposed || contextLost) return;
      badgeArtwork.setLogo(image);
      backArtwork.setLogo(image);
      render();
    },
    setQr(image) {
      if (disposed || contextLost) return;
      backArtwork.setQr(image);
      render();
    },
    setQrUnavailable() {
      if (disposed || contextLost) return;
      backArtwork.setQrUnavailable();
      render();
    },
    flip,
    setReducedMotion(reduced) {
      if (reducedMotion === reduced || disposed) return;
      reducedMotion = reduced;
      choreography.setReducedMotion(reduced, performance.now());
      physics.setAmbientEnabled(!reduced && currentFace === 'front');
      if (reduced) {
        stop();
        releaseDrag();
        physics.finishEntrance();
        physics.setFacing(currentFace, true);
        render();
      } else start();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      releaseDrag();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      options.hitArea.removeEventListener('pointerdown', onPointerDown);
      options.hitArea.removeEventListener('pointermove', onPointerMove);
      options.hitArea.removeEventListener('pointerup', onPointerUp);
      options.hitArea.removeEventListener('pointercancel', onPointerUp);
      options.hitArea.removeEventListener('pointerleave', onPointerLeave);
      options.hitArea.removeEventListener('lostpointercapture', onLostPointerCapture);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('resize', resize);
      physics.dispose();
      resources.forEach((resource) => resource.dispose());
      renderer.dispose();
    },
  };
}
