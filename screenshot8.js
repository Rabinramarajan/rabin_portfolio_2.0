const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  
  // Click on the "Let's Work Together" button to navigate to contact
  await page.click("a:has-text('Let\\'s Work Together')");
  await page.waitForTimeout(2000);
  
  const screenshot = await page.screenshot({ path: "contact-form-premium.png", fullPage: false });
  console.log("Premium contact form screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
