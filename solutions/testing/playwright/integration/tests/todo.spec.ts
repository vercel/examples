import { randomUUID } from 'crypto'
import { test, expect } from 'integration/setup-fixture'
import { authenticatedContext } from 'integration/utils/authenticated-context'
import { TodoPage } from 'shared/pages/todo-page'

const TODOS = [
  { id: randomUUID(), title: 'Make a cup of tea' },
  { id: randomUUID(), title: 'Go out and exercise' },
  { id: randomUUID(), title: 'Continue writing my next blog post' },
]

// Add the user cookie to the browser context. The todos page
// is behind authentication.
test.use(authenticatedContext)

test.describe('Todo Page', () => {
  test('should be able to add todos', async ({ page, utils, mockApi }) => {
    const todoPage = new TodoPage(page)
    await todoPage.goto()

    const form = utils.getByTestId('todos-page', 'new-todo-form')
    const input = form.locator('input')

    // Create 1st todo.
    await mockApi.todos.todo.post({
      body: { todos: [TODOS[0]] },
    })
    await input.fill(TODOS[0].title)
    await input.press('Enter')

    const todosList = utils.getByTestId('todos-page', 'todos-list')

    expect(todosList).toContainText(TODOS[0].title)

    // Create 2nd todo.
    const [waitForResponse] = await mockApi.todos.todo.post({
      body: { todos: [TODOS[0], TODOS[1]] },
    })
    await input.fill(TODOS[1].title)
    // This time we'll click the button instead and validate that
    // a response was received.
    await Promise.all([waitForResponse(), form.locator('button').click()])

    expect(todosList).toContainText([TODOS[0].title, TODOS[1].title])
  })
})
