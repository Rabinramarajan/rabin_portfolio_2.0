const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });
  
  await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  
  // Scroll to middle of page where form should be
  await page.evaluate(() => {
    window.scrollBy(0, 1000);
  });
  
  await page.waitForTimeout(2000);
  
  const screenshot = await page.screenshot({ path: "premium-inquiry-form.png", fullPage: false });
  console.log("Premium inquiry form screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
