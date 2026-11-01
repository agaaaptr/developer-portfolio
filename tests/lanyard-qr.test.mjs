import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import jsQR from 'jsqr';
import sharp from 'sharp';

test('the existing QR remains decodable at representative badge widths', async () => {
  const source = await readFile(new URL('../public/images/qr-links.png', import.meta.url));
  const qr = await sharp(source).resize(780, 780, { kernel: 'nearest' }).png().toBuffer();
  const badge = await sharp({
    create: { width: 960, height: 1500, channels: 4, background: '#000000' },
  }).composite([{ input: qr, left: 90, top: 530 }]).png().toBuffer();
  for (const width of [176, 240, 480]) {
    const { data, info } = await sharp(badge)
      .resize({ width, kernel: 'lanczos3' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const pixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
    assert.equal(jsQR(pixels, info.width, info.height)?.data, 'https://aga-putra.vercel.app/links', `${width}px badge`);
  }
});
