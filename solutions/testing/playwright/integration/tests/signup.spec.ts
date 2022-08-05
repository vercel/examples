import { test, expect } from 'integration/setup-fixture'
import { SignupPage } from 'shared/pages/signup'

test.describe('Signup', () => {
  test('should allow me to signup', async ({ page, mockApi }) => {
    const signupPage = new SignupPage(page)

    // Add a mock for the signup API call
    await mockApi.user.signup.post()

    await signupPage.goto()
    await signupPage.signup()

    await expect(page.locator('button', { hasText: 'Add Todo' })).toBeVisible()
  })
})
