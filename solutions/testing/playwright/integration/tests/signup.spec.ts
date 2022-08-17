import { randomUUID } from 'crypto'
import { test, expect } from 'integration/setup-fixture'
import { SignupPage } from 'shared/pages/signup-page'
import { TodoPage } from 'shared/pages/todo-page'
import generateUsername from 'shared/utils/generate-username'
import { getAuthState } from 'shared/utils/storage-state'

test.describe('Signup', () => {
  test('should allow a visitor to signup and redirect to todos page', async ({
    page,
    mockApi,
    context,
    baseURL,
  }) => {
    const signupPage = new SignupPage(page)
    const todoPage = new TodoPage(page)

    await signupPage.goto()
    // Add a mock for the signup API call.
    const [waitForResponse] = await mockApi.user.signup.post()
    // Add a mock for the todos request that happens after signup redirects to `/`.
    const [waitForTodoResponse] = await mockApi.todos.todo.get({
      body: { todos: [] },
    })
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

    await Promise.all([
      waitForResponse(),
      waitForTodoResponse(),
      page.waitForNavigation({ url: '/' }),
      submitButton.click(),
    ])

    await expect(todoPage.getNewTodoForm().submitButton).toBeVisible()
  })
})
