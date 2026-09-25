import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
// Self-hosted fonts (font-display: swap; unicode-range means only the latin file is downloaded).
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/ibm-plex-sans/wght.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/global.css';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// In production the HTML is prerendered (scripts/prerender.mjs); in dev the root is empty.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
