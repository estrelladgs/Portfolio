import { useRef, useState } from 'react';
import { useMode } from '../../context/ModeContext';
import { useLang } from '../../context/LangContext';

export function ModeToggle() {
  const { mode, toggleMode, setMode } = useMode();
  const { copy } = useLang();
  const [squash, setSquash] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleSelect = (next: 'dev' | 'content') => {
    if (next === mode) return;
    setMode(next);
    setSquash(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setSquash(false), 420);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      toggleMode();
      setSquash(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setSquash(false), 420);
    }
  };

  return (
    <div className="mode-toggle" role="tablist" aria-label="Modo del portfolio" data-active={mode} onKeyDown={handleKeyDown}>
      <span className={`mode-toggle__thumb${squash ? ' squash' : ''}`} aria-hidden="true" />
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'dev'}
        tabIndex={mode === 'dev' ? 0 : -1}
        className={`mode-toggle__tab${mode === 'dev' ? ' is-active' : ''}`}
        onClick={() => handleSelect('dev')}
      >
        {copy.nav.modeDev}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'content'}
        tabIndex={mode === 'content' ? 0 : -1}
        className={`mode-toggle__tab${mode === 'content' ? ' is-active' : ''}`}
        onClick={() => handleSelect('content')}
      >
        {copy.nav.modeContent}
      </button>
    </div>
  );
}
