const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("http://localhost:3000/#inquiry", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  const screenshot = await page.screenshot({ path: "contact-section.png" });
  console.log("Screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
