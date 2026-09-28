'use client'

import { TEST_PROMPTS } from '@/ai/constants'
import { MessageCircleIcon, SendIcon, SquareIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Input } from '@/components/ui/input'
import { Message } from '@/components/chat/message'
import { ModelSelector } from '@/components/settings/model-selector'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { Settings } from '@/components/settings/settings'
import { useLocalStorageValue } from '@/lib/use-local-storage-value'
import { useCallback, useEffect } from 'react'
import { useSharedChatContext } from '@/lib/chat-context'
import { useSandboxStore } from './state'

interface Props {
  className: string
  modelId?: string
}

export function Chat({ className }: Props) {
  const [input, setInput] = useLocalStorageValue('prompt-input')
  const {
    data: { messages },
    send,
    status,
    cancel,
    newProject,
    error,
  } = useSharedChatContext()
  const { setChatStatus } = useSandboxStore()

  const validateAndSubmitMessage = useCallback(
    (text: string) => {
      if (text.trim()) {
        void send(text).catch(() => {})
        setInput('')
      }
    },
    [send, setInput]
  )

  useEffect(() => {
    setChatStatus(status)
  }, [status, setChatStatus])

  return (
    <Panel className={className}>
      <PanelHeader>
        <div className="flex items-center font-mono font-semibold uppercase">
          <MessageCircleIcon className="mr-2 w-4" />
          Chat
        </div>
        <div className="ml-auto font-mono text-xs opacity-50">[{status}]</div>
        <Button
          variant="ghost"
          size="icon"
          title="New project"
          aria-label="New project"
          disabled={
            status === 'resuming' ||
            status === 'streaming' ||
            status === 'submitted'
          }
          onClick={newProject}
        >
          <PlusIcon className="size-4" />
        </Button>
      </PanelHeader>

      {/* Messages Area */}
      {messages.length === 0 ? (
        <div className="flex-1 min-h-0">
          <div className="flex flex-col justify-center items-center h-full font-mono text-sm text-muted-foreground">
            <p className="flex items-center font-semibold">
              Click and try one of these prompts:
            </p>
            <ul className="p-4 space-y-1 text-center">
              {TEST_PROMPTS.map((prompt, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 rounded-sm border border-dashed shadow-sm cursor-pointer border-border hover:bg-secondary/50 hover:text-primary"
                  onClick={() => {
                    if (status === 'ready') validateAndSubmitMessage(prompt)
                  }}
                >
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <Conversation className="relative w-full">
          <ConversationContent className="space-y-4">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      {error && (
        <p role="alert" className="px-3 py-2 text-sm text-red-600 break-words">
          {error.message}
        </p>
      )}
      <form
        className="flex items-center p-2 space-x-1 border-t border-primary/18 bg-background"
        onSubmit={async (event) => {
          event.preventDefault()
          validateAndSubmitMessage(input)
        }}
      >
        <Settings />
        <ModelSelector />
        <Input
          className="w-full font-mono text-sm rounded-sm border-0 bg-background"
          disabled={
            status === 'streaming' ||
            status === 'submitted' ||
            status === 'resuming'
          }
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          value={input}
        />
        {status === 'streaming' || status === 'submitted' ? (
          <Button
            type="button"
            title="Stop"
            aria-label="Stop"
            onClick={() => void cancel().catch(() => {})}
          >
            <SquareIcon className="size-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            aria-label="Send"
            disabled={
              (status !== 'ready' && status !== 'error') || !input.trim()
            }
          >
            <SendIcon className="size-4" />
          </Button>
        )}
      </form>
    </Panel>
  )
}
