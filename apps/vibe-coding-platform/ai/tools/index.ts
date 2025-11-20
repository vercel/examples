import type { InferUITools, ModelMessage } from 'ai'
import { createSandbox } from './create-sandbox'
import { generateFiles } from './generate-files'
import { getSandboxURL } from './get-sandbox-url'
import { runCommand } from './run-command'
import { sleepTool } from './sleep'
import { humanApprovalTool } from './human-approval'

interface Params {
  modelId: string
  messages: ModelMessage[]
}

export function tools({ modelId, messages }: Params) {
  return {
    createSandbox: createSandbox(),
    generateFiles: generateFiles({ modelId, messages }),
    getSandboxURL: getSandboxURL(),
    runCommand: runCommand(),
    sleep: sleepTool(),
    humanApproval: humanApprovalTool(),
  }
}

export type ToolSet = InferUITools<ReturnType<typeof tools>>
