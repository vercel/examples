import { test as base } from '@playwright/test'
import { IS_CI, PAUSE_ON_FAILURE } from 'shared/constants'
import pauseOnFailure from 'shared/fixtures/pause-on-failure'
import { createUtils, type Utils } from 'shared/fixtures/utils'

type Extensions = { utils: Utils }

export const test = base.extend<Extensions>({
  utils: ({ page }, use) => use(createUtils(page)),
})

if (!IS_CI && PAUSE_ON_FAILURE) {
  test.afterEach(pauseOnFailure)
}

export type Test = typeof test

export { expect } from '@playwright/test'
