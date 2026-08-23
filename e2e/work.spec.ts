import { expect, test, type Page } from "@playwright/test";

/**
 * Visual and structural QA for the work experience.
 *
 * The checks that matter here are the ones a screenshot diff cannot state in
 * words: that nothing overflows the viewport at any of the widths the site is
 * actually opened at, that the document outline stays contiguous, that the
 * filter is operable from the keyboard, and that the case study renders no
 * console errors or hydration warnings. Screenshots are captured alongside as
 * review artefacts rather than as the assertion.
 */

const WIDTHS = [
  { name: "mobile-320", width: 320, height: 780 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1280", width: 1280, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

/** The site's own scrollbar is not overflow; a wider scrollWidth is. */
async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  expect(overflow, "document scrolls horizontally").toBeLessThanOrEqual(1);
}

function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  return errors;
}

for (const vp of WIDTHS) {
  test(`work page holds its layout at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    const errors = watchConsole(page);

    await page.goto("/work");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForLoadState("networkidle");

    await assertNoHorizontalOverflow(page);
    expect(errors, errors.join("\n")).toEqual([]);

    await page.screenshot({
      path: `test-results/work-${vp.name}.png`,
      fullPage: true,
    });
  });

  test(`case study holds its layout at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    const errors = watchConsole(page);

    await page.goto("/work/fiji-immigration-internal");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForLoadState("networkidle");

    await assertNoHorizontalOverflow(page);
    expect(errors, errors.join("\n")).toEqual([]);

    await page.screenshot({
      path: `test-results/case-${vp.name}.png`,
      fullPage: true,
    });
  });
}

test("every project image resolves", async ({ page }) => {
  await page.goto("/work");
  await page.waitForLoadState("networkidle");
  const broken = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src),
  );
  expect(broken, `broken images: ${broken.join(", ")}`).toEqual([]);
});

test("filtering is keyboard operable and never empties the catalogue silently", async ({ page }) => {
  await page.goto("/work");
  const tabs = page.getByRole("tab");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  const selected = page.getByRole("tab", { selected: true });
  await expect(selected).not.toHaveAttribute("data-filter", "all");

  // Whatever bucket we landed in, its advertised count must equal what renders.
  const label = await selected.textContent();
  const count = Number(label?.match(/(\d+)\s*$/)?.[1] ?? "0");
  await expect(page.locator(".pcard")).toHaveCount(count);
});

test("case study exposes a contiguous heading outline and a working pager", async ({ page }) => {
  await page.goto("/work/prims-member-portal");

  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

  const levels = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1,h2,h3,h4")).map((h) => Number(h.tagName[1])),
  );
  for (let i = 1; i < levels.length; i += 1) {
    expect(levels[i] - levels[i - 1], `heading jump at index ${i}`).toBeLessThanOrEqual(1);
  }

  const next = page.locator('a[rel="next"]');
  await expect(next).toBeVisible();
  await next.click();
  await expect(page).toHaveURL(/\/work\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("an unknown slug renders the not-found page, not a blank one", async ({ page }) => {
  const response = await page.goto("/work/this-project-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
