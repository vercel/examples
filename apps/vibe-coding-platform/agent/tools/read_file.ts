import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { projectPath } from '../../lib/workspace'
import { environment } from '../sandbox'

export default defineTool({
  description: 'Read a project file before editing it.',
  inputSchema: z.object({ path: z.string() }),
  async execute({ path }, ctx) {
    const { native: sandbox } = await ctx.getSandbox(environment)
    const content = await sandbox.readFileToBuffer({ path: projectPath(path) })
    if (!content) throw new Error('File not found')
    return content.toString('utf8')
  },
})
