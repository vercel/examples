import type { DataPart } from '../../messages/data-parts'
import type { File } from './get-contents'
import type { UIMessageStreamWriter, UIMessage } from 'ai'
import { Sandbox } from '@e2b/sdk'

interface Params {
  sandboxId: string
  toolCallId: string
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export function getWriteFiles({ sandboxId, toolCallId, writer }: Params) {
  return async function writeFiles(params: {
    written: string[]
    files: File[]
    paths: string[]
  }) {
    const paths = params.written.concat(params.files.map((file) => file.path))
    writer.write({
      id: toolCallId,
      type: 'data-generating-files',
      data: { paths, status: 'uploading' },
    })

    try {
      const sandbox = await Sandbox.reconnect(sandboxId)
      for (const file of params.files) {
        await sandbox.filesystem.write(file.path, file.content)
      }
    } catch (error: any) {
      writer.write({
        id: toolCallId,
        type: 'data-generating-files',
        data: {
          error: { message: error.message },
          status: 'error',
          paths: params.paths,
        },
      })

      return `Failed to write files to E2B: ${error.message}`
    }

    writer.write({
      id: toolCallId,
      type: 'data-generating-files',
      data: { paths, status: 'uploaded' },
    })
  }
}
