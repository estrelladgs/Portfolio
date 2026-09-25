import { useEffect, useRef } from 'react';

const LERP_FACTOR = 0.08;
const EPSILON = 0.001;

/**
 * Listens for mouse/scroll on the #hero section (heroRef) but writes the
 * resulting --par-x/--par-y/--scroll-p custom properties onto a shared
 * ancestor (wrapperRef). #hero needs `perspective`, which creates its own
 * stacking context; writing the vars one level up lets the silhouette photo
 * (a sibling of #hero, stacked above the About section) inherit them too.
 *
 * Work only happens on demand: a frame is scheduled when the pointer moves or
 * the page scrolls, the loop stops once the easing settles, and nothing runs
 * while #hero is off screen (IntersectionObserver).
 */
export function useHeroEngine<TWrapper extends HTMLElement, THero extends HTMLElement>(reducedMotion: boolean) {
  const wrapperRef = useRef<TWrapper | null>(null);
  const heroRef = useRef<THero | null>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    const wrapperEl = wrapperRef.current;
    if (!heroEl || !wrapperEl) return;

    const write = (x: number, y: number, scrollP: number) => {
      wrapperEl.style.setProperty('--par-x', x.toFixed(4));
      wrapperEl.style.setProperty('--par-y', y.toFixed(4));
      wrapperEl.style.setProperty('--scroll-p', scrollP.toFixed(4));
    };

    if (reducedMotion) {
      write(0, 0, 0);
      return;
    }

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let rafId: number | null = null;
    let visible = true;
    const scrollProgress = () => Math.max(0, Math.min(1, window.scrollY / window.innerHeight));

    const frame = () => {
      rafId = null;
      current.x += (target.x - current.x) * LERP_FACTOR;
      current.y += (target.y - current.y) * LERP_FACTOR;
      const settled = Math.abs(target.x - current.x) < EPSILON && Math.abs(target.y - current.y) < EPSILON;
      if (settled) {
        current.x = target.x;
        current.y = target.y;
      }
      write(current.x, current.y, scrollProgress());
      if (!settled && visible) rafId = requestAnimationFrame(frame);
    };

    const schedule = () => {
      if (rafId === null && visible) rafId = requestAnimationFrame(frame);
    };

    const handleMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      target.y = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
      schedule();
    };

    const handleLeave = () => {
      target.x = 0;
      target.y = 0;
      schedule();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        schedule();
      } else {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
        // Leave the scroll-driven vars at their final value for elements that stay on screen (the portrait).
        write(current.x, current.y, scrollProgress());
      }
    });

    heroEl.addEventListener('mousemove', handleMove);
    heroEl.addEventListener('mouseleave', handleLeave);
    window.addEventListener('scroll', schedule, { passive: true });
    observer.observe(heroEl);
    write(0, 0, scrollProgress());

    return () => {
      heroEl.removeEventListener('mousemove', handleMove);
      heroEl.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('scroll', schedule);
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return { wrapperRef, heroRef };
}
