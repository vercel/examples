import type { UserModelMessage } from 'ai'

type ProviderOptions = UserModelMessage['providerOptions']

export type JsonValue =
  | null
  | string
  | number
  | boolean
  | { [key: string]: JsonValue }
  | JsonValue[]

export type ToolResultOutput =
  | { type: 'text'; value: string }
  | { type: 'json'; value: JsonValue }

export type ReconstructedMessage =
  | { role: 'user'; content: string; providerOptions?: ProviderOptions }
  | {
      role: 'assistant'
      content:
        | string
        | Array<
            | { type: 'text'; text: string }
            | {
                type: 'tool-call'
                toolCallId: string
                toolName: string
                input: Record<string, unknown>
              }
          >
      providerOptions?: ProviderOptions
    }
  | {
      role: 'tool'
      content: Array<{
        type: 'tool-result'
        toolCallId: string
        toolName: string
        output: ToolResultOutput
      }>
      providerOptions?: ProviderOptions
    }
