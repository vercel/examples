import { NextResponse, type NextRequest } from 'next/server'
import { getCommandLogs, getLogCount } from '@/lib/log-store'

interface Params {
  sandboxId: string
  cmdId: string
}

/**
 * Get command status and summary
 *
 * Returns the current status of a command including log count and exit code.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { sandboxId, cmdId } = await params

  const logData = getCommandLogs(cmdId)

  if (!logData) {
    return NextResponse.json(
      {
        sandboxId,
        cmdId,
        status: 'not_found',
        error: 'Command not found or expired',
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    sandboxId,
    cmdId,
    status: logData.status,
    logCount: getLogCount(cmdId),
    exitCode: logData.exitCode,
    error: logData.error,
    logsUrl: `/api/sandboxes/${sandboxId}/cmds/${cmdId}/logs`,
  })
}
