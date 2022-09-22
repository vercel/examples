import { SearchParamsProperties } from './types'

export function hasMatchingParams(
  mockSearchParams: Record<string, SearchParamsProperties>,
  requestSearchParams: URLSearchParams
): boolean {
  const mockSearchParamKeys = Object.keys(mockSearchParams)
  const mockSearchParamsCount = mockSearchParamKeys.length
  const requestSearchParamsKeys = Array.from(requestSearchParams.keys())
  const requestSearchParamsCount = requestSearchParamsKeys.length
  // No search params to check
  if (mockSearchParamsCount === 0 && requestSearchParamsCount === 0) {
    return true
  }

  const extraRequestParams = requestSearchParamsKeys.filter(
    (key) => !mockSearchParamKeys.includes(key)
  )
  if (extraRequestParams.length > 0) {
    return false
  }

  return Object.entries(mockSearchParams).every(
    ([key, { value, optional }]) => {
      const requestValue = requestSearchParams.get(key)
      // Value is optional, so if there is no request value, it still matches.
      if (optional && !requestValue) return true
      if (!requestValue) return false

      // '*' matches any value
      if (value === '*') return true

      if (value instanceof RegExp) {
        return value.test(requestValue)
      }
      return value === requestValue
    }
  )
}
