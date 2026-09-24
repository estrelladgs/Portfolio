import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Fails the client build early if VITE_SITE_URL is missing or malformed. */
function siteUrl(url: string | undefined): Plugin {
  return {
    name: 'site-url',
    apply: 'build',
    buildStart() {
      if (!url || !/^https:\/\/[^/]+$/.test(url)) {
        throw new Error(`VITE_SITE_URL debe ser una URL https sin barra final (valor actual: "${url ?? ''}")`);
      }
    },
  };
}

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), ...(isSsrBuild ? [] : [siteUrl(env.VITE_SITE_URL)])],
  };
});
