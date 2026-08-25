const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  
  await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  
  // Scroll down to find the inquiry form
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight * 2);
  });
  
  await page.waitForTimeout(2000);
  
  const screenshot = await page.screenshot({ path: "final-contact-form.png", fullPage: false });
  console.log("Final contact form screenshot saved");
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
