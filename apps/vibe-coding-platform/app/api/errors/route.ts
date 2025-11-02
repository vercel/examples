import { Models } from '@/ai/constants'
import { NextResponse } from 'next/server'
import { checkBotId } from 'botid/server'
import { generateObject } from 'ai'
import { linesSchema, resultSchema } from '@/components/error-monitor/schemas'
import prompt from './prompt.md'

export async function POST(req: Request) {
  const checkResult = await checkBotId()
  if (checkResult.isBot) {
    return NextResponse.json({ error: `Bot detected` }, { status: 403 })
  }

  const body = await req.json()
  const parsedBody = linesSchema.safeParse(body)
  if (!parsedBody.success) {
    return NextResponse.json({ error: `Invalid request` }, { status: 400 })
  }

  const result = await generateObject({
    system: prompt,
    model: Models.OpenAIGPT5,
    providerOptions: {
      openai: {
        include: ['reasoning.encrypted_content'],
        reasoningEffort: 'minimal',
        reasoningSummary: 'auto',
        serviceTier: 'priority',
      },
    },
    messages: [{ role: 'user', content: JSON.stringify(parsedBody.data) }],
    schema: resultSchema,
  })

  return NextResponse.json(result.object, {
    status: 200,
  })
}
