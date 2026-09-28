import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { environment } from '../sandbox'

export default defineTool({
  description:
    'Start a preview server on 0.0.0.0:3000. Its launch command is saved for automatic restart after the sandbox resumes.',
  inputSchema: z.object({ command: z.string(), args: z.array(z.string()) }),
  async execute({ command, args }, ctx) {
    const sandbox = await ctx.getSandbox(environment)
    return {
      sandboxId: sandbox.name,
      ...(await sandbox.preview.start(command, args)),
    }
  },
})
