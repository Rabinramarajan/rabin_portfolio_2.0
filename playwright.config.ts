import { defineConfig, devices } from '@playwright/test';

/** Runs against the built site served by the real Worker (`wrangler dev`), so routing, 404s and /api match production. */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:8787' },
  webServer: {
    command: 'npx wrangler dev --port 8787 --local',
    url: 'http://localhost:8787',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
