import { createOpenAI } from '@ai-sdk/openai'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { headers } from 'next/headers'

export const maxDuration = 120

export async function POST(req: Request) {
  const {
    messages,
    model = 'gpt-4o-mini',
  }: { messages: UIMessage[]; model: string } = await req.json()

  // Forward auth cookies so the request passes Vercel's deployment protection
  const requestHeaders = await headers()
  const cookie = requestHeaders.get('cookie') || ''

  const litellm = createOpenAI({
    baseURL: `${process.env.GATEWAY_URL}/v1`,
    apiKey: process.env.LITELLM_MASTER_KEY || 'not-needed',
    headers: { cookie },
  })

  const result = streamText({
    model: litellm(model),
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
