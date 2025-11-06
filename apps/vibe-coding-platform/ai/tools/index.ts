import type { InferUITools } from 'ai'
import { createSandbox } from './create-sandbox'
import { generateFiles } from './generate-files'
import { getSandboxURL } from './get-sandbox-url'
import { runCommand } from './run-command'

interface Params {
  modelId: string
}

export function tools({ modelId }: Params) {
  return {
    createSandbox: createSandbox(),
    generateFiles: generateFiles({ modelId }),
    getSandboxURL: getSandboxURL(),
    runCommand: runCommand(),
  }
}

export type ToolSet = InferUITools<ReturnType<typeof tools>>
