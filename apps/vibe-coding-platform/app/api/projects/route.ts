import { checkBotId } from 'botid/server'
import { signProjectToken } from '@/lib/project-auth'

export async function POST(request: Request) {
  if ((await checkBotId()).isBot) {
    return Response.json({ error: 'Bot detected' }, { status: 403 })
  }
  const headers = new Headers({
    authorization: `Bearer ${await signProjectToken()}`,
    'content-type': 'application/json',
  })
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers.set(
      'x-vercel-protection-bypass',
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    )
  }
  const response = await fetch(new URL('/eve/v1/session', request.url), {
    method: 'POST',
    headers,
    body: '{}',
    signal: AbortSignal.timeout(60_000),
  })
  if (!response.ok) {
    return Response.json(
      { error: 'Could not create the agent session.' },
      { status: 502 }
    )
  }
  const { sessionId } = await response.json()
  if (typeof sessionId !== 'string') throw new Error('Missing eve session ID')
  return Response.json(
    { sessionId, token: await signProjectToken(sessionId) },
    {
      headers: { 'cache-control': 'no-store' },
    }
  )
}
