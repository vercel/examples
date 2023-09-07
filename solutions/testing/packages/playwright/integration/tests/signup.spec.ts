import { randomUUID } from 'crypto'
import { test, expect } from 'integration/setup-fixture'
import { SignupPage } from 'shared/pages/signup-page'
import { TodoPage } from 'shared/pages/todo-page'
import generateUsername from 'shared/utils/generate-username'
import { getAuthState } from 'shared/utils/storage-state'
import { mockVercelPostgres } from 'integration/utils/mock-vercel-postgres'

test.describe.only('Signup', () => {
  test('should allow a visitor to signup and redirect to todos page', async ({
    page,
    next,
    context,
    baseURL,
  }) => {
    const signupPage = new SignupPage(page)
    const todoPage = new TodoPage(page)

    next.onFetch(async (req) => {
      console.log('URL', req.url)
      return mockVercelPostgres(req, {
        // Mock the todos request that happens after signup redirects to `/`.
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
            rowCount: 0,
            rowAsArray: false,
            viaNeonFetch: true,
            rows: [],
          }
        },
      })
    })

    await signupPage.goto()

    const { username, password, submitButton } = signupPage.getSignupForm()

    // Fill the username
    await username.click()
    await page.keyboard.type(generateUsername())
    // And password
    await password.click()
    await page.keyboard.type(randomUUID())
    // Add the cookie for the user, we do this before clicking the
    // signup button so that it properly redirects to `/`.
    await context.addCookies(getAuthState(baseURL!).cookies)
    await Promise.all([page.waitForURL('/'), submitButton.click()])

    await expect(todoPage.getNewTodoForm().submitButton).toBeVisible()
  })
})
