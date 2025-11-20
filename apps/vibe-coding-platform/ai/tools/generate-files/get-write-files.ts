import type { File } from './get-contents'
import type { Sandbox } from '@vercel/sandbox'
import { getRichError } from '../get-rich-error'

interface Params {
  sandbox: Sandbox
  toolCallId: string
}

export function getWriteFiles({ sandbox }: Params) {
  return async function writeFiles(params: {
    written: string[]
    files: File[]
    paths: string[]
  }) {
    try {
      await sandbox.writeFiles(
        params.files.map((file) => ({
          content: Buffer.from(file.content, 'utf8'),
          path: file.path,
        }))
      )
    } catch (error) {
      const richError = getRichError({
        action: 'write files to sandbox',
        args: params,
        error,
      })

      return richError.message
    }
  }
}
