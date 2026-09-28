import { checkBotId } from 'botid/server'
import { authorizeWorkspace, verifyProjectToken } from '@/lib/project-auth'
import { listFiles, openWorkspace, previewOutput } from '@/lib/workspace'
import { adaptProjectSandbox } from '@/agent/lib/project-sandbox'
import { getRunningWorkspace } from '@/lib/running-workspace'

type Context = { params: Promise<{ sandboxId: string }> }

export async function GET(request: Request, { params }: Context) {
  const { sandboxId } = await params
  if (!(await authorizeWorkspace(request, sandboxId)))
    return new Response(null, { status: 403 })
  const sandbox = await getRunningWorkspace(sandboxId)
  return Response.json(
    {
      ...(sandbox ? await previewOutput(sandbox) : null),
      status: sandbox ? 'running' : 'stopped',
    },
    { headers: { 'cache-control': 'no-store' } }
  )
}

export async function POST(request: Request, { params }: Context) {
  const { sandboxId } = await params
  const token = await verifyProjectToken(request)
  if (
    token?.grant !== 'session' ||
    !(await authorizeWorkspace(request, sandboxId))
  ) {
    return new Response(null, { status: 403 })
  }
  if ((await checkBotId()).isBot) {
    return Response.json({ error: 'Bot detected' }, { status: 403 })
  }
  const sandbox = await openWorkspace(token.sessionId)
  return Response.json({
    sandboxId: sandbox.name,
    paths: await listFiles(adaptProjectSandbox(sandbox).sandbox),
    replacePaths: true,
    ...(await previewOutput(sandbox)),
  })
}
