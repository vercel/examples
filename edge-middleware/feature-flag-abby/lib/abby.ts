import { createAbby } from '@tryabby/next'

if (typeof process.env.NEXT_PUBLIC_ABBY_PROJECT_ID != 'string') {
  throw new Error('NEXT_PUBLIC_ABBY_PROJECT_ID is not defined')
}

export const abby = createAbby({
  projectId: process.env.NEXT_PUBLIC_ABBY_PROJECT_ID,
  currentEnvironment: 'default',
  tests: {
    Home: {
      variants: ['A', 'B', 'C'],
    },
    Marketing: {
      variants: ['b', 'c', 'original'],
    },
  },
  flags: ['clientFlag', 'serverFlag'],
})
