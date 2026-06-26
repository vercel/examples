/**
 * Returns the base URL for tRPC requests.
 * - Browser: empty string (relative path avoids CORS issues with www vs bare domain)
 * - Server (SSR): absolute URL from VERCEL_URL or localhost fallback
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? '3000'}`
}
