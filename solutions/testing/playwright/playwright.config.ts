import { join } from 'path'
import type {
  PlaywrightTestConfig,
  ReporterDescription,
} from '@playwright/test'
import { devices } from '@playwright/test'
import { getBaseUrl } from './utils/get-base-url'

const IS_CI = Boolean(process.env.CI)
const OPEN_DEVTOOLS = Boolean(process.env.OPEN_DEVTOOLS)
const TEST_TYPE = process.env.TEST_TYPE

if (TEST_TYPE && !['e2e', 'integration'].includes(TEST_TYPE)) {
  throw new Error('⛔️ TEST_TYPE must be either "e2e" or "integration"')
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: TEST_TYPE ? join(__dirname, TEST_TYPE, 'tests') : '.',
  testMatch: '*.spec.ts',
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',
  /* Maximum time one test can run for. */
  timeout: 30_000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5_000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: IS_CI,
  /* Never retry tests */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: IS_CI ? 1 : undefined,
  /* Reporters to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    IS_CI ? ['list'] : ['line'],
    IS_CI
      ? [
          'junit',
          {
            outputFile: join(__dirname, 'junit.xml'),
            embedAnnotationsAsProperties: true,
          },
        ]
      : null,
    ['html', { outputFolder: join(__dirname, 'html-report'), open: 'never' }],
  ].filter(Boolean) as ReporterDescription[],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: getBaseUrl(),
    extraHTTPHeaders: {
      // Indicate the app we're running tests!
      'x-automated-test': 'true',
    },
    locale: 'en-US',
    timezoneId: 'GMT',
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    screenshot: 'only-on-failure',
    /* Collect traces for all test that fail. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          devtools: OPEN_DEVTOOLS,
        },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    /* Test against mobile viewports. */
    {
      name: 'webkit-mobile',
      use: {
        ...devices['iPhone 13 Pro'],
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
}

export default config
