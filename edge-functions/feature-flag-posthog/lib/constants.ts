/**
 * List of known active Feature Flags
 */
export const FEATURE_FLAGS = {
  NEW_ABOUT_PAGE: 'New_About_Page',
  NEW_MARKETING_PAGE: 'New_Marketing_Page',
  NEW_PRODUCT_PAGE: 'New_Product_Page',
} as const

export type FEATURE_FLAGS = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS]

export const DISTINCT_ID_COOKIE_NAME = 'distinct_id'
