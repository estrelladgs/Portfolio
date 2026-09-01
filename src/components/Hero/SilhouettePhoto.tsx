import './SilhouettePhoto.css';

export function SilhouettePhoto() {
  return (
    <figure className="silhouette" aria-hidden="false">
      <span className="silhouette__shadow" aria-hidden="true" />
      <div className="silhouette__mask">
        <span className="silhouette__fill-base" aria-hidden="true" />
        <span className="silhouette__fill-accent fx-accent" aria-hidden="true" />
        <img
          className="silhouette__img silhouette__img--duotone"
          src="/assets/foto-estrella.png"
          alt="Retrato de Estrella Domínguez Sánchez"
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
      <img
        className="silhouette__overflow"
        src="/assets/foto-estrella.png"
        alt=""
        aria-hidden="true"
        width={1200}
        height={1600}
        loading="lazy"
      />
    </figure>
  );
}
