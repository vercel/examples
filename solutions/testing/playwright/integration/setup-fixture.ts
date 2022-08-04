import { test as base } from '@playwright/test'
import { IS_CI, PAUSE_ON_FAILURE } from 'shared/constants'
import type { SharedExtensions } from 'shared/fixtures/types'
import pauseOnFailure from 'shared/fixtures/pause-on-failure'
import { type MockApi, createMockApi } from './apis'

type Extensions = SharedExtensions & { mockApi: MockApi }

export const test = base.extend<Extensions>({
  context: async ({ context, baseURL }, use) => {
    if (!baseURL) {
      throw new Error(
        '`baseURL` is required in order to run integration tests.'
      )
    }

    await context.route('**/*', (route, request) => {
      const resourceType = request.resourceType()
      const requestUrl = request.url()

      // Block any request that doesn't start with the base URL.
      const isBlocked = !requestUrl.startsWith(baseURL)

      // Block fetch/XHR requests, but not other asset types like scripts.
      const isFetchRequest = ['fetch', 'xhr'].includes(resourceType)

      // Allow all HEAD requests.
      const isHeadRequest = request.method() === 'HEAD'

      // Allow requests to specific paths.
      const isAllowed = ['/_next/'].some((allowedPath) =>
        requestUrl.startsWith(`${baseURL}${allowedPath}`)
      )

      if (!isBlocked && (!isFetchRequest || isHeadRequest || isAllowed)) {
        return route.continue()
      }

      route.fulfill()
    })

    await use(context)
  },
  mockApi: ({ page }, use) => use(createMockApi(page)),
})

if (!IS_CI && PAUSE_ON_FAILURE) {
  test.afterEach(pauseOnFailure)
}

export type Test = typeof test

export { expect } from '@playwright/test'
