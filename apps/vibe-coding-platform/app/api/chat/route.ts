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

async function codeWorkflow({
  messages,
  modelId,
}: {
  messages: ChatUIMessage[]
  modelId: string
}) {
  'use workflow'

  const writable = getWritable<UIStreamChunk>()

  const agent = new DurableAgent({
    model: modelId,
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

  // createUIMessageStream({
  //   originalMessages: messages,
  //     result.consumeStream(),
  //     writer.merge(
  //       result.toUIMessageStream({
  //         sendReasoning: true,
  //         sendStart: false,
  //         messageMetadata: () => ({
  //           model: model.name,
  //         }),
  //       })
  //     )
  //   },
  // })
}
