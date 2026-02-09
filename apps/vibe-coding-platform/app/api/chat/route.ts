import { type ChatUIMessage } from '@/components/chat/types'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from 'ai'
import { DEFAULT_MODEL, SUPPORTED_MODELS, Models } from '@/ai/constants'
import { NextResponse } from 'next/server'
import { getModelOptions } from '@/ai/gateway'
import { checkBotId } from 'botid/server'
import { tools } from '@/ai/tools'
import prompt from './prompt.md'

// Model display names mapping
const MODEL_NAMES: Record<string, string> = {
  [Models.OpenAIGPT52]: 'GPT-5.2',
  [Models.AmazonNovaPro]: 'Amazon Nova Pro',
  [Models.AnthropicClaude4Sonnet]: 'Claude 4 Sonnet',
  [Models.AnthropicClaude45Sonnet]: 'Claude 4.5 Sonnet',
  [Models.GoogleGeminiFlash]: 'Gemini 2.5 Flash',
  [Models.MoonshotKimiK2]: 'Kimi K2',
  [Models.XaiGrok3Fast]: 'Grok 3 Fast',
}

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

  const {
    messages,
    modelId = DEFAULT_MODEL,
    reasoningEffort,
  } = await (req.json() as Promise<BodyData>)

  // Use local models instead of gateway API
  const models = SUPPORTED_MODELS.map((id) => ({
    id,
    name: MODEL_NAMES[id] || id,
  }))

  const model = models.find((m) => m.id === modelId)
  if (!model) {
    return NextResponse.json(
      { error: `Model ${modelId} not found.` },
      { status: 400 },
    )
  }

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        const result = streamText({
          ...getModelOptions(modelId, { reasoningEffort }),
          system: prompt,
          messages: await convertToModelMessages(
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
            }),
          ),
          stopWhen: stepCountIs(20),
          tools: tools({ modelId, writer }),
          onError: (error) => {
            console.error('Error communicating with AI')
            console.error(JSON.stringify(error, null, 2))
          },
        })
        result.consumeStream()
        writer.merge(
          result.toUIMessageStream({
            sendReasoning: true,
            sendStart: false,
            messageMetadata: () => ({
              model: model.name,
            }),
          }),
        )
      },
    }),
  })
}
