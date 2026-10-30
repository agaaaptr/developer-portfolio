'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import personalData from '@/data/personal.json';

function drawFront(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 768;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 768);

  // photo panel
  ctx.fillStyle = '#c6ff34';
  ctx.fillRect(24, 24, 464, 320);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.strokeRect(24, 24, 464, 320);

  // white silhouette (head + shoulders)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(256, 150, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(256, 262, 115, 78, 0, Math.PI, 0);
  ctx.fill();

  // "AP" initials over the silhouette
  ctx.fillStyle = '#000000';
  ctx.font = '900 72px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AP', 256, 180);

  // info
  ctx.fillStyle = '#000000';
  ctx.font = '900 60px Arial, Helvetica, sans-serif';
  ctx.fillText(personalData.professionalName, 256, 430);

  ctx.fillStyle = '#000000';
  ctx.font = '28px "Courier New", monospace';
  ctx.fillText(personalData.title, 256, 485);

  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.font = '20px "Courier New", monospace';
  ctx.fillText(personalData.location, 256, 525);

  // status chip
  ctx.fillStyle = '#7f3aed';
  const chipW = 200;
  const chipH = 44;
  ctx.fillRect(256 - chipW / 2, 570, chipW, chipH);
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(256 - chipW / 2, 570, chipW, chipH);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Arial, Helvetica, sans-serif';
  ctx.fillText('OPEN TO WORK', 256, 570 + chipH / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawBack(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 768;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 768);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.strokeRect(24, 24, 464, 720);

  ctx.fillStyle = '#000000';
  ctx.font = '900 110px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AP_', 256, 300);

  // barcode
  ctx.fillStyle = '#000000';
  for (let i = 0; i < 40; i++) {
    const x = 96 + i * 9;
    const h = i % 3 === 0 ? 70 : 110;
    ctx.fillRect(x, 520, 4, h);
  }

  ctx.font = '32px "Courier New", monospace';
  ctx.fillText(`@${personalData.socials.github}`, 256, 690);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function StaticCard() {
  return (
    <div className="mx-auto flex h-[400px] w-full max-w-[280px] flex-col overflow-hidden rounded-base border-2 border-ink bg-card shadow-neo">
      <div className="flex h-2/5 items-center justify-center bg-lime" aria-hidden="true">
        <span className="font-display text-5xl">AP</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 px-5">
        <p className="font-display text-xl uppercase">{personalData.professionalName}</p>
        <p className="font-mono text-xs uppercase text-ink/60">{personalData.title}</p>
        <p className="font-mono text-xs text-ink/50">{personalData.location}</p>
        <span className="mt-2 w-fit rounded-full border-2 border-ink bg-violet px-3 py-0.5 font-mono text-[10px] uppercase text-white">
          Open to work
        </span>
      </div>
    </div>
  );
}

