const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  
  // Scroll to the contact inquiry section
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight * 8);
  });
  
  await page.waitForTimeout(2000);
  const screenshot = await page.screenshot({ path: "contact-form.png" });
  console.log("Contact form screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
