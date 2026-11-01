const MAX_RENDER_PIXELS = 6_000_000;

export function getLanyardPixelRatio(devicePixelRatio: number, width: number, height: number) {
  if (![devicePixelRatio, width, height].every((value) => Number.isFinite(value) && value > 0)) {
    throw new RangeError('Pixel ratio and canvas dimensions must be positive finite numbers');
  }

  return Math.min(devicePixelRatio, 2, Math.sqrt(MAX_RENDER_PIXELS / (width * height)));
}

export function getBadgeTextureScale(pixelRatio: number) {
  if (!Number.isFinite(pixelRatio) || pixelRatio <= 0) {
    throw new RangeError('Pixel ratio must be a positive finite number');
  }

  return Math.min(2, Math.max(1, Math.ceil(pixelRatio * 2) / 2));
}
