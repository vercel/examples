import type { Response } from '@playwright/test'

export enum HTTPMethod {
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

/**
 * Allows for matching search params by a fixed value, any value (`*`),
 * or one that matches a regular expression.
 */
type SearchParams = Record<string, SearchParamsValue | SearchParamsProperties>

/**
 * The configuration that can be used by the API to create mocks
 */
interface ServiceConfig<T> {
  path: string
  method: HTTPMethod
  pathParams?: Record<string, string>
  searchParams?: SearchParams
  status?: number
  body: T
}

/**
 * Custom configuration that can be used by the test to extend the mock
 * before applying it. All keys are optional.
 */
interface CreateMockConfig<T> {
  pathParams?: Record<string, string>
  searchParams?: SearchParams
  status?: number
  body?: T | ((body: T) => T)
  times?: number
}

/**
 * Setups an API mock for the selected `path`.
 *
 * @param serviceConfig Tells how to mock the `path`.
 * @returns A new function that will implement the mock in
 * the test that calls it.
 */
export type CreateMockFn = <T>(serviceConfig: ServiceConfig<T>) => (
  config?: CreateMockConfig<T>
) => Promise<
  [
    /**
     * Returns an instance of `page.waitForResponse` which returns
     * a `Response` that matches the mock.
     */
    waitForResponse: (
      matcher?: (response: Response) => boolean
    ) => Promise<Response>,
    /**
     * Returns the response body that was used by the API mock.
     */
    getResponseBody: () => T
  ]
>
