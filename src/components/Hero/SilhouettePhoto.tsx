import { useLang } from '../../context/LangContext';
import { Picture } from '../Picture/Picture';
// TODO_FOTO_PERFIL: sustituir por la foto en alta (mín. 840×1120, 3:4) y ampliar los anchos a 230;460;690;840.
// The current source is 500×500 with transparency, so widths are capped at 500 and the fallback stays PNG.
import portrait from '../../assets/foto-estrella.png?w=230;420;500&format=avif;webp;png&as=picture';
import './SilhouettePhoto.css';

// Box: 230px wide on mobile, 340px on tablet, 420px on desktop.
const PORTRAIT_SIZES = '(max-width: 767px) 230px, (max-width: 1023px) 340px, 420px';

export function SilhouettePhoto() {
  const { copy } = useLang();

  return (
    <figure className="silhouette">
      <span className="silhouette__shadow" aria-hidden="true" />
      <div className="silhouette__mask">
        <span className="silhouette__fill-base" aria-hidden="true" />
        <span className="silhouette__fill-accent fx-accent" aria-hidden="true" />
        <Picture
          picture={portrait}
          sizes={PORTRAIT_SIZES}
          className="silhouette__img silhouette__img--duotone"
          alt={copy.a11y.portraitAlt}
          highPriority
        />
        <Picture
          picture={portrait}
          sizes={PORTRAIT_SIZES}
          className="silhouette__img silhouette__img--color"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <span className="silhouette__gradient fx-accent" aria-hidden="true" />
      </div>
    </figure>
  );
}
