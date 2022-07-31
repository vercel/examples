import { BasePage } from '../utils/base-page'

export class SignupPage extends BasePage {
  path() {
    return '/signup'
  }

  goto() {
    return this.page.goto(this.path())
  }

  async signup() {
    const labels = this.page.locator('label')

    await labels.locator('text=Username').click()
    await this.page.keyboard.type('new-user')

    await labels.locator('text=Password').click()
    await this.page.keyboard.type('new-password')

    await Promise.all([
      this.page.waitForNavigation({ url: '/' }),
      this.page.locator('button', { hasText: 'Signup' }).click(),
    ])
  }
}
