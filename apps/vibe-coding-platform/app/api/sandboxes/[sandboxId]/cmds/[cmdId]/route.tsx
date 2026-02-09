import { NextResponse, type NextRequest } from 'next/server'
import { Sandbox } from '@e2b/sdk'

interface Params {
  sandboxId: string
  cmdId: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const cmdParams = await params
  const sandbox = await Sandbox.reconnect(cmdParams.sandboxId)

  // E2B doesn't have a getCommand method like Vercel Sandbox
  // The command execution is typically handled through Trigger.dev tasks
  // This endpoint may not be needed with E2B's architecture
  return NextResponse.json({
    sandboxId: sandbox.id,
    cmdId: cmdParams.cmdId,
    message: 'Command status tracking is handled via Trigger.dev tasks',
  })
}
