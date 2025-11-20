import { tool } from 'ai'
import description from './sleep.prompt'
import z from 'zod/v3'
import { createWebhook, getWritable, sleep } from 'workflow'
import { UIStreamChunk } from './types'

const inputSchema = z.object({})

async function reportHumanApproval(
  { url }: { url: string },
  { toolCallId }: { toolCallId: string }
) {
  'use step'
  const writable = getWritable<UIStreamChunk>()
  const writer = writable.getWriter()

  writer.write({
    id: toolCallId,
    type: 'data-wait',
    data: { text: `Waiting for a human to click on the link: ${url}` },
  })
}

async function executeHumanApproval({ toolCallId }: { toolCallId: string }) {
  const webhook = createWebhook()

  await reportHumanApproval({ url: webhook.url }, { toolCallId })

  await webhook

  // const request = await webhook
  // Access the request body
  // const data = await request.json();
  // console.log("Data:", data);
}

export const humanApprovalTool = () =>
  tool({
    description,
    inputSchema,
    execute: (_args, options) => executeHumanApproval(options),
  })
