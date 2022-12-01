import { test, expect } from 'e2e/setup-fixture'
import { authenticatedContext } from 'e2e/utils/authenticated-context'
import { TodoPage } from 'shared/pages/todo-page'

const todos = [
  'Make a cup of tea',
  'Go out and exercise',
  'Continue writing my next blog post',
]

// Add the user cookie to the browser context. The todos page
// is behind authentication.
test.use(authenticatedContext)

test.describe('Todo Page', () => {
  test('should be able to add todos', async ({ page }) => {
    const todoPage = new TodoPage(page)
    await todoPage.goto()

    const { input, submitButton } = todoPage.getNewTodoForm()
    const todoItems = todoPage.getTodos()

    // Create 1st todo.
    const addFirstTodo = async () => {
      await input.fill(todos[0])
      await input.press('Enter')

      await expect(todoItems.first()).toContainText(todos[0])
      await expect(todoItems).toHaveCount(1)
    }
    // Create 2nd todo.
    const addSecondTodo = async () => {
      await input.fill(todos[1])
      await submitButton.click()

      await expect(todoItems.last()).toContainText(todos[1])
      await expect(todoItems).toHaveCount(2)
    }

    await addFirstTodo()
    await addSecondTodo()
  })

  test('should be able to mark and un-mark todo items as complete', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)
    await todoPage.goto()

    const { input } = todoPage.getNewTodoForm()
    const { completeButton, undoButton } = todoPage.getTodoButtons()

    await input.fill(todos[0])
    await input.press('Enter')

    await expect(completeButton).toBeVisible()

    await completeButton.click()

    // Once the item is completed, the button's text changes to `Undo`.
    await expect(undoButton).toBeVisible()

    await undoButton.click()

    await expect(completeButton).toBeVisible()
  })

  test('should be able to remove todo items', async ({ page }) => {
    const todoPage = new TodoPage(page)
    await todoPage.goto()

    const { input } = todoPage.getNewTodoForm()
    const todoItems = todoPage.getTodos()
    const { removeButton } = todoPage.getTodoButtons(todoItems.first())

    await input.fill(todos[0])
    await input.press('Enter')

    await expect(todoItems).toHaveCount(1)
    await expect(todoItems.first()).toContainText(todos[0])
    await expect(removeButton).toBeVisible()

    await removeButton.click()

    await expect(todoItems).not.toBeVisible()
  })
})
