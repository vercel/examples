import { ModelMessage, stepCountIs } from 'ai'
import { tools } from '@/ai/tools'
import prompt from './chat.prompt'
import { UIStreamChunk } from '@/ai/tools/types'
import { getWritable } from 'workflow'
import { DurableAgent } from '@workflow/ai/agent'

export async function codeWorkflow({
  messages,
  modelId,
}: {
  messages: ModelMessage[]
  modelId: string
}) {
  'use workflow'

  const writable = getWritable<UIStreamChunk>()

  const agent = new DurableAgent({
    model: modelId,
    system: prompt,
    tools: tools({ modelId, messages }),
  })

  await agent.stream({
    messages,
    writable,
    stopWhen: stepCountIs(20),
  })
}
