import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { listFiles, previewOutput } from '../../lib/workspace'
import { environment } from '../sandbox'

export default defineTool({
  description:
    'Open or resume the persistent project workspace and list its files.',
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const { native: sandbox } = await ctx.getSandbox(environment)
    return {
      sandboxId: sandbox.name,
      paths: await listFiles(sandbox),
      replacePaths: true,
      ...(await previewOutput(sandbox)),
    }
  },
})
