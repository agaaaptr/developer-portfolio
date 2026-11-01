export type LanyardFace = 'front' | 'back';

const IDLE_DELAY = 8000;
const HINT_DURATION = 500;

export function createLanyardChoreography(now: number) {
  let face: LanyardFace = 'front';
  let lastInteraction = now;
  let hintStarted: number | null = null;
  let hintVisibleAt: number | null = null;
  let manualBack = false;
  let reducedMotion = false;
  let interruptedAt: number | null = null;

  const holdCurrentFace = (time: number) => {
    lastInteraction = time;
    hintStarted = null;
    hintVisibleAt = null;
    manualBack = face === 'back';
  };

  const updateInterruption = (wasInterrupted: boolean, time: number) => {
    const interrupted = reducedMotion;
    if (!wasInterrupted && interrupted) {
      interruptedAt = time;
    } else if (wasInterrupted && !interrupted) {
      if (hintStarted !== null && interruptedAt !== null) {
        const interruption = Math.max(0, time - interruptedAt);
        hintStarted += interruption;
        if (hintVisibleAt !== null) hintVisibleAt += interruption;
      } else {
        lastInteraction = time;
      }
      interruptedAt = null;
    }
  };

  return {
    tick(time: number, backVisible = true): LanyardFace | null {
      if (reducedMotion || manualBack) return null;
      if (hintStarted !== null) {
        if (hintVisibleAt === null) {
          if (backVisible) hintVisibleAt = time;
          return null;
        }
        if (time - hintVisibleAt < HINT_DURATION) return null;
        lastInteraction = hintStarted;
        hintStarted = null;
        hintVisibleAt = null;
        face = 'front';
        return face;
      }
      if (time - lastInteraction < IDLE_DELAY) return null;
      hintStarted = time;
      face = 'back';
      return face;
    },
    toggle(time: number): LanyardFace {
      face = face === 'front' ? 'back' : 'front';
      holdCurrentFace(time);
      return face;
    },
    interact(time: number) {
      holdCurrentFace(time);
    },
    resume(time: number) {
      if (hintStarted !== null) {
        hintStarted = time;
        if (hintVisibleAt !== null) hintVisibleAt = time;
      } else {
        lastInteraction = time;
      }
    },
    setReducedMotion(value: boolean, time: number) {
      if (reducedMotion === value) return;
      const wasInterrupted = reducedMotion;
      reducedMotion = value;
      updateInterruption(wasInterrupted, time);
    },
  };
}
