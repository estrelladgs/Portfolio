import type { Ref } from 'react';
import { useLang } from '../../context/LangContext';
import { useMode } from '../../context/ModeContext';
import './Hero.css';

const BARS_A = [40, 60, 45, 80, 55, 70, 95];

interface HeroProps {
  heroRef: Ref<HTMLElement>;
}

export function Hero({ heroRef }: HeroProps) {
  const { copy } = useLang();
  const { mode } = useMode();
  const hero = copy.hero[mode];

  return (
    <section id="hero" className="hero" aria-label="Presentación" ref={heroRef}>
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
              <span key={`l1-${mode}`} className="hero__h1-mask">
                {hero.h1Line1}
              </span>
            </span>
            <span className="hero__h1-line hero__h1-line--accent fx-accent reveal-line" style={{ animationDelay: '120ms' }}>
              <span key={`l2-${mode}`} className="hero__h1-mask">
                {hero.h1Line2}
              </span>
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

        <div className="hero__cards" key={mode}>
          <article className="hero-card hero-card--a" style={{ animationDelay: '500ms' }}>
            <p className="hero-card__title mono-label">{hero.cardA.title}</p>
            <div className="hero-card__code">
              {hero.cardA.lines.map((line, i) => (
                <span
                  key={i}
                  className={`hero-card__code-line${i === hero.cardA.lines.length - 1 ? ' fx-accent hero-card__code-line--accent' : ''}`}
                >
                  {line}
                </span>
              ))}
            </div>
          </article>

          <article className="hero-card hero-card--b" style={{ animationDelay: '590ms' }}>
            <p className="hero-card__title mono-label">{hero.cardB.title}</p>
            <div className="hero-card__image-slot">
              <img
                src={mode === 'dev' ? '/assets/lugna-mockup-1.jpg' : '/assets/marta-vegas-frame.jpg'}
                alt=""
                loading="lazy"
                width={290}
                height={180}
              />
              <span className="hero-card__image-label mono-label">{hero.cardB.slot}</span>
            </div>
          </article>

          <article className="hero-card hero-card--c" style={{ animationDelay: '680ms' }}>
            <p className="hero-card__title mono-label">{hero.cardC.title}</p>
            <div className="hero-card__bars">
              {BARS_A.map((h, i) => (
                <span
                  key={i}
                  className={`hero-card__bar${i === BARS_A.length - 1 ? ' fx-accent hero-card__bar--accent' : ''}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </article>
        </div>
      </div>

      <a href="#sobre-mi" className="hero__scroll-cue mono-label">
        ↓ {hero.scroll}
      </a>
    </section>
  );
}
