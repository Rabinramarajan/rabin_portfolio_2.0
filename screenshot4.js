const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  
  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  await page.waitForTimeout(2000);
  
  // Take screenshot of bottom section
  const screenshot = await page.screenshot({ path: "contact-bottom.png", fullPage: false });
  console.log("Bottom section screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
