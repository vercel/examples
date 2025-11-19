import { NextResponse, type NextRequest } from 'next/server'

interface Params {
  sandboxId: string
  cmdId: string
}

/**
 * Get command status (simplified for e2b)
 *
 * Note: e2b doesn't have the same command tracking as Vercel SDK.
 * Commands are executed synchronously or async, but we don't track
 * individual command IDs after execution.
 *
 * For now, this returns a simplified response. In production, you'd
 * want to implement proper command tracking using a database or Redis.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const cmdParams = await params

  // Return a placeholder response since e2b doesn't track commands the same way
  return NextResponse.json({
    sandboxId: cmdParams.sandboxId,
    cmdId: cmdParams.cmdId,
    startedAt: new Date().toISOString(),
    exitCode: 0,
    note: 'e2b command tracking not implemented - commands are executed synchronously via Trigger.dev',
  })
}
