import { baseFixture } from 'shared/base-fixture'
import { createApiMocks, type MockApi } from './apis'
import createApiMockFn from './utils/create-mock-api'
import { registerRouteHandler } from './utils/register-route-handler'

type Extensions = {
  mockApi: MockApi
  registerRouteHandler: void
  userId?: number
}

export const test = baseFixture.extend<Extensions>({
  registerRouteHandler: [
    async ({ context, baseURL }, use) => {
      await registerRouteHandler(context, baseURL)
      await use()
    },
    { auto: true },
  ],
  mockApi: ({ page }, use) => use(createApiMocks(createApiMockFn(page))),
  userId: async ({ page }, use) => {
    const cookies = await page.context().cookies()
    const userId = Number(
      cookies.find((cookie) => cookie.name === 'user_id')?.value
    )
    use(isNaN(userId) ? undefined : userId)
  },
})

export type Test = typeof test

export { expect } from 'next/experimental/testmode/playwright'
