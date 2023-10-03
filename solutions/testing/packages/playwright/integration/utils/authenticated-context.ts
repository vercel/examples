import type { Fixtures, PlaywrightTestOptions } from '@playwright/test'
import { getAuthState } from 'shared/utils/storage-state'

/**
 * An authenticated context for a spec.
 *
 * Note that one user is created per test file, per browser. Within the test
 * file, the same user (context) will be shared between tests.
 */
export const authenticatedContext: Fixtures<{}, {}, PlaywrightTestOptions> = {
  storageState: ({ baseURL }, use) => use(getAuthState(baseURL!)),
}
