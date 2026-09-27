import { useEffect, useId, useRef } from 'react';
import { CONTENT, PLATFORM_LABELS, type LocalizedProject } from '../../i18n/content';
import { useScrollLock } from '../../hooks/useScrollLock';
import { ExternalLink } from '../ExternalLink/ExternalLink';
import { YouTubeFacade } from './YouTubeFacade';
import { Picture } from '../Picture/Picture';

// Panel is min(920px, 100vw - 40px) wide.
const MODAL_IMAGE_SIZES = '(max-width: 959px) calc(100vw - 40px), 920px';

/**
 * The media box is 16:9 by default. Images already framed between 16:10 and 16:9
 * keep their own ratio so object-fit: cover doesn't trim them.
 */
function mediaAspect(project: LocalizedProject): string | undefined {
  if (project.youtubeId || !project.image) return undefined;
  const ratio = project.image.img.w / project.image.img.h;
  return ratio >= 1.6 - 0.01 && ratio <= 16 / 9 ? `${project.image.img.w} / ${project.image.img.h}` : undefined;
}
import './ProjectModal.css';

interface ProjectModalProps {
  project: LocalizedProject;
  copy: (typeof CONTENT)['es']['projects'];
  onClose: () => void;
}

/**
 * Native modal <dialog>: showModal() makes the rest of the page inert, moves focus
 * inside, keeps Tab within the dialog and closes on Escape (firing `close`).
 */
export function ProjectModal({ project, copy, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useScrollLock(true);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = () => dialogRef.current?.close();

  // Native modals let Tab leave to the browser UI after the last control; keep it cycling inside.
  const trapTab = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab') return;
    const focusables = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const meta = [
    { label: copy.platformsLabel, values: project.platforms.map((p) => PLATFORM_LABELS[p]) },
    { label: copy.formatLabel, values: project.format.map((f) => copy.formats[f]) },
    { label: copy.toolsLabel, values: project.tools },
  ].filter((row) => row.values.length > 0);

  return (
    // A modal <dialog> is an interactive widget, not static content: the keydown handler keeps
    // Tab inside it, and the backdrop click has a keyboard equivalent (Escape, native to showModal).
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className="project-modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onKeyDown={trapTab}
      onClick={(e) => {
        // Clicks on the dialog's own box (outside the panel) act as a backdrop click.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="project-modal__panel">
        <button type="button" className="project-modal__close" onClick={close} aria-label={copy.closeCue}>
          ✕
        </button>

        <div className="project-modal__media" style={{ aspectRatio: mediaAspect(project) }}>
          {project.youtubeId ? (
            <YouTubeFacade
              videoId={project.youtubeId}
              title={`${copy.videoTitle}: ${project.title}`}
              playLabel={`${copy.playVideo}: ${project.title}`}
              poster={project.image}
              posterSizes={MODAL_IMAGE_SIZES}
            />
          ) : project.image ? (
            <Picture picture={project.image} sizes={MODAL_IMAGE_SIZES} alt={project.imageAlt ?? ''} />
          ) : (
            <div className="project-modal__placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="project-modal__body">
          <h2 id={titleId} className="project-modal__title">
            {project.title}
          </h2>
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
                  <h3 className="project-modal__highlight-title">
                    {h.title}
                    {h.status === 'en-progreso' && <span className="project-modal__status mono-label">{copy.inProgress}</span>}
                  </h3>
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
            <ExternalLink className="project-modal__link mono-label" href={project.externalUrl}>
              {copy.linkCue} <span aria-hidden="true">↗</span>
            </ExternalLink>
          )}
        </div>
      </div>
    </dialog>
  );
}
