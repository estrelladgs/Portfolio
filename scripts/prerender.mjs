// Renders <App /> with the SSR bundle and injects the HTML into dist/index.html.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const PLACEHOLDER = '<!--app-html-->';
const htmlPath = resolve('dist/index.html');
const ssrDir = resolve('dist-ssr');

const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);
const template = readFileSync(htmlPath, 'utf8');

if (!template.includes(PLACEHOLDER)) {
  throw new Error(`No se encuentra ${PLACEHOLDER} en dist/index.html`);
}

writeFileSync(htmlPath, template.replace(PLACEHOLDER, render()));
rmSync(ssrDir, { recursive: true, force: true });
console.log('Prerenderizado: dist/index.html');
