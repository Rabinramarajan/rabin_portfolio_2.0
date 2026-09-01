import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const criticalViewports = [
  { name: 'Desktop 1920x1080', width: 1920, height: 1080 },
  { name: 'Desktop 2560x1440', width: 2560, height: 1440 },
  { name: 'Laptop 1366x768', width: 1366, height: 768 },
  { name: 'Laptop 1440x900', width: 1440, height: 900 },
  { name: 'Tablet 768x1024', width: 768, height: 1024 },
  { name: 'Tablet 834x1112', width: 834, height: 1112 },
  { name: 'Mobile 360x800', width: 360, height: 800 },
  { name: 'Mobile 375x812', width: 375, height: 812 },
];

const criticalPages = [
  { name: 'Home', url: '/' },
  { name: 'Work', url: '/work' },
  { name: 'Services', url: '/services' },
  { name: 'Contact', url: '/contact' },
];

const dir = './final-audit-screenshots';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function takeScreenshots() {
  const browser = await chromium.launch();

  console.log('\n📸 Taking final audit screenshots...\n');

  let count = 0;
  for (const page of criticalPages) {
    for (const vp of criticalViewports) {
      const p = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      try {
        await p.goto(`http://localhost:3000${page.url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await p.waitForTimeout(800);
        
        const filename = `${page.name}_${vp.name.replace(/ /g, '_')}.png`;
        const filepath = path.join(dir, filename);
        
        await p.screenshot({ path: filepath, fullPage: false });
        count++;
        if (count % 8 === 0) console.log(`  ✓ ${count} screenshots taken...`);
      } catch (error) {
        console.log(`  ✗ ${page.name} @ ${vp.name}`);
      } finally {
        await p.close();
      }
    }
  }

  await browser.close();
  console.log(`\n✅ Total: ${count} screenshots in ${dir}\n`);
}

takeScreenshots().catch(console.error);
