const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  
  // Scroll to near the end but not quite footer
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate((h) => {
    window.scrollTo(0, h * 0.92);
  }, height);
  
  await page.waitForTimeout(2000);
  
  const screenshot = await page.screenshot({ path: "contact-inquiry-form.png", fullPage: false });
  console.log("Contact inquiry form screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
