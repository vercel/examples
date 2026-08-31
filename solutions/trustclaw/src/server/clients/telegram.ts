import { env } from '~/env'

export function isTelegramConfigured(): boolean {
  return !!env.TELEGRAM_BOT_TOKEN && !!env.TELEGRAM_BOT_USERNAME
}

function getTelegramApiBase(): string {
  if (!env.TELEGRAM_BOT_TOKEN) {
    throw new Error('Telegram not configured')
  }
  return `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`
}

export async function sendTelegramMessage(
  chatId: string,
  text: string
): Promise<void> {
  const TELEGRAM_API_BASE = getTelegramApiBase()
  // Try with Markdown formatting first
  const markdownResponse = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  })

  if (markdownResponse.ok) return

  // Markdown parsing failed (e.g. underscores in URLs) - retry as plain text
  const plainResponse = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  })

  if (!plainResponse.ok) {
    const body = await plainResponse.text().catch(() => '(no body)')
    console.error(`[telegram] sendMessage failed: ${plainResponse.status}`, {
      chatId,
      textLength: text.length,
      body,
    })
    throw new Error(
      `Telegram sendMessage failed: ${plainResponse.status} - ${body}`
    )
  }
}

export async function sendChatAction(
  chatId: string,
  action: 'typing'
): Promise<void> {
  const TELEGRAM_API_BASE = getTelegramApiBase()
  const response = await fetch(`${TELEGRAM_API_BASE}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      action,
    }),
  })
  if (!response.ok) {
    const body = await response.text().catch(() => '(no body)')
    console.error(`[telegram] sendChatAction failed: ${response.status}`, {
      chatId,
      action,
      body,
    })
    throw new Error(
      `Telegram sendChatAction failed: ${response.status} - ${body}`
    )
  }
}
