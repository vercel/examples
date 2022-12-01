import { hasMatchingParams } from './has-matching-params'

describe('hasMatchingParams', () => {
  test('should return true if there are no parameters', () => {
    const requestParams = new URLSearchParams()
    expect(hasMatchingParams({}, requestParams)).toBe(true)
  })

  test('should return false if the request has extra parameters', () => {
    const requestParams = new URLSearchParams({
      team: 'acme',
      query: 'hello',
      extra: 'param',
    })
    expect(
      hasMatchingParams(
        {
          team: { value: 'acme', optional: false },
          query: { value: 'hello', optional: false },
        },
        requestParams
      )
    ).toBe(false)
  })

  test('should return true if there is an optional parameter and it is not present in the request', () => {
    const requestParams = new URLSearchParams({
      team: 'acme',
    })
    expect(
      hasMatchingParams(
        {
          team: { value: 'acme', optional: false },
          query: { value: 'hello', optional: true },
        },
        requestParams
      )
    ).toBe(true)
  })

  test('should return true if there is an optional parameter and it is present in the request', () => {
    const requestParams = new URLSearchParams({
      team: 'acme',
      query: 'hello',
    })
    expect(
      hasMatchingParams(
        {
          team: { value: 'acme', optional: false },
          query: { value: 'hello', optional: true },
        },
        requestParams
      )
    ).toBe(true)
  })

  test('should return true if all mock params match their request params', () => {
    const requestParams = new URLSearchParams({
      team: 'acme',
      query: 'hello',
    })
    expect(
      hasMatchingParams(
        {
          team: { value: 'acme', optional: false },
          query: { value: 'hello', optional: false },
        },
        requestParams
      )
    ).toBe(true)
  })

  test("should return false if just one mock params doesn't match their request param", () => {
    const requestParams = new URLSearchParams({
      team: 'acme',
      query: 'hello0',
    })
    expect(
      hasMatchingParams(
        {
          team: { value: 'acme', optional: false },
          query: { value: 'hello', optional: false },
        },
        requestParams
      )
    ).toBe(false)
  })

  test('should support regexs for matching params', () => {
    const requestParams = new URLSearchParams({
      team: 'acme',
      query: 'hello',
    })
    expect(
      hasMatchingParams(
        {
          team: { value: /(?:acme|hello)/, optional: false },
          query: { value: /^hel.+/, optional: false },
        },
        requestParams
      )
    ).toBe(true)
  })

  test("should log a message when the regex doesn't match", () => {
    const requestParams = new URLSearchParams({
      team: 'acme',
      query: 'h3llo',
    })
    expect(
      hasMatchingParams(
        {
          team: { value: /(?:hello)/, optional: false },
          query: { value: /^hel.+/, optional: false },
        },
        requestParams
      )
    ).toBe(false)
  })

  test('should support a wildcard match all', () => {
    const requestParams = new URLSearchParams({
      team: 'acme',
    })
    expect(
      hasMatchingParams(
        {
          team: { value: '*', optional: false },
        },
        requestParams
      )
    ).toBe(true)
  })
})
