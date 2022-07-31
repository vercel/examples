import type { Test } from 'integration/setup-fixture'

type AfterEach = Parameters<Test['afterEach']>[0]

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
