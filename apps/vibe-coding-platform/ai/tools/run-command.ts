import { Command, Sandbox } from '@vercel/sandbox'
import { getRichError } from './get-rich-error'
import { tool } from 'ai'
import description from './run-command.prompt'
import z from 'zod/v3'

const inputSchema = z.object({
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
  sudo: z.boolean().optional().describe('Whether to run the command with sudo'),
  wait: z
    .boolean()
    .describe(
      'Whether to wait for the command to finish before returning. If true, the command will block until it completes, and you will receive its output.'
    ),
})

async function executeRunCommand(
  { sandboxId, command, sudo, wait, args = [] }: z.infer<typeof inputSchema>,
  { toolCallId: _toolCallId }: { toolCallId: string }
) {
  let sandbox: Sandbox | null = null

  try {
    sandbox = await Sandbox.get({ sandboxId })
  } catch (error) {
    const richError = getRichError({
      action: 'get sandbox by id',
      args: { sandboxId },
      error,
    })

    return richError.message
  }

  let cmd: Command | null = null

  try {
    cmd = await sandbox.runCommand({
      detached: true,
      cmd: command,
      args,
      sudo,
    })
  } catch (error) {
    const richError = getRichError({
      action: 'run command in sandbox',
      args: { sandboxId },
      error,
    })

    return richError.message
  }

  if (!wait) {
    return `The command \`${command} ${args.join(
      ' '
    )}\` has been started in the background in the sandbox with ID \`${sandboxId}\` with the commandId ${
      cmd.cmdId
    }.`
  }

  const done = await cmd.wait()
  try {
    const [stdout, stderr] = await Promise.all([done.stdout(), done.stderr()])

    return (
      `The command \`${command} ${args.join(
        ' '
      )}\` has finished with exit code ${done.exitCode}.` +
      `Stdout of the command was: \n` +
      `\`\`\`\n${stdout}\n\`\`\`\n` +
      `Stderr of the command was: \n` +
      `\`\`\`\n${stderr}\n\`\`\``
    )
  } catch (error) {
    const richError = getRichError({
      action: 'wait for command to finish',
      args: { sandboxId, commandId: cmd.cmdId },
      error,
    })
    return richError.message
  }
}

export const runCommand = () =>
  tool({
    description,
    inputSchema,
    execute: (args, options) => executeRunCommand(args, { ...options }),
  })
