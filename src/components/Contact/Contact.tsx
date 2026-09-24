import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../context/LangContext';
import { track } from '../../lib/analytics';
import { ExternalLink } from '../ExternalLink/ExternalLink';
import './Contact.css';

export function Contact() {
  const { lang, copy } = useLang();
  const { contact } = copy;
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<number | null>(null);

  const handleCopy = async () => {
    let status: 'copied' | 'failed' = 'failed';
    try {
      await navigator.clipboard.writeText(contact.emailCta);
      status = 'copied';
      track('email_copy');
    } catch {
      /* clipboard unavailable (e.g. insecure context or permission denied) */
    }
    setCopyStatus(status);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyStatus('idle'), 2500);
  };

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  const statusText = copyStatus === 'copied' ? contact.copied : copyStatus === 'failed' ? contact.copyFailed : '';

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
            <div className="contact__email-row">
              <a href={`mailto:${contact.emailCta}`} className="pill-btn pill-btn--primary contact__email-btn">
                {contact.emailCta} ↗
              </a>
              <button type="button" className="pill-btn pill-btn--secondary" onClick={handleCopy}>
                {contact.copyEmail}
              </button>
            </div>
            <span
              className={`contact__toast mono-label${statusText ? ' is-visible' : ''}`}
              role="status"
              aria-live="polite"
            >
              {statusText}
            </span>

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
              <ExternalLink
                href={contact.linkedin.href}
                className="contact__link-row"
                onClick={() => track('linkedin_click')}
              >
                <span>{contact.linkedin.label}</span>
                <span className="contact__link-arrow" aria-hidden="true">
                  ↗
                </span>
              </ExternalLink>
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
