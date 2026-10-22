import { NextResponse } from 'next/server'
import { GlideClient, GlideClientConfiguration } from '@valkey/valkey-glide'
import {
  validateContactForm,
  buildMessageResponse,
  ValidationError,
  ValidationSuccess,
} from './helpers'

// Force Node.js runtime for native modules
// NOTE: This demo has no authentication. In production, add auth middleware
// to protect these endpoints from unauthorized access.
export const runtime = 'nodejs'

const STREAM_NAME = 'contact-messages'
const CONSUMER_GROUP = 'contact-processors'
const CONSUMER_NAME = `consumer-${process.env.HOSTNAME || 'default'}`

let client: GlideClient | undefined

/**
 * Get or initialize Valkey client with health check
 */
async function getClient(): Promise<GlideClient> {
  if (client) {
    try {
      await client.ping()
      return client
    } catch {
      client = undefined
    }
  }

  const endpoint = process.env.VALKEY_ENDPOINT || 'localhost:6379'

  const [host, portStr] = endpoint.split(':')
  const port = parseInt(portStr, 10)

  if (!host || isNaN(port)) {
    throw new Error('VALKEY_ENDPOINT must be in format host:port')
  }

  const config: GlideClientConfiguration = {
    addresses: [{ host, port }],
    requestTimeout: 5000,
    clientName: 'vercel_message_queue_client',
  }

  client = await GlideClient.createClient(config)
  return client
}

let groupCreated = false

async function ensureConsumerGroup(client: GlideClient): Promise<void> {
  if (groupCreated) return
  try {
    await client.xgroupCreate(STREAM_NAME, CONSUMER_GROUP, '0', {
      mkStream: true,
    })
  } catch (error: unknown) {
    if (!(error instanceof Error && error.message.includes('BUSYGROUP'))) {
      throw error
    }
  }
  groupCreated = true
}

function handleError(error: unknown, defaultMessage: string) {
  console.error('API Error:', error)

  const message = error instanceof Error ? error.message : ''

  // Connection-related errors get a helpful explanation
  if (
    message.includes('ECONNREFUSED') ||
    message.includes('ETIMEDOUT') ||
    message.includes('ENOTFOUND') ||
    message.includes('connection') ||
    message.includes('timeout')
  ) {
    return NextResponse.json(
      {
        error: `${defaultMessage}: Unable to connect to the Valkey server. Ensure VALKEY_ENDPOINT is configured and the server is reachable.`,
      },
      { status: 503 }
    )
  }

  return NextResponse.json({ error: defaultMessage }, { status: 500 })
}

/**
 * POST - Produce a message
 * Adds a contact form submission to the Valkey stream
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = validateContactForm(body)

    if (!validation.valid) {
      return NextResponse.json(
        { error: (validation as ValidationError).error },
        { status: 400 }
      )
    }

    const { name, email, message } = (validation as ValidationSuccess).data

    const client = await getClient()
    const timestamp = new Date().toISOString()

    /**
     * Append entry (field, value pairs) to the specified stream: {@link https://valkey.io/commands/xadd/}
     * MAXLEN with approximate trimming caps stream growth to prevent unbounded memory use.
     */
    const streamMessageId = await client.xadd(
      STREAM_NAME,
      [
        ['name', name],
        ['email', email],
        ['message', message],
        ['timestamp', timestamp],
      ],
      { trim: { method: 'maxlen', threshold: 10000, exact: false } }
    )

    return NextResponse.json({ streamMessageId, timestamp }, { status: 201 })
  } catch (error: unknown) {
    return handleError(error, 'Failed to produce message')
  }
}

/**
 * GET - Consume a message
 * Reads the next unprocessed message from the consumer group.
 * First tries to claim any pending messages that have been idle > 60 seconds,
 * then falls back to reading new messages.
 */
export async function GET() {
  try {
    const client = await getClient()
    await ensureConsumerGroup(client)

    /**
     * XAUTOCLAIM returns: [next_start_id, {messageId: [[field, value], ...]}, deleted_ids?]
     * Automatically reclaims messages idle > 60 seconds.
     * See more {@link https://valkey.io/commands/xautoclaim/}
     */
    const claimResponse = await client.xautoclaim(
      STREAM_NAME,
      CONSUMER_GROUP,
      CONSUMER_NAME,
      60000,
      '0-0',
      { count: 1 }
    )

    const [_next_id, claimMessages] = claimResponse
    const messageIds = Object.keys(claimMessages)
    if (messageIds.length > 0) {
      const streamMessageId = messageIds[0]
      const fieldsArray = claimMessages[streamMessageId]
      return NextResponse.json(
        {
          message: buildMessageResponse(streamMessageId, fieldsArray, {
            claimed: true,
          }),
        },
        { status: 200 }
      )
    }

    /**
     * No pending messages to claim:
     * Dequeue latest message from the stream
     * See also {@link https://valkey.io/commands/xreadgroup/}
     */
    const response = await client.xreadgroup(
      CONSUMER_GROUP,
      CONSUMER_NAME,
      { [STREAM_NAME]: '>' },
      { count: 1 }
    )

    if (!response || response.length === 0) {
      return NextResponse.json({ message: null }, { status: 200 })
    }

    const streamData = response[0]
    const messages = streamData.value

    if (!messages || Object.keys(messages).length === 0) {
      return NextResponse.json({ message: null }, { status: 200 })
    }

    const streamMessageId = Object.keys(messages)[0]
    const fieldsArray = messages[streamMessageId]

    if (!fieldsArray) {
      return NextResponse.json({ message: null }, { status: 200 })
    }

    return NextResponse.json(
      { message: buildMessageResponse(streamMessageId, fieldsArray) },
      { status: 200 }
    )
  } catch (error: unknown) {
    return handleError(error, 'Failed to consume message')
  }
}

/**
 * DELETE - Acknowledge a message
 * Marks a message as processed and removes it from the pending list
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')

    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId query parameter is required' },
        { status: 400 }
      )
    }

    const client = await getClient()

    /**
     * XACK removes one or more messages from the pending list of a stream
     * See also {@link https://valkey.io/commands/xack/}
     */
    await client.xack(STREAM_NAME, CONSUMER_GROUP, [messageId])

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    return handleError(error, 'Failed to acknowledge message')
  }
}
