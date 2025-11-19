import { NextResponse, type NextRequest } from 'next/server'

interface Params {
  sandboxId: string
  cmdId: string
}

/**
 * Get command logs (simplified for e2b)
 *
 * Note: e2b commands return stdout/stderr directly, not as streaming logs.
 * In the current implementation, logs are returned as part of the command
 * execution result. This endpoint returns an empty stream for compatibility.
 *
 * For production, implement proper log streaming using WebSockets or SSE.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const logParams = await params
  const encoder = new TextEncoder()

  // Return empty stream with a note
  return new NextResponse(
    new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              data: 'Logs are included in command execution result',
              stream: 'info',
              timestamp: Date.now(),
            }) + '\n'
          )
        )
        controller.close()
      },
    }),
    { headers: { 'Content-Type': 'application/x-ndjson' } }
  )
}
