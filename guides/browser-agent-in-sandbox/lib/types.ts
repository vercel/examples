import type { InferUITool, UIMessage } from 'ai'
import type { createBashTool } from 'bash-tool'

// The `bash` tool is the only tool the agent uses. We infer its input/output
// types from `bash-tool` so message rendering is fully typed.
type BashToolkit = Awaited<ReturnType<typeof createBashTool>>
export type BashTool = InferUITool<BashToolkit['tools']['bash']>

export type ChatTools = {
  bash: BashTool
}

export type ChatUIMessage = UIMessage<never, never, ChatTools>

// The streamed UI part for a `bash` tool call (state machine:
// input-streaming → input-available → output-available | output-error).
export type BashUIPart = Extract<
  ChatUIMessage['parts'][number],
  { type: 'tool-bash' }
>
