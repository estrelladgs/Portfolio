import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { LocalizedProject } from '../../i18n/content';

interface ProjectCardProps {
  item: LocalizedProject;
  index: number;
  tagLabels: string[];
  dimmed: boolean;
  onHoverChange: (hovered: boolean) => void;
  onOpen: () => void;
}

export function ProjectCard({ item, index, tagLabels, dimmed, onHoverChange, onOpen }: ProjectCardProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const rafId = useRef<number | null>(null);
  const target = useRef({ rx: 0, ry: 0, sx: 0, sy: 0 });
  const current = useRef({ rx: 0, ry: 0, sx: 0, sy: 0 });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
  }, []);

  const startLoop = () => {
    if (rafId.current !== null) return;
    const tick = () => {
      current.current.rx += (target.current.rx - current.current.rx) * 0.18;
      current.current.ry += (target.current.ry - current.current.ry) * 0.18;
      current.current.sx += (target.current.sx - current.current.sx) * 0.18;
      current.current.sy += (target.current.sy - current.current.sy) * 0.18;
      const el = elRef.current;
      if (el) {
        el.style.setProperty('--tilt-x', `${current.current.rx.toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${current.current.ry.toFixed(2)}deg`);
        el.style.setProperty('--shadow-x', `${current.current.sx.toFixed(1)}px`);
        el.style.setProperty('--shadow-y', `${current.current.sy.toFixed(1)}px`);
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
  };

  const stopLoop = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    target.current.rx = y * -4;
    target.current.ry = x * 6;
    target.current.sx = -x * 14;
    target.current.sy = -y * 10;
  };

  const handleEnter = () => {
    onHoverChange(true);
    if (!reducedMotion) startLoop();
  };

  const handleLeave = () => {
    onHoverChange(false);
    target.current = { rx: 0, ry: 0, sx: 0, sy: 0 };
    if (!reducedMotion) {
      window.setTimeout(stopLoop, 520);
    }
  };

  return (
    <article
      ref={elRef}
      className={`project-card${dimmed ? ' is-dimmed' : ''}${inView ? ' is-in-view' : ''}`}
      style={{ transitionDelay: `${index * 70}ms` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onOpen}
      data-cursor="view"
    >
      <div className="project-card__media">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            width={1200}
            height={800}
            className="project-card__img"
          />
        ) : (
          <div className="project-card__placeholder" aria-hidden="true" />
        )}
        {item.youtubeId && (
          <span className="project-card__play" aria-hidden="true">
            ▶
          </span>
        )}
      </div>
      <div className="project-card__body">
        <div className="project-card__heading-row">
          <h3 className="project-card__title">{item.title}</h3>
          <span className="project-card__index mono-label">
            {String(index + 1).padStart(2, '0')} ↗
          </span>
        </div>
        <p className="project-card__desc">{item.summary}</p>
        <ul className="project-card__roles">
          {tagLabels.map((label) => (
            <li key={label} className="mono-label">
              {label}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
