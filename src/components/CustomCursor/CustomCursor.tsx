import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useLang } from '../../context/LangContext';
import './CustomCursor.css';

const LERP_FACTOR = 0.18;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<'default' | 'view' | 'link'>('default');
  const reducedMotion = useReducedMotion();
  const { copy } = useLang();

  useEffect(() => {
    setEnabled(window.matchMedia('(pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let rafId: number;

    const handleMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      const el = e.target as HTMLElement;
      if (el.closest('[data-cursor="view"]')) setVariant('view');
      else if (el.closest('a, button')) setVariant('link');
      else setVariant('default');
    };

    const tick = () => {
      const factor = reducedMotion ? 1 : LERP_FACTOR;
      current.x += (target.x - current.x) * factor;
      current.y += (target.y - current.y) * factor;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafId);
    };
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <div ref={dotRef} className={`custom-cursor custom-cursor--${variant}`} aria-hidden="true">
      {variant === 'view' && <span className="custom-cursor__label">{copy.projects.viewCue}</span>}
    </div>
  );
}
