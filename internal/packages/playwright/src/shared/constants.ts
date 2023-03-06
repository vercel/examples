export const IS_CI = Boolean(process.env.CI)

export const OPEN_DEVTOOLS = Boolean(process.env.OPEN_DEVTOOLS)

export const PAUSE_ON_FAILURE = Boolean(process.env.PAUSE_ON_FAILURE)

export const TEST_TYPE = process.env.TEST_TYPE

if (TEST_TYPE && !['e2e', 'integration'].includes(TEST_TYPE)) {
  throw new Error('⛔️ TEST_TYPE must be either "e2e" or "integration"')
}

export const BASE_URL =
  typeof process.env.BASE_URL === 'string'
    ? process.env.BASE_URL
    : 'http://localhost:3000'
