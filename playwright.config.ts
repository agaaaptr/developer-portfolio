import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './playwright/test-results',
  reporter: [['list'], ['html', { outputFolder: './playwright/report', open: 'never' }]],
  timeout: 45_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm run dev -- --hostname 127.0.0.1 --port 3000',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 } },
    { name: 'tablet', use: { browserName: 'chromium', viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, hasTouch: true } },
    { name: 'tablet-landscape', use: { browserName: 'chromium', viewport: { width: 1024, height: 768 }, deviceScaleFactor: 2, hasTouch: true } },
    { name: 'phone', use: { browserName: 'chromium', viewport: { width: 375, height: 812 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } },
    { name: 'phone-large', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } },
    { name: 'small-phone', use: { browserName: 'chromium', viewport: { width: 320, height: 700 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
    { name: 'phone-landscape', use: { browserName: 'chromium', viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  ],
});
