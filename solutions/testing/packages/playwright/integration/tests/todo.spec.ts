import { Target } from '@applitools/eyes-playwright'
import { test, expect } from 'integration/setup-fixture'
import { authenticatedContext } from 'integration/utils/authenticated-context'
import { TodoPage } from 'shared/pages/todo-page'
import { mockVercelPostgres } from 'integration/utils/mock-vercel-postgres'

const todos = [
  'Make a cup of tea',
  'Go out and exercise',
  'Continue writing my next blog post',
]

// Add the user cookie to the browser context. The todos page
// is behind authentication.
test.use(authenticatedContext)

test.use({ nextOptions: { fetchLoopback: true } })

test.describe('Todo Page', () => {
  test('should be able to add todos', async ({ page, next, eyes }) => {
    const rows: unknown[] = []

    next.onFetch(async (req) => {
      return mockVercelPostgres(req, {
        'SELECT * FROM todos WHERE user_id = $1;': () => {
          return {
            command: 'SELECT',
            fields: [
              { name: 'id', dataTypeID: 25 },
              { name: 'title', dataTypeID: 25 },
              { name: 'done', dataTypeID: 16 },
              { name: 'user_id', dataTypeID: 23 },
              { name: 'created_at', dataTypeID: 20 },
              { name: 'updated_at', dataTypeID: 20 },
            ],
            rowCount: rows.length,
            rowAsArray: false,
            viaNeonFetch: true,
            rows,
          }
        },
        'INSERT INTO todos (title, done, user_id) VALUES ($1, false, $2) RETURNING *;':
          (params) => {
            const [title, userId] = params
            const row = [
              rows.length + 1,
              title,
              'false',
              Number(userId),
              Date.now(),
              Date.now(),
            ]
            rows.push(row)
            return {
              command: 'INSERT',
              fields: [
                { name: 'id', dataTypeID: 25 },
                { name: 'title', dataTypeID: 25 },
                { name: 'done', dataTypeID: 16 },
                { name: 'user_id', dataTypeID: 23 },
                { name: 'created_at', dataTypeID: 20 },
                { name: 'updated_at', dataTypeID: 20 },
              ],
              rowCount: 1,
              rowAsArray: false,
              viaNeonFetch: true,
              rows: [row],
            }
          },
      })
    })

    const todoPage = new TodoPage(page)

    await todoPage.goto()
    await eyes.check('Todo page', Target.window().fully())

    const { input, submitButton } = todoPage.getNewTodoForm()
    const todoItems = todoPage.getTodos()

    await expect(todoItems).toHaveCount(0)

    // Create 1st todo.
    const addFirstTodo = async () => {
      await input.fill(todos[0])
      await input.press('Enter')
      // Test that the input is empty after submitting.

      await expect(input).toHaveValue('')
      await expect(todoItems.first()).toContainText(todos[0])
      await expect(todoItems).toHaveCount(1)
    }
    // Create 2nd todo.
    const addSecondTodo = async () => {
      await input.fill(todos[1])
      // This time we'll click the button instead
      await submitButton.click()

      await expect(todoItems.last()).toContainText(todos[1])
      await expect(todoItems).toHaveCount(2)
    }

    await addFirstTodo()
    await addSecondTodo()
    // This snapshot uses layout match level to avoid differences in closing time text.
    await eyes.check('Todo page with 2 todos', Target.window().fully().layout())
  })

  test('should be able to mark todo items as complete', async ({
    page,
    next,
    userId,
    eyes,
  }) => {
    const rows: unknown[] = [
      [1, todos[0], 'false', userId, Date.now(), Date.now()],
    ]

    next.onFetch(async (req) => {
      return mockVercelPostgres(req, {
        'SELECT * FROM todos WHERE user_id = $1;': () => {
          return {
            command: 'SELECT',
            fields: [
              { name: 'id', dataTypeID: 25 },
              { name: 'title', dataTypeID: 25 },
              { name: 'done', dataTypeID: 16 },
              { name: 'user_id', dataTypeID: 23 },
              { name: 'created_at', dataTypeID: 20 },
              { name: 'updated_at', dataTypeID: 20 },
            ],
            rowCount: rows.length,
            rowAsArray: false,
            viaNeonFetch: true,
            rows,
          }
        },
        'UPDATE todos SET done = $1 WHERE id = $2 RETURNING *;': (params) => {
          const [done, id] = params
          const row = rows.find((r: any) => r[0] === Number(id)) as any[]

          row[2] = done
          row[5] = Date.now()

          return {
            command: 'UPDATE',
            fields: [
              { name: 'id', dataTypeID: 25 },
              { name: 'title', dataTypeID: 25 },
              { name: 'done', dataTypeID: 16 },
              { name: 'user_id', dataTypeID: 23 },
              { name: 'created_at', dataTypeID: 20 },
              { name: 'updated_at', dataTypeID: 20 },
            ],
            rowCount: 1,
            rowAsArray: false,
            viaNeonFetch: true,
            rows: [row],
          }
        },
      })
    })

    const todoPage = new TodoPage(page)

    await todoPage.goto()

    const { completeButton, undoButton } = todoPage.getTodoButtons()

    await expect(completeButton).toBeVisible()
    await completeButton.click()
    // Once the item is completed, the button's text changes to `Undo`.
    await expect(undoButton).toBeVisible()
    await eyes.check('Completed todo', Target.window().fully())
  })

  test('should be able to undo a todo marked as complete', async ({
    page,
    next,
    userId,
  }) => {
    const rows: unknown[] = [
      [1, todos[0], 'true', userId, Date.now(), Date.now()],
    ]

    next.onFetch(async (req) => {
      return mockVercelPostgres(req, {
        'SELECT * FROM todos WHERE user_id = $1;': () => {
          return {
            command: 'SELECT',
            fields: [
              { name: 'id', dataTypeID: 25 },
              { name: 'title', dataTypeID: 25 },
              { name: 'done', dataTypeID: 16 },
              { name: 'user_id', dataTypeID: 23 },
              { name: 'created_at', dataTypeID: 20 },
              { name: 'updated_at', dataTypeID: 20 },
            ],
            rowCount: rows.length,
            rowAsArray: false,
            viaNeonFetch: true,
            rows,
          }
        },
        'UPDATE todos SET done = $1 WHERE id = $2 RETURNING *;': (params) => {
          const [done, id] = params
          const row = rows.find((r: any) => r[0] === Number(id)) as any[]

          row[2] = done

          return {
            command: 'UPDATE',
            fields: [
              { name: 'id', dataTypeID: 25 },
              { name: 'title', dataTypeID: 25 },
              { name: 'done', dataTypeID: 16 },
              { name: 'user_id', dataTypeID: 23 },
              { name: 'created_at', dataTypeID: 20 },
              { name: 'updated_at', dataTypeID: 20 },
            ],
            rowCount: 1,
            rowAsArray: false,
            viaNeonFetch: true,
            rows: [row],
          }
        },
      })
    })

    const todoPage = new TodoPage(page)

    await todoPage.goto()

    const { completeButton, undoButton } = todoPage.getTodoButtons()

    await expect(undoButton).toBeVisible()

    await undoButton.click()

    await expect(completeButton).toBeVisible()
  })

  test('should be able to remove todo items', async ({
    page,
    next,
    userId,
  }) => {
    let rows = todos.map((todo, i) => [
      i + 1,
      todo,
      'false',
      userId,
      Date.now(),
      Date.now(),
    ])

    next.onFetch(async (req) => {
      return mockVercelPostgres(req, {
        'SELECT * FROM todos WHERE user_id = $1;': () => {
          return {
            command: 'SELECT',
            fields: [
              { name: 'id', dataTypeID: 25 },
              { name: 'title', dataTypeID: 25 },
              { name: 'done', dataTypeID: 16 },
              { name: 'user_id', dataTypeID: 23 },
              { name: 'created_at', dataTypeID: 20 },
              { name: 'updated_at', dataTypeID: 20 },
            ],
            rowCount: rows.length,
            rowAsArray: false,
            viaNeonFetch: true,
            rows,
          }
        },
        'DELETE FROM todos WHERE id = $1;': (params) => {
          const [id] = params

          rows = rows.filter((r) => r[0] !== Number(id))

          return {
            command: 'DELETE',
            fields: [
              { name: 'id', dataTypeID: 25 },
              { name: 'title', dataTypeID: 25 },
              { name: 'done', dataTypeID: 16 },
              { name: 'user_id', dataTypeID: 23 },
              { name: 'created_at', dataTypeID: 20 },
              { name: 'updated_at', dataTypeID: 20 },
            ],
            rowCount: 1,
            rowAsArray: false,
            viaNeonFetch: true,
            rows: [],
          }
        },
      })
    })

    const todoPage = new TodoPage(page)

    await todoPage.goto()

    const todoItems = todoPage.getTodos()
    const { removeButton } = todoPage.getTodoButtons(todoItems.first())

    await expect(todoItems).toHaveCount(todos.length)
    await expect(todoItems.first()).toContainText(todos[0])
    await expect(removeButton).toBeVisible()

    await removeButton.click()

    await expect(todoItems).toHaveCount(2)
    await expect(todoItems.first()).not.toContainText(todos[0])
  })
})
