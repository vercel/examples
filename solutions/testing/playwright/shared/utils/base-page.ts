import type { Locator, Page, Response } from '@playwright/test'

export abstract class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  abstract goto(...args: unknown[]): Promise<null | Response>

  abstract path(...args: unknown[]): void

  // Ensure that functions prefixed by `get` return Playwright Locators
  [key: `get${string}`]: (...args: any[]) => Locator | Record<string, Locator>
}
