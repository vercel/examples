import type { Test } from 'e2e/setup-fixture'

type AfterEach = Parameters<Test['afterEach']>[0]

/**
 * Pauses testing execution on failure. Works for both integration and E2E tests.
 *
 * @param fixtures
 * @param testInfo
 * @returns A fixture that will log the error and pause Playwright after an error is thrown.
 */
const pauseOnFailure: AfterEach = async ({ page, headless }, testInfo) => {
  if (headless || testInfo.status === testInfo.expectedStatus) return

  process.stderr.write(
    `⛔️ PLAYWRIGHT TEST FAILURE ⛔️\n${
      testInfo.error?.stack || testInfo.error?.message || ''
    }\n`
  )

  process.stderr.write(`⏸ Pausing Playwright to manually inspect the failure\n`)

  await page.pause()
}

export default pauseOnFailure
