import {
  isSessionMutation,
  signRelayToken,
  verifyProjectToken,
} from './project-auth'

export async function relayEveRequest(
  request: Request,
  path: string,
  checkBot: () => Promise<{ isBot: boolean }>
) {
  const token = await verifyProjectToken(request)
  if (token?.grant !== 'session') return new Response(null, { status: 403 })
  const sessionPath = `/eve/v1/session/${encodeURIComponent(token.sessionId)}`
  const mutation =
    request.method === 'POST' && isSessionMutation(path, sessionPath)
  const stream = request.method === 'GET' && path === `${sessionPath}/stream`
  if (!mutation && !stream) return new Response(null, { status: 403 })
  if (mutation && (await checkBot()).isBot) {
    return Response.json({ error: 'Bot detected' }, { status: 403 })
  }

  const headers = new Headers()
  for (const name of ['content-type', 'x-model-id', 'x-reasoning-effort']) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }
  headers.set(
    'authorization',
    mutation
      ? `Bearer ${await signRelayToken(token.sessionId, path)}`
      : request.headers.get('authorization')!
  )
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers.set(
      'x-vercel-protection-bypass',
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    )
  }
  const target = new URL(path, request.url)
  target.search = new URL(request.url).search
  const response = await fetch(target, {
    method: request.method,
    headers,
    body: mutation ? await request.text() : undefined,
    signal: request.signal,
    redirect: 'manual',
  })
  const responseHeaders = new Headers({ 'cache-control': 'no-store' })
  for (const [name, value] of response.headers) {
    if (
      name.startsWith('x-eve-') ||
      ['content-type', 'retry-after', 'www-authenticate'].includes(name)
    ) {
      responseHeaders.set(name, value)
    }
  }
  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
}
