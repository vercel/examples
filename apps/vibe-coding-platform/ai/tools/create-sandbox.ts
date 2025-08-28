import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { Sandbox } from '@vercel/sandbox'
import { tool } from 'ai'
import description from './create-sandbox.md'
import z from 'zod/v3'

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const createSandbox = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      timeout: z
        .number()
        .optional()
        .describe(
          'Maximum time in milliseconds the Vercel Sandbox will remain active before automatically shutting down. Defaults to 300000ms (5 minutes). The sandbox will terminate all running processes when this timeout is reached.'
        ),
      ports: z
        .array(z.number())
        .max(2)
        .optional()
        .describe(
          'Array of network ports to expose and make accessible from outside the Vercel Sandbox. These ports allow web servers, APIs, or other services running inside the Vercel Sandbox to be reached externally. Common ports include 3000 (Next.js), 8000 (Python servers), 5000 (Flask), etc.'
        ),
    }),
    execute: async ({ timeout, ports }, { toolCallId }) => {
      writer.write({
        id: toolCallId,
        type: 'data-create-sandbox',
        data: { status: 'loading' },
      })

      const sandbox = await Sandbox.create({
        timeout,
        ports,
      })

      writer.write({
        id: toolCallId,
        type: 'data-create-sandbox',
        data: { sandboxId: sandbox.sandboxId, status: 'done' },
      })

      return `Sandbox created with ID: ${sandbox.sandboxId}. You can now upload files, run commands, and access services on the exposed ports.`
    },
  })
