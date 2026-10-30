'use client';

import { useEffect } from 'react';

// Draws the "AP._" icon (lime rounded square, merged "AP" monogram, "._" suffix
// where the dot blinks like a terminal cursor). Returns a PNG data URL.
function drawIcon(size: number, withDot: boolean): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const s = size / 180;

  ctx.fillStyle = '#c6ff34';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6 * s;
  const inset = 6 * s;
  const side = size - inset * 2;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(inset, inset, side, side, 22 * s);
  } else {
    ctx.rect(inset, inset, side, side);
  }
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#000000';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  // merged "AP" monogram (P overlaps A's right stroke)
  const apFont = `900 ${66 * s}px Arial, Helvetica, sans-serif`;
  ctx.font = apFont;
  const aW = ctx.measureText('A').width;
  const pW = ctx.measureText('P').width;
  const overlap = aW * 0.22;
  const apW = aW + pW - overlap;

  // suffix "._" (dot toggles, underscore static)
  const sufFont = `900 ${44 * s}px Arial, Helvetica, sans-serif`;
  ctx.font = sufFont;
  const dotW = ctx.measureText('.').width;
  const usW = ctx.measureText('_').width;
  const gap = 8 * s;
  const suffixW = (withDot ? dotW + 2 * s : 0) + usW;

  const totalW = apW + gap + suffixW;
  let x = (size - totalW) / 2;
  const y = size / 2;

  ctx.font = apFont;
  ctx.fillText('A', x, y);
  ctx.fillText('P', x + aW - overlap, y);
  x += apW + gap;

  ctx.font = sufFont;
  if (withDot) {
    ctx.fillText('.', x, y);
    x += dotW + 2 * s;
  }
  ctx.fillText('_', x, y);

  return canvas.toDataURL('image/png');
}

export const FaviconBlink = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const frames = [drawIcon(64, true), drawIcon(64, false)];
    let i = 0;

    const apply = () => {
      let link = document.querySelector<HTMLLinkElement>('link#favicon-blink');
      if (!link) {
        link = document.createElement('link');
        link.id = 'favicon-blink';
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = frames[i % 2];
      i += 1;
    };

    apply();
    const interval = setInterval(() => {
      if (document.hidden) return;
      apply();
    }, 500);

    return () => {
      clearInterval(interval);
      document.querySelector('link#favicon-blink')?.remove();
    };
  }, []);

  return null;
};
