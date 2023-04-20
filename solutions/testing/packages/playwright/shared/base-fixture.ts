import { IS_CI, PAUSE_ON_FAILURE } from './constants'
import pauseOnFailure from './fixtures/pause-on-failure'
import { createUtils, type Utils } from './fixtures/utils'
import { applitoolsTest } from './applitools'
import {
  BrowserType,
  DeviceName,
  ScreenOrientation,
} from '@applitools/eyes-playwright'

type BaseExtensions = { utils: Utils }

const test = applitoolsTest({
  appName: 'Main Site',
  config(config) {
    // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
    // Other browsers are also available, like Edge and IE.
    config.addBrowser(1600, 1200, BrowserType.CHROME)
    // config.addBrowser(1024, 768, BrowserType.SAFARI)
    // config.addBrowser(800, 600, BrowserType.FIREFOX)

    // Add 2 mobile emulation devices with different orientations
    // config.addDeviceEmulation(DeviceName.iPhone_11, ScreenOrientation.PORTRAIT)
    // config.addDeviceEmulation(DeviceName.Pixel_3, ScreenOrientation.LANDSCAPE)

    return config
  },
})

export const baseFixture = test.extend<BaseExtensions>({
  utils: ({ page }, use) => use(createUtils(page)),
})

export type Test = typeof baseFixture

if (!IS_CI && PAUSE_ON_FAILURE) {
  baseFixture.afterEach(pauseOnFailure)
}
