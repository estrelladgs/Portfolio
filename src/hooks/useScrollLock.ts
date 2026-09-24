import { useEffect } from 'react';

let locks = 0;

/** Locks page scroll while `active`. Ref-counted so overlapping overlays don't unlock each other. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    if (locks++ === 0) root.style.overflow = 'hidden';
    return () => {
      if (--locks === 0) root.style.overflow = '';
    };
  }, [active]);
}
