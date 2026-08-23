import { test, expect } from "@playwright/test";

/**
 * Field lookups scoped to the contact form.
 *
 * The page also lists contact channels as links labelled "Email" / "Phone",
 * so an unscoped getByLabel(/^email/i) matches both the input and the link
 * and fails Playwright's strict mode.
 */
const form = (page: import("@playwright/test").Page) => page.locator("form");

test.describe("Contact page", () => {
  test("submits a valid message and shows the success state", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      // Hold the response briefly. Fulfilling instantly resolves the mutation
      // inside the same frame as the click, so the "Sending…" state is never
      // committed and the assertion below has nothing to observe.
      await new Promise((r) => setTimeout(r, 400));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          referenceId: "RR-20260822-E2E1",
          responseTime: "Usually responds within 1 business day",
        }),
      });
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("worth shipping");

    await form(page).getByLabel(/^name/i).fill("Ada Lovelace");
    await form(page).getByLabel(/^email/i).fill("ada@example.com");
    await form(page).getByLabel(/inquiry type/i).selectOption("Project");
    await form(page).getByLabel(/^message/i).fill(
      "We need a senior Angular consultant to help ship a member portal this quarter.",
    );

    const submit = page.getByRole("button", { name: /send message/i });
    await submit.click();
    await expect(page.getByRole("button", { name: /sending/i })).toBeDisabled();
    await expect(page.getByRole("status")).toContainText("Message received.");
    await expect(page.getByText("RR-20260822-E2E1")).toBeVisible();
  });

  test("shows a failure state when the API rejects the request", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Could not send. Please try again or email me directly." }),
      });
    });

    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/contact");
    await form(page).getByLabel(/^name/i).fill("Ada Lovelace");
    await form(page).getByLabel(/^email/i).fill("ada@example.com");
    await form(page).getByLabel(/inquiry type/i).selectOption("Collaboration");
    await form(page).getByLabel(/^message/i).fill(
      "We would like to collaborate on an open-source Angular design system this year.",
    );
    await page.getByRole("button", { name: /send message/i }).click();
    // Scoped to the form: Next renders its own route announcer with
    // role="alert", which makes an unscoped lookup ambiguous.
    await expect(form(page).getByRole("alert")).toContainText("Could not send");
  });

  test("keeps the layout within the viewport on a 320px screen", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/contact");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
  });
});
