import { chromium } from 'playwright';

const viewports = [
  { name: '14" Laptop', width: 1536, height: 864 },
  { name: '15.6" Laptop', width: 1440, height: 900 },
];

async function verify(browser, name, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(600);

    // Take screenshot of above-fold content
    await page.screenshot({ path: `./overlap-check-${name.replace(/"/g, '').replace(/ /g, '_')}.png`, fullPage: false });

    // Check for actual content visibility issues
    const issues = await page.evaluate(() => {
      const findings = {
        heroBelowFold: false,
        firstSectionVisible: false,
        hasOverlap: false,
      };

      const hero = document.querySelector('.chero, .hero');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        findings.heroBelowFold = rect.bottom < 0;
      }

      const firstSection = document.querySelector('main > section:not(.chero), main > div:not(.chero)');
      if (firstSection) {
        const rect = firstSection.getBoundingClientRect();
        findings.firstSectionVisible = rect.top < window.innerHeight;
        
        // Check if it's overlapping with header
        const header = document.querySelector('.hd, header, [role="banner"]');
        if (header) {
          const headerRect = header.getBoundingClientRect();
          if (rect.top < headerRect.bottom + 10 && rect.top > 0) {
            findings.hasOverlap = true;
          }
        }
      }

      return findings;
    });

    const status = issues.hasOverlap ? '❌ OVERLAP' : '✅ OK';
    console.log(`${status} | ${name.padEnd(15)} | First section visible: ${issues.firstSectionVisible}`);
  } catch (error) {
    console.log(`⚠️  ${name}: ${error.message.substring(0, 40)}`);
  } finally {
    await page.close();
  }
}

async function run() {
  const browser = await chromium.launch();
  console.log('\n🔍 VISUAL OVERLAP CHECK\n');

  for (const vp of viewports) {
    await verify(browser, vp.name, vp.width, vp.height);
  }

  await browser.close();
  console.log('\n✅ Screenshots saved for manual inspection\n');
}

run().catch(console.error);
