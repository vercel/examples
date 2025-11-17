import type { InferUITools, UIMessage, UIMessageStreamWriter } from 'ai'
import { createSandbox } from './create-sandbox'
import { generateFiles } from './generate-files'
import { getSandboxURL } from './get-sandbox-url'
import { runCommand } from './run-command'
import { DataPart } from '../messages/data-parts'

interface Params {
  modelId: string
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export function tools({ modelId, writer }: Params) {
  return {
    createSandbox: createSandbox(writer),
    generateFiles: generateFiles(writer, { modelId }),
    getSandboxURL: getSandboxURL(writer),
    runCommand: runCommand(writer),
  }
}

export type ToolSet = InferUITools<ReturnType<typeof tools>>
