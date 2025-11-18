import { DEFAULT_MODEL } from '@/ai/constants'
import { getAvailableModels, getModelOptions } from '@/ai/gateway'
import { tools } from '@/ai/tools'
import type { ChatUIMessage } from '@/components/chat/types'
import { DurableAgent } from '@workflow/ai/agent'
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  type UIMessageChunk,
} from 'ai'
import { checkBotId } from 'botid/server'
import { NextResponse } from 'next/server'
import { getWritable } from 'workflow'
import { start } from 'workflow/api'
import prompt from './chat.prompt'

interface BodyData {
  messages: ChatUIMessage[]
  modelId?: string
  reasoningEffort?: 'low' | 'medium'
}

export async function POST(req: Request) {
  const checkResult = await checkBotId()
  if (checkResult.isBot) {
    return NextResponse.json({ error: `Bot detected` }, { status: 403 })
  }

  const [models, { messages, modelId = DEFAULT_MODEL, reasoningEffort }] =
    await Promise.all([getAvailableModels(), req.json() as Promise<BodyData>])
  const model = models.find((model) => model.id === modelId)
  if (!model) {
    return NextResponse.json(
      { error: `Model ${modelId} not found.` },
      { status: 400 }
    )
  }

  const run = await start(codingWorkflow, [
    {
      modelId: model.id,
      reasoningEffort,
      prompt,
      messages,
    },
  ])

  return createUIMessageStreamResponse({
    stream: run.readable,
    //     stream: createUIMessageStream({
    //       originalMessages: messages,
    //       execute: ({ writer }) => {
    //         const result = streamText({
    //         })
    //         result.consumeStream()
    //         writer.merge(
    //           result.toUIMessageStream({
    //             sendReasoning: true,
    //             sendStart: false,
    //             messageMetadata: () => ({
    //               model: model.name,
    //             }),
    //           }),
    //         )
    //       },
    //     }),
  })
}

async function codingWorkflow({
  prompt,
  modelId,
  messages,
  reasoningEffort,
}: {
  prompt: string
  modelId: string
  messages: ChatUIMessage[]
  reasoningEffort?: 'minimal' | 'low' | 'medium'
}) {
  'use workflow'

  const writable = getWritable<UIMessageChunk>()

  const agent = new DurableAgent({
    model: async () => {
      'use step'

      return getModelOptions(modelId, { reasoningEffort }).model
    },
    system: prompt,
    tools: tools({ modelId }),
  })

  await agent.stream({
    messages: convertToModelMessages(
      messages.map((message) => {
        message.parts = message.parts.map((part) => {
          if (part.type === 'data-report-errors') {
            return {
              type: 'text',
              text:
                `There are errors in the generated code. This is the summary of the errors we have:\n` +
                `\`\`\`${part.data.summary}\`\`\`\n` +
                (part.data.paths?.length
                  ? `The following files may contain errors:\n` +
                    `\`\`\`${part.data.paths?.join('\n')}\`\`\`\n`
                  : '') +
                `Fix the errors reported.`,
            }
          }
          return part
        })
        return message
      })
    ),
    writable,
    stopWhen: stepCountIs(20),
  })
}
