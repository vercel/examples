import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { WORKSPACE } from '../../lib/workspace'
import { environment } from '../sandbox'

export default defineTool({
  description:
    'Run a command in /workspace and return its exit code and output. Use start_preview for the dev server.',
  inputSchema: z.object({
    command: z.string(),
    args: z.array(z.string()).default([]),
  }),
  async *execute({ command, args }, ctx) {
    const { native: sandbox } = await ctx.getSandbox(environment)
    const process = await sandbox.runCommand({
      cmd: command,
      args,
      cwd: WORKSPACE,
      detached: true,
    })
    const progress = {
      sandboxId: sandbox.name,
      commandId: process.cmdId,
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
    const done = await process
      .wait({ signal: ctx.abortSignal })
      .catch(async (error) => {
        if (ctx.abortSignal?.aborted) await process.kill().catch(() => {})
        throw error
      })
    yield {
      ...progress,
      status: 'done',
      exitCode: done.exitCode,
      stdout: (await done.stdout()).slice(-16000),
      stderr: (await done.stderr()).slice(-16000),
    }
  },
})
