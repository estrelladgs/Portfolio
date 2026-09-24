import { useMemo, useState } from 'react';
import { useLang } from '../../context/LangContext';
import { getProjects } from '../../i18n/content';
import { track } from '../../lib/analytics';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import './Projects.css';

export function Projects() {
  const { lang, copy } = useLang();
  const { projects } = copy;
  const items = useMemo(() => getProjects(lang), [lang]);

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const openProject = items.find((p) => p.slug === openSlug) ?? null;

  const handleOpen = (slug: string) => {
    setOpenSlug(slug);
    track('case_view', { slug });
  };

  return (
    <section id="proyectos" className="projects">
      <div className="container">
        <div className="projects__header">
          <div>
            <span className="section-index">{projects.index}</span>
            <h2 className="projects__heading">{projects.heading}</h2>
          </div>
          <span className="projects__counter mono-label">
            {String(items.length).padStart(2, '0')} / {projects.counterSuffix}
          </span>
        </div>

        <div className="projects__grid">
          {items.map((item, i) => (
            <ProjectCard
              key={item.slug}
              item={item}
              index={i}
              tagLabels={item.tags.map((tag) => projects.disciplines[tag])}
              dimmed={hoveredSlug !== null && hoveredSlug !== item.slug}
              onHoverChange={(hovered) => setHoveredSlug(hovered ? item.slug : null)}
              onOpen={() => handleOpen(item.slug)}
            />
          ))}
        </div>
      </div>

      {openProject && <ProjectModal project={openProject} copy={projects} onClose={() => setOpenSlug(null)} />}
    </section>
  );
}
