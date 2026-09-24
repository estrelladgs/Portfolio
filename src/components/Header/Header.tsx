import { useEffect, useState } from 'react';
import { useLang } from '../../context/LangContext';
import { LangToggle } from './LangToggle';
import './Header.css';

const NAV_ITEMS: { key: 'about' | 'services' | 'projects' | 'contact'; href: string }[] = [
  { key: 'about', href: '#sobre-mi' },
  { key: 'services', href: '#servicios' },
  { key: 'projects', href: '#proyectos' },
  { key: 'contact', href: '#contacto' },
];

export function Header() {
  const { copy } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="site-header__inner">
          <a href="#hero" className="site-logo">
            EDS<span className="fx-accent">.</span>
          </a>

          <nav className="site-nav" aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => (
              <a key={item.key} href={item.href} className="site-nav__link">
                {copy.nav[item.key]}
              </a>
            ))}
          </nav>

          <div className="site-header__right">
            <div className="site-header__desktop-controls">
              <LangToggle />
            </div>
            <div className="site-header__mobile-controls">
              <button
                type="button"
                className="menu-btn"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className={`menu-btn__line${menuOpen ? ' is-open' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? ' is-open' : ''}`}>
        <nav aria-label="Navegación móvil">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.key}
              href={item.href}
              className="mobile-menu__link"
              style={{ transitionDelay: `${i * 60}ms` }}
              onClick={() => setMenuOpen(false)}
            >
              {copy.nav[item.key]}
            </a>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <LangToggle compact />
        </div>
      </div>
    </>
  );
}
