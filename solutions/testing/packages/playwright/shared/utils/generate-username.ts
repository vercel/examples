import { randomUUID } from 'crypto'

/**
 * Generates a random username for testing purposes.
 *
 * @returns A username
 */
export default function generateUsername() {
  // This function is also intended to be used for E2E testing, so the goal of
  // having a prefix like `test123-` is that cleaning users from the production
  // environment (and other records owned by that user) becomes easier
  return `test123-${randomUUID()}`
}
