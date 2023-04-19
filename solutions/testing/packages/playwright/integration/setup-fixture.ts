import createApiMockFn from './utils/create-mock-api'
import { createApiMocks, type MockApi } from './apis'
import { baseFixture } from 'shared/base-fixture'

type Extensions = { mockApi: MockApi }

export const test = baseFixture.extend<Extensions>({
  context: async ({ context, baseURL }, use) => {
    if (!baseURL) {
      throw new Error(
        '`baseURL` is required in order to run integration tests.'
      )
    }

    await context.route('**/*', (route, request) => {
      const resourceType = request.resourceType()
      const url = request.url()

      // Block any request that doesn't start with the base URL.
      const isBlocked = !url.startsWith(baseURL)

      // Block fetch/XHR requests, but not other asset types like scripts.
      const isFetchRequest = ['fetch', 'xhr'].includes(resourceType)

      // Allow all HEAD requests.
      const isHeadRequest = request.method() === 'HEAD'

      // Allow requests to specific paths.
      const isAllowed = ['/_next/'].some((allowedPath) =>
        url.startsWith(`${baseURL}${allowedPath}`)
      )

      if (!isBlocked && (!isFetchRequest || isHeadRequest || isAllowed)) {
        return route.continue()
      }

      console.log('Route blocked:', resourceType, url, request.method())

      route.fulfill()
    })

    await use(context)
  },
  mockApi: ({ page }, use) => use(createApiMocks(createApiMockFn(page))),
})

export type Test = typeof test

export { expect } from '@playwright/test'
