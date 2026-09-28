import { NextResponse, type NextRequest } from 'next/server'
import { getRunningWorkspace, workspaceStopped } from '@/lib/running-workspace'
import { authorizeWorkspace } from '@/lib/project-auth'

interface Params {
  sandboxId: string
  cmdId: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const logParams = await params
  if (!(await authorizeWorkspace(request, logParams.sandboxId)))
    return new NextResponse(null, { status: 403 })
  const encoder = new TextEncoder()
  const sandbox = await getRunningWorkspace(logParams.sandboxId)
  if (!sandbox) return workspaceStopped()
  const command = await sandbox.getCommand(logParams.cmdId)

  return new NextResponse(
    new ReadableStream({
      async pull(controller) {
        for await (const logline of command.logs({ signal: request.signal })) {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                data: logline.data,
                stream: logline.stream,
                timestamp: Date.now(),
              }) + '\n'
            )
          )
        }
        controller.close()
      },
    }),
    { headers: { 'Content-Type': 'application/x-ndjson' } }
  )
}
