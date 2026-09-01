import { chromium } from 'playwright';

const criticalTests = [
  { page: 'Home', url: '/', viewport: { width: 1920, height: 1080 } },
  { page: 'Home', url: '/', viewport: { width: 375, height: 812 } },
  { page: 'Work', url: '/work', viewport: { width: 1366, height: 768 } },
  { page: 'Contact', url: '/contact', viewport: { width: 834, height: 1112 } },
];

async function validate(browser, page, url, viewport) {
  const p = await browser.newPage(viewport);
  try {
    await p.goto(`http://localhost:3000${url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    const issues = await p.evaluate(() => {
      const findings = {
        scrollOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        clippedContent: false,
        brokenNav: false,
        console_errors: [],
      };

      // Check for clipped content by looking at elements extending beyond viewport
      const clipped = [];
      document.querySelectorAll('main > *, body > section, body > div[role="region"]').forEach(el => {
        if (el.getBoundingClientRect().right > window.innerWidth + 5) {
          clipped.push(el.tagName);
        }
      });
      findings.clippedContent = clipped.length > 0;

      // Check nav exists and is accessible
      const nav = document.querySelector('nav, [role="navigation"], .hd');
      findings.brokenNav = !nav;

      return findings;
    });

    return issues;
  } catch (error) {
    return { error: error.message };
  } finally {
    await p.close();
  }
}

async function run() {
  const browser = await chromium.launch();

  console.log('\n🔍 VALIDATION CHECK\n');
  console.log('Test | Page | Viewport | Result');
  console.log('-'.repeat(70));

  let allPass = true;
  for (const test of criticalTests) {
    const result = await validate(browser, test.page, test.url, test.viewport);
    
    const pass = !result.scrollOverflow && !result.clippedContent && !result.brokenNav && !result.error;
    const status = pass ? '✅' : '❌';
    
    console.log(`${status} | ${test.page.padEnd(8)} | ${test.viewport.width}x${test.viewport.height} | ${pass ? 'PASS' : 'FAIL'}`);
    
    if (!pass) {
      allPass = false;
      if (result.scrollOverflow) console.log('   └─ Horizontal overflow detected');
      if (result.clippedContent) console.log('   └─ Content clipped');
      if (result.brokenNav) console.log('   └─ Navigation broken');
      if (result.error) console.log(`   └─ Error: ${result.error}`);
    }
  }

  await browser.close();

  console.log('-'.repeat(70));
  if (allPass) {
    console.log('\n✅ VALIDATION PASSED - No issues found\n');
  } else {
    console.log('\n❌ Issues detected - see above\n');
  }
}

run().catch(console.error);
