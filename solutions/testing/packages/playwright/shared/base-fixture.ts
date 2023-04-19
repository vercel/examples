import { test as base } from '@playwright/test'
import { IS_CI, PAUSE_ON_FAILURE } from './constants'
import pauseOnFailure from './fixtures/pause-on-failure'
import { createUtils, type Utils } from './fixtures/utils'
import {
  ApplitoolsExtensions,
  applitools,
  setupApplitoolsEyes,
} from './applitools'

type BaseExtensions = { utils: Utils }

export const baseFixture = base.extend<BaseExtensions & ApplitoolsExtensions>({
  utils: ({ page }, use) => use(createUtils(page)),
  applitools: [applitools, { option: true }],
})

if (!IS_CI && PAUSE_ON_FAILURE) {
  baseFixture.afterEach(pauseOnFailure)
}

setupApplitoolsEyes(baseFixture)
