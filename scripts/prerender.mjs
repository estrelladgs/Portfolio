// Renders <App /> with the SSR bundle and injects the HTML into dist/index.html.
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const PLACEHOLDER = '<!--app-html-->';
const FONT_PLACEHOLDER = '<!--font-preload-->';
// The headline (LCP text) font; its hashed file name is only known after the build.
const PRELOAD_FONT = /^bricolage-grotesque-latin-opsz-normal-[\w-]+\.woff2$/;

const htmlPath = resolve('dist/index.html');
const ssrDir = resolve('dist-ssr');

const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);
let html = readFileSync(htmlPath, 'utf8');

if (!html.includes(PLACEHOLDER)) {
  throw new Error(`No se encuentra ${PLACEHOLDER} en dist/index.html`);
}
html = html.replace(PLACEHOLDER, render());

const font = readdirSync(resolve('dist/assets')).find((f) => PRELOAD_FONT.test(f));
if (!font) throw new Error('No se encuentra la fuente del titular para precargarla');
html = html.replace(FONT_PLACEHOLDER, `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`);

writeFileSync(htmlPath, html);
rmSync(ssrDir, { recursive: true, force: true });
console.log(`Prerenderizado: dist/index.html (precarga ${font})`);
