import { createHash, randomUUID } from 'node:crypto'
import { jwtVerify, SignJWT } from 'jose'
import type { AuthFn } from 'eve/channels/auth'
import { DEFAULT_MODEL, SUPPORTED_MODELS } from '../ai/constants'

const issuer = 'vibe-coding-platform'

function secret() {
  const value = process.env.PROJECT_SECRET
  if (!value || value.length < 32) {
    throw new Error(
      'Set PROJECT_SECRET to a random value of at least 32 characters.'
    )
  }
  return new TextEncoder().encode(value)
}

export function workspaceName(sessionId: string) {
  return `vibe-${createHash('sha256').update(sessionId).digest('hex').slice(0, 32)}`
}

export async function signProjectToken(sessionId?: string) {
  return new SignJWT({ sessionId, grant: sessionId ? 'session' : 'create' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(issuer)
    .setAudience('vibe-project')
    .setSubject(sessionId ?? randomUUID())
    .setIssuedAt()
    .setExpirationTime(sessionId ? '30d' : '1m')
    .sign(secret())
}

export async function verifyProjectToken(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer /i, '')
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ['HS256'],
      issuer,
      audience: 'vibe-project',
    })
    if (payload.grant === 'create') return { grant: 'create' as const }
    if (payload.grant === 'session' && typeof payload.sessionId === 'string') {
      return { grant: 'session' as const, sessionId: payload.sessionId }
    }
  } catch {
    return null
  }
  return null
}

export const authorizeAgent: AuthFn<Request> = async (request) => {
  const token = await verifyProjectToken(request)
  const path = new URL(request.url).pathname
  if (!token) return null
  if (token.grant === 'create') {
    if (request.method !== 'POST' || !path.endsWith('/v1/session')) return null
    return {
      authenticator: 'project',
      principalType: 'app' as const,
      principalId: 'project-bootstrap',
      attributes: { modelId: DEFAULT_MODEL, reasoningEffort: 'low' },
    }
  }
  const match = path.match(/\/v1\/session\/([^/]+)(?:\/|$)/)
  if (!match || decodeURIComponent(match[1]) !== token.sessionId) return null
  const requested = request.headers.get('x-model-id') ?? DEFAULT_MODEL
  const modelId = SUPPORTED_MODELS.includes(requested)
    ? requested
    : DEFAULT_MODEL
  const reasoningEffort =
    request.headers.get('x-reasoning-effort') === 'medium' ? 'medium' : 'low'
  return {
    authenticator: 'project',
    principalType: 'user' as const,
    principalId: token.sessionId,
    attributes: { modelId, reasoningEffort },
  }
}

export async function authorizeWorkspace(request: Request, name: string) {
  const token = await verifyProjectToken(request)
  return token?.grant === 'session' && workspaceName(token.sessionId) === name
}
