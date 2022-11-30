import type { test } from '@playwright/test'
import { getAuthState } from 'shared/utils/storage-state'

// TODO: This type isn't currently exported, the Playwright team are open to
// contributions here.
type Fixtures = Parameters<typeof test['use']>[0]

/**
 * An authenticated context for a spec.
 *
 * Note that one user is created per test file, per browser. Within the test
 * file, the same user (context) will be shared between tests.
 */
export const authenticatedContext: Fixtures = {
  storageState: ({ baseURL }, use) => use(getAuthState(baseURL!)),
}
