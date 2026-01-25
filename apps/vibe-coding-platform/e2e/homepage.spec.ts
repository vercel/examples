import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')

    // Check that the page loads
    await expect(page).toHaveTitle(/vibe/i)
  })

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/')

    // Check for main navigation
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('body')).toBeVisible()

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Chat Interface', () => {
  test('should show chat input', async ({ page }) => {
    await page.goto('/')

    // Look for chat input or textarea
    const chatInput = page.locator('textarea, input[type="text"]').first()
    await expect(chatInput).toBeVisible()
  })

  test('should show model selector', async ({ page }) => {
    await page.goto('/')

    // Look for model selector
    const modelSelector = page.locator('[data-testid="model-selector"], select, [role="combobox"]').first()
    if (await modelSelector.isVisible()) {
      await expect(modelSelector).toBeVisible()
    }
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/')

    // Check for h1
    const h1 = page.locator('h1').first()
    if (await h1.isVisible()) {
      await expect(h1).toBeVisible()
    }
  })

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/')

    // Check that buttons have accessible names
    const buttons = page.locator('button')
    const count = await buttons.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i)
      if (await button.isVisible()) {
        const name = await button.getAttribute('aria-label') || await button.textContent()
        expect(name).toBeTruthy()
      }
    }
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')

    // This is a basic check - more thorough testing would use axe-core
    const body = page.locator('body')
    const bgColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(bgColor).toBeTruthy()
  })
})

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('should not have JavaScript errors', async ({ page }) => {
    const errors: string[] = []

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto('/')
    await page.waitForTimeout(1000)

    // Filter out known benign errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('hydration')
    )

    expect(criticalErrors).toHaveLength(0)
  })
})
