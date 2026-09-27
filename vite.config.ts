import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';
import sharp from 'sharp';

/** Stable (unhashed) portrait URL for the JSON-LD Person image. */
const PERSON_IMAGE = 'estrella-dominguez.jpg';

/** Validates VITE_SITE_URL and emits robots.txt, sitemap.xml and the JSON-LD portrait. */
function seoFiles(url: string | undefined): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    buildStart() {
      if (!url || !/^https:\/\/[^/]+$/.test(url)) {
        throw new Error(`VITE_SITE_URL debe ser una URL https sin barra final (valor actual: "${url ?? ''}")`);
      }
    },
    async generateBundle() {
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
      this.emitFile({
        type: 'asset',
        fileName: PERSON_IMAGE,
        // The portrait is a transparent cut-out: flatten it on the same dark tone the site uses behind it.
        source: await sharp('src/assets/foto-estrella.png')
          .flatten({ background: '#1a1714' })
          .jpeg({ quality: 85, mozjpeg: true })
          .toBuffer(),
      });
    },
  };
}

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), imagetools(), ...(isSsrBuild ? [] : [seoFiles(env.VITE_SITE_URL)])],
  };
});
