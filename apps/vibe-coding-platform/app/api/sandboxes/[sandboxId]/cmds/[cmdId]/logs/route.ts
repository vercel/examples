import { NextResponse, type NextRequest } from 'next/server'
import { runs } from '@trigger.dev/sdk/v3'

interface Params {
  sandboxId: string
  cmdId: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { cmdId } = await params
  const encoder = new TextEncoder()

  return new NextResponse(
    new ReadableStream({
      async pull(controller) {
        const run = await runs.retrieve(cmdId)

        if (run.status === 'COMPLETED') {
          const result = run.output as any
          if (result && result.stdout) {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  data: result.stdout,
                  stream: 'stdout',
                  timestamp: Date.now(),
                }) + '\n',
              ),
            )
          }
          if (result && result.stderr) {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  data: result.stderr,
                  stream: 'stderr',
                  timestamp: Date.now(),
                }) + '\n',
              ),
            )
          }
          controller.close()
        } else if (
          run.status === 'FAILED' ||
          run.status === 'CANCELED' ||
          run.status === 'CRASHED' ||
          run.status === 'TIMED_OUT' ||
          run.status === 'SYSTEM_FAILURE'
        ) {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                data: `\nRun ${run.status}: ${(run as any).error?.message || 'Execution failed'}\n`,
                stream: 'stderr',
                timestamp: Date.now(),
              }) + '\n',
            ),
          )
          controller.close()
        } else {
          // Still running, send a heartbeat or wait
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                data: '',
                stream: 'stdout',
                timestamp: Date.now(),
              }) + '\n',
            ),
          )
          // Wait a bit before next pull
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      },
    }),
    { headers: { 'Content-Type': 'application/x-ndjson' } },
  )
}
