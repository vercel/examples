import { CreateMockFn, HTTPMethod } from 'integration/utils/types'

export const createTodosMocks = (createMockFn: CreateMockFn) => ({
  todo: {
    get: createMockFn({
      path: '/api/todo',
      method: HTTPMethod.Get,
      body: {},
    }),
    post: createMockFn({
      path: '/api/todo',
      method: HTTPMethod.Post,
      body: {},
    }),
    patch: createMockFn({
      path: '/api/todo',
      method: HTTPMethod.Patch,
      body: {},
    }),
    delete: createMockFn({
      path: '/api/todo',
      method: HTTPMethod.Delete,
      body: {},
    }),
  },
})
