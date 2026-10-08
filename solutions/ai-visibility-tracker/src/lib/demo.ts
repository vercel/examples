/**
 * Demo mode (DEMO_MODE=1) opens every page to visitors without a password and
 * refuses writes from them. The admin can still sign in and change things.
 * Used for the public demo deployment; never set it on a real tracker.
 */
export function isDemoMode(): boolean {
  const value = process.env.DEMO_MODE?.trim().toLowerCase()
  return value === '1' || value === 'true'
}

export const DEMO_READ_ONLY_MESSAGE =
  'This demo is read-only. Deploy your own copy to make changes.'
