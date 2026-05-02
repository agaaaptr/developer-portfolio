'use client';

import { useEffect, useState } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: ScrollDirection;
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 10, initialDirection = null } = options;

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(initialDirection);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const nextIsAtTop = currentScrollY < 50;

      setIsAtTop((previous) => (previous === nextIsAtTop ? previous : nextIsAtTop));

      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      const nextDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      setScrollDirection((previous) => (previous === nextDirection ? previous : nextDirection));
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return { scrollDirection, isAtTop };
}
