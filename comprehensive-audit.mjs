import { chromium } from 'playwright';

const testCases = [
  { name: 'Home', url: '/', viewports: [
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: '1366x768', width: 1366, height: 768 },
    { name: '375x812', width: 375, height: 812 },
  ]},
  { name: 'Work', url: '/work', viewports: [
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: '1366x768', width: 1366, height: 768 },
    { name: '834x1112', width: 834, height: 1112 },
  ]},
  { name: 'Contact', url: '/contact', viewports: [
    { name: '1366x768', width: 1366, height: 768 },
    { name: '375x812', width: 375, height: 812 },
  ]},
];

async function audit(browser, pageName, url, viewportName, viewport) {
  const page = await browser.newPage({ viewport });
  try {
    await page.goto(`http://localhost:3000${url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(500);

    const issues = await page.evaluate(() => {
      const findings = {
        headerFixed: false,
        navHidden: false,
        mobileMenuWorks: false,
        textClipped: 0,
        buttonTargetsSmall: 0,
        linearGradientText: 0,
      };

      // Check header
      const header = document.querySelector('.hd');
      if (header) {
        const style = window.getComputedStyle(header);
        findings.headerFixed = style.position === 'fixed';
      }

      // Check nav visibility
      const nav = document.querySelector('.hd__nav');
      if (nav) {
        const style = window.getComputedStyle(nav);
        findings.navHidden = style.display === 'none';
      }

      // Check mobile menu
      const mobileMenu = document.querySelector('.mm');
      if (mobileMenu) {
        findings.mobileMenuWorks = true;
      }

      // Count text overflow
      document.querySelectorAll('h1, h2, h3, p, button').forEach(el => {
        if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
          findings.textClipped++;
        }
      });

      // Check button target sizes
      document.querySelectorAll('button, a[role="button"]').forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.height < 40 || rect.width < 40) {
          findings.buttonTargetsSmall++;
        }
      });

      // Check for linear gradient text (design element)
      document.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.backgroundImage && style.backgroundImage.includes('gradient')) {
          if (style.backgroundClip === 'text' || style.webkitBackgroundClip === 'text') {
            findings.linearGradientText++;
          }
        }
      });

      return findings;
    });

    const allGood = !issues.textClipped && !issues.buttonTargetsSmall;
    const icon = allGood ? '✓' : '⚠️';
    console.log(`${icon} ${pageName.padEnd(12)} | ${viewportName.padEnd(12)} | Text: ${issues.textClipped} | Btns: ${issues.buttonTargetsSmall} | Header: ${issues.headerFixed}`);

    return issues;
  } catch (error) {
    console.log(`✗ ${pageName.padEnd(12)} | ${viewportName.padEnd(12)} | ERROR`);
    return null;
  } finally {
    await page.close();
  }
}

async function run() {
  const browser = await chromium.launch();

  console.log('\n🔬 DETAILED RESPONSIVE CHECK\n');
  console.log('Status | Page'.padEnd(25) + ' | Viewport | Issues');
  console.log('-'.repeat(70));

  for (const test of testCases) {
    for (const vp of test.viewports) {
      await audit(browser, test.name, test.url, vp.name, vp);
    }
  }

  await browser.close();
  console.log('\n✅ Audit complete\n');
}

run().catch(console.error);
