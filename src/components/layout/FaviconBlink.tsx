'use client';

import { useEffect } from 'react';

// Draws the "AP_." icon (lime rounded square, black "AP", optional underscore bar)
// at the given pixel size and returns a PNG data URL. Matches the static favicon art.
function drawIcon(size: number, withUnderscore: boolean): string {
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
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(inset, inset, side, side, 22 * s);
  } else {
    ctx.beginPath();
    ctx.rect(inset, inset, side, side);
  }
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#000000';
  ctx.font = `900 ${92 * s}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('AP', size / 2, 122 * s);

  if (withUnderscore) {
    ctx.fillRect(54 * s, 134 * s, 72 * s, 10 * s);
  }

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
