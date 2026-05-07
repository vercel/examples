'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Virtuoso } from 'react-virtuoso'
import type { VirtuosoHandle } from 'react-virtuoso'
import type { UIMessage } from '@ai-sdk/react'
import { Loader2, ArrowDown } from 'lucide-react'
import { ErrorBoundary } from '~/components/core/error-boundary'
import { Button } from '~/components/ui/button'
import { useTerminalStore } from '../terminal-store'
import { useChatHook } from '../use-chat-hook'
import { UserMessage } from './user-message'
import { AssistantMessage } from './assistant-message/assistant-message'
import { ThinkingIndicator } from './assistant-message/thinking-indicator'
import { ChatInput } from './chat-input'
import { TerminalPane } from '../terminal/terminal-pane'
import { ComposioCta } from './composio-cta'

const SAMPLE_PROMPTS = [
  'Summarize my emails for today',
  "What's on my calendar for tomorrow",
  'Catch me up on latest messages on Slack',
]

const START_INDEX = 100_000

interface ChatViewProps {
  initialMessages: UIMessage[]
  streamId: string | null
  historyPageCount: number
  fetchOlderMessages: () => void
  hasOlderMessages: boolean
  isFetchingOlderMessages: boolean
}

export function ChatView({
  initialMessages,
  streamId,
  historyPageCount,
  fetchOlderMessages,
  hasOlderMessages,
  isFetchingOlderMessages,
}: ChatViewProps) {
  const { sendMessage, stop, messages, status, setMessages } = useChatHook({
    initialMessages,
    streamId,
  })
  const terminalOpen = useTerminalStore((s) => s.terminalOpen)
  const setTerminalOpen = useTerminalStore((s) => s.setTerminalOpen)
  const isEmpty = messages.length === 0

  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX)
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [atBottom, setAtBottom] = useState(true)

  const prevMessageCountRef = useRef(messages.length)
  const prevFirstIdRef = useRef<string | null>(null)

  if (messages.length > 0) {
    const currentFirstId = messages[0]!.id
    const countDelta = messages.length - prevMessageCountRef.current

    if (
      countDelta > 0 &&
      prevFirstIdRef.current !== null &&
      currentFirstId !== prevFirstIdRef.current
    ) {
      setFirstItemIndex((prev) => prev - countDelta)
    }

    prevMessageCountRef.current = messages.length
    prevFirstIdRef.current = currentFirstId
  }

  // Infinite scroll: prepend older messages when new history pages load
  const pageCountRef = useRef(historyPageCount)
  useEffect(() => {
    if (historyPageCount <= pageCountRef.current) {
      pageCountRef.current = historyPageCount
      return
    }
    setMessages((current) => {
      const currentIds = new Set(current.map((m) => m.id))
      const newOlder = initialMessages.filter((m) => !currentIds.has(m.id))
      if (newOlder.length === 0) return current
      return [...newOlder, ...current]
    })
    pageCountRef.current = historyPageCount
  }, [historyPageCount, initialMessages, setMessages])

  const handleStartReached = useCallback(() => {
    if (hasOlderMessages && !isFetchingOlderMessages) {
      void fetchOlderMessages()
    }
  }, [hasOlderMessages, isFetchingOlderMessages, fetchOlderMessages])

  const isStreaming = status === 'streaming' || status === 'submitted'
  const lastMessage = messages[messages.length - 1]
  const isWaitingForAssistant = isStreaming && lastMessage?.role === 'user'

  // Scroll the user's message to the top of the viewport when they send it
  const handleSend = useCallback(
    (text: string) => {
      const result = sendMessage(text)
      // Wait one frame for Virtuoso to render the new user message
      requestAnimationFrame(() => {
        virtuosoRef.current?.scrollToIndex({
          index: 'LAST',
          align: 'start',
          behavior: 'smooth',
        })
      })
      return result
    },
    [sendMessage]
  )

  const handleScrollToBottom = useCallback(() => {
    virtuosoRef.current?.scrollToIndex({
      index: 'LAST',
      align: 'end',
      behavior: 'smooth',
    })
  }, [])

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col">
        <ComposioCta />
        <div className="relative min-h-0 flex-1">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <div className="flex flex-wrap justify-center gap-2">
                {SAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      void handleSend(prompt)
                    }}
                    className="border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-full border px-4 py-2 text-sm transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <Virtuoso
              ref={virtuosoRef}
              data={messages}
              firstItemIndex={firstItemIndex}
              initialTopMostItemIndex={{ index: 'LAST', align: 'end' }}
              startReached={handleStartReached}
              atBottomStateChange={setAtBottom}
              atBottomThreshold={50}
              increaseViewportBy={{ top: 200, bottom: 0 }}
              components={{
                Header: () =>
                  isFetchingOlderMessages ? (
                    <div className="flex justify-center py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : null,
                Footer: () => (
                  <div className="pb-4 md:pb-6">
                    {isWaitingForAssistant && (
                      <div className="mx-auto w-full max-w-3xl px-4 pt-6 md:px-8">
                        <ThinkingIndicator />
                      </div>
                    )}
                  </div>
                ),
              }}
              itemContent={(_index, message) =>
                message.role === 'user' ? (
                  <div className="mx-auto w-full max-w-3xl px-4 pt-6 md:px-8">
                    <ErrorBoundary
                      key={message.id}
                      fallback={
                        <p className="text-muted-foreground text-sm italic">
                          Failed to render message
                        </p>
                      }
                    >
                      <UserMessage message={message} />
                    </ErrorBoundary>
                  </div>
                ) : (
                  <div className="mx-auto w-full max-w-3xl px-4 pt-6 md:px-8">
                    <ErrorBoundary
                      key={message.id}
                      fallback={
                        <p className="text-muted-foreground text-sm italic">
                          Failed to render message
                        </p>
                      }
                    >
                      <AssistantMessage
                        message={message}
                        status={
                          message.id === lastMessage?.id ? status : 'ready'
                        }
                        onOpenTerminal={() => setTerminalOpen(true)}
                      />
                    </ErrorBoundary>
                  </div>
                )
              }
              className="!overflow-y-auto"
            />
          )}

          {!atBottom && !isEmpty && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleScrollToBottom}
              className="absolute bottom-4 left-1/2 size-10 -translate-x-1/2 rounded-full shadow-md"
            >
              <ArrowDown className="size-4" />
            </Button>
          )}
        </div>

        <ChatInput onSend={handleSend} onStop={stop} status={status} />
      </div>

      {terminalOpen && (
        <div className="hidden w-[400px] shrink-0 border-l border-border md:block lg:w-[500px]">
          <TerminalPane
            messages={messages}
            status={status}
            onHide={() => setTerminalOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
