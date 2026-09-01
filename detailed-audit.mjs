import { chromium } from 'playwright';
import fs from 'fs';

const viewports = {
  'Desktop 1920x1080': { width: 1920, height: 1080 },
  'Desktop 2560x1440': { width: 2560, height: 1440 },
  'Laptop 1366x768': { width: 1366, height: 768 },
  'Laptop 1440x900': { width: 1440, height: 900 },
  'Laptop 1536x864': { width: 1536, height: 864 },
  'Tablet 768x1024': { width: 768, height: 1024 },
  'Tablet 834x1112': { width: 834, height: 1112 },
  'Mobile 360x800': { width: 360, height: 800 },
  'Mobile 375x812': { width: 375, height: 812 },
  'Mobile 390x844': { width: 390, height: 844 },
};

const pages = [
  { name: 'Home', url: '/' },
  { name: 'Work', url: '/work' },
  { name: 'Services', url: '/services' },
  { name: 'Contact', url: '/contact' },
  { name: 'Experience', url: '/experience' },
];

const issues = [];

async function audit(browser, page, url, viewportName, viewport) {
  const p = await browser.newPage({ viewport });
  try {
    await p.goto(`http://localhost:3000${url}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await p.waitForTimeout(500);

    const data = await p.evaluate(() => {
      const findings = {
        horizontalScroll: document.documentElement.scrollWidth > window.innerWidth + 1,
        bodyHeight: document.body.scrollHeight,
        viewportHeight: window.innerHeight,
        overflowingElements: [],
        textOverflowElements: [],
      };

      // Find elements with overflow
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          if (rect.right > window.innerWidth + 1 || rect.left < -1) {
            findings.overflowingElements.push({
              tag: el.tagName,
              class: el.className?.substring(0, 50),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
            });
          }
          // Check text overflow in common elements
          if (['H1', 'H2', 'H3', 'P', 'BUTTON', 'A', 'SPAN'].includes(el.tagName)) {
            if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
              findings.textOverflowElements.push({
                tag: el.tagName,
                text: el.textContent?.substring(0, 40),
              });
            }
          }
        }
      });

      return findings;
    });

    if (data.horizontalScroll) {
      issues.push({
        severity: 'P0-CRITICAL',
        page,
        viewport: viewportName,
        issue: 'Horizontal scroll',
        details: data.overflowingElements.slice(0, 2),
      });
    }

    if (data.textOverflowElements.length > 3) {
      issues.push({
        severity: 'P1-HIGH',
        page,
        viewport: viewportName,
        issue: `Text overflow in ${data.textOverflowElements.length} elements`,
      });
    }

    const status = data.horizontalScroll ? '❌ SCROLL' : (data.textOverflowElements.length > 3 ? '⚠️  TEXT' : '✓');
    console.log(`${page.padEnd(14)} | ${viewportName.padEnd(18)} | ${status}`);

  } catch (error) {
    console.log(`${page.padEnd(14)} | ${viewportName.padEnd(18)} | ERROR`);
  } finally {
    await p.close();
  }
}

async function run() {
  const browser = await chromium.launch();

  console.log('\n🔍 DETAILED RESPONSIVE AUDIT\n');
  console.log('Page'.padEnd(14) + ' | ' + 'Viewport'.padEnd(18) + ' | Issues');
  console.log('-'.repeat(65));

  for (const page of pages) {
    for (const [vname, vport] of Object.entries(viewports)) {
      await audit(browser, page.name, page.url, vname, vport);
    }
  }

  await browser.close();

  if (issues.length > 0) {
    console.log(`\n⚠️  Found ${issues.length} issues:\n`);
    issues.forEach(i => {
      console.log(`${i.severity} | ${i.page} @ ${i.viewport}`);
      console.log(`  └─ ${i.issue}`);
    });
  } else {
    console.log('\n✅ No critical responsive issues detected!');
  }
}

run().catch(console.error);
