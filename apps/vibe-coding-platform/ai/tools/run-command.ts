import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { tool } from 'ai'
import description from './run-command.md'
import z from 'zod/v3'
import { tasks } from '@trigger.dev/sdk/v3'
import { readVfsFiles } from '../../lib/vfs'

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const runCommand = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      sandboxId: z.string().describe('The ID of the local sandbox'),
      command: z.string().describe('The base command to run'),
      args: z
        .array(z.string())
        .optional()
        .describe('Arguments for the command'),
      sudo: z.boolean().optional().describe('Whether to run with sudo'),
      wait: z.boolean().describe('Whether to wait for the command to finish'),
    }),
    execute: async (
      { sandboxId, command, wait, args = [] },
      { toolCallId },
    ) => {
      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: { sandboxId, command, args, status: 'executing' },
      })

      try {
        if (wait) {
          const run = await tasks.triggerAndWait('run-command', {
            command,
            args,
            sandboxId,
          })

          if (run.ok) {
            const result = run.output as any
            writer.write({
              id: toolCallId,
              type: 'data-run-command',
              data: {
                sandboxId,
                commandId: run.id,
                command,
                args,
                exitCode: result.exitCode,
                status: 'done',
              },
            })

            return (
              `The command \`${command} ${args.join(
                ' ',
              )}\` has finished with exit code ${result.exitCode}.` +
              `Stdout: \n\`\`\`\n${result.stdout}\n\`\`\`\n` +
              `Stderr: \n\`\`\`\n${result.stderr}\n\`\`\``
            )
          } else {
            const errorMessage = (run as any).error?.message || 'Unknown error'
            writer.write({
              id: toolCallId,
              type: 'data-run-command',
              data: {
                sandboxId,
                commandId: run.id,
                command,
                args,
                status: 'error',
                error: { message: `Run failed: ${errorMessage}` },
              },
            })
            return `Command failed: ${errorMessage}`
          }
        } else {
          const handle = await tasks.trigger('run-command', {
            command,
            args,
            sandboxId,
          })

          writer.write({
            id: toolCallId,
            type: 'data-run-command',
            data: {
              sandboxId,
              commandId: handle.id,
              command,
              args,
              status: 'running',
            },
          })

          return `The command \`${command} ${args.join(
            ' ',
          )}\` has been started via Trigger.dev with run ID \`${handle.id}\`.`
        }
      } catch (error: any) {
        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId,
            command,
            args,
            error: { message: error.message },
            status: 'error',
          },
        })

        return `Error running command: ${error.message}`
      }
    },
  })
