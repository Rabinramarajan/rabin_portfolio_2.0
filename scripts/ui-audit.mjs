/**
 * Rendered-UI audit: drives the built site and reports what static analysis
 * cannot see — horizontal overflow, broken images, missing alt text, heading
 * order, undersized touch targets, dead internal links, unsafe external links
 * and console errors, across 12 viewports from 320px to 1920px.
 *
 *   npx next build && npx next start -p 3100
 *   node scripts/ui-audit.mjs            # BASE=... to point elsewhere
 *
 * Note: served outside Vercel, /_vercel/insights and /_vercel/speed-insights
 * 404 and show up under CONSOLE. That is a local artefact, not a site defect.
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE || "http://localhost:3100";
const ROUTES = [
  "/", "/work", "/work/fiji-immigration-internal", "/services",
  "/services/angular-development", "/services/mobile-app-development",
  "/services/web-application-development", "/experience", "/skills",
  "/process", "/pricing", "/insights", "/insights/signals", "/contact",
  "/resume", "/freelance-angular-developer", "/not-a-real-page",
];
const VIEWPORTS = [
  [320, 800], [375, 812], [390, 844], [430, 932], [768, 1024],
  [820, 1180], [1024, 768], [1280, 800], [1366, 600], [1366, 768],
  [1440, 700], [1920, 1080],
];

const findings = [];
const add = (type, route, vp, detail) =>
  findings.push({ type, route, vp: vp ? `${vp[0]}x${vp[1]}` : "-", detail });

const browser = await chromium.launch();

// --- Pass 1: overflow at every viewport ---
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp[0], height: vp[1] }, colorScheme: "dark" });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    try {
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    } catch { add("NAV_FAIL", route, vp, "navigation timeout"); continue; }
    const res = await page.evaluate(() => {
      const de = document.documentElement;
      const over = de.scrollWidth - de.clientWidth;
      const culprits = [];
      if (over > 1) {
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > de.clientWidth + 1 || r.left < -1) {
            const cs = getComputedStyle(el);
            if (cs.position === "fixed") continue;
            culprits.push(`${el.tagName.toLowerCase()}.${(el.className && typeof el.className === "string" ? el.className : "").split(" ").filter(Boolean).slice(0,3).join(".")} [L${Math.round(r.left)} R${Math.round(r.right)} W${Math.round(r.width)}]`);
          }
        }
      }
      return { over, culprits: culprits.slice(0, 6) };
    });
    if (res.over > 1) add("OVERFLOW", route, vp, `+${res.over}px :: ${res.culprits.join(" | ")}`);
  }
  await ctx.close();
}

// --- Pass 2: per-route semantics at one desktop + one mobile viewport ---
for (const vp of [[1280, 800], [375, 812]]) {
  const ctx = await browser.newContext({ viewport: { width: vp[0], height: vp[1] }, colorScheme: "dark" });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") add("CONSOLE", page.url().replace(BASE, ""), vp, m.text().slice(0, 200)); });
  page.on("pageerror", (e) => add("PAGEERROR", page.url().replace(BASE, ""), vp, String(e).slice(0, 200)));
  for (const route of ROUTES) {
    try { await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 }); } catch { continue; }
    const r = await page.evaluate(() => {
      const out = { badImg: [], noAlt: [], headings: [], smallTargets: [], emptyLinks: [], h1count: 0 };
      for (const img of document.querySelectorAll("img")) {
        if (img.complete && img.naturalWidth === 0) out.badImg.push(img.currentSrc || img.src);
        if (!img.hasAttribute("alt")) out.noAlt.push(img.src.slice(-60));
      }
      const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
      out.h1count = hs.filter((n) => n === 1).length;
      let prev = 0;
      hs.forEach((n, i) => { if (prev && n > prev + 1) out.headings.push(`jump h${prev}->h${n} at #${i}`); prev = n; });
      for (const el of document.querySelectorAll("a[href], button")) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.width < 24 || rect.height < 24)
          out.smallTargets.push(`${el.tagName.toLowerCase()}"${(el.textContent||"").trim().slice(0,25)}" ${Math.round(rect.width)}x${Math.round(rect.height)}`);
        const name = (el.textContent || "").trim() || el.getAttribute("aria-label") || el.querySelector("img,svg")?.getAttribute("aria-label") || "";
        if (!name) out.emptyLinks.push(el.outerHTML.slice(0, 90));
      }
      return out;
    });
    if (r.badImg.length) add("BROKEN_IMG", route, vp, r.badImg.join(", "));
    if (r.noAlt.length) add("IMG_NO_ALT", route, vp, r.noAlt.join(", "));
    if (r.h1count !== 1) add("H1_COUNT", route, vp, `h1 count = ${r.h1count}`);
    if (r.headings.length) add("HEADING_ORDER", route, vp, r.headings.join(", "));
    if (r.smallTargets.length) add("SMALL_TARGET", route, vp, [...new Set(r.smallTargets)].slice(0,8).join(" | "));
    if (r.emptyLinks.length) add("NO_ACC_NAME", route, vp, [...new Set(r.emptyLinks)].slice(0,4).join(" | "));
  }
  await ctx.close();
}

// --- Pass 3: internal link integrity ---
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const seen = new Set();
  for (const route of ROUTES) {
    try { await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 }); } catch { continue; }
    const hrefs = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => ({ href: a.getAttribute("href"), target: a.getAttribute("target"), rel: a.getAttribute("rel") })));
    for (const h of hrefs) {
      if (!h.href) continue;
      if (/^https?:/.test(h.href)) {
        if (h.target === "_blank" && !(h.rel || "").includes("noopener")) add("UNSAFE_EXTERNAL", route, null, h.href);
        continue;
      }
      if (h.href.startsWith("#") || h.href.startsWith("mailto:") || h.href.startsWith("tel:")) continue;
      const path = h.href.split("#")[0];
      if (!path || seen.has(path)) continue;
      seen.add(path);
      const resp = await page.request.get(BASE + path).catch(() => null);
      if (!resp || resp.status() >= 400) add("BROKEN_LINK", route, null, `${path} -> ${resp ? resp.status() : "ERR"}`);
    }
  }
  await ctx.close();
}

await browser.close();

const byType = {};
for (const f of findings) (byType[f.type] ||= []).push(f);
for (const [t, list] of Object.entries(byType)) {
  console.log(`\n########## ${t} (${list.length}) ##########`);
  for (const f of list) console.log(`  ${f.route} @${f.vp}\n     ${f.detail}`);
}
console.log(`\nTOTAL FINDINGS: ${findings.length}`);
