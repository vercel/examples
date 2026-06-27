import { timingSafeEqual } from 'crypto'
import { after, NextResponse } from 'next/server'
import { env } from '~/env'
import { db } from '~/server/clients/db'
import { sendTelegramMessage, sendChatAction } from '~/server/clients/telegram'
import { prepareAgentRun } from '~/server/api/routers/trustclaw/agent/setup'
import { stripToolResultEchoes } from '~/server/api/routers/trustclaw/agent/strip-tool-echoes'
import { toPlainRecordSafe } from '~/server/api/routers/trustclaw/agent/context/build-context'
import { parseManageConnectionsResult } from '~/app/(authenticated)/dashboard/_components/tool-results/connections/schema'
import {
  claimTelegramUpdate,
  setTelegramActive,
  getTelegramActive,
} from '~/server/clients/redis'
import { telegramUpdateInput } from './_telegram-webhook.schema'

function describeToolCall(tc: {
  toolName: string
  input: Record<string, unknown>
  result?: { output: unknown }
}): string | null {
  const name = tc.toolName

  if (name.endsWith('WAIT_FOR_CONNECTIONS')) return null
  if (name.endsWith('SEARCH_TOOLS')) return 'Searching for tools...'
  if (name.endsWith('REMOTE_BASH_TOOL')) return 'Running a command...'
  if (name === 'schedule') return 'Managing schedule...'

  if (name.endsWith('MANAGE_CONNECTIONS')) {
    if (tc.result) {
      const parsed = parseManageConnectionsResult(tc.result.output, tc.input)
      if (parsed) {
        const urls = Object.entries(parsed.results)
          .filter(([, entry]) => entry.redirect_url?.startsWith('https://'))
          .map(
            ([toolkit, entry]) =>
              `Connect your ${toolkit}: ${entry.redirect_url}`
          )
        if (urls.length > 0) return urls.join('\n')
      }
    }
    return 'Setting up connections...'
  }

  if (
    name.endsWith('MULTI_EXECUTE_TOOL') ||
    name.endsWith('REMOTE_WORKBENCH')
  ) {
    const thought =
      typeof tc.input.thought === 'string' ? tc.input.thought : null
    return thought ?? 'Working on it...'
  }

  return 'Working on it...'
}

export const maxDuration = 60

export async function POST(request: Request) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response('Telegram not configured', { status: 503 })
  }

  const secretToken =
    request.headers.get('x-telegram-bot-api-secret-token') ?? ''
  const expectedSecret = env.TELEGRAM_WEBHOOK_SECRET
  if (
    secretToken.length !== expectedSecret.length ||
    !timingSafeEqual(Buffer.from(secretToken), Buffer.from(expectedSecret))
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = telegramUpdateInput.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ ok: true })
  }

  const { update_id, message } = parsed.data
  if (!message?.text) {
    return NextResponse.json({ ok: true })
  }

  if (message.chat.type !== 'private') {
    return NextResponse.json({ ok: true })
  }

  // Deduplicate: skip if this update was already claimed (Telegram retry)
  const claimed = await claimTelegramUpdate(update_id)
  if (!claimed) {
    return NextResponse.json({ ok: true })
  }

  const chatId = String(message.chat.id)
  const text = message.text

  if (text.startsWith('/start')) {
    await handleStartCommand(chatId, text)
    return NextResponse.json({ ok: true })
  }

  // Respond immediately to Telegram, process the message in the background.
  // Agent runs can take 30-120+ seconds - exceeding Telegram's ~60s webhook
  // timeout - which previously caused Telegram to retry and duplicate messages.
  after(handleRegularMessage(chatId, text, update_id))
  return NextResponse.json({ ok: true })
}

async function handleStartCommand(chatId: string, text: string): Promise<void> {
  const parts = text.split(' ')
  const token = parts[1]?.trim()

  if (!token) {
    await sendTelegramMessage(
      chatId,
      `Welcome! To link your TrustClaw agent, use the link from ${env.NEXT_PUBLIC_APP_URL}/dashboard/settings.`
    )
    return
  }

  const { count } = await db.composioClawInstance.updateMany({
    where: {
      telegramLinkToken: token,
      telegramChatId: null,
      telegramLinkTokenExpiresAt: { gt: new Date() },
    },
    data: {
      telegramChatId: chatId,
      telegramLinkToken: null,
      telegramLinkTokenExpiresAt: null,
    },
  })

  if (count === 0) {
    await sendTelegramMessage(
      chatId,
      `Invalid or expired link token. Please generate a new one from ${env.NEXT_PUBLIC_APP_URL}/dashboard/settings.`
    )
    return
  }

  await sendTelegramMessage(
    chatId,
    "Linked! I'm your TrustClaw by Composio agent. Send me a message anytime."
  )
}

async function handleRegularMessage(
  chatId: string,
  text: string,
  updateId: number
): Promise<void> {
  const instance = await db.composioClawInstance.findUnique({
    where: { telegramChatId: chatId },
    select: { id: true },
  })

  if (!instance) {
    await sendTelegramMessage(
      chatId,
      `I don't recognize this chat. Link me from ${env.NEXT_PUBLIC_APP_URL}/dashboard/settings`
    )
    return
  }

  // Mark this update as the active generation for this instance.
  // If a previous generation is running, it will detect this change
  // in its onStepFinish and abort.
  await setTelegramActive(instance.id, updateId)

  await sendChatAction(chatId, 'typing')

  const prepareResult = await prepareAgentRun({
    instanceId: instance.id,
    userMessage: text,
    source: 'telegram',
  })

  const { agent, messages } = prepareResult.result

  let accumulatedText = ''
  const abortController = new AbortController()

  try {
    const result = await agent.generate({
      prompt: messages,
      abortSignal: abortController.signal,
      onStepFinish: async (step) => {
        // Check if a newer message has superseded this one
        const activeUpdateId = await getTelegramActive(instance.id)
        if (activeUpdateId !== null && activeUpdateId !== updateId) {
          abortController.abort()
          return
        }

        // Send tool call descriptions (with results for connection URLs)
        for (let i = 0; i < step.toolCalls.length; i++) {
          const tc = step.toolCalls[i]!
          const tr = step.toolResults[i]
          const tcInput = toPlainRecordSafe(tc.input)
          const desc = describeToolCall({
            toolName: tc.toolName,
            input: tcInput,
            ...(tr ? { result: { output: tr.output } } : {}),
          })
          if (desc) {
            await sendTelegramMessage(chatId, desc)
          }
        }

        // Send any text generated in this step
        const stepText = stripToolResultEchoes(step.text).trim()
        if (stepText) {
          accumulatedText += stepText
          await sendTelegramMessage(chatId, stepText.slice(0, 4096))
          await sendChatAction(chatId, 'typing')
        }
      },
    })

    // Send final text only if it wasn't already sent via onStepFinish
    const finalText = stripToolResultEchoes(result.text).trim()
    if (!accumulatedText && finalText) {
      await sendTelegramMessage(chatId, finalText.slice(0, 4096))
    } else if (!accumulatedText && !finalText) {
      await sendTelegramMessage(chatId, 'I processed your request.')
    }
  } catch (error) {
    // If aborted by a newer message, send "-" to indicate truncation
    if (abortController.signal.aborted) {
      await sendTelegramMessage(chatId, '-')
      return
    }
    throw error
  }
}
