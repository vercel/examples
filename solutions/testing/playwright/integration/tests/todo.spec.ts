import { test, expect } from 'integration/setup-fixture'
import { authenticatedContext } from 'integration/utils/authenticated-context'

test.use(authenticatedContext)

test.describe('Todo Page', () => {
  test('should be able to add todos', async ({ page, utils }) => {
    const form = utils.getByTestId('todos-page', 'new-todo-form')
    console.log('FORM', form)
    expect(true).toBe(false)
  })
})
