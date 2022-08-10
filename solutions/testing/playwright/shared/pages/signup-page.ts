import { BasePage } from '../utils/base-page'

export class SignupPage extends BasePage {
  path() {
    return '/signup'
  }

  goto() {
    return this.page.goto(this.path())
  }

  getSignupForm() {
    const labels = this.page.locator('label')
    return {
      username: labels.locator('text=Username'),
      password: labels.locator('text=Password'),
      submitButton: this.page.locator('button', { hasText: 'Signup' }),
    }
  }
}
