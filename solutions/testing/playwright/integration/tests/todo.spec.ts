import { todosBody } from 'integration/fixtures/api-todos/todos'
import { test, expect } from 'integration/setup-fixture'
import { authenticatedContext } from 'integration/utils/authenticated-context'
import { TodoPage } from 'shared/pages/todo-page'

// Add the user cookie to the browser context. The todos page
// is behind authentication.
test.use(authenticatedContext)

test.describe('Todo Page', () => {
  test('should be able to add todos', async ({ page, mockApi }) => {
    const { todos } = todosBody
    const todoPage = new TodoPage(page)
    const [waitForResponse] = await mockApi.todos.todo.get({
      body: { todos: [] },
    })

    // Navigate to the page and wait for a response from /api/todo
    await Promise.all([waitForResponse(), todoPage.goto()])

    const { input, submitButton } = todoPage.getNewTodoForm()
    const todosList = todoPage.getTodosList()

    // Create 1st todo.
    const addFirstTodo = async () => {
      const [waitForResponse] = await mockApi.todos.todo.post({
        body: { todos: [todos[0]] },
      })

      await input.fill(todos[0].title)
      await Promise.all([waitForResponse(), input.press('Enter')])

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
      await Promise.all([waitForResponse(), submitButton.click()])

      await expect(todosList).toContainText([todos[0].title, todos[1].title])
      await expect(todosList.locator('li')).toHaveCount(2)
    }

    await addFirstTodo()
    await addSecondTodo()
  })

  test('should clear the input field when a new item is added', async ({
    page,
    mockApi,
  }) => {
    const { todos } = todosBody
    const todoPage = new TodoPage(page)
    const [waitForResponse] = await mockApi.todos.todo.get({ body: { todos } })

    await Promise.all([waitForResponse(), todoPage.goto()])

    const todosList = todoPage.getTodosList()

    await expect(todosList.locator('li')).toHaveCount(todos.length)
  })

  test('should be able to mark todo items as complete', async ({
    page,
    mockApi,
  }) => {
    const { todos } = todosBody
    const todoPage = new TodoPage(page)
    const todo = todos[0]
    const [waitForTodos] = await mockApi.todos.todo.get({
      body: { todos: [todo] },
    })

    await Promise.all([waitForTodos(), todoPage.goto()])

    const todosList = todoPage.getTodosList()
    const todoItem = todosList.locator('li').first()
    const completeButton = todoItem.locator('text=Complete')

    await expect(completeButton).toBeVisible()

    const [waitForResponse] = await mockApi.todos.todo.patch({
      body: { todos: [{ ...todo, done: true }] },
      searchParams: { id: todo.id },
    })

    await Promise.all([waitForResponse(), completeButton.click()])

    // Once the item is completed, the button's text changes to `Undo`.
    await expect(todoItem.locator('text=Undo')).toBeVisible()
  })

  test('should be able to un-mark todo items as complete', async ({
    page,
    mockApi,
  }) => {
    const { todos } = todosBody
    const todoPage = new TodoPage(page)
    const todo = { ...todos[0], done: true }
    const [waitForTodos] = await mockApi.todos.todo.get({
      body: { todos: [todo] },
    })

    await Promise.all([waitForTodos(), todoPage.goto()])

    const todosList = todoPage.getTodosList()
    const todoItem = todosList.locator('li').first()
    const undoButton = todoItem.locator('text=Undo')

    await expect(undoButton).toBeVisible()

    const [waitForResponse] = await mockApi.todos.todo.patch({
      body: { todos: [{ ...todo, done: false }] },
      searchParams: { id: todo.id },
    })

    await Promise.all([waitForResponse(), undoButton.click()])

    await expect(todoItem.locator('text=Complete')).toBeVisible()
  })

  test('should be able to remove todo items', async ({ page, mockApi }) => {
    const { todos } = todosBody
    const todoPage = new TodoPage(page)
    const [waitForTodos] = await mockApi.todos.todo.get({
      body: { todos },
    })

    await Promise.all([waitForTodos(), todoPage.goto()])

    const todosList = todoPage.getTodosList()
    const todoItem = todosList.locator('li').first()
    const removeButton = todoItem.locator('text=Remove')

    await expect(todosList.locator('li')).toHaveCount(todos.length)
    await expect(todosList).toContainText(todos[0].title)
    await expect(removeButton).toBeVisible()

    const [waitForResponse] = await mockApi.todos.todo.delete({
      body: {
        todos: todos.slice(1),
      },
      searchParams: { id: todos[0].id },
    })

    await Promise.all([waitForResponse(), removeButton.click()])

    await expect(todosList.locator('li')).toHaveCount(2)
    await expect(todosList).not.toContainText(todos[0].title)
  })
})
