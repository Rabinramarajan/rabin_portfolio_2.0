import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1366, height: 768 }
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  
  // Check if CTA buttons are in viewport
  const buttonText = await page.locator('text=View My Work').isVisible();
  const actionsBox = await page.locator('.chero__actions').evaluate(el => {
    return {
      visible: el.offsetHeight > 0,
      height: el.scrollHeight,
      top: el.offsetTop
    };
  });
  
  console.log(`View My Work button visible: ${buttonText}`);
  console.log(`Actions element:`, actionsBox);
  
  // Scroll down and check what else is visible
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(300);
  
  const heroHeight = await page.locator('#hero').evaluate(el => el.scrollHeight);
  console.log(`Hero total height: ${heroHeight}px`);
  
  await page.screenshot({ path: 'improved-scrolled.png', fullPage: false });
  console.log(`Screenshot taken after scroll`);
  
  await browser.close();
})();
