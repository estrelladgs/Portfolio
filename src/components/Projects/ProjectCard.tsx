import { useEffect, useRef, useState, type Ref } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { LocalizedProject } from '../../i18n/content';
import { Picture } from '../Picture/Picture';

// Grid: 1 column on mobile (22px gutters), 2 up to 1279px, then 3–4 columns of at most ~400px.
const CARD_IMAGE_SIZES = '(max-width: 767px) calc(100vw - 44px), (max-width: 1279px) 50vw, 400px';

interface ProjectCardProps {
  item: LocalizedProject;
  index: number;
  tagLabels: string[];
  viewCaseLabel: string;
  buttonRef: Ref<HTMLButtonElement>;
  dimmed: boolean;
  onHoverChange: (hovered: boolean) => void;
  onOpen: () => void;
}

export function ProjectCard({
  item,
  index,
  tagLabels,
  viewCaseLabel,
  buttonRef,
  dimmed,
  onHoverChange,
  onOpen,
}: ProjectCardProps) {
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

  // Eases the tilt towards the pointer; frames only run until it settles, so a still pointer costs nothing.
  const tick = () => {
    const c = current.current;
    const t = target.current;
    c.rx += (t.rx - c.rx) * 0.18;
    c.ry += (t.ry - c.ry) * 0.18;
    c.sx += (t.sx - c.sx) * 0.18;
    c.sy += (t.sy - c.sy) * 0.18;
    const settled = [c.rx - t.rx, c.ry - t.ry, c.sx - t.sx, c.sy - t.sy].every((d) => Math.abs(d) < 0.01);
    if (settled) current.current = { ...t };
    const el = elRef.current;
    if (el) {
      el.style.setProperty('--tilt-x', `${current.current.rx.toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${current.current.ry.toFixed(2)}deg`);
      el.style.setProperty('--shadow-x', `${current.current.sx.toFixed(1)}px`);
      el.style.setProperty('--shadow-y', `${current.current.sy.toFixed(1)}px`);
    }
    rafId.current = settled ? null : requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (rafId.current === null) rafId.current = requestAnimationFrame(tick);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    target.current = { rx: y * -4, ry: x * 6, sx: -x * 14, sy: -y * 10 };
    schedule();
  };

  const handleEnter = () => onHoverChange(true);

  const handleLeave = () => {
    onHoverChange(false);
    target.current = { rx: 0, ry: 0, sx: 0, sy: 0 };
    if (!reducedMotion) schedule();
  };

  return (
    <article
      ref={elRef}
      className={`project-card${dimmed ? ' is-dimmed' : ''}${inView ? ' is-in-view' : ''}`}
      style={{ transitionDelay: `${index * 70}ms` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor="view"
    >
      <div className="project-card__media">
        {item.image ? (
          <Picture
            picture={item.image}
            sizes={CARD_IMAGE_SIZES}
            alt=""
            loading="lazy"
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
          <h3 className="project-card__title">
            {/* Stretched button: its ::after covers the whole card, so the card stays clickable. */}
            <button ref={buttonRef} type="button" className="project-card__button" aria-haspopup="dialog" onClick={onOpen}>
              <span className="project-card__title-text">{item.title}</span>
              <span className="visually-hidden">, {viewCaseLabel}</span>
            </button>
          </h3>
          <span className="project-card__index mono-label" aria-hidden="true">
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
