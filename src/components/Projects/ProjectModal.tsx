import { useEffect } from 'react';
import { CONTENT, PLATFORM_LABELS, type LocalizedProject } from '../../i18n/content';
import './ProjectModal.css';

interface ProjectModalProps {
  project: LocalizedProject;
  copy: (typeof CONTENT)['es']['projects'];
  onClose: () => void;
}

export function ProjectModal({ project, copy, onClose }: ProjectModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const meta = [
    { label: copy.platformsLabel, values: project.platforms.map((p) => PLATFORM_LABELS[p]) },
    { label: copy.formatLabel, values: project.format.map((f) => copy.formats[f]) },
    { label: copy.toolsLabel, values: project.tools },
  ].filter((row) => row.values.length > 0);

  return (
    <div className="project-modal" role="dialog" aria-modal="true" aria-label={project.title} onClick={onClose}>
      <div className="project-modal__panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="project-modal__close" onClick={onClose} aria-label={copy.closeCue}>
          ✕
        </button>

        <div className="project-modal__media">
          {project.youtubeId ? (
            <div className="project-modal__video">
              <iframe
                src={`https://www.youtube.com/embed/${project.youtubeId}`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : project.image ? (
            <img src={project.image} alt={project.title} width={1200} height={800} />
          ) : (
            <div className="project-modal__placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="project-modal__body">
          <h3 className="project-modal__title">{project.title}</h3>
          <p className="project-modal__desc">{project.summary}</p>

          <ul className="project-modal__roles">
            {project.tags.map((tag) => (
              <li key={tag} className="mono-label">
                {copy.disciplines[tag]}
              </li>
            ))}
          </ul>

          {project.highlights.length > 0 && (
            <ul className="project-modal__highlights">
              {project.highlights.map((h) => (
                <li key={h.title}>
                  <h4 className="project-modal__highlight-title">
                    {h.title}
                    {h.status === 'en-progreso' && <span className="project-modal__status mono-label">{copy.inProgress}</span>}
                  </h4>
                  <p>{h.text}</p>
                </li>
              ))}
            </ul>
          )}

          {meta.length > 0 && (
            <dl className="project-modal__meta">
              {meta.map((row) => (
                <div key={row.label}>
                  <dt className="mono-label">{row.label}</dt>
                  <dd>{row.values.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.externalUrl && (
            <a className="project-modal__link mono-label" href={project.externalUrl} target="_blank" rel="noopener noreferrer">
              {copy.linkCue} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
