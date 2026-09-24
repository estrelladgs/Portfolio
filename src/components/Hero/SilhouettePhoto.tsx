import { useLang } from '../../context/LangContext';
import './SilhouettePhoto.css';

export function SilhouettePhoto() {
  const { copy } = useLang();

  return (
    <figure className="silhouette">
      <span className="silhouette__shadow" aria-hidden="true" />
      <div className="silhouette__mask">
        <span className="silhouette__fill-base" aria-hidden="true" />
        <span className="silhouette__fill-accent fx-accent" aria-hidden="true" />
        <img
          className="silhouette__img silhouette__img--duotone"
          src="/assets/foto-estrella.png"
          alt={copy.a11y.portraitAlt}
          width={1200}
          height={1600}
          {...{ fetchpriority: 'high' }}
        />
        <img
          className="silhouette__img silhouette__img--color"
          src="/assets/foto-estrella.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1200}
          height={1600}
        />
        <span className="silhouette__gradient fx-accent" aria-hidden="true" />
      </div>
    </figure>
  );
}
