import { smoothStream, UI_MESSAGE_STREAM_HEADERS } from 'ai'
import { z } from 'zod'
import { auth } from '~/server/auth'
import { db } from '~/server/clients/db'
import { prepareAgentRun } from '~/server/api/routers/trustclaw/agent/setup'
import {
  setStreamingMessage,
  getStreamingMessage,
} from '~/server/clients/redis'
import { getStreamContext } from './stream-store'
import { TRPCError } from '@trpc/server'

const chatRequestBody = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().optional(),
      parts: z.array(z.record(z.unknown())).optional(),
    })
  ),
})

async function getAuthenticatedInstance(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const userId = session.user.id
  const instance = await db.composioClawInstance.findUnique({
    where: { userId },
    select: { id: true, userId: true },
  })

  if (!instance) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }

  return { userId, instanceId: instance.id }
}

export const maxDuration = 60

export async function POST(request: Request) {
  const authResult = await getAuthenticatedInstance(request)
  if (!authResult) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { instanceId } = authResult

  const body = chatRequestBody.safeParse(await request.json())
  if (!body.success) {
    return new Response('Invalid request body', { status: 400 })
  }

  const lastUserMessage = [...body.data.messages]
    .reverse()
    .find((m) => m.role === 'user')
  const userText =
    lastUserMessage?.parts
      ?.filter(
        (p): p is { type: string; text: string } =>
          typeof p === 'object' &&
          p !== null &&
          'type' in p &&
          p.type === 'text' &&
          'text' in p &&
          typeof p.text === 'string'
      )
      .map((p) => p.text)
      .join('\n') ?? ''
  if (!userText.trim()) {
    return new Response('Empty message', { status: 400 })
  }

  const prepareResult = await prepareAgentRun({
    instanceId,
    userMessage: userText,
    source: 'web',
  })

  const { agent, messages } = prepareResult.result

  const streamId = crypto.randomUUID()
  await setStreamingMessage(instanceId, streamId)

  // agent.stream() returns streamText() result - supports toUIMessageStreamResponse
  // Pass request.signal so the agent stops when the client disconnects (stop button)
  const result = await agent.stream({
    prompt: messages,
    experimental_transform: smoothStream(),
    abortSignal: request.signal,
  })

  const streamContext = getStreamContext()
  return result.toUIMessageStreamResponse({
    headers: {
      'X-Stream-Id': streamId,
    },
    ...(streamContext
      ? {
          consumeSseStream: ({ stream }) => {
            void streamContext.createNewResumableStream(streamId, () => stream)
          },
        }
      : {}),
  })
}

export async function GET(request: Request) {
  const authResult = await getAuthenticatedInstance(request)

  const { instanceId } = authResult
  const url = new URL(request.url)
  const streamId = url.searchParams.get('streamId')

  if (!streamId) {
    return new Response('Missing streamId', { status: 400 })
  }

  const activeStreamId = await getStreamingMessage(instanceId)
  if (activeStreamId !== streamId) {
    return new Response('Stream not found or not yours', { status: 404 })
  }

  const streamContext = getStreamContext()
  if (!streamContext) {
    return new Response('Stream resumption not available', { status: 204 })
  }
  const stream = await streamContext.resumeExistingStream(streamId)
  if (!stream) {
    return new Response('Stream already completed', { status: 204 })
  }

  return new Response(stream.pipeThrough(new TextEncoderStream()), {
    headers: UI_MESSAGE_STREAM_HEADERS,
  })
}
