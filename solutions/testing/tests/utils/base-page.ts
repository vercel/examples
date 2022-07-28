import type { Page, Response } from '@playwright/test'

export abstract class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
    this.validateGetLocatorMethods()
  }

  abstract goto(...args: unknown[]): Promise<null | Response>

  abstract path(...args: unknown[]): void

  private validateGetLocatorMethods() {
    const prototype = Reflect.getPrototypeOf(this)
    if (!prototype) return

    console.log('PROTOTYPE', prototype)
  }
}
