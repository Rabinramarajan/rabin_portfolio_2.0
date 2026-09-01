import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1366, height: 768 }
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: 'improved-1366x768.png', fullPage: false });
  
  console.log('✓ Screenshot captured: improved-1366x768.png');
  await browser.close();
})();
