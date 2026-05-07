import { NextResponse } from 'next/server'
import { GlideClient, GlideClientConfiguration } from '@valkey/valkey-glide'
import { randomUUID } from 'crypto'
import { stringify } from 'querystring'

// Force Node.js runtime for native modules
export const runtime = 'nodejs'

const STREAM_NAME = 'contact-messages'
const CONSUMER_GROUP = 'contact-processors'

let client: GlideClient | undefined

/**
 * Get or initialize Valkey client
 */
async function getClient(): Promise<GlideClient> {
  if (client) {
    return client
  }

  const endpoint = process.env.VALKEY_ENDPOINT
  if (!endpoint) {
    throw new Error('VALKEY_ENDPOINT environment variable is not set')
  }

  const [host, portStr] = endpoint.split(':')
  const port = parseInt(portStr, 10)

  if (!host || isNaN(port)) {
    throw new Error('VALKEY_ENDPOINT must be in format host:port')
  }

  const config: GlideClientConfiguration = {
    addresses: [{ host, port }],
  }

  client = await GlideClient.createClient(config)
  return client
}

async function ensureConsumerGroup(client: GlideClient): Promise<void> {
  try {
    /**
     * Try to create the consumer group
     * XGROUP CREATE stream group id [MKSTREAM]
     * See also {@link https://valkey.io/commands/xgroup-create/}
     */
    await client.customCommand([
      'XGROUP',
      'CREATE',
      STREAM_NAME,
      CONSUMER_GROUP,
      '0',
      'MKSTREAM',
    ])
  } catch (error: any) {
    // Ignore if group already exists
    if (!error?.message?.includes('BUSYGROUP')) {
      throw error
    }
  }
}

function handleError(error: unknown, defaultMessage: string) {
  console.error('API Error:', error)
  const message =
    error instanceof Error
      ? `${defaultMessage}. ${error.message}`
      : defaultMessage
  return NextResponse.json({ error: message }, { status: 500 })
}

type ContactDataForm = { name: string; email: string; message: string }

type ValidationSuccess = {
  valid: true
  data: ContactDataForm
}

type ValidationError = {
  valid: false
  error: string
}

type ValidationResult = ValidationSuccess | ValidationError

function validateContactForm(data: any): ValidationResult {
  if (!data.name || typeof data.name !== 'string') {
    return { valid: false, error: 'Name is required and must be a string' }
  }
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' }
  }
  if (!data.message || typeof data.message !== 'string') {
    return { valid: false, error: 'Message is required and must be a string' }
  }

  return {
    valid: true,
    data: {
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    },
  }
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
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { name, email, message } = validation.data

    const client = await getClient()
    const timestamp = new Date().toISOString()

    /**
     * Append entry (field, value pairs) to the specified stream: {@link https://valkey.io/commands/xadd/}
     */
    const streamMessageId = await client.xadd(STREAM_NAME, [
      ['name', name],
      ['email', email],
      ['message', message],
      ['timestamp', timestamp],
    ])

    return NextResponse.json(
      {
        streamMessageId,
        timestamp,
      },
      { status: 201 }
    )
  } catch (error) {
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

    const consumerName = `consumer-${randomUUID()}`

    /**
     * XAUTOCLAIM automatically reclaims messages that
     * have not been acknowledged, 60 seconds paramter tells
     * the backend to reclaim aby messages that have not
     * been consumed for more than this time.
     * See more {@link https://valkey.io/commands/xautoclaim/}
     */
    const claimResponse = await client.xautoclaim(
      STREAM_NAME,
      CONSUMER_GROUP,
      consumerName,
      60000,
      '0-0',
      { count: 1 }
    )

    // XAUTOCLAIM returns: [next_id, [messages], deleted_ids]
    // valkey-glide wraps messages as objects with 'key' and 'value' properties
    const [_next_id, claimMessages, _deleted_ids] = claimResponse
    const messageIds = Object.keys(claimMessages)
    if (messageIds.length > 0) {
      const streamMessageId = messageIds[0]
      const fieldsArray = claimMessages[streamMessageId]

      const messageData: Record<string, string> = {}

      for (const [field, value] of fieldsArray) {
        messageData[String(field)] = String(value)
      }

      return NextResponse.json(
        {
          message: {
            streamMessageId,
            name: messageData.name,
            email: messageData.email,
            message: messageData.message,
            timestamp: messageData.timestamp,
            claimed: true, // Indicate this was a claimed message
          },
        },
        { status: 200 }
      )
    }

    /**
     * No pending messages to claim:
     * Dequeue latest message from the stream
     * See also {@link https://valkey.io/commands/xreadgroup/}
     * and {@link https://valkey.io/commands/xread/}
     */
    const response = await client.xreadgroup(
      CONSUMER_GROUP,
      consumerName,
      { [STREAM_NAME]: '>' },
      { count: 1 }
    )

    // Response format from xreadgroup: array of {key: stream_name, value: Record<message_id, fields>}
    if (!response || response.length === 0) {
      return NextResponse.json({ message: null }, { status: 200 })
    }

    // getting the head, since XREADGROUP supports reading from multiple streams at the same time
    const streamData = response[0]
    const messages = streamData.value

    if (!messages || Object.keys(messages).length === 0) {
      return NextResponse.json({ message: null }, { status: 200 })
    }

    // Get the first message ID and its fields
    const streamMessageId = Object.keys(messages)[0]
    const fieldsArray = messages[streamMessageId]

    if (!fieldsArray) {
      return NextResponse.json({ message: null }, { status: 200 })
    }

    // Convert array of pairs to Record
    const messageData: Record<string, string> = {}
    for (const [field, value] of fieldsArray) {
      messageData[String(field)] = String(value)
    }

    return NextResponse.json(
      {
        message: {
          streamMessageId,
          name: messageData.name,
          email: messageData.email,
          message: messageData.message,
          timestamp: messageData.timestamp,
        },
      },
      { status: 200 }
    )
  } catch (error) {
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
     * See also {@link https://valkey.io/commands/xack/ message_id}
     */
    await client.xack(STREAM_NAME, CONSUMER_GROUP, [messageId])

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return handleError(error, 'Failed to acknowledge message')
  }
}
