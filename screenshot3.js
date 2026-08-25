const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  
  // Find and scroll to inquiry section
  await page.evaluate(() => {
    const inquiry = document.getElementById("inquiry");
    if (inquiry) {
      inquiry.scrollIntoView({ behavior: "instant", block: "start" });
    }
  });
  
  await page.waitForTimeout(2000);
  const screenshot = await page.screenshot({ path: "contact-inquiry.png", fullPage: false });
  console.log("Contact inquiry screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
