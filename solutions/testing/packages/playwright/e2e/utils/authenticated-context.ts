import { PlaywrightTestOptions, Fixtures, request } from '@playwright/test'
import { randomUUID } from 'crypto'
import generateUsername from 'shared/utils/generate-username'
import type { StorageState } from 'shared/utils/storage-state'

async function createAuthenticatedStorage(
  baseURL: string
): Promise<StorageState> {
  const requestContext = await request.newContext()
  const token = 'SECRET_TOKEN'

  // Create a new user
  const response = await requestContext.post(`${baseURL}/api/signup`, {
    data: { username: generateUsername(), password: randomUUID() },
    headers: {
      // In general, teting user accounts are cleaned from the production DB
      // and creating them requires less verifications, but the process should
      // be authenticated so that this can't be exploited.
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status() === 403) {
    throw new Error(`Authorization failed. Your API token is incorrect.`)
  }
  if (!response.ok()) {
    // If here's an error try to get the error message from the JSON response.
    const errorMessage = await response
      .json()
      .then((json) => {
        // The API returns errors in the format `{ error: { message: string } }`.
        const { message } = json.error
        // if the body doesn't match our format, use the status text.
        return (message as string) || response.statusText()
      })
      .catch(() => response.statusText())

    throw new Error(`Failed to create a test user.\n> ${errorMessage}`)
  }

  const storageState = await requestContext.storageState()

  // Cleans up the context.
  await requestContext.dispose()

  return storageState
}

/**
 * An authenticated context for a spec.
 *
 * Note that one user is created per test file, per browser. Within the test
 * file, the same user (context) will be shared between tests.
 */
export const authenticatedContext: Fixtures<{}, {}, PlaywrightTestOptions> = {
  storageState: async ({ baseURL }, use) => {
    use(await createAuthenticatedStorage(baseURL!))
  },
}
