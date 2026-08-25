const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });
  
  await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  
  // Scroll to show full form section
  await page.evaluate(() => {
    window.scrollBy(0, 800);
  });
  
  await page.waitForTimeout(1500);
  
  const screenshot = await page.screenshot({ path: "full-premium-contact.png", fullPage: false });
  console.log("Full premium contact screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
