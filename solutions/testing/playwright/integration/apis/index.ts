import { Page } from '@playwright/test'
import { hasMatchingParams } from 'integration/utils/has-matching-params'
import { CreateMockFn } from 'integration/utils/types'

export const createMockApi = (page: Page) => {
  const createMockFn: CreateMockFn =
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
      // Replace params in the path.
      const replacedPath = path.replace(
        /{{}}/g,
        (_match, param: string) => mergedPathParams[param] ?? '*'
      )

      const mergedSearchParams = {
        ...defaultPathParams,
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

      let lastResponseBody: T

      // Matches a path ending with '', '?', or '/?'
      const pathRegex = new RegExp(replacedPath + /(?:$|\?.+|\/\?.+)/.source)

      await page.route(
        pathRegex,
        (route, request) => {
          const url = new URL(request.url())

          if (
            request.method() !== method ||
            !hasMatchingParams(replacedPath, mockSearchParams, url.searchParams)
          ) {
            return route.fallback()
          }

          lastResponseBody =
            body instanceof Function ? body(defaultBody) : body ?? defaultBody

          let y = lastResponseBody
            ? JSON.stringify(lastResponseBody)
            : undefined

          return route.fulfill({
            contentType: 'application/json',
            status: status ?? defaultStatus,
            body: lastResponseBody
              ? JSON.stringify(lastResponseBody)
              : undefined,
          })
        },
        { times }
      )

      return [
        () =>
          page.waitForResponse((response) => {
            const url = new URL(response.url())
            if (!pathRegex.test(url.pathname)) return false

            return hasMatchingParams(
              replacedPath,
              mockSearchParams,
              url.searchParams
            )
          }),
        () => lastResponseBody,
      ]
    }
}

// export const mockApi: Fixture
