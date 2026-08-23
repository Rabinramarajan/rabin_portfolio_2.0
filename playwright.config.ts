import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    colorScheme: "dark",
  },
  webServer: {
    command: "npm run dev",
    // The suite shares one client identity, so the production chat rate limit
    // (20 messages / 10 min) would throttle later tests. Raised for runs only.
    env: { CHAT_RATE_LIMIT: "1000" },
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
