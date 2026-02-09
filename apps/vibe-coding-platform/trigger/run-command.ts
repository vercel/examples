import { task } from '@trigger.dev/sdk/v3'
import { Sandbox } from '@e2b/sdk'

export const runCommandTask = task({
  id: 'run-command',
  run: async (payload: {
    command: string
    args: string[]
    sandboxId: string
  }) => {
    try {
      const sandbox = await Sandbox.reconnect(payload.sandboxId)

      const fullCommand = `${payload.command} ${payload.args.join(' ')}`
      console.log(`Executing E2B: ${fullCommand}`)

      const result = await sandbox.process.startAndWait(fullCommand)

      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
      }
    } catch (error: any) {
      console.error('E2B Execution failed:', error)
      return {
        stdout: '',
        stderr: error.message,
        exitCode: 1,
      }
    }
  },
})
