import { useEffect, useRef } from 'react';

const LERP_FACTOR = 0.08;

/**
 * Listens for mouse/scroll on the #hero section (heroRef) but writes the
 * resulting --par-x/--par-y/--scroll-p custom properties onto a shared
 * ancestor (wrapperRef). #hero needs `perspective`, which creates its own
 * stacking context; writing the vars one level up lets the silhouette photo
 * (a sibling of #hero, stacked above the About section) inherit them too.
 */
export function useHeroEngine<TWrapper extends HTMLElement, THero extends HTMLElement>(reducedMotion: boolean) {
  const wrapperRef = useRef<TWrapper | null>(null);
  const heroRef = useRef<THero | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    const wrapperEl = wrapperRef.current;
    if (!heroEl || !wrapperEl) return;

    if (reducedMotion) {
      wrapperEl.style.setProperty('--par-x', '0');
      wrapperEl.style.setProperty('--par-y', '0');
      wrapperEl.style.setProperty('--scroll-p', '0');
      return;
    }

    const handleMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      target.current.x = Math.max(-1, Math.min(1, x));
      target.current.y = Math.max(-1, Math.min(1, y));
    };

    const handleLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * LERP_FACTOR;
      current.current.y += (target.current.y - current.current.y) * LERP_FACTOR;

      const scrollP = Math.max(0, Math.min(1, window.scrollY / window.innerHeight));

      wrapperEl.style.setProperty('--par-x', current.current.x.toFixed(4));
      wrapperEl.style.setProperty('--par-y', current.current.y.toFixed(4));
      wrapperEl.style.setProperty('--scroll-p', scrollP.toFixed(4));

      rafId.current = requestAnimationFrame(tick);
    };

    heroEl.addEventListener('mousemove', handleMove);
    heroEl.addEventListener('mouseleave', handleLeave);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      heroEl.removeEventListener('mousemove', handleMove);
      heroEl.removeEventListener('mouseleave', handleLeave);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [reducedMotion]);

  return { wrapperRef, heroRef };
}
