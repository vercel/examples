import type { Locator, Page } from '@playwright/test'
import { tid } from 'main-site/lib/data-testid'

export const createUtils = (page: Page) => ({
  /**
   * Returns a locator that matches the given data-testid.
   * @param args - The data-testid to match.
   */
  getByTestId: (...args: string[]) =>
    page.locator(`data-testid=${tid(...args)}`),
  getByTestIdWithinElement: (element: Locator, ...args: string[]) =>
    element.locator(`data-testid=${tid(...args)}`),
  /**
   * Returns true when a viewport is mobile.
   *
   * Useful for when different selectors are needed at different screen sizes.
   */
  isMobileViewport: () => (page.viewportSize()?.width ?? 0) <= 600,
})

export type Utils = ReturnType<typeof createUtils>
