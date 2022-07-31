import { test as base } from '@playwright/test'
import { IS_CI, PAUSE_ON_FAILURE } from 'shared/constants'
import type { SharedExtensions } from 'shared/fixtures/types'
import pauseOnFailure from 'shared/fixtures/pause-on-failure'

type Extensions = SharedExtensions

export const test = base.extend<Extensions>({})

if (!IS_CI && PAUSE_ON_FAILURE) {
  test.afterEach(pauseOnFailure)
}

export type Test = typeof test

export { expect } from '@playwright/test'
