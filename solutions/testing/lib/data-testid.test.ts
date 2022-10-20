import { tid } from './data-testid'

describe('tid', () => {
  test('should return an empty string if there are no parameters', () => {
    const testId = tid()
    expect(testId).toBe('')
  })

  test('should return an empty string for empty ids', () => {
    expect(tid('')).toBe('')
    expect(tid(['', ''])).toBe('')
    expect(tid('', '', '')).toBe('')
  })

  test('should return the same id if there is only one string param', () => {
    expect(tid('id')).toBe('id')
  })

  test('should return the same id if there is an array with a single id', () => {
    expect(tid(['id'])).toBe('id')
  })

  test('should join and return a test id for multiple string params', () => {
    expect(tid('id', '123', 'abc')).toBe('id/123/abc')
  })

  test('should join and return a test id for an array with multiple ids', () => {
    expect(tid(['id', '123', 'abc'])).toBe('id/123/abc')
  })
})
