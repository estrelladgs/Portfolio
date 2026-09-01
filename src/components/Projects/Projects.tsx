import { useMemo, useState } from 'react';
import { useLang } from '../../context/LangContext';
import { useMode } from '../../context/ModeContext';
import type { ProjectCategory } from '../../i18n/content';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import './Projects.css';

export function Projects() {
  const { copy } = useLang();
  const { mode } = useMode();
  const { projects } = copy;

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const groups = useMemo(() => {
    const bySlug: Record<ProjectCategory, typeof projects.items> = { dev: [], content: [] };
    projects.items.forEach((item) => {
      bySlug[item.category].push(item);
    });
    const order: ProjectCategory[] = mode === 'dev' ? ['dev', 'content'] : ['content', 'dev'];
    return order.map((category) => ({
      category,
      label: category === 'dev' ? projects.groupDev : projects.groupContent,
      items: bySlug[category],
    }));
  }, [projects, mode]);

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

        {groups.map((group) => (
          <div className="projects__group" key={group.category}>
            <p className="projects__group-label mono-label">{group.label}</p>
            <div className="projects__grid">
              {group.items.map((item, i) => (
                <ProjectCard
                  key={item.slug}
                  item={item}
                  index={i}
                  dimmed={hoveredSlug !== null && hoveredSlug !== item.slug}
                  onHoverChange={(hovered) => setHoveredSlug(hovered ? item.slug : null)}
                  onOpen={() => setOpenSlug(item.slug)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {openProject && (
        <ProjectModal
          project={openProject}
          onClose={() => setOpenSlug(null)}
          closeCue={projects.closeCue}
          repoCue={projects.repoCue}
        />
      )}
    </section>
  );
}
