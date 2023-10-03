import { randomUUID } from 'crypto'
import { test, expect } from 'e2e/setup-fixture'
import { SignupPage } from 'shared/pages/signup-page'
import { TodoPage } from 'shared/pages/todo-page'
import generateUsername from 'shared/utils/generate-username'

test.describe('Signup', () => {
  test('should allow a visitor to signup and redirect to todos page', async ({
    page,
  }) => {
    const signupPage = new SignupPage(page)
    await signupPage.goto()

    const { username, password, submitButton } = signupPage.getSignupForm()

    await username.click()
    await page.keyboard.type(generateUsername())

    await password.click()
    await page.keyboard.type(randomUUID())

    await Promise.all([
      page.waitForNavigation({ url: '/' }),
      submitButton.click(),
    ])

    const todoPage = new TodoPage(page)

    await expect(todoPage.getNewTodoForm().submitButton).toBeVisible()
  })
})
