// @ts-check
const nextJest = require('next/jest')
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

/** @typedef {import('@jest/types').Config.InitialOptions} JestConfigOptions */

// Add any custom config to be passed to Jest
/** @type {JestConfigOptions} */
const customJestConfig = {
  testMatch: ['./**/*.test.{ts,tsx}'],
  collectCoverageFrom: ['./**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['<rootDir>/playwright/'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  // moduleDirectories: ['node_modules', '<rootDir>/'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
