import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { Sandbox } from '@e2b/sdk'
import { tool } from 'ai'
import description from './get-sandbox-url.md'
import z from 'zod/v3'

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const getSandboxURL = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      sandboxId: z
        .string()
        .describe(
          "The unique identifier of the E2B Sandbox (e.g., 'sbx_abc123xyz'). This ID is returned when creating an E2B Sandbox and is used to reference the specific sandbox instance.",
        ),
      port: z
        .number()
        .describe(
          'The port number where a service is running inside the E2B Sandbox (e.g., 3000 for Next.js dev server, 8000 for Python apps, 5000 for Flask). The port must have been exposed when the sandbox was created or when running commands.',
        ),
    }),
    execute: async ({ sandboxId, port }, { toolCallId }) => {
      writer.write({
        id: toolCallId,
        type: 'data-get-sandbox-url',
        data: { status: 'loading' },
      })

      const sandbox = await Sandbox.reconnect(sandboxId)
      // E2B provides host URLs via getHostname method
      const hostname = sandbox.getHostname(port)
      const url = `https://${hostname}`

      writer.write({
        id: toolCallId,
        type: 'data-get-sandbox-url',
        data: { url, status: 'done' },
      })

      return { url }
    },
  })
