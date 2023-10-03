import { join } from 'path'
import type {
  PlaywrightTestConfig,
  ReporterDescription,
} from '@playwright/test'
import { devices } from '@playwright/test'
import { BASE_URL, IS_CI, OPEN_DEVTOOLS, TEST_TYPE } from 'shared/constants'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: TEST_TYPE ? join(__dirname, TEST_TYPE, 'tests') : '.',
  testMatch: '*.spec.ts',
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/output',
  /* Maximum time one test can run for. */
  timeout: 30_000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 10_000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: IS_CI,
  /* Never retry tests */
  retries: 0,
  workers: IS_CI ? 6 : undefined,
  /* Reporters to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    IS_CI ? ['list'] : ['line'],
    IS_CI
      ? [
          'junit',
          {
            outputFile: join(__dirname, 'test-results/output/junit.xml'),
            embedAnnotationsAsProperties: true,
          },
        ]
      : null,
    [
      'html',
      {
        outputFolder: join(__dirname, 'test-results/html-report'),
        open: 'never',
      },
    ],
  ].filter(Boolean) as ReporterDescription[],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      // Indicate the app we're running tests!
      'x-automated-test': 'true',
    },
    locale: 'en-US',
    timezoneId: 'GMT',
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 10_000,
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
    /**
     * Our generated tests only check that the page responds properly so using multiple
     * browsers is unlikely to catch any issues.
     */
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },
    /* Test against mobile viewports. */
    // {
    //   name: 'webkit-mobile',
    //   use: {
    //     ...devices['iPhone 13 Pro'],
    //   },
    // },
    // {
    //   name: 'chromium-mobile',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
  ],
}

export default config
