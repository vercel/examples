import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { startPreview } from '../../lib/workspace'
import { environment } from '../sandbox'

export default defineTool({
  description:
    'Start a preview server on 0.0.0.0:3000. Its launch command is saved for automatic restart after the sandbox resumes.',
  inputSchema: z.object({ command: z.string(), args: z.array(z.string()) }),
  async execute({ command, args }, ctx) {
    const { native: sandbox } = await ctx.getSandbox(environment)
    return {
      sandboxId: sandbox.name,
      ...(await startPreview(sandbox, command, args)),
    }
  },
})
