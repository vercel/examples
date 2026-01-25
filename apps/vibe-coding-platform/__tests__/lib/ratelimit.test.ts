import { checkRateLimit, checkAuthRateLimit, checkAIRateLimit } from '@/lib/ratelimit'

describe('Rate Limiting', () => {
  describe('checkRateLimit', () => {
    it('should allow requests under the limit', async () => {
      const result = await checkRateLimit('test-user-1')
      expect(result.success).toBe(true)
      expect(result.remaining).toBeLessThan(result.limit)
    })

    it('should return remaining count after multiple requests', async () => {
      const userId = `test-user-${Date.now()}`

      const result1 = await checkRateLimit(userId)
      expect(result1.success).toBe(true)

      const result2 = await checkRateLimit(userId)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBeLessThan(result1.remaining)
    })
  })

  describe('checkAuthRateLimit', () => {
    it('should allow auth requests under the limit', async () => {
      const result = await checkAuthRateLimit('auth-test-user-1')
      expect(result.success).toBe(true)
      expect(result.limit).toBe(10) // Auth limit is 10 per minute
    })
  })

  describe('checkAIRateLimit', () => {
    it('should allow AI requests under the limit', async () => {
      const result = await checkAIRateLimit('ai-test-user-1')
      expect(result.success).toBe(true)
      expect(result.limit).toBe(20) // AI limit is 20 per minute
    })
  })
})
