import { useLang } from '../../context/LangContext';
import type { Lang } from '../../i18n/content';

// Language names are given in their own language (and tagged with lang) so they
// are read correctly whatever the current UI language is.
const OPTIONS: { lang: Lang; short: string; name: string }[] = [
  { lang: 'es', short: 'ES', name: 'Español' },
  { lang: 'en', short: 'EN', name: 'English' },
];

export function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, copy } = useLang();

  return (
    <div
      className={`lang-toggle${compact ? ' lang-toggle--compact' : ''}`}
      role="group"
      aria-label={copy.a11y.langGroup}
    >
      {OPTIONS.map((option, i) => (
        <span key={option.lang} className="lang-toggle__item">
          {i > 0 && (
            <span className="lang-toggle__sep" aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            lang={option.lang}
            aria-label={option.name}
            aria-pressed={lang === option.lang}
            className={lang === option.lang ? 'is-active' : ''}
            onClick={() => setLang(option.lang)}
          >
            {option.short}
          </button>
        </span>
      ))}
    </div>
  );
}
