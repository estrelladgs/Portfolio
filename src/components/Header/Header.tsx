import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../context/LangContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { LangToggle } from './LangToggle';
import './Header.css';

const NAV_ITEMS: { key: 'about' | 'services' | 'projects' | 'contact'; href: string }[] = [
  { key: 'about', href: '#sobre-mi' },
  { key: 'services', href: '#servicios' },
  { key: 'projects', href: '#proyectos' },
  { key: 'contact', href: '#contacto' },
];

const MENU_ID = 'mobile-menu';
const FOCUSABLE = 'a[href], button:not([disabled])';

export function Header() {
  const { copy } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useScrollLock(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = (returnFocus: boolean) => {
    setMenuOpen(false);
    if (returnFocus) menuBtnRef.current?.focus();
  };

  useEffect(() => {
    if (!menuOpen) return;

    // Keep assistive tech and Tab out of the page behind the menu.
    const background = document.querySelectorAll<HTMLElement>('#main, .site-footer');
    background.forEach((el) => (el.inert = true));
    // Wait a frame: the menu is still visibility:hidden (unfocusable) in the commit frame.
    const focusFrame = requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(true);
        return;
      }
      if (e.key !== 'Tab') return;
      // Focus cycle: menu button + everything inside the menu.
      const items = [menuBtnRef.current, ...(menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])].filter(
        (el): el is HTMLElement => !!el,
      );
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (index <= 0 ? items.length - 1 : index - 1) : (index + 1) % items.length;
      e.preventDefault();
      items[next].focus();
    };

    // The menu only exists below 1024px; close it if the viewport grows past that.
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = () => desktop.matches && setMenuOpen(false);

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      cancelAnimationFrame(focusFrame);
      background.forEach((el) => (el.inert = false));
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
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
                ref={menuBtnRef}
                type="button"
                className="menu-btn"
                aria-expanded={menuOpen}
                aria-controls={MENU_ID}
                aria-label={menuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
                onClick={() => (menuOpen ? closeMenu(true) : setMenuOpen(true))}
              >
                <span className={`menu-btn__line${menuOpen ? ' is-open' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div id={MENU_ID} ref={menuRef} className={`mobile-menu${menuOpen ? ' is-open' : ''}`}>
        <nav aria-label="Navegación móvil">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.key}
              href={item.href}
              className="mobile-menu__link"
              style={{ transitionDelay: `${i * 60}ms` }}
              onClick={() => closeMenu(false)}
            >
              {copy.nav[item.key]}
            </a>
          ))}
          <div className="mobile-menu__footer">
            <LangToggle compact />
          </div>
        </nav>
      </div>
    </>
  );
}
