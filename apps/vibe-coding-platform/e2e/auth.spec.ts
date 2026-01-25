import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
  })

  test('should show register page', async ({ page }) => {
    await page.goto('/register')

    await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible()
    await expect(page.getByPlaceholder(/name/i)).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
  })

  test('should navigate from login to register', async ({ page }) => {
    await page.goto('/login')

    await page.click('text=Sign up')
    await expect(page).toHaveURL('/register')
  })

  test('should navigate from register to login', async ({ page }) => {
    await page.goto('/register')

    await page.click('text=Sign in')
    await expect(page).toHaveURL('/login')
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login')

    await page.click('button[type="submit"]')

    // Browser native validation should prevent submission
    const emailInput = page.getByPlaceholder(/email/i)
    await expect(emailInput).toBeFocused()
  })

  test('should show OAuth buttons', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('button', { name: /github/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
  })
})

test.describe('Protected Routes', () => {
  test('should redirect to login from dashboard when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect to login from projects when not authenticated', async ({ page }) => {
    await page.goto('/projects/123')

    await expect(page).toHaveURL(/\/login/)
  })
})
