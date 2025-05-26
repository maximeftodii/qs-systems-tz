const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 600000, // 10 minutes
  expect: {
    timeout: 15000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  maxFailures: 1,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  use: {
    // Global test settings
    headless: false,
    viewport: null, // Use full screen instead of fixed viewport
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // Browser launch options for maximized window
    launchOptions: {
      args: [
        '--start-maximized',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ],
      slowMo: 1000,
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        // Don't use devices['Desktop Chrome'] as it conflicts with viewport: null
        channel: 'chrome',
        viewport: null, // Use full screen instead of fixed viewport
        launchOptions: {
          args: [
            '--start-maximized',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ],
          slowMo: 1000,
        }
      },
    },
  ],

  // Output directories
  outputDir: 'test-results/',
  
  // Global setup and teardown
  globalSetup: require.resolve('./utils/global-setup.js'),
  globalTeardown: require.resolve('./utils/global-teardown.js'),
}); 