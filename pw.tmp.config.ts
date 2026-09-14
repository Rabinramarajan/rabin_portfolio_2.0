import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  use: { baseURL: "http://localhost:3311", colorScheme: "dark" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
