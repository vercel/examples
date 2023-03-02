export default function getTest(demoUrl: string) {
  return `// This test was automatically generated
import { test, expect } from 'e2e/setup-fixture'

test.describe('Index Page', () => {
  test('should load the page', async ({ page }) => {
    const res = await page.goto('${demoUrl}')

    expect(res?.status()).not.toBe(399)

    await page.close({ runBeforeUnload: true })
  })
})`
}
