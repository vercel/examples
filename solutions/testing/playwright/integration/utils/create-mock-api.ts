import { Page } from '@playwright/test'
import { hasMatchingParams } from './has-matching-params'
import { CreateMockFn } from './types'

/**
 * Returns a function that can be used to create API mocks by
 * wrapping paths with `page.route`.
 *
 * @param page The `page` object received by the fixture
 * @returns The mock function
 */
const createApiMockFn =
  (page: Page): CreateMockFn =>
  ({
    path,
    method,
    pathParams: defaultPathParams,
    searchParams: defaultSearchParams,
    body: defaultBody,
    status: defaultStatus,
  }) =>
  async ({ pathParams, searchParams, body, status, times } = {}) => {
    if (path.includes('?')) {
      throw Error(
        'Query parameters must be supplied via `defaultSearchParams` and or `searchParams`.'
      )
    }
    if (path.startsWith('*') || path.endsWith('*')) {
      throw Error('Mock API paths must not start or end with a wildcard.')
    }

    type T = typeof defaultBody

    const mergedPathParams = {
      ...defaultPathParams,
      ...pathParams,
    }
    // Replace params in the path. For example it transforms
    // `/api/user/{{userId}}` into `/api/user/acme`
    const replacedPath = path.replace(
      /{{(?<param>\w+)}}/g,
      // If there's no value for the param any value will be accepted
      (_match, param: string) => mergedPathParams[param] ?? '*'
    )

    const mergedSearchParams = {
      ...defaultSearchParams,
      ...searchParams,
    }
    // Append any additional search params.
    const mockSearchParams = Object.fromEntries(
      Object.entries(mergedSearchParams).map(([key, value]) => {
        const isRegex = value instanceof RegExp
        const isString = typeof value === 'string'

        return [
          key,
          isRegex || isString ? { value, optional: false } : value,
        ] as const
      })
    )

    let responseBody: T

    // Also match the path if it ends with '?' or '/?'
    const pathRegex = new RegExp(replacedPath + /(?:$|\?.+|\/\?.+)/.source)

    await page.route(
      pathRegex,
      (route, request) => {
        const url = new URL(request.url())

        // If the HTTP method or the search params didn't match, continue
        // to the next handler.
        if (
          request.method() !== method ||
          !hasMatchingParams(mockSearchParams, url.searchParams)
        ) {
          return route.fallback()
        }

        responseBody =
          body instanceof Function ? body(defaultBody) : body ?? defaultBody

        return route.fulfill({
          contentType: 'application/json',
          status: status ?? defaultStatus,
          body: responseBody ? JSON.stringify(responseBody) : undefined,
        })
      },
      { times }
    )

    return [
      (matcher) =>
        page.waitForResponse((response) => {
          const url = new URL(response.url())

          if (
            !pathRegex.test(url.pathname) ||
            !hasMatchingParams(mockSearchParams, url.searchParams)
          ) {
            return false
          }

          return matcher ? matcher(response) : true
        }),
      () => responseBody,
    ]
  }

export default createApiMockFn
