// Walks the prerendered build with the keyboard only (Tab / Shift+Tab / Enter / Space / Escape)
// and reports every stop where focus is lost, hidden, unmarked or covered by the fixed header.
// Usage: npm run build && npm run a11y:keyboard
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { preview } from 'vite';

const BROWSER = [
  process.env.BROWSER_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p));
if (!BROWSER) throw new Error('No se encuentra Edge ni Chrome. Define BROWSER_PATH.');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const problems = [];

/** Inspects document.activeElement after a key press. */
function inspect(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body || el === document.documentElement) return { lost: true };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const hasOutline = (s) => s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
    const card = el.closest('.project-card');
    const indicator =
      hasOutline(cs) ||
      cs.boxShadow !== 'none' ||
      (card && hasOutline(getComputedStyle(card))) ||
      el.tagName === 'IFRAME';
    // Covered = the topmost element at the focused element's top edge belongs to the fixed header.
    const header = document.querySelector('.site-header');
    const probeX = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1);
    const probeY = Math.min(Math.max(r.top + 2, 0), innerHeight - 1);
    const topmost = document.elementFromPoint(probeX, probeY);
    const coveredByHeader = !header.contains(el) && !!topmost && header.contains(topmost);
    const name = (el.getAttribute('aria-label') || el.textContent || el.title || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 50);
    return {
      name: `${el.tagName.toLowerCase()} "${name}"`,
      inViewport: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth,
      rendered: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && Number(cs.opacity) > 0,
      indicator,
      coveredByHeader,
    };
  });
}

async function press(page, key, shift = false) {
  if (shift) await page.keyboard.down('Shift');
  await page.keyboard.press(key);
  if (shift) await page.keyboard.up('Shift');
  // Wait for smooth scrolling (scroll-behavior: smooth) to settle before measuring.
  let last = -1;
  let stable = 0;
  for (let i = 0; i < 60 && stable < 4; i++) {
    await sleep(60);
    const y = await page.evaluate(() => scrollY);
    stable = y === last ? stable + 1 : 0;
    last = y;
  }
}

function check(label, step, s) {
  const issues = [];
  if (s.lost) issues.push('foco perdido (body)');
  else {
    if (!s.rendered) issues.push('elemento invisible');
    if (!s.inViewport) issues.push('fuera de pantalla');
    if (!s.indicator) issues.push('sin indicador de foco');
    if (s.coveredByHeader) issues.push('tapado por la cabecera fija');
  }
  if (issues.length) problems.push(`[${label}] paso ${step}: ${s.name ?? ''} → ${issues.join(', ')}`);
  return s;
}

/**
 * Tabs through the whole page forward, then back. Tabbing past the last control
 * leaves the document for the browser UI (reported as body): that marks the end, not a loss.
 */
async function walk(page, label) {
  const stops = [];
  for (let i = 0; i < 80; i++) {
    await press(page, 'Tab');
    const s = await inspect(page);
    if (s.lost && stops.length) break; // end of document
    check(`${label} Tab`, i + 1, s);
    stops.push(s.name);
  }
  for (let i = 0; i < stops.length; i++) {
    await press(page, 'Tab', true);
    check(`${label} Shift+Tab`, i + 1, await inspect(page));
  }
  return stops;
}

const server = await preview({ preview: { port: 4176, strictPort: true }, logLevel: 'silent' });
const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true });

try {
  // ---- Desktop ----
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4176/', { waitUntil: 'networkidle0' });

  const stops = await walk(page, 'Escritorio');
  console.log(`Escritorio: ${stops.length} paradas de Tab\n  ${stops.join('\n  ')}`);

  // Skip link: first Tab, Enter, next Tab lands inside <main>
  await page.goto('http://localhost:4176/', { waitUntil: 'networkidle0' });
  await press(page, 'Tab');
  await press(page, 'Enter');
  await press(page, 'Tab');
  const inMain = await page.evaluate(() => !!document.activeElement.closest('main'));
  console.log(`Skip link → siguiente Tab dentro de <main>: ${inMain}`);
  if (!inMain) problems.push('[Escritorio] el enlace de salto no lleva el foco a <main>');

  // Project dialog via keyboard: Enter opens, Tab cycles, Escape closes and returns focus
  for (const key of ['Enter', 'Space']) {
    await page.focus('.project-card__button');
    const opener = await page.evaluate(() => document.activeElement.textContent);
    await press(page, key);
    await sleep(200);
    const open = await page.evaluate(() => !!document.querySelector('dialog[open]'));
    for (let i = 0; i < 6; i++) {
      await press(page, 'Tab');
      const s = check(`Modal (${key}) Tab`, i + 1, await inspect(page));
      const inside = await page.evaluate(() => !!document.activeElement.closest('dialog'));
      if (!inside && !s.lost) problems.push(`[Modal] el foco salió del diálogo: ${s.name}`);
    }
    await press(page, 'Escape');
    await sleep(200);
    const back = await page.evaluate(() => document.activeElement.textContent);
    console.log(`Modal con ${key}: abre=${open}, Escape devuelve el foco a "${back}" (esperado "${opener}")`);
    if (!open || back !== opener) problems.push(`[Modal ${key}] apertura o retorno de foco incorrectos`);
  }

  // Copy email button with Space
  await page
    .browserContext()
    .overridePermissions('http://localhost:4176', ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
  const copyBtn = await page.evaluateHandle(() => document.querySelector('.contact__email-row button'));
  await copyBtn.focus();
  await press(page, 'Space');
  await sleep(200);
  console.log(`Copiar email con Espacio → aviso: "${await page.$eval('.contact__toast', (e) => e.textContent)}"`);

  // ---- Mobile ----
  const m = await browser.newPage();
  await m.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await m.goto('http://localhost:4176/', { waitUntil: 'networkidle0' });
  const mStops = await walk(m, 'Móvil');
  console.log(`Móvil: ${mStops.length} paradas de Tab`);

  await m.focus('.menu-btn');
  await press(m, 'Enter');
  await sleep(300);
  for (let i = 0; i < 8; i++) {
    await press(m, 'Tab');
    const s = check('Menú móvil Tab', i + 1, await inspect(m));
    const ok = await m.evaluate(() => !!document.activeElement.closest('.mobile-menu, .menu-btn'));
    if (!ok && !s.lost) problems.push(`[Menú móvil] el foco salió del menú: ${s.name}`);
  }
  await press(m, 'Escape');
  await sleep(300);
  const onBtn = await m.evaluate(() => document.activeElement === document.querySelector('.menu-btn'));
  console.log(`Menú móvil: Escape devuelve el foco al botón: ${onBtn}`);
  if (!onBtn) problems.push('[Menú móvil] Escape no devuelve el foco al botón');
} finally {
  await browser.close();
  await server.close();
}

console.log(
  problems.length ? `\n${problems.length} problema(s):\n- ${problems.join('\n- ')}` : '\nSin problemas de foco.',
);
process.exitCode = problems.length ? 1 : 0;
