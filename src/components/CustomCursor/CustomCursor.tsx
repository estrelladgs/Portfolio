import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useLang } from '../../context/LangContext';
import './CustomCursor.css';

const LERP_FACTOR = 0.18;
const POINTER_QUERY = '(pointer: fine) and (hover: hover)';

/**
 * Decorative follower dot. It never replaces the system cursor: it only renders
 * for fine, hover-capable pointers and is off when reduced motion is requested.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const [variant, setVariant] = useState<'default' | 'view' | 'link'>('default');
  const reducedMotion = useReducedMotion();
  const { copy } = useLang();
  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    const mq = window.matchMedia(POINTER_QUERY);
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    // Frames only run while the dot is catching up with the pointer; a still pointer costs nothing.
    let rafId: number | null = null;

    const tick = () => {
      current.x += (target.x - current.x) * LERP_FACTOR;
      current.y += (target.y - current.y) * LERP_FACTOR;
      const settled = Math.abs(target.x - current.x) < 0.1 && Math.abs(target.y - current.y) < 0.1;
      if (settled) {
        current.x = target.x;
        current.y = target.y;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = settled ? null : requestAnimationFrame(tick);
    };

    const handleMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (rafId === null) rafId = requestAnimationFrame(tick);

      const el = e.target as HTMLElement;
      if (el.closest('[data-cursor="view"]')) setVariant('view');
      else if (el.closest('a, button')) setVariant('link');
      else setVariant('default');
    };

    window.addEventListener('mousemove', handleMove);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={dotRef} className={`custom-cursor custom-cursor--${variant}`} aria-hidden="true">
      {variant === 'view' && <span className="custom-cursor__label">{copy.projects.viewCue}</span>}
    </div>
  );
}
