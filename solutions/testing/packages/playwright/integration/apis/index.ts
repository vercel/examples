import { CreateMockFn } from 'integration/utils/types'
import { createTodosMocks } from './todos'
import { createUserMocks } from './user'

export const createApiMocks = (createMockFn: CreateMockFn) => ({
  user: createUserMocks(createMockFn),
  todos: createTodosMocks(createMockFn),
})

export type MockApi = ReturnType<typeof createApiMocks>
