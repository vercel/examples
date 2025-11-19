/**
 * Trigger.dev client configuration for the frontend.
 *
 * Note: In Trigger.dev v3, you don't need to manually create a client.
 * The SDK handles this automatically when you use `tasks` from "@trigger.dev/sdk/v3".
 *
 * This file exports helper functions for checking configuration.
 */

/**
 * Check if Trigger.dev is properly configured
 */
export function isTriggerConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_TRIGGER_API_KEY &&
    process.env.NEXT_PUBLIC_TRIGGER_API_URL
  )
}

/**
 * Get the Trigger.dev API configuration
 */
export function getTriggerConfig() {
  console.log(
    'getTriggerConfig',
    process.env.NEXT_PUBLIC_TRIGGER_API_KEY,
    process.env.NEXT_PUBLIC_TRIGGER_API_URL
  )
  return {
    apiKey: process.env.NEXT_PUBLIC_TRIGGER_API_KEY || '',
    apiUrl:
      process.env.NEXT_PUBLIC_TRIGGER_API_URL || 'https://api.trigger.dev',
  }
}
