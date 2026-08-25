const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  
  // Get page height and scroll to 70% down
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate((h) => {
    window.scrollTo(0, h * 0.65);
  }, height);
  
  await page.waitForTimeout(2000);
  
  const screenshot = await page.screenshot({ path: "contact-form-final.png", fullPage: false });
  console.log("Contact form screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
