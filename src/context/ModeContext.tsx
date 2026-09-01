import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Mode } from '../i18n/content';

interface ModeContextValue {
  mode: Mode;
  isSwitching: boolean;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

function readInitialMode(): Mode {
  if (typeof document === 'undefined') return 'dev';
  const attr = document.documentElement.getAttribute('data-mode');
  return attr === 'content' ? 'content' : 'dev';
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(readInitialMode);
  const [isSwitching, setIsSwitching] = useState(false);

  const setMode = useCallback((next: Mode) => {
    setModeState((current) => {
      if (current === next) return current;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReduced) {
        document.documentElement.setAttribute('data-mode', next);
        try {
          localStorage.setItem('eds:mode', next);
        } catch {
          /* storage unavailable */
        }
        return next;
      }

      setIsSwitching(true);
      document.documentElement.classList.add('mode-switching');

      window.setTimeout(() => {
        document.documentElement.setAttribute('data-mode', next);
        try {
          localStorage.setItem('eds:mode', next);
        } catch {
          /* storage unavailable */
        }
      }, 300);

      window.setTimeout(() => {
        document.documentElement.classList.remove('mode-switching');
        setIsSwitching(false);
      }, 600);

      return next;
    });
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'dev' ? 'content' : 'dev');
  }, [mode, setMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, []);

  const value = useMemo(() => ({ mode, isSwitching, setMode, toggleMode }), [mode, isSwitching, setMode, toggleMode]);

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
