import { Sandbox } from '@vercel/sandbox'
import { getContents, type File } from './generate-files/get-contents'
import { getRichError } from './get-rich-error'
import { getWriteFiles } from './generate-files/get-write-files'
import { type ModelMessage, tool } from 'ai'
import description from './generate-files.prompt'
import z from 'zod/v3'

const inputSchema = z.object({
  sandboxId: z.string(),
  paths: z.array(z.string()),
})

async function executeGenerateFiles(
  { sandboxId, paths }: z.infer<typeof inputSchema>,
  { toolCallId }: { toolCallId: string },
  modelId: string,
  messages: ModelMessage[]
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

  const writeFiles = getWriteFiles({ sandbox, toolCallId })
  const iterator = getContents({ messages, modelId, paths })
  const uploaded: File[] = []

  try {
    for await (const chunk of iterator) {
      if (chunk.files.length > 0) {
        const error = await writeFiles(chunk)
        if (error) {
          return error
        } else {
          uploaded.push(...chunk.files)
        }
      } else {
        // no files to write
      }
    }
  } catch (error) {
    const richError = getRichError({
      action: 'generate file contents',
      args: { modelId, paths },
      error,
    })

    return richError.message
  }

  return `Successfully generated and uploaded ${
    uploaded.length
  } files. Their paths and contents are as follows:
    ${uploaded
      .map((file) => `Path: ${file.path}\nContent: ${file.content}\n`)
      .join('\n')}`
}

export const generateFiles = ({
  modelId,
  messages,
}: {
  modelId: string
  messages: ModelMessage[]
}) =>
  tool({
    description,
    inputSchema,
    execute: (args, options) =>
      executeGenerateFiles(args, { ...options }, modelId, messages),
  })
