import type { InferUITools } from 'ai'
import { createSandbox } from './create-sandbox'
import { generateFiles } from './generate-files'
import { getSandboxURL } from './get-sandbox-url'
import { runCommand } from './run-command'
import { UIStreamWriter } from './types'

interface Params {
  modelId: string
  writer: UIStreamWriter
}

export function tools({ modelId, writer }: Params) {
  return {
    createSandbox: createSandbox({ writer }),
    generateFiles: generateFiles({ modelId, writer }),
    getSandboxURL: getSandboxURL({ writer }),
    runCommand: runCommand({ writer }),
  }
}

export type ToolSet = InferUITools<ReturnType<typeof tools>>
