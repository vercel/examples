import { Sandbox } from '@vercel/sandbox'
import { getContents, type File } from './generate-files/get-contents'
import { getRichError } from './get-rich-error'
import { getWriteFiles } from './generate-files/get-write-files'
import { ModelMessage, tool } from 'ai'
import description from './generate-files.prompt'
import z from 'zod/v3'
import { UIStreamChunk } from './types'
import { getWritable } from 'workflow'

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
  'use step'

  const writable = getWritable<UIStreamChunk>()
  const writer = writable.getWriter()

  writer.write({
    id: toolCallId,
    type: 'data-generating-files',
    data: { paths: [], status: 'generating' },
  })

  let sandbox: Sandbox | null = null

  try {
    sandbox = await Sandbox.get({ sandboxId })
  } catch (error) {
    const richError = getRichError({
      action: 'get sandbox by id',
      args: { sandboxId },
      error,
    })

    writer.write({
      id: toolCallId,
      type: 'data-generating-files',
      data: { error: richError.error, paths: [], status: 'error' },
    })

    return richError.message
  }

  const writeFiles = getWriteFiles({ sandbox, toolCallId, writer })
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
        writer.write({
          id: toolCallId,
          type: 'data-generating-files',
          data: {
            status: 'generating',
            paths: chunk.paths,
          },
        })
      }
    }
  } catch (error) {
    const richError = getRichError({
      action: 'generate file contents',
      args: { modelId, paths },
      error,
    })

    writer.write({
      id: toolCallId,
      type: 'data-generating-files',
      data: {
        error: richError.error,
        status: 'error',
        paths,
      },
    })

    return richError.message
  }

  writer.write({
    id: toolCallId,
    type: 'data-generating-files',
    data: { paths: uploaded.map((file) => file.path), status: 'done' },
  })

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
      executeGenerateFiles(args, options, modelId, messages),
  })
