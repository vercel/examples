import { baseFixture } from 'shared/base-fixture'

export const test = baseFixture

export type Test = typeof test

export { expect } from '@playwright/test'
