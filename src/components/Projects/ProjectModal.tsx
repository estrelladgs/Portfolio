import { useEffect } from 'react';
import { MARTA_VEGAS_YOUTUBE_ID } from '../../i18n/content';
import './ProjectModal.css';

interface ProjectItem {
  slug: string;
  title: string;
  description: string;
  roles: string[];
  image?: string;
  hasVideo?: boolean;
  repoUrl?: string;
  externalUrl?: string;
}

interface ProjectModalProps {
  project: ProjectItem;
  onClose: () => void;
  closeCue: string;
  repoCue: string;
}

export function ProjectModal({ project, onClose, closeCue, repoCue }: ProjectModalProps) {
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

  const linkUrl = project.repoUrl ?? project.externalUrl;

  return (
    <div className="project-modal" role="dialog" aria-modal="true" aria-label={project.title} onClick={onClose}>
      <div className="project-modal__panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="project-modal__close" onClick={onClose} aria-label={closeCue}>
          ✕
        </button>

        <div className="project-modal__media">
          {project.hasVideo && MARTA_VEGAS_YOUTUBE_ID ? (
            <div className="project-modal__video">
              <iframe
                src={`https://www.youtube.com/embed/${MARTA_VEGAS_YOUTUBE_ID}`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : project.image ? (
            <img src={project.image} alt={project.title} width={1200} height={800} />
          ) : (
            <div className="project-modal__code" aria-hidden="true">
              <span className="project-modal__code-mark">{'</>'}</span>
            </div>
          )}
        </div>

        <div className="project-modal__body">
          <h3 className="project-modal__title">{project.title}</h3>
          <p className="project-modal__desc">{project.description}</p>
          <ul className="project-modal__roles">
            {project.roles.map((role) => (
              <li key={role} className="mono-label">
                {role}
              </li>
            ))}
          </ul>
          {linkUrl && (
            <a className="project-modal__link mono-label" href={linkUrl} target="_blank" rel="noopener noreferrer">
              {project.repoUrl ? repoCue : project.title} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
