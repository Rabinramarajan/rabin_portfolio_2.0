import { chromium } from 'playwright';

const problematicViewports = [
  { name: '14" Laptop', width: 1536, height: 864 },
  { name: '15.6" Laptop', width: 1440, height: 900 },
  { name: '13" Laptop', width: 1366, height: 768 },
];

async function diagnose(browser, name, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(500);

    const issues = await page.evaluate(() => {
      const findings = {
        heroHeight: 0,
        heroOverflowing: false,
        contentBelowHero: [],
        overlappingElements: [],
      };

      // Check hero section
      const hero = document.querySelector('.chero, .hero, [class*="hero"]');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        findings.heroHeight = Math.round(rect.height);
        findings.heroOverflowing = rect.bottom > window.innerHeight * 1.5;
      }

      // Check for absolutely positioned elements that might overlap
      document.querySelectorAll('[style*="position: absolute"], [style*="position:absolute"], .chero__quote, [class*="absolute"]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.height > 0 && rect.width > 0) {
          findings.overlappingElements.push({
            class: el.className,
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            height: Math.round(rect.height),
          });
        }
      });

      // Check main content sections
      const sections = document.querySelectorAll('main > section, main > div, [role="region"]');
      sections.forEach((sec, i) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.2) {
          findings.contentBelowHero.push({
            index: i,
            tag: sec.tagName,
            top: Math.round(rect.top),
          });
        }
      });

      return findings;
    });

    console.log(`\n📊 ${name} (${width}x${height})`);
    console.log(`  Hero Height: ${issues.heroHeight}px`);
    console.log(`  Overflowing: ${issues.heroOverflowing ? '❌ YES' : '✅ NO'}`);
    console.log(`  Content sections near fold: ${issues.contentBelowHero.length}`);
    if (issues.overlappingElements.length > 0) {
      console.log(`  Absolutely positioned elements: ${issues.overlappingElements.length}`);
      issues.overlappingElements.forEach(el => {
        console.log(`    - ${el.class} (top: ${el.top}, bottom: ${el.bottom})`);
      });
    }

    return issues;
  } catch (error) {
    console.log(`\n❌ ${name}: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function run() {
  const browser = await chromium.launch();
  console.log('\n🔍 DIAGNOSING OVERLAP ISSUES\n');

  for (const vp of problematicViewports) {
    await diagnose(browser, vp.name, vp.width, vp.height);
  }

  await browser.close();
}

run().catch(console.error);
