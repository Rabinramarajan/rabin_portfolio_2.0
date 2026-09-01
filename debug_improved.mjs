import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1366, height: 768 }
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  
  const heroHeight = await page.locator('#hero').evaluate(el => el.scrollHeight);
  const heroClient = await page.locator('#hero').evaluate(el => el.clientHeight);
  
  const profileVisible = await page.locator('.hero-visual').evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.display;
  });
  
  const heroShellWidth = await page.locator('.chero__shell').evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      maxWidth: computed.maxWidth,
      width: computed.width
    };
  });
  
  console.log(`Hero scrollHeight: ${heroHeight}px (viewport: 768px, overflow: ${heroHeight > 768 ? 'YES' : 'NO'})`);
  console.log(`Profile image display: ${profileVisible}`);
  console.log(`Shell styling:`, heroShellWidth);
  
  await browser.close();
})();
