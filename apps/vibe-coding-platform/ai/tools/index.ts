import type { InferUITools, UIMessage, UIMessageStreamWriter } from 'ai'
import { createSandbox } from './create-sandbox'
import { generateFiles } from './generate-files'
import { getSandboxURL } from './get-sandbox-url'
import { runCommand } from './run-command'
import type { DataPart } from '../messages/data-parts'

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
