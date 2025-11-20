import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { runCommand as runE2BCommand } from '@/lib/trigger-wrapper'
import { getRichError } from './get-rich-error'
import { tool } from 'ai'
import description from './run-command.md'
import z from 'zod/v3'

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const runCommand = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      sandboxId: z
        .string()
        .describe('The ID of the Vercel Sandbox to run the command in'),
      command: z
        .string()
        .describe(
          "The base command to run (e.g., 'npm', 'node', 'python', 'ls', 'cat'). Do NOT include arguments here. IMPORTANT: Each command runs independently in a fresh shell session - there is no persistent state between commands. You cannot use 'cd' to change directories for subsequent commands."
        ),
      args: z
        .array(z.string())
        .optional()
        .describe(
          "Array of arguments for the command. Each argument should be a separate string (e.g., ['install', '--verbose'] for npm install --verbose, or ['src/index.js'] to run a file, or ['-la', './src'] to list files). IMPORTANT: Use relative paths (e.g., 'src/file.js') or absolute paths instead of trying to change directories with 'cd' first, since each command runs in a fresh shell session."
        ),
      sudo: z
        .boolean()
        .optional()
        .describe('Whether to run the command with sudo'),
      wait: z
        .boolean()
        .describe(
          'Whether to wait for the command to finish before returning. If true, the command will block until it completes, and you will receive its output.'
        ),
    }),
    execute: async (
      { sandboxId, command, sudo, wait, args = [] },
      { toolCallId }
    ) => {
      // Generate commandId upfront for immediate log streaming
      const commandId = `cmd_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`

      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: { sandboxId, commandId, command, args, status: 'executing' },
      })

      try {
        const result = await runE2BCommand(sandboxId, {
          command,
          args,
          sudo,
          wait,
          commandId, // Pass the pre-generated ID
        })

        if (result.status === 'failed') {
          throw new Error(result.error || 'Command execution failed')
        }

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId,
            commandId: result.commandId,
            command,
            args,
            status: wait ? 'done' : 'running',
            exitCode: result.exitCode,
          },
        })

        if (!wait) {
          return `The command \`${command} ${args.join(
            ' '
          )}\` has been started in the background in the sandbox with ID \`${sandboxId}\` with the commandId ${
            result.commandId
          }.`
        }

        return (
          `The command \`${command} ${args.join(
            ' '
          )}\` has finished with exit code ${result.exitCode || 0}.` +
          `\nStdout of the command was: \n` +
          `\`\`\`\n${result.stdout || ''}\n\`\`\`\n` +
          `Stderr of the command was: \n` +
          `\`\`\`\n${result.stderr || ''}\n\`\`\``
        )
      } catch (error) {
        const richError = getRichError({
          action: 'run command in sandbox',
          args: { sandboxId },
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId,
            command,
            args,
            error: richError.error,
            status: 'error',
          },
        })

        return richError.message
      }
    },
  })
