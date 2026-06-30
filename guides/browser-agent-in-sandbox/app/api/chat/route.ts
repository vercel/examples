import { runBrowserAgent } from '@/ai/agent/run'
import { DEFAULT_TASK } from '@/ai/agent/constants'
import type { ChatUIMessage } from '@/lib/types'

// The agent loop provisions a sandbox and runs many browser steps — keep it on
// the Node.js runtime and give it a long budget. On Vercel this needs Fluid
// Compute enabled for the streaming + long duration to work.
export const runtime = 'nodejs'
export const maxDuration = 800

interface BodyData {
  messages?: ChatUIMessage[]
  prompt?: string
}

export async function POST(req: Request) {
  const { messages, prompt } = (await req.json()) as BodyData

  // `useChat` sends `messages`. The smoke-test script can send a bare `prompt`.
  // If neither is present, fall back to the default research task.
  if (messages && messages.length > 0) {
    return runBrowserAgent({ messages })
  }

  return runBrowserAgent({ prompt: prompt ?? DEFAULT_TASK })
}
