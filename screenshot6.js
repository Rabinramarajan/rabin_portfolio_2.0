const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  
  // Get page height and scroll to 80% down to get to contact section
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate((h) => {
    window.scrollTo(0, h * 0.80);
  }, height);
  
  await page.waitForTimeout(2000);
  
  const screenshot = await page.screenshot({ path: "premium-contact-form.png", fullPage: false });
  console.log("Premium contact form screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
