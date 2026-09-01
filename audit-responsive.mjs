import { chromium } from 'playwright';

const viewports = {
  'Desktop 1920x1080': { width: 1920, height: 1080 },
  'Laptop 1366x768': { width: 1366, height: 768 },
  'Tablet 834x1112': { width: 834, height: 1112 },
  'Mobile 375x812': { width: 375, height: 812 },
};

const pages = [
  { name: 'Home', url: '/' },
  { name: 'Work', url: '/work' },
  { name: 'Services', url: '/services' },
];

async function test() {
  const browser = await chromium.launch();

  console.log('\n📱 RESPONSIVE AUDIT\n');
  console.log('Page'.padEnd(12) + ' | ' + 'Viewport'.padEnd(18) + ' | Status');
  console.log('-'.repeat(60));

  for (const page of pages) {
    for (const [viewportName, viewport] of Object.entries(viewports)) {
      const p = await browser.newPage({ viewport });
      try {
        await p.goto(`http://localhost:3000${page.url}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
        const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        console.log(`${page.name.padEnd(12)} | ${viewportName.padEnd(18)} | ${overflow ? '❌' : '✓'}`);
      } catch (e) {
        console.log(`${page.name.padEnd(12)} | ${viewportName.padEnd(18)} | ⚠️`);
      } finally {
        await p.close();
      }
    }
  }

  await browser.close();
}

test().catch(console.error);
