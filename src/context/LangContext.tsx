import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CONTENT, type Lang } from '../i18n/content';

interface LangContextValue {
  lang: Lang;
  copy: (typeof CONTENT)['es'];
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

function readInitialLang(): Lang {
  if (typeof document === 'undefined') return 'es';
  const attr = document.documentElement.getAttribute('data-lang');
  return attr === 'en' ? 'en' : 'es';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.setAttribute('data-lang', next);
    document.documentElement.setAttribute('lang', next);
    try {
      localStorage.setItem('eds:lang', next);
    } catch {
      /* storage unavailable */
    }
  }, []);

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
