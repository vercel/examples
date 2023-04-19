import { IS_CI, PAUSE_ON_FAILURE } from './constants'
import pauseOnFailure from './fixtures/pause-on-failure'
import { createUtils, type Utils } from './fixtures/utils'
import { applitoolsTest } from './applitools'

type BaseExtensions = { utils: Utils }

const test = applitoolsTest({ appName: 'Main Site' })

export const baseFixture = test.extend<BaseExtensions>({
  utils: ({ page }, use) => use(createUtils(page)),
})

export type Test = typeof baseFixture

if (!IS_CI && PAUSE_ON_FAILURE) {
  baseFixture.afterEach(pauseOnFailure)
}
