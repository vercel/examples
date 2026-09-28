import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { commandLine, readOutputTail } from '../lib/command-output'
import { environment } from '../sandbox'

export default defineTool({
  description:
    'Run a command in /workspace and return its exit code and output. Use start_preview for the dev server.',
  inputSchema: z.object({
    command: z.string(),
    args: z.array(z.string()).default([]),
  }),
  async *execute({ command, args }, ctx) {
    const sandbox = await ctx.getSandbox(environment)
    const process = await sandbox.spawn({
      command: commandLine(command, args),
      abortSignal: ctx.abortSignal,
    })
    const progress = {
      sandboxId: sandbox.name,
      commandId: process.commandId,
      command,
      args,
    }
    yield {
      ...progress,
      status: 'executing',
      exitCode: undefined,
      stdout: '',
      stderr: '',
    }
    const [done, stdout, stderr] = await Promise.all([
      process.wait(),
      readOutputTail(process.stdout),
      readOutputTail(process.stderr),
    ])
    yield {
      ...progress,
      status: 'done',
      exitCode: done.exitCode,
      stdout,
      stderr,
    }
  },
})
