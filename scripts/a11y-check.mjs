// Runs axe-core against the prerendered build (dist/) in several UI states.
// Usage: npm run build && npm run a11y
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';
import { preview } from 'vite';

const require = createRequire(import.meta.url);
const axeSource = require('axe-core').source;

const BROWSER_CANDIDATES = [
  process.env.BROWSER_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844, isMobile: true, hasTouch: true };

async function openPage(browser, url, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(url, { waitUntil: 'networkidle0' });
  // Scroll through the page so scroll-triggered reveals reach their final state.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 400));
  return page;
}

async function runAxe(page) {
  await page.evaluate(axeSource);
  return page.evaluate(
    (tags) =>
      window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] }),
    TAGS,
  );
}

const scenarios = [
  { name: 'Escritorio', viewport: DESKTOP },
  { name: 'Móvil', viewport: MOBILE },
  {
    name: 'Escritorio + modal abierto',
    viewport: DESKTOP,
    async setup(page) {
      const target = (await page.$('.project-card__button')) ?? (await page.$('.project-card'));
      await target.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await target.click();
      await new Promise((r) => setTimeout(r, 400));
    },
  },
  {
    name: 'Móvil + menú abierto',
    viewport: MOBILE,
    async setup(page) {
      await page.click('.menu-btn');
      await new Promise((r) => setTimeout(r, 500));
    },
  },
];

const browserPath = BROWSER_CANDIDATES.find((p) => existsSync(p));
if (!browserPath) throw new Error('No se encuentra Edge ni Chrome. Define BROWSER_PATH.');

const server = await preview({ preview: { port: 4174, strictPort: true }, logLevel: 'silent' });
const url = 'http://localhost:4174/';
const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });

const unique = new Map();
const review = new Map();
try {
  for (const scenario of scenarios) {
    const page = await openPage(browser, url, scenario.viewport);
    if (scenario.setup) await scenario.setup(page);
    const { violations, incomplete } = await runAxe(page);
    const nodes = violations.reduce((n, v) => n + v.nodes.length, 0);
    console.log(`\n## ${scenario.name}: ${violations.length} regla(s), ${nodes} elemento(s)`);
    for (const v of violations) {
      console.log(`- [${v.impact}] ${v.id} (${v.nodes.length}): ${v.help}`);
      for (const node of v.nodes) {
        const target = node.target.join(' ');
        console.log(`    · ${target}`);
        unique.set(`${v.id}|${target}`, v.id);
      }
    }
    for (const v of incomplete) {
      for (const node of v.nodes) {
        const target = node.target.join(' ');
        const reason = node.any.concat(node.all, node.none).find((c) => c.message)?.message ?? '';
        review.set(`${v.id}|${target}`, `${v.id} · ${target} · ${reason}`);
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}

if (review.size) {
  console.log(`\n## A revisar manualmente (axe no pudo decidir): ${review.size}`);
  for (const line of review.values()) console.log(`- ${line}`);
}

const rules = new Set(unique.values());
console.log(`\nTOTAL (sin duplicados entre escenarios): ${unique.size} incidencia(s) en ${rules.size} regla(s)`);
process.exitCode = unique.size > 0 ? 1 : 0;
