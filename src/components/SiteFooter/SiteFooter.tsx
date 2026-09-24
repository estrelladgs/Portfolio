import { useLang } from '../../context/LangContext';
import './SiteFooter.css';

/** Page-level footer (contentinfo landmark), outside <main>. */
export function SiteFooter() {
  const { copy } = useLang();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span className="mono-label">{copy.contact.footerLeft}</span>
        <span className="mono-label">{copy.contact.footerRight}</span>
        <p className="visually-hidden">{copy.a11y.motionNotice}</p>
      </div>
    </footer>
  );
}
