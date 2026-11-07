import { type ChatUIMessage } from '@/components/chat/types'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from 'ai'
import { DEFAULT_MODEL, MODEL_NAMES, SUPPORTED_MODELS } from '@/ai/constants'
import { NextResponse } from 'next/server'
import { getModelOptions } from '@/ai/gateway'
import { checkBotId } from 'botid/server'
import { tools } from '@/ai/tools'
import { notifyPhone } from '@/lib/notify-phone'
import prompt from './prompt.md'

interface BodyData {
  messages: ChatUIMessage[]
  modelId?: string
  reasoningEffort?: 'low' | 'medium'
}

export async function POST(req: Request) {
  const [checkResult, { messages, modelId = DEFAULT_MODEL, reasoningEffort }] =
    await Promise.all([checkBotId(), req.json() as Promise<BodyData>])

  if (checkResult.isBot) {
    return NextResponse.json({ error: `Bot detected` }, { status: 403 })
  }

  if (!SUPPORTED_MODELS.includes(modelId)) {
    return NextResponse.json(
      { error: `Model ${modelId} not found.` },
      { status: 400 }
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
            })
          ),
          stopWhen: stepCountIs(20),
          tools: tools({ modelId, writer }),
          onError: (error) => {
            console.error('Error communicating with AI')
            console.error(JSON.stringify(error, null, 2))
          },
          onFinish: async ({ steps }) => {
            // Optional: tell your phone the preview is ready (no-op unless
            // LAUTHER_TOKEN is set). The tap opens the sandbox URL.
            const previewUrl = steps
              .flatMap((step) => step.toolResults)
              .filter((result) => result.toolName === 'getSandboxURL')
              .map((result) => (result.output as { url?: string } | undefined)?.url)
              .filter((url): url is string => typeof url === 'string')
              .at(-1)
            const lastPrompt = messages
              .filter((message) => message.role === 'user')
              .at(-1)
              ?.parts.flatMap((part) => (part.type === 'text' ? [part.text] : []))
              .join(' ')
            await notifyPhone({
              title: previewUrl ? 'Your app is ready' : 'Generation finished',
              message: lastPrompt?.slice(0, 200) ?? '',
              ...(previewUrl ? { url: previewUrl } : {}),
            })
          },
        })
        result.consumeStream()
        writer.merge(
          result.toUIMessageStream({
            sendReasoning: true,
            sendStart: false,
            messageMetadata: () => ({
              model: MODEL_NAMES[modelId] ?? modelId,
            }),
          })
        )
      },
    }),
  });
}
