import { NextResponse, type NextRequest } from 'next/server'
import { readFile } from '@/lib/trigger-wrapper'
import z from 'zod/v3'

const FileParamsSchema = z.object({
  sandboxId: z.string(),
  path: z.string(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sandboxId: string }> }
) {
  const { sandboxId } = await params
  const fileParams = FileParamsSchema.safeParse({
    path: request.nextUrl.searchParams.get('path'),
    sandboxId,
  })

  if (fileParams.success === false) {
    return NextResponse.json(
      { error: 'Invalid parameters. You must pass a `path` as query' },
      { status: 400 }
    )
  }

  const result = await readFile(fileParams.data.sandboxId, fileParams.data.path)

  if (!result.success || !result.content) {
    return NextResponse.json(
      { error: result.error || 'File not found in the Sandbox' },
      { status: 404 }
    )
  }

  // Return the content as a stream
  const encoder = new TextEncoder()
  return new NextResponse(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(result.content!))
        controller.close()
      },
    })
  )
}
