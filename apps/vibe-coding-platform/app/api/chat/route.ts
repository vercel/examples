import { type ChatUIMessage } from '@/components/chat/types'
import { createUIMessageStreamResponse } from 'ai'
import { DEFAULT_MODEL } from '@/ai/constants'
import { NextResponse } from 'next/server'
import { getAvailableModels } from '@/ai/gateway'
import { checkBotId } from 'botid/server'
import { start } from 'workflow/api'
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
    headers: {
      'x-workflow-run-id': run.runId,
    },
  })
}
