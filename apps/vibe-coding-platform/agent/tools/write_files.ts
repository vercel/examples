import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { projectPath, WORKSPACE } from '../../lib/workspace'
import { environment } from '../sandbox'

export default defineTool({
  description:
    'Write complete source files to the persistent project. Read existing files before changing them.',
  inputSchema: z.object({
    files: z
      .array(z.object({ path: z.string(), content: z.string() }))
      .min(1)
      .max(50),
  }),
  async execute({ files }, ctx) {
    const sandbox = await ctx.getSandbox(environment)
    for (const file of files) {
      await sandbox.writeTextFile({ ...file, abortSignal: ctx.abortSignal })
    }
    return {
      sandboxId: sandbox.name,
      paths: files.map((file) =>
        projectPath(file.path).slice(WORKSPACE.length + 1)
      ),
    }
  },
})
