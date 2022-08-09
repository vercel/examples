import { todosBody } from 'integration/fixtures/api-todos/todos'
import { test, expect } from 'integration/setup-fixture'
import { authenticatedContext } from 'integration/utils/authenticated-context'
import { TodoPage } from 'shared/pages/todo-page'

// Add the user cookie to the browser context. The todos page
// is behind authentication.
test.use(authenticatedContext)

test.describe('Todo Page', () => {
  test('should be able to add todos', async ({ page, utils, mockApi }) => {
    const todoPage = new TodoPage(page)
    await todoPage.goto()

    const { todos } = todosBody
    const form = utils.getByTestId('todos-page', 'new-todo-form')
    const input = form.locator('input')
    const todosList = utils.getByTestId('todos-page', 'todos-list')

    // Create 1st todo.
    const addFirstTodo = async () => {
      const [waitForResponse] = await mockApi.todos.todo.post({
        body: { todos: [todos[0]] },
      })

      await input.fill(todos[0].title)
      await Promise.all([waitForResponse(), input.press('Enter')])

      // console.log(await todosList.locator('li').count())
      // await page.pause()

      await expect(todosList).toContainText(todos[0].title)
      await expect(todosList.locator('li')).toHaveCount(1)
    }
    // Create 2nd todo.
    const addSecondTodo = async () => {
      const [waitForResponse] = await mockApi.todos.todo.post({
        body: { todos: todos.slice(0, 2) },
      })

      await input.fill(todos[1].title)
      // This time we'll click the button instead and validate that
      // a response was received.
      await Promise.all([waitForResponse(), form.locator('button').click()])

      await expect(todosList).toContainText([todos[0].title, todos[1].title])
      await expect(todosList.locator('li')).toHaveCount(2)
    }

    await addFirstTodo()
    await addSecondTodo()
  })
})
