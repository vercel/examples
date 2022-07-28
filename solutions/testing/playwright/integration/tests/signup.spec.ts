import { test, expect } from '@playwright/test'

test.describe('Signup', () => {
  test('should allow me to signup', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator('h1 + p')).toHaveText('Signup to start')
  })
})
