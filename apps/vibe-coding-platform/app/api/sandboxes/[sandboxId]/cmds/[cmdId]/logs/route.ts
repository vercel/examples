import { NextResponse, type NextRequest } from 'next/server'
import { getCommandLogs, getLogCount } from '@/lib/log-store'

interface Params {
  sandboxId: string
  cmdId: string
}

/**
 * Get command logs with real-time streaming support.
 *
 * Supports long-polling: pass ?fromIndex=N to get logs starting from index N.
 * The response includes the current log count so the client knows where to poll from next.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { cmdId } = await params
  const searchParams = request.nextUrl.searchParams
  const fromIndex = parseInt(searchParams.get('fromIndex') || '0', 10)

  const encoder = new TextEncoder()

  // Create a streaming response
  const stream = new ReadableStream({
    async start(controller) {
      let lastIndex = fromIndex
      let pollCount = 0
      const maxPolls = 60 // Max 60 seconds of polling

      const poll = async () => {
        const logData = getCommandLogs(cmdId, lastIndex)

        if (!logData) {
          // Command not found - might be too old or invalid
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                error: 'Command not found',
                cmdId,
              }) + '\n'
            )
          )
          controller.close()
          return
        }

        // Send any new logs
        for (const log of logData.logs) {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                data: log.data,
                stream: log.stream,
                timestamp: log.timestamp,
              }) + '\n'
            )
          )
        }

        // Update the index
        lastIndex = getLogCount(cmdId)

        // Check if command is done
        if (logData.status === 'completed' || logData.status === 'failed') {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                status: logData.status,
                exitCode: logData.exitCode,
                error: logData.error,
                done: true,
              }) + '\n'
            )
          )
          controller.close()
          return
        }

        // Continue polling if not done
        pollCount++
        if (pollCount < maxPolls) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          await poll()
        } else {
          // Timeout - send current state and close
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                status: 'polling_timeout',
                lastIndex,
                message: 'Reconnect with fromIndex to continue',
              }) + '\n'
            )
          )
          controller.close()
        }
      }

      await poll()
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