export const IdCard = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFallback(true);
      return;
    }

    let hasGL = false;
    try {
      const probe = document.createElement('canvas');
      hasGL = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
    } catch {
      hasGL = false;
    }
    if (!hasGL) {
      setFallback(true);
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, -0.1, 4.3);

    const setSize = () => {
      const w = mount.clientWidth || 280;
      const h = mount.clientHeight || 400;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    // card shape: rounded rect with a punched hole
    const W = 1.2;
    const H = 1.8;
    const RAD = 0.1;
    const shape = new THREE.Shape();
    shape.moveTo(-W / 2 + RAD, -H / 2);
    shape.lineTo(W / 2 - RAD, -H / 2);
    shape.quadraticCurveTo(W / 2, -H / 2, W / 2, -H / 2 + RAD);
    shape.lineTo(W / 2, H / 2 - RAD);
    shape.quadraticCurveTo(W / 2, H / 2, W / 2 - RAD, H / 2);
    shape.lineTo(-W / 2 + RAD, H / 2);
    shape.quadraticCurveTo(-W / 2, H / 2, -W / 2, H / 2 - RAD);
    shape.lineTo(-W / 2, -H / 2 + RAD);
    shape.quadraticCurveTo(-W / 2, -H / 2, -W / 2 + RAD, -H / 2);
    const hole = new THREE.Path();
    hole.absarc(0, H / 2 - 0.16, 0.07, 0, Math.PI * 2, false);
    shape.holes.push(hole);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSize: 0.012,
      bevelThickness: 0.012,
      bevelSegments: 2,
      curveSegments: 24,
    });

    const frontTex = drawFront();
    const backTex = drawBack();
    const capMat = new THREE.MeshBasicMaterial({ map: frontTex });
    const sideMat = new THREE.MeshBasicMaterial({ color: '#000000' });
    // ExtrudeGeometry emits 2 material groups: 0 = both caps, 1 = side walls.
    const card = new THREE.Mesh(geometry, [capMat, sideMat]);

    const group = new THREE.Group();
    group.add(card);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.06, 0.02, 12, 24),
      new THREE.MeshBasicMaterial({ color: '#7f3aed' }),
    );
    ring.position.set(0, H / 2 - 0.16, 0.06);
    group.add(ring);

    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, H / 2 - 0.16, 0),
      new THREE.Vector3(0, H / 2 + 0.35, 0.03),
      new THREE.Vector3(-0.06, H / 2 + 0.75, 0),
      new THREE.Vector3(0, H / 2 + 1.25, -0.02),
    ]);
    const strap = new THREE.Mesh(
      new THREE.TubeGeometry(strapCurve, 32, 0.02, 8, false),
      new THREE.MeshBasicMaterial({ color: '#000000' }),
    );
    group.add(strap);

    scene.add(group);

    // interaction
    let rotX = 0;
    let rotY = 0;
    let velX = 0;
    let velY = 0;
    let dragging = false;
    let downX = 0;
    let downY = 0;
    let moved = 0;
    let downT = 0;
    let flipValue = 0;
    let flipFrom = 0;
    let flipTo = 0;
    let flipT = 1;
    let flipping = false;
    let mapSwapped = false;

    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      downX = e.clientX;
      downY = e.clientY;
      moved = 0;
      downT = performance.now();
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      moved += Math.abs(dx) + Math.abs(dy);
      velY = dx * 0.008;
      velX = dy * 0.006;
      rotY += dx * 0.008;
      rotX += dy * 0.006;
      rotX = Math.max(-0.5, Math.min(0.5, rotX));
      downX = e.clientX;
      downY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.releasePointerCapture(e.pointerId);
      if (moved < 6 && performance.now() - downT < 500) {
        const target = flipValue === 0 ? Math.PI : 0;
        flipFrom = flipValue;
        flipTo = target;
        flipValue = target;
        flipT = 0;
        flipping = true;
        mapSwapped = false;
      }
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);

      if (!dragging) {
        rotY += velY;
        rotX += velX;
        velY *= 0.95;
        velX *= 0.95;
      }
      if (flipping) {
        flipT += dt / 0.5;
        if (!mapSwapped && flipT >= 0.5) {
          // swap cap texture at the edge-on midpoint so the flip reveals the real back
          capMat.map = flipValue === 0 ? frontTex : backTex;
          capMat.needsUpdate = true;
          mapSwapped = true;
        }
        if (flipT >= 1) {
          flipT = 1;
          flipping = false;
        }
      }
      const eased = 1 - Math.pow(1 - flipT, 3);
      group.rotation.y = rotY + flipFrom + (flipTo - flipFrom) * eased;
      group.rotation.x = rotX;

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      geometry.dispose();
      frontTex.dispose();
      backTex.dispose();
      capMat.dispose();
      sideMat.dispose();
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
      strap.geometry.dispose();
      (strap.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  if (fallback) return <StaticCard />;

  return (
    <div
      ref={mountRef}
      className="h-[400px] w-full max-w-[280px]"
      aria-label="3D ID card — drag to rotate, click to flip"
    />
  );
};
