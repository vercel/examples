import { Sandbox } from '@e2b/sdk'
import { tool } from 'ai'
import description from './create-sandbox.md'
import z from 'zod/v3'
import { DataPart } from '../messages/data-parts'
import { UIMessageStreamWriter, UIMessage } from 'ai'

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const createSandbox = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      timeout: z.number().optional().describe('Maximum time in milliseconds.'),
      ports: z.array(z.number()).optional().describe('Ports to expose.'),
    }),
    execute: async (_, { toolCallId }) => {
      writer.write({
        id: toolCallId,
        type: 'data-create-sandbox',
        data: { status: 'loading' },
      })

      try {
        const sandbox = await Sandbox.create()

        writer.write({
          id: toolCallId,
          type: 'data-create-sandbox',
          data: { sandboxId: sandbox.id, status: 'done' },
        })

        return (
          `Sandbox created with ID: ${sandbox.id}.` +
          `\nYou can now upload files and run commands via E2B and Trigger.dev.`
        )
      } catch (error: any) {
        writer.write({
          id: toolCallId,
          type: 'data-create-sandbox',
          data: {
            error: { message: error.message },
            status: 'error',
          },
        })

        console.log('Error creating E2B Sandbox:', error)
        return `Failed to create E2B sandbox: ${error.message}`
      }
    },
  })
