import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { transformStream } from '@crayonai/stream'

const client = new OpenAI({
  baseURL: 'https://api.thesys.dev/v1/embed',
  apiKey: process.env.THESYS_API_KEY,
})

export async function POST(req: NextRequest) {
  const { prompt, previousC1Response } = (await req.json()) as {
    prompt: string
    previousC1Response?: string
  }

  const messages: ChatCompletionMessageParam[] = []

  if (previousC1Response) {
    messages.push({
      role: 'assistant',
      content: previousC1Response,
    })
  }

  messages.push({
    role: 'user',
    content: prompt,
  })

  const llmStream = await client.chat.completions.create({
    model: 'c1/anthropic/claude-sonnet-4/v-20250815',
    messages: [...messages],
    stream: true,
  })

  const responseStream = transformStream(llmStream, (chunk) => {
    return chunk.choices[0]?.delta?.content || ''
  })

  return new Response(responseStream as ReadableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
