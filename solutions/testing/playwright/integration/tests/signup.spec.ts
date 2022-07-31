import { test, expect } from 'integration/setup-fixture'
import { SignupPage } from 'shared/pages/signup'

test.describe('Signup', () => {
  test('should allow me to signup', async ({ page }) => {
    const signupPage = new SignupPage(page)

    await signupPage.goto()
    await signupPage.signup()
  })
})
