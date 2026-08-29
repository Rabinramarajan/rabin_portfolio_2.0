import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [375, 768, 1024]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 }, isMobile: w<768 });
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const m = await p.evaluate(() => {
    const L = s => { const e=document.querySelector(s); return e? +e.getBoundingClientRect().left.toFixed(1):null; };
    return { logo: L('header a'), eyebrow: L('#services div'), card1: L('#services ul li'),
             docW: document.documentElement.scrollWidth, win: innerWidth };
  });
  console.log(w, JSON.stringify(m));
  await p.close();
}
await b.close();
