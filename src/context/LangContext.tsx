import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CONTENT, type Lang } from '../i18n/content';

interface LangContextValue {
  lang: Lang;
  copy: (typeof CONTENT)['es'];
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  // Always start in Spanish so the client matches the prerendered HTML;
  // a stored preference is applied right after hydration.
  const [lang, setLangState] = useState<Lang>('es');

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.setAttribute('lang', next);
    try {
      localStorage.setItem('eds:lang', next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem('eds:lang') === 'en') setLang('en');
    } catch {
      /* storage unavailable */
    }
  }, [setLang]);

  const toggleLang = useCallback(() => {
    setLang(lang === 'es' ? 'en' : 'es');
  }, [lang, setLang]);

  const value = useMemo(
    () => ({ lang, copy: CONTENT[lang], setLang, toggleLang }),
    [lang, setLang, toggleLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
