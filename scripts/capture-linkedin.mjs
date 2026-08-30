import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const OUT = 'screenshots';
const W = 1920, H = 1080;

// order = LinkedIn carousel order
const shots = [
  { name: '01-hero',           path: '/' },
  { name: '02-projects',       path: '/work', text: 'Fiji Immigration Internal Management System', offset: 360 },
  { name: '03-experience',     path: '/experience', text: 'The turning points.', offset: 140 },
  { name: '04-skills',         path: '/skills', text: 'Engineering Knowledge Tree', offset: 140 },
  { name: '05-project-detail', path: '/work/fiji-immigration-internal' },
  { name: '06-process',        path: '/process', text: 'Interactive Process Map', offset: 120 },
  { name: '07-about',          path: '/about' },
  { name: '08-contact',        path: '/contact', scrollY: 420 },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();

for (const s of shots) {
  await page.goto(BASE + s.path, { waitUntil: 'networkidle', timeout: 120000 });
  // trigger lazy/scroll animations, then return to target
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  if (s.scrollY) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), s.scrollY);
    await page.waitForTimeout(1200);
  }

  if (s.text) {
    const el = page.getByText(s.text, { exact: false }).first();
    if (await el.count()) {
      await el.evaluate((n, off) => window.scrollTo({ top: n.getBoundingClientRect().top + window.scrollY - off, behavior: 'instant' }), s.offset ?? 120);
      await page.waitForTimeout(1500);
    }
  }

  // hide cursor + any custom cursor element
  const hide = ['*{cursor:none !important}', 'nextjs-portal,#__next-build-watcher,[data-nextjs-toast]{display:none !important}', s.text ? '.hd{display:none !important}' : ''].join(' ');
  await page.addStyleTag({ content: hide });
  await page.evaluate(() => document.querySelectorAll('nextjs-portal').forEach((n) => n.remove()));
  await page.mouse.move(-50, -50).catch(() => {});
  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  console.log('captured', s.name);
}

await browser.close();
console.log('done ->', fs.realpathSync(OUT));
