import { Sandbox } from '@vercel/sandbox'
import { tool } from 'ai'
import description from './get-sandbox-url.prompt'
import z from 'zod/v3'

const inputSchema = z.object({
  sandboxId: z
    .string()
    .describe(
      "The unique identifier of the Vercel Sandbox (e.g., 'sbx_abc123xyz'). This ID is returned when creating a Vercel Sandbox and is used to reference the specific sandbox instance."
    ),
  port: z
    .number()
    .describe(
      'The port number where a service is running inside the Vercel Sandbox (e.g., 3000 for Next.js dev server, 8000 for Python apps, 5000 for Flask). The port must have been exposed when the sandbox was created or when running commands.'
    ),
})

async function executeGetSandboxURL(
  { sandboxId, port }: z.infer<typeof inputSchema>,
  { toolCallId: _toolCallId }: { toolCallId: string }
) {
  const sandbox = await Sandbox.get({ sandboxId })
  const url = sandbox.domain(port)

  return { url }
}

export const getSandboxURL = () =>
  tool({
    description,
    inputSchema,
    execute: (args, options) => executeGetSandboxURL(args, options),
  })
