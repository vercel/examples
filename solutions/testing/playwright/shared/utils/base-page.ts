import type { Locator, Page, Response } from '@playwright/test'
import { createApiMocks, type MockApi } from 'integration/apis'
import createApiMockFn from 'integration/utils/create-mock-api'
import { createUtils, type Utils } from 'shared/fixtures/utils'

export abstract class BasePage {
  readonly page: Page
  private _utils?: Utils
  private _mockApi?: MockApi

  get utils() {
    return this._utils || (this._utils = createUtils(this.page))
  }

  get mockApi() {
    return (
      this._mockApi ||
      (this._mockApi = createApiMocks(createApiMockFn(this.page)))
    )
  }

  constructor(page: Page) {
    this.page = page
  }

  abstract goto(...args: unknown[]): Promise<null | Response>

  abstract path(...args: unknown[]): void

  // Ensure that functions prefixed by `get` return Playwright Locators
  [key: `get${string}`]: (...args: any[]) => Locator | Record<string, Locator>
}
