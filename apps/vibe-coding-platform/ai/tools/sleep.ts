import { tool } from 'ai'
import description from './sleep.prompt'
import z from 'zod/v3'
import { getWritable, sleep } from 'workflow'
import { UIStreamChunk } from './types'

const inputSchema = z.object({
  sleepForMs: z.number().describe('The number of milliseconds to sleep'),
})

async function reportSleep(
  { sleepForMs }: z.infer<typeof inputSchema>,
  { toolCallId }: { toolCallId: string }
) {
  'use step'
  const writable = getWritable<UIStreamChunk>()
  const writer = writable.getWriter()

  writer.write({
    id: toolCallId,
    type: 'data-sleep',
    data: { sleepForMs },
  })
}

async function executeSleep(
  { sleepForMs }: z.infer<typeof inputSchema>,
  { toolCallId }: { toolCallId: string }
) {
  await reportSleep({ sleepForMs }, { toolCallId })

  await sleep(sleepForMs)
}

export const sleepTool = () =>
  tool({
    description,
    inputSchema,
    execute: (args, options) => executeSleep(args, options),
  })
