export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST!

export const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY!

if (!POSTHOG_HOST) {
  throw new Error(
    'The environment variable NEXT_PUBLIC_POSTHOG_HOST is missing.'
  )
}
if (!POSTHOG_API_KEY) {
  throw new Error(
    'The environment variable NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY is missing.'
  )
}

export const DISTINCT_ID_COOKIE_NAME = 'distinct_id'

/**
 * List of known active Feature Flags
 */
export const FLAGS = {
  NEW_ABOUT_PAGE: 'New_About_Page',
  NEW_MARKETING_PAGE: 'New_Marketing_Page',
  NEW_PRODUCT_PAGE: 'New_Product_Page',
} as const

export type Flags = typeof FLAGS[keyof typeof FLAGS]
