import { createChatSession, defineChat } from '@agentskit/chat'
import { AgentChat } from '@agentskit/chat/react'
import type { AdapterFactory } from '@agentskit/core'

const adapter: AdapterFactory = {
  createSource(request) {
    let aborted = false

    return {
      async *stream() {
        const prompt =
          request.messages.filter((message) => message.role === 'user').at(-1)
            ?.content ?? ''
        const answer = prompt
          ? `AgentsKit received “${prompt}”. Replace this local adapter with OpenAI, Anthropic, Gemini, Ollama, or your own provider.`
          : 'Ask a question to start the stream.'

        for (const token of answer.split(' ')) {
          if (aborted) return
          await new Promise((resolve) => setTimeout(resolve, 45))
          yield { type: 'text', content: `${token} ` } as const
        }

        yield { type: 'done' } as const
      },
      abort() {
        aborted = true
      },
    }
  },
}

const definition = defineChat({ id: 'vercel-demo', chat: { adapter } })
const session = createChatSession(definition, { sessionId: 'vercel-demo' })

export const App = () => (
  <main>
    <header>
      <a
        href="https://github.com/AgentsKit-io/agentskit-chat"
        target="_blank"
        rel="noreferrer"
      >
        AgentsKit Chat
      </a>
      <h1>A headless agent chat you can deploy now.</h1>
      <p>
        Streaming, cancellation, session state, and accessible React
        rendering—without an API key for this demo.
      </p>
    </header>
    <section className="demo" aria-label="Chat demo">
      <AgentChat
        definition={definition}
        session={session}
        placeholder="Ask how the adapter works"
      />
    </section>
  </main>
)
