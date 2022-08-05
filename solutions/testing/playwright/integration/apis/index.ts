import { CreateMockFn } from 'integration/utils/types'
import { createUserMocks } from './user'

export const createApiMocks = (createMockFn: CreateMockFn) => ({
  user: createUserMocks(createMockFn),
})

export type MockApi = ReturnType<typeof createApiMocks>
