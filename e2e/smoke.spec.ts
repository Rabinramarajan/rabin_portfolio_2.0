import { expect, test } from '@playwright/test';

const SHOTS = process.env['SHOTS_DIR'];

/** Every indexed path from the live site must still resolve. */
const PRESERVED_ROUTES = [
  '/',
  '/work',
  '/work/fiji-immigration-internal',
  '/services',
  '/services/angular-development',
  '/services/frontend-architecture',
  '/services/ionic-development',
  '/services/angular-performance-optimization',
  '/insights',
  '/insights/rxjs-reduce-api-calls',
  '/experience',
  '/about',
  '/process',
  '/pricing',
  '/resume',
  '/contact',
  '/privacy',
  '/terms',
];

for (const path of PRESERVED_ROUTES) {
  test(`${path} renders with its own title and canonical`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    // Titles carry " | Rabin R" unless that would push them past ~60 characters
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThanOrEqual(62);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`https://rabinr.in${path === '/' ? '/' : path}`);
    expect(errors).toEqual([]);
  });
}

test('unknown paths return the 404 page with a 404 status', async ({ page }) => {
  const response = await page.goto('/definitely-not-a-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('wandered off');
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`home has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/home-${width}.png`, fullPage: true });
  });
}

test('mobile menu opens, focuses the first link and closes on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const toggle = page.locator('button[aria-controls="primary-nav"]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#primary-nav a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('project filter narrows the gallery', async ({ page }) => {
  await page.goto('/work');
  await page.waitForLoadState('networkidle');
  const cards = page.locator('app-project-card');
  const total = await cards.count();
  await page.getByRole('button', { name: /^Marketplaces/ }).click();
  await expect(cards).toHaveCount(1);
  expect(total).toBeGreaterThan(1);
});

test('skills toolkit supports keyboard tab navigation', async ({ page }) => {
  await page.goto('/#skills');
  await page.waitForLoadState('networkidle');
  const first = page.getByRole('tab', { name: 'Frontend' });
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Backend' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Backend' })).toBeFocused();
});

test('contact form validates, then sends', async ({ page }) => {
  await page.goto('/contact');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Please tell me your name.')).toBeVisible();

  await page.getByLabel('Name').fill('Playwright Test');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Subject').fill('Smoke test');
  await page.getByLabel('What are you working on?').fill('Checking the contact form end to end works.');
  await page.waitForTimeout(3100); // the server rejects submissions faster than a person could type
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('status')).toContainText('Message sent');
});

test('reduced motion leaves content visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#hero-title')).toBeVisible();
  const hidden = await page.locator('.reveal').evaluateAll((els) =>
    els.filter((el) => getComputedStyle(el).opacity === '0').length,
  );
  expect(hidden).toBe(0);
});

test.describe('agent discovery', () => {
  test('pages advertise discovery links and vary on Accept', async ({ request }) => {
    const response = await request.get('/work');
    expect(response.headers()['vary']).toContain('Accept');
    const link = response.headers()['link'];
    for (const rel of ['rel="sitemap"', 'rel="describedby"', 'rel="api-catalog"', 'type="text/markdown"']) {
      expect(link).toContain(rel);
    }
  });

  test('Accept: text/markdown returns the Markdown twin on the same URL', async ({ request }) => {
    const response = await request.get('/work/prims-member-portal', { headers: { Accept: 'text/markdown' } });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/markdown');
    expect(await response.text()).toContain('# PRIMS Member Portal');
  });

  test('llms.txt, robots.txt and the API catalog are published', async ({ request }) => {
    expect(await (await request.get('/llms.txt')).text()).toMatch(/^# Rabin R/);
    expect(await (await request.get('/robots.txt')).text()).toContain('Content-Signal: search=yes, ai-input=yes, ai-train=yes');
    const catalog = await request.get('/.well-known/api-catalog');
    expect(catalog.headers()['content-type']).toContain('application/linkset+json');
    expect((await catalog.json()).linkset[0].anchor).toMatch(/\/api\/contact$/);
  });
});

test('article contents highlights the section being read', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/insights/stopped-writing-angular-old-way-10-modern-patterns');
  await page.waitForLoadState('networkidle');
  const links = page.locator('.post__toc-link');
  const target = (await links.nth(3).getAttribute('href'))!.split('#')[1];
  await page.evaluate((id) => {
    const heading = document.getElementById(id)!;
    scrollTo({ top: heading.getBoundingClientRect().top + scrollY - 150, behavior: 'instant' });
  }, target);
  const active = page.locator('.post__toc-link[aria-current="location"]');
  await expect(active).toHaveCount(1);
  await expect(active).toHaveAttribute('href', new RegExp(`#${target}$`));
});
