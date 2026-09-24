import { useState } from 'react';
import { useLang } from '../../context/LangContext';
import { track } from '../../lib/analytics';
import './Contact.css';

export function Contact() {
  const { lang, copy } = useLang();
  const { contact } = copy;
  const [copied, setCopied] = useState(false);

  const handleContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(contact.emailCta);
      setCopied(true);
      track('email_copy');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="contacto" className="contact">
      <div className="contact__glow fx-accent" aria-hidden="true" />
      <div className="container">
        <span className="section-index">{contact.index}</span>

        <h2 className="contact__heading">
          <span className="contact__heading-solid">{contact.headingSolid}</span>
          <span className="contact__heading-outline" data-label={contact.headingOutline}>
            {contact.headingOutline}
          </span>
        </h2>

        <div className="contact__row">
          <div className="contact__cta">
            <a
              href={`mailto:${contact.emailCta}`}
              className="pill-btn pill-btn--primary contact__email-btn"
              onContextMenu={handleContextMenu}
            >
              {contact.emailCta} ↗
            </a>
            {copied && <span className="contact__toast mono-label">{contact.copied}</span>}

            <div className="contact__cv">
              <span className="mono-label contact__cv-label">{contact.cvHeading}</span>
              <div className="contact__cv-buttons">
                <a
                  href={contact.cvHref}
                  className="pill-btn pill-btn--secondary"
                  download
                  onClick={() => track('cv_download', { lang })}
                >
                  {contact.cvButton}
                </a>
              </div>
            </div>
          </div>

          <ul className="contact__links">
            <li>
              <a
                href={contact.linkedin.href}
                target="_blank"
                rel="noreferrer"
                className="contact__link-row"
                onClick={() => track('linkedin_click')}
              >
                <span>{contact.linkedin.label}</span>
                <span className="contact__link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </div>

        <footer className="contact__footer">
          <span className="mono-label">{contact.footerLeft}</span>
          <span className="mono-label">{contact.footerRight}</span>
        </footer>
      </div>
    </section>
  );
}
