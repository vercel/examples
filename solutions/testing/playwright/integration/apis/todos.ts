import { todosBody } from 'integration/fixtures/api-todos/todos'
import { type CreateMockFn, HTTPMethod } from 'integration/utils/types'

export const createTodosMocks = (createMockFn: CreateMockFn) => ({
  todo: {
    get: createMockFn({
      path: '/api/todo',
      method: HTTPMethod.Get,
      body: todosBody,
    }),
    post: createMockFn({
      path: '/api/todo',
      method: HTTPMethod.Post,
      body: todosBody,
    }),
    patch: createMockFn({
      path: '/api/todo',
      method: HTTPMethod.Patch,
      body: todosBody,
    }),
    delete: createMockFn({
      path: '/api/todo',
      method: HTTPMethod.Delete,
      body: todosBody,
    }),
  },
})
