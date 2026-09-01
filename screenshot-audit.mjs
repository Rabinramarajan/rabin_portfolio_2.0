import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const viewports = {
  'Desktop 1920x1080': { width: 1920, height: 1080 },
  'Laptop 1366x768': { width: 1366, height: 768 },
  'Tablet 834x1112': { width: 834, height: 1112 },
  'Mobile 375x812': { width: 375, height: 812 },
};

const pages = [
  { name: 'Home', url: '/' },
  { name: 'Work', url: '/work' },
];

const screenshotsDir = './responsive-screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function takeScreenshot(browser, pageName, url, viewportName, viewport) {
  const page = await browser.newPage({ viewport });
  try {
    await page.goto(`http://localhost:3000${url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(800);

    const filename = `${pageName.replace(/ /g, '_')}_${viewportName.replace(/ /g, '_')}.png`;
    const filepath = path.join(screenshotsDir, filename);
    
    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`✓ ${filename}`);
  } catch (error) {
    console.log(`✗ ${pageName} @ ${viewportName}: ${error.message.substring(0, 40)}`);
  } finally {
    await page.close();
  }
}

async function run() {
  const browser = await chromium.launch();

  console.log('\n📸 Taking screenshots...\n');

  for (const page of pages) {
    for (const [vname, vport] of Object.entries(viewports)) {
      await takeScreenshot(browser, page.name, page.url, vname, vport);
    }
  }

  await browser.close();
  console.log(`\n✅ Screenshots saved to: ${screenshotsDir}`);
}

run().catch(console.error);
