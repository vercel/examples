import { APIError, Sandbox } from '@vercel/sandbox'
import { authorizeWorkspace, verifyProjectToken } from '@/lib/project-auth'
import { listFiles, openWorkspace, previewOutput } from '@/lib/workspace'

type Context = { params: Promise<{ sandboxId: string }> }

export async function GET(request: Request, { params }: Context) {
  const { sandboxId } = await params
  if (!(await authorizeWorkspace(request, sandboxId)))
    return new Response(null, { status: 403 })
  try {
    const sandbox = await Sandbox.get({ name: sandboxId, resume: false })
    return Response.json(
      {
        ...(sandbox.status === 'running' ? await previewOutput(sandbox) : null),
        status: sandbox.status === 'running' ? 'running' : 'stopped',
      },
      {
        headers: { 'cache-control': 'no-store' },
      }
    )
  } catch (error) {
    if (error instanceof APIError && error.response.status === 404) {
      return Response.json({ status: 'stopped' })
    }
    throw error
  }
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
  const sandbox = await openWorkspace(token.sessionId)
  return Response.json({
    sandboxId: sandbox.name,
    paths: await listFiles(sandbox),
    replacePaths: true,
    ...(await previewOutput(sandbox)),
  })
}
