import { BasePage } from 'shared/utils/base-page'

export class TodoPage extends BasePage {
  path() {
    return '/'
  }

  goto() {
    return this.page.goto(this.path())
  }

  getNewTodoForm() {
    return this.utils.getByTestId('todos-page', 'new-todo-form')
  }

  getNewTodoInput() {
    return this.getNewTodoForm().locator('input')
  }

  getTodosList() {
    return this.utils.getByTestId('todos-page', 'todos-list')
  }
  // async
}
