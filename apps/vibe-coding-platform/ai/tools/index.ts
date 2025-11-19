import type { InferUITools, ModelMessage } from 'ai'
import { createSandbox } from './create-sandbox'
import { generateFiles } from './generate-files'
import { getSandboxURL } from './get-sandbox-url'
import { runCommand } from './run-command'
import { UIStreamWriter } from './types'

interface Params {
  modelId: string
  writer: UIStreamWriter
  messages: ModelMessage[]
}

export function tools({ modelId, writer, messages }: Params) {
  return {
    createSandbox: createSandbox({ writer }),
    generateFiles: generateFiles({ modelId, writer, messages }),
    getSandboxURL: getSandboxURL({ writer }),
    runCommand: runCommand({ writer }),
  }
}

export type ToolSet = InferUITools<ReturnType<typeof tools>>
