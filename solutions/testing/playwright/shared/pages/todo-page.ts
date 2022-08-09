import { BasePage } from 'shared/utils/base-page'

export class TodoPage extends BasePage {
  path() {
    return '/'
  }

  goto() {
    return this.page.goto(this.path())
  }

  getNewTodoForm() {
    const form = this.utils.getByTestId('todos-page', 'new-todo-form')
    return {
      input: form.locator('input'),
      submitButton: form.locator('button'),
    }
  }

  getTodosList() {
    return this.utils.getByTestId('todos-page', 'todos-list')
  }
}
