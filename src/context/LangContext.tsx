import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { CONTENT, type Lang } from '../i18n/content';

interface LangContextValue {
  lang: Lang;
  copy: (typeof CONTENT)['es'];
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

/*
 * The chosen language lives in localStorage (an external store). useSyncExternalStore
 * renders the server snapshot ('es', matching the prerendered HTML) during hydration and
 * then switches to the stored value without a hydration mismatch or an extra effect.
 */
const STORAGE_KEY = 'eds:lang';
const listeners = new Set<() => void>();
// In-memory choice, so switching still works when storage is unavailable.
let chosen: Lang | null = null;

function readLang(): Lang {
  if (chosen) return chosen;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keep other tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      chosen = null;
      onChange();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function writeLang(next: Lang) {
  chosen = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage unavailable: the in-memory choice still applies */
  }
  listeners.forEach((listener) => listener());
}

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => 'es' as const);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => writeLang(next), []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'es' ? 'en' : 'es');
  }, [lang, setLang]);

  const value = useMemo(() => ({ lang, copy: CONTENT[lang], setLang, toggleLang }), [lang, setLang, toggleLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
