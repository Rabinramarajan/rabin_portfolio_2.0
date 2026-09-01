import { chromium } from 'playwright';

const criticalBreakpoints = [
  { name: '3440x1440 (Ultrawide)', width: 3440, height: 1440 },
  { name: '2560x1440 (4K)', width: 2560, height: 1440 },
  { name: '1920x1080 (Desktop)', width: 1920, height: 1080 },
  { name: '1536x864 (14" Laptop)', width: 1536, height: 864 },
  { name: '1440x900 (15" Laptop)', width: 1440, height: 900 },
  { name: '1366x768 (HD Laptop)', width: 1366, height: 768 },
  { name: '834x1112 (iPad)', width: 834, height: 1112 },
  { name: '375x812 (iPhone)', width: 375, height: 812 },
  { name: '360x800 (Android)', width: 360, height: 800 },
];

async function verify(browser, name, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    const data = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      bodyHeight: document.body.scrollHeight,
      navWorking: !!document.querySelector('.hd'),
      footerVisible: !!document.querySelector('footer'),
    }));

    const status = data.overflow ? '❌ OVERFLOW' : '✅ OK';
    console.log(`${status} | ${name.padEnd(30)} | Height: ${data.bodyHeight}px`);
    return !data.overflow;
  } catch (error) {
    console.log(`⚠️  | ${name.padEnd(30)} | ERROR: ${error.message.substring(0, 30)}`);
    return false;
  } finally {
    await page.close();
  }
}

async function run() {
  const browser = await chromium.launch();

  console.log('\n🔍 FINAL RESPONSIVE VERIFICATION\n');
  console.log('Status | Viewport'.padEnd(40) + ' | Content Height');
  console.log('-'.repeat(75));

  let passCount = 0;
  for (const bp of criticalBreakpoints) {
    const passed = await verify(browser, bp.name, bp.width, bp.height);
    if (passed) passCount++;
  }

  await browser.close();

  console.log('-'.repeat(75));
  console.log(`\n✅ VERIFICATION COMPLETE: ${passCount}/${criticalBreakpoints.length} viewports pass\n`);
  
  if (passCount === criticalBreakpoints.length) {
    console.log('🎉 Portfolio is PRODUCTION-READY for responsive design!\n');
  }
}

run().catch(console.error);
