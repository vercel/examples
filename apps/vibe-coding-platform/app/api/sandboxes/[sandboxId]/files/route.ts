import { Sandbox } from '@vercel/sandbox'
import { authorizeWorkspace } from '@/lib/project-auth'
import { projectPath } from '@/lib/workspace'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sandboxId: string }> }
) {
  const { sandboxId } = await params
  if (!(await authorizeWorkspace(request, sandboxId)))
    return new Response(null, { status: 403 })
  const requested = new URL(request.url).searchParams.get('path')
  let path: string
  try {
    path = projectPath(requested ?? '')
  } catch {
    return Response.json({ error: 'Invalid project path' }, { status: 400 })
  }
  const sandbox = await Sandbox.get({ name: sandboxId, resume: false })
  const content = await sandbox.readFileToBuffer({ path })
  if (!content) return new Response(null, { status: 404 })
  return new Response(new Uint8Array(content), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}
