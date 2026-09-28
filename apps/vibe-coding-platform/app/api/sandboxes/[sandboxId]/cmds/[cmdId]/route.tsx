import { NextResponse, type NextRequest } from 'next/server'
import { Sandbox } from '@vercel/sandbox'
import { authorizeWorkspace } from '@/lib/project-auth'

interface Params {
  sandboxId: string
  cmdId: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const cmdParams = await params
  if (!(await authorizeWorkspace(request, cmdParams.sandboxId)))
    return new NextResponse(null, { status: 403 })
  const sandbox = await Sandbox.get({
    name: cmdParams.sandboxId,
    resume: false,
  })
  const command = await sandbox.getCommand(cmdParams.cmdId)

  /**
   * The wait can get to fail when the Sandbox is stopped but the command
   * was still running. In such case we return empty for finish data.
   */
  const done = await command.wait({ signal: request.signal }).catch(() => null)
  return NextResponse.json({
    sandboxId: sandbox.name,
    cmdId: command.cmdId,
    startedAt: command.startedAt,
    exitCode: done?.exitCode,
  })
}
