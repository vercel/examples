import { test, expect } from 'integration/setup-fixture'
import { SignupPage } from 'shared/pages/signup-page'
import getAuthCookies from 'shared/utils/get-auth-cookies'

test.describe('Signup', () => {
  test('should allow a visitor to signup and redirect to todos page', async ({
    page,
    mockApi,
    context,
    baseURL,
  }) => {
    const signupPage = new SignupPage(page)

    await signupPage.goto()
    // Add a mock for the signup API call
    await mockApi.user.signup.post()
    // Add the cookie for the user so that `/signup` properly redirects to `/`
    await context.addCookies(getAuthCookies(baseURL!))
    await signupPage.signup()

    await expect(page.locator('button', { hasText: 'Add Todo' })).toBeVisible()
  })
})
