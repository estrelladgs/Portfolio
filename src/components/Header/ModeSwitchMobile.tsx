import { useMode } from '../../context/ModeContext';
import { useLang } from '../../context/LangContext';

export function ModeSwitchMobile() {
  const { mode, toggleMode } = useMode();
  const { copy } = useLang();

  return (
    <button
      type="button"
      className="mode-switch-mobile"
      role="switch"
      aria-checked={mode === 'content'}
      aria-label={`${copy.nav.modeDev} / ${copy.nav.modeContent}`}
      onClick={toggleMode}
    >
      <span className="mode-switch-mobile__track">
        <span className="mode-switch-mobile__knob" />
      </span>
    </button>
  );
}
