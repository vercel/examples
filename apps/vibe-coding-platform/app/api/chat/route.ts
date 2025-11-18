import { type ChatUIMessage } from '@/components/chat/types'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from 'ai'
import { DEFAULT_MODEL } from '@/ai/constants'
import { NextResponse } from 'next/server'
import { getAvailableModels } from '@/ai/gateway'
import { checkBotId } from 'botid/server'
import { tools } from '@/ai/tools'
import prompt from './chat.prompt'
import { start } from 'workflow/api'
import { UIStreamChunk } from '@/ai/tools/types'
import { getWritable } from 'workflow'
import { DurableAgent } from '@workflow/ai/agent'
import { codeWorkflow } from './workflow'

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

  const run = await start(codeWorkflow, [
    {
      messages,
      modelId,
    },
  ])

  return createUIMessageStreamResponse({
    stream: run.readable,
  })
}
