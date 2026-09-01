import { useLang } from '../../context/LangContext';

export function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();

  return (
    <div className={`lang-toggle${compact ? ' lang-toggle--compact' : ''}`} role="group" aria-label="Idioma / Language">
      <button type="button" aria-pressed={lang === 'es'} className={lang === 'es' ? 'is-active' : ''} onClick={() => setLang('es')}>
        ES
      </button>
      <span className="lang-toggle__sep">/</span>
      <button type="button" aria-pressed={lang === 'en'} className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>
        EN
      </button>
    </div>
  );
}
