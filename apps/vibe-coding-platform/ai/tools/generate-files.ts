import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { Sandbox } from '@vercel/sandbox'
import { streamObject, tool } from 'ai'
import { getModelOptions } from '../gateway'
import description from './generate-files.md'
import prompt from './generate-files-prompt.md'
import z from 'zod/v3'

interface Params {
  modelId: string
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

const fileSchema = z.object({
  path: z
    .string()
    .describe(
      "Path to the file in the Vercel Sandbox (relative paths from sandbox root, e.g., 'src/main.js', 'package.json', 'components/Button.tsx')"
    ),
  content: z
    .string()
    .describe(
      'The content of the file as a utf8 string (complete file contents that will replace any existing file at this path)'
    ),
})

export const generateFiles = ({ writer, modelId }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      sandboxId: z.string(),
    }),
    execute: async ({ sandboxId }, { toolCallId, messages }) => {
      writer.write({
        id: toolCallId,
        type: 'data-generating-files',
        data: { paths: [], status: 'generating' },
      })

      /**
       * In order to provide visual feedback while files are being generated,
       * we use a nested AI call, otherwise all files must be generated before
       * calling the tool which provides a worse experience.
       */
      const result = streamObject({
        ...getModelOptions(modelId),
        messages: [...messages, { role: 'user', content: prompt }],
        schema: z.object({ files: z.array(fileSchema) }),
        onError: (error) => {
          console.error('Error communicating with AI')
          console.error(JSON.stringify(error, null, 2))
        },
      })

      const written: string[] = []
      const sandbox = await Sandbox.get({ sandboxId })
      const writeFiles = getWriteFiles({ sandbox, toolCallId, writer })

      for await (const items of result.partialObjectStream) {
        if (!Array.isArray(items?.files)) {
          continue
        }

        const files = items.files.slice(written.length, items.files.length - 2)
        if (files.length > 0) {
          written.push(...(await writeFiles({ files, written })))
        } else {
          writer.write({
            id: toolCallId,
            type: 'data-generating-files',
            data: {
              status: 'generating',
              paths: written.concat(
                items.files
                  .slice(written.length, items.files.length - 1)
                  .flatMap((f) => (f?.path ? [f.path] : []))
              ),
            },
          })
        }
      }

      const output = await result.object
      await writeFiles({
        files: output.files.slice(written.length),
        written: written,
      })

      writer.write({
        id: toolCallId,
        type: 'data-generating-files',
        data: {
          paths: output.files.map(({ path }) => path),
          status: 'done',
        },
      })

      return `Successfully generated and uploaded ${
        output.files.length
      } files. Their path and content are as follows:
        ${output.files
          .map((file) => `Path: ${file.path}\nContent: ${file.content}\n`)
          .join('\n')}`
    },
  })

interface Dependencies {
  sandbox: Sandbox
  toolCallId: string
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

function getWriteFiles({ sandbox, toolCallId, writer }: Dependencies) {
  return async function writeFiles(params: {
    files: (Partial<z.infer<typeof fileSchema>> | undefined)[]
    written: string[]
  }) {
    const files = params.files.map((file) => fileSchema.parse(file))
    const paths = params.written.concat(files.map((file) => file.path))

    writer.write({
      id: toolCallId,
      type: 'data-generating-files',
      data: { paths, status: 'uploading' },
    })

    await sandbox.writeFiles(
      files.map((file) => ({
        content: Buffer.from(file.content, 'utf8'),
        path: file.path,
      }))
    )

    writer.write({
      id: toolCallId,
      type: 'data-generating-files',
      data: { paths, status: 'uploaded' },
    })

    return files.map((file) => file.path)
  }
}
