import { useHeroEngine } from '../../hooks/useHeroEngine';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Hero } from '../Hero/Hero';
import { SilhouettePhoto } from '../Hero/SilhouettePhoto';
import { About } from '../About/About';
import './HeroAbout.css';

export function HeroAbout() {
  const reducedMotion = useReducedMotion();
  const { wrapperRef, heroRef } = useHeroEngine<HTMLDivElement, HTMLElement>(reducedMotion);

  return (
    <div className="hero-about" ref={wrapperRef}>
      <Hero heroRef={heroRef} />
      <SilhouettePhoto />
      <About />
    </div>
  );
}
