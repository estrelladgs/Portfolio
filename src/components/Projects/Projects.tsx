import { useLayoutEffect, useRef, useState } from 'react';
import { useLang } from '../../context/LangContext';
import { useMode } from '../../context/ModeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Mode } from '../../i18n/content';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import './Projects.css';

const ORDER: Record<Mode, string[]> = {
  dev: ['lugna', 'foxbit', 'marta-vegas', 'xarxa-aitana'],
  content: ['marta-vegas', 'lugna', 'foxbit', 'xarxa-aitana'],
};

const AREA_BY_POSITION = ['featured', 'side-a', 'side-b', 'full'];

export function Projects() {
  const { copy } = useLang();
  const { mode } = useMode();
  const reducedMotion = useReducedMotion();
  const { projects } = copy;

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const prevRects = useRef<Record<string, DOMRect>>({});
  const isFirstRun = useRef(true);

  const order = ORDER[mode];
  const areaBySlug: Record<string, string> = {};
  order.forEach((slug, i) => {
    areaBySlug[slug] = AREA_BY_POSITION[i];
  });

  useLayoutEffect(() => {
    const newRects: Record<string, DOMRect> = {};
    Object.entries(cardRefs.current).forEach(([slug, el]) => {
      if (el) newRects[slug] = el.getBoundingClientRect();
    });

    if (!isFirstRun.current && !reducedMotion) {
      Object.entries(newRects).forEach(([slug, newRect]) => {
        const oldRect = prevRects.current[slug];
        const el = cardRefs.current[slug];
        if (oldRect && el) {
          const dx = oldRect.left - newRect.left;
          const dy = oldRect.top - newRect.top;
          if (dx || dy) {
            el.style.transition = 'none';
            el.style.transform = `translate(${dx}px, ${dy}px)`;
            // force reflow
            void el.getBoundingClientRect();
            requestAnimationFrame(() => {
              el.style.transition = 'transform 450ms var(--ease-io)';
              el.style.transform = '';
              window.setTimeout(() => {
                el.style.transition = '';
              }, 460);
            });
          }
        }
      });
    }

    isFirstRun.current = false;
    prevRects.current = newRects;
  }, [mode, reducedMotion]);

  const openProject = projects.items.find((p) => p.slug === openSlug) ?? null;

  return (
    <section id="proyectos" className="projects">
      <div className="container">
        <div className="projects__header">
          <div>
            <span className="section-index">{projects.index}</span>
            <h2 className="projects__heading">{projects.heading}</h2>
          </div>
          <span className="projects__counter mono-label">{projects.counter}</span>
        </div>

        <div className="projects__grid">
          {projects.items.map((item, i) => (
            <ProjectCard
              key={item.slug}
              item={item}
              index={i}
              area={areaBySlug[item.slug]}
              dimmed={hoveredSlug !== null && hoveredSlug !== item.slug}
              onHoverChange={(hovered) => setHoveredSlug(hovered ? item.slug : null)}
              onOpen={() => setOpenSlug(item.slug)}
              registerRef={(el) => {
                cardRefs.current[item.slug] = el;
              }}
              viewCue={projects.viewCue}
            />
          ))}
        </div>
      </div>

      {openProject && (
        <ProjectModal project={openProject} onClose={() => setOpenSlug(null)} closeCue={projects.closeCue} />
      )}
    </section>
  );
}
