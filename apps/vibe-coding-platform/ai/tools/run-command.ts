import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { Sandbox } from '@vercel/sandbox'
import description from './run-command.md'
import { tool } from 'ai'
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
    }),
    execute: async (
      { sandboxId, command, sudo, args = [] },
      { toolCallId }
    ) => {
      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: { command, args, status: 'loading', sandboxId },
      })

      const sandbox = await Sandbox.get({ sandboxId })
      const cmd = await sandbox.runCommand({
        detached: true,
        cmd: command,
        args,
        sudo,
      })

      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: {
          command,
          args,
          status: 'done',
          sandboxId,
          commandId: cmd.cmdId,
        },
      })

      return `The command \`${command} ${args.join(
        ' '
      )}\` has been started in the sandbox with ID \`${sandboxId}\`. You can use the command ID \`${
        cmd.cmdId
      }\` to wait for its completion or check its status later. Remember, each command runs in a fresh shell session, so you cannot rely on previous commands' state. If this command need to finish before running anything else you must use the \`waitCommand\` tool with the command ID \`${
        cmd.cmdId
      }\`. If you want to run this command in the background, you can ignore the command ID.`
    },
  })
