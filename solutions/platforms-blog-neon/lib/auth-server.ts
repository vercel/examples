import 'server-only'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { requireEnv } from '@/lib/env'

// Verify a Neon Auth JWT on the server against the project's JWKS, and return
// the user id (the `sub` claim). Used to authorize the image upload route.
const jwks = createRemoteJWKSet(
  new URL(requireEnv(process.env.NEON_JWKS_URL, 'NEON_JWKS_URL'))
)

export async function getUserIdFromRequest(
  request: Request
): Promise<string | null> {
  const header = request.headers.get('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, jwks)
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch {
    return null
  }
}
