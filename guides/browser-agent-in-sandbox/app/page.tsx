'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'
import { ArrowUpIcon, GlobeIcon, SquareIcon } from 'lucide-react'
import type { ChatUIMessage } from '@/lib/types'
import { DEFAULT_TASK } from '@/ai/agent/constants'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Loader } from '@/components/ai-elements/loader'
import { Message } from '@/components/chat/message'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function Page() {
  const [input, setInput] = useState(DEFAULT_TASK)
  const { messages, sendMessage, status, stop } = useChat<ChatUIMessage>({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const busy = status === 'submitted' || status === 'streaming'

  function submit() {
    const text = input.trim()
    if (!text || busy) return
    sendMessage({ text })
  }

  return (
    <div className="mx-auto flex h-screen max-h-screen w-full max-w-3xl flex-col px-4">
      <header className="flex items-center gap-2 py-4">
        <GlobeIcon className="size-5" />
        <h1 className="font-mono text-sm font-semibold tracking-tight">
          Browser Research Agent
        </h1>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          browse CLI · Vercel Sandbox · Browserbase
        </span>
      </header>

      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="max-w-md text-sm text-muted-foreground">
            An autonomous agent that drives the Browserbase{' '}
            <code className="font-mono">browse</code> CLI inside a Vercel
            Sandbox. Enter a research task and watch it browse the web, step by
            step.
          </p>
        </div>
      ) : (
        <Conversation className="flex-1">
          <ConversationContent className="space-y-6">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {status === 'submitted' && (
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <Loader size={14} />
                Provisioning sandbox and starting the agent…
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      <form
        className="mb-4 mt-2"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <div className="rounded-xl border border-input bg-background p-2 shadow-sm focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                submit()
              }
            }}
            disabled={busy}
            rows={3}
            placeholder="Describe a research task…"
            className="border-0 bg-transparent p-1.5 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between px-1.5 pt-1">
            <span className="font-mono text-xs text-muted-foreground">
              ⌘↵ to run
            </span>
            {busy ? (
              <Button type="button" size="sm" variant="secondary" onClick={stop}>
                <SquareIcon className="size-3.5" />
                Stop
              </Button>
            ) : (
              <Button type="submit" size="sm" disabled={!input.trim()}>
                Run
                <ArrowUpIcon className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
