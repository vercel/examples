import { type BrowserContext } from '@playwright/test'

/**
 * Register a route handler that blocks requests to external domains. For integration tests only.
 */
export const registerRouteHandler = async (
  context: BrowserContext,
  baseURL?: string
): Promise<void> => {
  if (!baseURL) {
    throw new Error('`baseURL` is required in order to run integration tests.')
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
    const isAllowed = [
      '/_next/',
      '/__nextjs',
      '/lazy-compilation-using-/',
    ].some((allowedPath) => url.startsWith(`${baseURL}${allowedPath}`))

    if (!isBlocked && (!isFetchRequest || isHeadRequest || isAllowed)) {
      return route.continue()
    }

    console.log('Route blocked:', resourceType, url, request.method())

    route.fulfill({ status: 404 })
  })
}
