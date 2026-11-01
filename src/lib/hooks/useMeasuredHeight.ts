'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';

// Measures a ref's rendered height and tracks it through resizes so a wrapping
// motion element can animate its height without clipping the grid.
export function useMeasuredHeight<T extends HTMLElement>(ref: RefObject<T | null>, deps: unknown[]): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => setHeight(node.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return height;
}
