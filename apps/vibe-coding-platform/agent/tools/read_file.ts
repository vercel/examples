import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { environment } from '../sandbox'

export default defineTool({
  description: 'Read a project file before editing it.',
  inputSchema: z.object({ path: z.string() }),
  async execute({ path }, ctx) {
    const sandbox = await ctx.getSandbox(environment)
    const content = await sandbox.readTextFile({
      path,
      abortSignal: ctx.abortSignal,
    })
    if (content === null) throw new Error('File not found')
    return content
  },
})
