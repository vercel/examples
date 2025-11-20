import { type ChatUIMessage } from '@/components/chat/types'
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  Experimental_Agent as Agent,
  stepCountIs,
} from 'ai'
import { DEFAULT_MODEL } from '@/ai/constants'
import { NextResponse } from 'next/server'
import { getAvailableModels } from '@/ai/gateway'
import { checkBotId } from 'botid/server'
import { tools } from '@/ai/tools'
import prompt from './chat.prompt'

interface BodyData {
  messages: ChatUIMessage[]
  modelId?: string
}

export async function POST(req: Request) {
  const checkResult = await checkBotId()
  if (checkResult.isBot) {
    return NextResponse.json({ error: `Bot detected` }, { status: 403 })
  }

  const [models, { messages, modelId = DEFAULT_MODEL }] = await Promise.all([
    getAvailableModels(),
    req.json() as Promise<BodyData>,
  ])

  const model = models.find((model) => model.id === modelId)
  if (!model) {
    return NextResponse.json(
      { error: `Model ${modelId} not found.` },
      { status: 400 }
    )
  }

  const modelMessages = convertToModelMessages(messages)

  const agent = new Agent({
    model: modelId,
    system: prompt,
    tools: tools({ modelId, messages: modelMessages }),
    stopWhen: stepCountIs(20),
  })

  const stream = agent.stream({
    messages: modelMessages,
  })

  return createUIMessageStreamResponse({
    stream: stream.toUIMessageStream(),
  })
}
