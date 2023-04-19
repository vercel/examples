import { baseFixture } from './base-fixture'
import {
  BatchInfo,
  Configuration,
  VisualGridRunner,
  BrowserType,
  DeviceName,
  ScreenOrientation,
  Eyes,
} from '@applitools/eyes-playwright'

const noop = () => {}

export type ApplitoolsConfig = {
  applitools: { enabled: boolean }
}

export type ApplitoolsExtensions = ApplitoolsConfig & {
  applitools: { eyes: Eyes }
}

export const applitools: ApplitoolsExtensions['applitools'] = {
  enabled: false,
  eyes: { check: noop } as Eyes,
}

export function setupApplitoolsEyes(test: typeof baseFixture) {
  if (!process.env.APPLITOOLS_API_KEY) {
    console.warn('Applitools API key not found. Skipping visual tests.')
    return
  }

  // Applitools objects to share for all tests
  let Batch: BatchInfo
  let Config: Configuration
  let Runner: VisualGridRunner

  // This method sets up the configuration for running visual tests in the Ultrafast Grid.
  // The configuration is shared by all tests in a test suite, so it belongs in a `beforeAll` method.
  test.beforeAll(async ({ applitools }) => {
    if (!applitools.enabled) return

    // Create the runner for the Ultrafast Grid.
    // Concurrency refers to the number of visual checkpoints Applitools will perform in parallel.
    // Warning: If you have a free account, then concurrency will be limited to 1.
    Runner = new VisualGridRunner({ testConcurrency: 5 })

    // Create a new batch for tests.
    // A batch is the collection of visual checkpoints for a test suite.
    // Batches are displayed in the Eyes Test Manager, so use meaningful names.
    Batch = new BatchInfo({
      name: 'Example: Playwright TypeScript with the Ultrafast Grid',
    })

    // Create a configuration for Applitools Eyes.
    Config = new Configuration()

    // Set the batch for the config.
    Config.setBatch(Batch)

    // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
    // Other browsers are also available, like Edge and IE.
    Config.addBrowser(1600, 1200, BrowserType.CHROME)
    Config.addBrowser(1024, 768, BrowserType.SAFARI)
    Config.addBrowser(800, 600, BrowserType.FIREFOX)

    // Add 2 mobile emulation devices with different orientations
    Config.addDeviceEmulation(DeviceName.iPhone_11, ScreenOrientation.PORTRAIT)
    Config.addDeviceEmulation(DeviceName.Pixel_3, ScreenOrientation.LANDSCAPE)
  })

  test.afterAll(async ({ applitools }) => {
    if (!applitools.enabled) return

    // Close the batch and report visual differences to the console.
    // Note that it forces Playwright to wait synchronously for all visual checkpoints to complete.
    const results = await Runner.getAllTestResults()
    console.log('Visual test results', results)
  })

  // This method sets up each test with its own Applitools Eyes object.
  test.beforeEach(async ({ page, applitools }) => {
    if (!applitools.enabled) return

    // Create the Applitools Eyes object connected to the VisualGridRunner and set its configuration.
    applitools.eyes = new Eyes(Runner, Config)

    // Open Eyes to start visual testing.
    // Each test should open its own Eyes for its own snapshots.
    // It is a recommended practice to set all four inputs below:
    await applitools.eyes.open(
      // The Playwright page object to "watch"
      page,

      // The name of the application under test.
      // All tests for the same app should share the same app name.
      // Set this name wisely: Applitools features rely on a shared app name across tests.
      'ACME Bank',

      // The name of the test case for the given application.
      // Additional unique characteristics of the test may also be specified as part of the test name,
      // such as localization information ("Home Page - EN") or different user permissions ("Login by admin").
      test.info().title,

      // The viewport size for the local browser.
      // Eyes will resize the web browser to match the requested viewport size.
      // This parameter is optional but encouraged in order to produce consistent results.
      { width: 1024, height: 768 }
    )
  })

  test.afterEach(async ({ applitools }) => {
    if (!applitools.enabled) return

    // Close Eyes to tell the server it should display the results.
    await applitools.eyes.closeAsync()

    // Warning: `eyes.closeAsync()` will NOT wait for visual checkpoints to complete.
    // You will need to check the Eyes Test Manager for visual results per checkpoint.
    // Note that "unresolved" and "failed" visual checkpoints will not cause the Playwright test to fail.

    // If you want the Playwright test to wait synchronously for all checkpoints to complete, then use `eyes.close()`.
    // If any checkpoints are unresolved or failed, then `eyes.close()` will make the Playwright test fail.
  })
}
