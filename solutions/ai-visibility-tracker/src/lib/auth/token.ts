/**
 * Session tokens are an HMAC of a fixed label keyed by the admin password, so
 * they contain nothing secret, cannot be reversed into the password, and are
 * invalidated by changing the password. Web Crypto only: this file is shared by
 * the proxy (edge-compatible) and the server.
 */
export const SESSION_COOKIE = 'avt_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

const SESSION_LABEL = 'ai-visibility-tracker:session:v1'

export async function deriveSessionToken(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(SESSION_LABEL)
  )
  return toHex(signature)
}

/** Constant-time string comparison (both strings are hex of equal length when valid). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export async function isValidSessionToken(
  token: string | undefined,
  password: string
): Promise<boolean> {
  if (!token || !password) return false
  return safeEqual(token, await deriveSessionToken(password))
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) =>
    b.toString(16).padStart(2, '0')
  ).join('')
}
