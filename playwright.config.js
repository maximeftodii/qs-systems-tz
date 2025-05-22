const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 600000,
  expect: {
    timeout: 15000
  },
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    headless: false,
    viewport: null,
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    launchOptions: {
      args: ['--start-maximized']
    }
  },
  retries: 0,
  maxFailures: 1,
  workers: 1,
  // Keep browser open after failure
  launchOptions: {
    slowMo: 1000,
  }
}); 