type ThreeModule = typeof import('three');

export function createBadgeCanvasTexture(three: ThreeModule, canvas: HTMLCanvasElement) {
  const baseWidth = canvas.width;
  const baseHeight = canvas.height;
  const createTexture = () => {
    const texture = new three.CanvasTexture(canvas);
    texture.colorSpace = three.SRGBColorSpace;
    return texture;
  };
  let texture = createTexture();
  let disposed = false;

  return {
    get texture() {
      return texture;
    },
    resize(scale: number) {
      if (disposed) throw new Error('Badge texture has already been disposed');
      if (!Number.isFinite(scale) || scale <= 0) throw new RangeError('Badge texture scale must be positive and finite');
      const width = Math.max(1, Math.floor(baseWidth * scale));
      const height = Math.max(1, Math.floor(baseHeight * scale));
      if (canvas.width === width && canvas.height === height) return false;
      canvas.width = width;
      canvas.height = height;
      const previous = texture;
      texture = createTexture();
      texture.anisotropy = previous.anisotropy;
      previous.dispose();
      return true;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      texture.dispose();
    },
  };
}
