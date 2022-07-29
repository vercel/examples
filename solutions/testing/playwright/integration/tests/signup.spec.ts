import { test, expect } from '@playwright/test'
import { SignupPage } from 'shared/pages/signup'

test.describe('Signup', () => {
  test('should allow me to signup', async ({ page }) => {
    const signupPage = new SignupPage(page)

    await signupPage.goto()
    await expect(page.locator('h1 + p')).toHaveText('Signup to start:')
  })
})
