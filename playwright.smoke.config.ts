import { defineConfig, devices } from '@playwright/test';

// Smoke-test config that runs against the user's existing local dev server
// (instead of spawning its own). Used to exercise the real routes.js
// probe-and-flip behaviour end-to-end with a real Edgar session loaded from
// /Users/garyjob/Applications/dao_client/.env.
//
// Run with:
//   npx playwright test --config=playwright.smoke.config.ts
export default defineConfig({
  testDir: './tests',
  testMatch: /routes_smoke\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.DAPP_BASE_URL || 'http://localhost:8000',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // No webServer — we rely on the user's already-running local server.
});
