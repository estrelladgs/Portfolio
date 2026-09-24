import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Validates VITE_SITE_URL and emits robots.txt + sitemap.xml built from it. */
function seoFiles(url: string | undefined): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    buildStart() {
      if (!url || !/^https:\/\/[^/]+$/.test(url)) {
        throw new Error(`VITE_SITE_URL debe ser una URL https sin barra final (valor actual: "${url ?? ''}")`);
      }
    },
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          `  <url>\n    <loc>${url}/</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n` +
          '</urlset>\n',
      });
    },
  };
}

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), ...(isSsrBuild ? [] : [seoFiles(env.VITE_SITE_URL)])],
  };
});
