import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to https://demo.playwright.dev/todomvc/
  await page.goto('https://demo.playwright.dev/todomvc/')

  // Go to https://demo.playwright.dev/todomvc/#/
  await page.goto('https://demo.playwright.dev/todomvc/#/')

  // Click [placeholder="What needs to be done\?"]
  await page.locator('[placeholder="What needs to be done\\?"]').click()

  // Fill [placeholder="What needs to be done\?"]
  await page
    .locator('[placeholder="What needs to be done\\?"]')
    .fill('Hello todo!')

  // Press Enter
  await page.locator('[placeholder="What needs to be done\\?"]').press('Enter')

  // Check input[type="checkbox"] >> nth=1
  await page.locator('input[type="checkbox"]').nth(1).check()

  // Click text=Clear completed
  await page.locator('text=Clear completed').click()
})
