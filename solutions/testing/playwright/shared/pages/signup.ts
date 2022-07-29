import { BasePage } from '../utils/base-page'

export class SignupPage extends BasePage {
  path() {
    return '/signup'
  }

  goto() {
    return this.page.goto(this.path())
  }
}
