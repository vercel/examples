import { type CreateMockFn, HTTPMethod } from 'integration/utils/types'

export const createUserMocks = (createMockFn: CreateMockFn) => ({
  signup: {
    post: createMockFn({
      path: '/api/signup',
      method: HTTPMethod.Post,
      body: { success: true },
    }),
  },
})
