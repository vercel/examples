import { convertToModelMessages, type UIMessageChunk } from 'ai'
import { type ChatUIMessage } from '@/components/chat/types'
import { getModelOptions } from '@/ai/gateway'
import { tools } from '@/ai/tools'
import { DurableAgent } from '@workflow/ai/agent'
import { getWritable } from 'workflow'

export async function codingWorkflow({
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
    // TODO: wire up all these options, not just the modelId
    // ...getModelOptions(modelId, { reasoningEffort }),

    model: getModelOptions(modelId, { reasoningEffort }).model.modelId,
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
    // TODO: wire up stopWhen in DurableAgent
    // stopWhen: stepCountIs(20),

    // TODO: wire up onError in DurableAgent
    // onError: (error) => {
    //   console.error('Error communicating with AI')
    //   console.error(JSON.stringify(error, null, 2))
    // },
  })
}
