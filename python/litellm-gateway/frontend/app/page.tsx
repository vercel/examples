'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useRef, useEffect } from 'react'

const MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku' },
]

export default function Home() {
  const [model, setModel] = useState(MODELS[0].id)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, error, status, setMessages, stop } = useChat()

  const isStreaming = status === 'streaming'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage({ text: input }, { body: { model } })
    setInput('')
  }

  function handleNewChat() {
    stop()
    setMessages([])
    setInput('')
  }

  return (
    <div className="container">
      <header>
        <nav>
          <button className="new-chat" onClick={handleNewChat} title="New chat">
            +
          </button>
          <span className="logo">LiteLLM Gateway</span>
          <select
            className="model-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </nav>
      </header>

      <main>
        {messages.length === 0 ? (
          <div className="empty-state">
            <h1>LiteLLM Gateway</h1>
            <p>
              Self-hosted AI gateway powered by{' '}
              <a
                href="https://www.litellm.ai/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LiteLLM
              </a>{' '}
              and deployed on{' '}
              <a
                href="https://vercel.com/docs/services"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel Services
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="messages">
            {messages.map((m) => (
              <div key={m.id} className={`message ${m.role}`}>
                <div className="message-role">
                  {m.role === 'user' ? 'You' : model}
                </div>
                <div className="message-content">
                  {m.parts.map((part, i) => {
                    if (part.type === 'text') {
                      return <span key={i}>{part.text}</span>
                    }
                    return null
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {error && (
        <div className="error">
          {error.message ||
            'Something went wrong. Check your API keys and try again.'}
        </div>
      )}

      <footer>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="text"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="send"
            >
              {isStreaming ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </footer>
    </div>
  )
}
