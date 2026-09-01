import playwright from 'playwright';

const viewports = [
  { name: '15_6_FHD_1920x1080', width: 1920, height: 1080 },
  { name: '15_6_HD_1366x768', width: 1366, height: 768 },
  { name: '15_6_WXGA_1440x900', width: 1440, height: 900 },
];

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height }
    });
    
    await page.goto('http://localhost:3000', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    
    const heroHeight = await page.locator('#hero').evaluate(el => el.scrollHeight);
    const heroClient = await page.locator('#hero').evaluate(el => el.clientHeight);
    
    console.log(`${viewport.name}:`);
    console.log(`  scrollHeight: ${heroHeight}px, clientHeight: ${heroClient}px, viewport: ${viewport.height}px`);
    console.log(`  overflow: ${heroHeight > viewport.height ? 'YES (' + (heroHeight - viewport.height) + 'px)' : 'NO'}`);
    
    await page.screenshot({ path: `final-${viewport.name}.png`, fullPage: false });
    await page.close();
  }
  
  await browser.close();
})();
