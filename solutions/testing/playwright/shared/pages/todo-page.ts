import { BasePage } from 'shared/utils/base-page'

export class TodoPage extends BasePage {
  path() {
    return '/'
  }

  goto() {
    return this.page.goto(this.path())
  }

  // async
}
