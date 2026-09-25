// Runs the browser-research agent and returns a UI message stream that
// `@ai-sdk/react`'s `useChat` consumes directly.
//
// The agent loop runs HERE on the host (Vercel AI SDK `streamText` with
// `stopWhen`). Its `bash` tool — built with `bash-tool` — executes commands
// INSIDE the Vercel Sandbox microVM. The model navigates the web by emitting
// `browse` commands through that `bash` tool. Tool calls + their results and the
// model's text stream to the client as standard AI SDK UI message parts.
import {
  type ModelMessage,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from 'ai'
import { createBashTool } from 'bash-tool'
import { MODEL, buildSystemPrompt } from './constants'
import { createBrowseSandbox, toBashToolSandbox } from './sandbox'
import type { ChatUIMessage } from '@/lib/types'

interface RunAgentOptions {
  /** Prior UI messages from `useChat` (includes the latest user turn). */
  messages?: ChatUIMessage[]
  /** Or a bare prompt string (used by the smoke-test script). */
  prompt?: string
}

export async function runBrowserAgent({
  messages,
  prompt,
}: RunAgentOptions): Promise<Response> {
  const sandbox = await createBrowseSandbox()

  // Build the `bash` tool backed by the sandbox. `destination` is the working
  // directory the bash tool runs commands from.
  const { tools } = await createBashTool({
    sandbox: toBashToolSandbox(sandbox),
    destination: '/vercel/sandbox',
  })

  // Only expose the `bash` tool — that is all the agent needs to drive `browse`.
  const agentTools = { bash: tools.bash }

  const modelMessages: ModelMessage[] = messages
    ? await convertToModelMessages(messages)
    : [{ role: 'user', content: prompt ?? '' }]

  return createUIMessageStreamResponse({
    stream: createUIMessageStream<ChatUIMessage>({
      originalMessages: messages,
      execute: ({ writer }) => {
        const result = streamText({
          model: MODEL,
          system: buildSystemPrompt(),
          messages: modelMessages,
          tools: agentTools,
          // The agent navigates the web over many steps; give it room.
          stopWhen: stepCountIs(40),
          onError: (error) => {
            console.error('Agent error:', JSON.stringify(error, null, 2))
          },
        })

        result.consumeStream()
        writer.merge(result.toUIMessageStream({ sendStart: false }))
      },
      onFinish: async () => {
        // Tear down the microVM once the run completes.
        await sandbox.stop().catch(() => {})
      },
    }),
  })
}
