import type { Response } from '@playwright/test'

enum HTTPMethod {
  Delete = 'DELETE',
  Get = 'GET',
  Patch = 'PATCH',
  Post = 'POST',
}

type SearchParamsValue = '*' | string | RegExp

export interface SearchParamsProperties {
  value: SearchParamsValue
  optional: boolean
}

type SearchParams = Record<string, SearchParamsValue | SearchParamsProperties>

interface ServiceConfig<T> {
  path: string
  method: HTTPMethod
  pathParams?: Record<string, string>
  searchParams?: SearchParams
  status?: number
  body: T
}

interface CreateMockConfig<T> {
  pathParams?: Record<string, string>
  searchParams?: SearchParams
  status?: number
  body?: T | ((body: T) => T)
  times?: number
}

export type CreateMockFn = <T>(
  serviceConfig: ServiceConfig<T>
) => (
  config?: CreateMockConfig<T>
) => Promise<
  [waitForResponse: () => Promise<Response>, getLastResponseBody: () => T]
>
