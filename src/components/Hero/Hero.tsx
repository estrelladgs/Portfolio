import type { Ref } from 'react';
import { useLang } from '../../context/LangContext';
import { HERO_VIDEO_FRAME } from '../../i18n/content';
import { Picture } from '../Picture/Picture';
import './Hero.css';

interface HeroProps {
  heroRef: Ref<HTMLElement>;
}

export function Hero({ heroRef }: HeroProps) {
  const { copy } = useLang();
  const { hero } = copy;

  return (
    <section id="hero" className="hero" aria-label={copy.a11y.heroLabel} ref={heroRef}>
      <div className="hero__bg">
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__glow fx-accent" aria-hidden="true" />
        <div className="hero__outline" aria-hidden="true">
          {copy.outlineName}
        </div>
      </div>

      <div className="hero__stage">
        <div className="hero__copy">
          <p className="hero__eyebrow mono-label fx-accent reveal-line" style={{ animationDelay: '0ms' }}>
            {hero.eyebrow}
          </p>
          <h1 className="hero__h1">
            <span className="hero__h1-line reveal-line" style={{ animationDelay: '60ms' }}>
              <span className="hero__h1-mask">{hero.h1Line1}</span>
            </span>{' '}
            <span className="hero__h1-line hero__h1-line--accent fx-accent reveal-line" style={{ animationDelay: '120ms' }}>
              <span className="hero__h1-mask">{hero.h1Line2}</span>
            </span>
          </h1>
          <p className="hero__subtitle reveal-line" style={{ animationDelay: '180ms' }}>
            {hero.subtitle}
          </p>
          <div className="hero__actions reveal-line" style={{ animationDelay: '240ms' }}>
            <a href="#proyectos" className="pill-btn pill-btn--primary">
              {hero.ctaPrimary}
            </a>
            <a href="#contacto" className="pill-btn pill-btn--secondary">
              {hero.ctaSecondary}
            </a>
          </div>
        </div>

        {/* Decorative illustration (sample script and a video frame): hidden from assistive tech. */}
        <div className="hero__cards" aria-hidden="true">
          <article className="hero-card hero-card--a" style={{ animationDelay: '500ms' }}>
            <p className="hero-card__title mono-label">{hero.cardA.title}</p>
            <div className="hero-card__script">
              {hero.cardA.lines.map((line, i) => (
                <span
                  key={i}
                  className={`hero-card__script-line${i === hero.cardA.lines.length - 1 ? ' fx-accent hero-card__script-line--accent' : ''}`}
                >
                  {line}
                </span>
              ))}
            </div>
          </article>

          <article className="hero-card hero-card--b" style={{ animationDelay: '590ms' }}>
            <p className="hero-card__title mono-label">{hero.cardB.title}</p>
            <div className="hero-card__image-slot">
              {/* Above the fold on desktop: eager. The cards are hidden below 1024px, so nothing loads there. */}
              <Picture picture={HERO_VIDEO_FRAME} sizes="290px" alt="" hiddenBelow={1024} />
              <span className="hero-card__image-label mono-label">{hero.cardB.slot}</span>
            </div>
          </article>
        </div>
      </div>

      <a href="#sobre-mi" className="hero__scroll-cue mono-label">
<span aria-hidden="true">↓</span> {hero.scroll}
      </a>
    </section>
  );
}
