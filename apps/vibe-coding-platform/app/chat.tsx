'use client'

import type { ChatUIMessage } from '@/components/chat/types'
import { DEFAULT_MODEL, TEST_PROMPTS, SUPPORTED_MODELS } from '@/ai/constants'
import { MessageCircleIcon, SendIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Message } from '@/components/chat/message'
import { ModelSelector } from '@/components/model-selector/model-selector'
import { MoonLoader } from 'react-spinners'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createParser, useQueryState } from 'nuqs'
import { toast } from 'sonner'
import { mutate } from 'swr'
import { useChat } from '@ai-sdk/react'
import { useDataStateMapper } from './state'
import { useLocalStorageValue } from '@/lib/use-local-storage-value'
import { useEffect, useRef } from 'react'

interface Props {
  className: string
  modelId?: string
}

export function Chat({ className }: Props) {
  const [modelId, setModelId] = useQueryState('modelId', modelParser)
  const [input, setInput] = useLocalStorageValue('prompt-input')
  const mapDataToState = useDataStateMapper()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, status } = useChat<ChatUIMessage>({
    onToolCall: () => mutate('/api/auth/info'),
    onData: mapDataToState,
    onError: (error) => {
      toast.error(`Communication error with the AI: ${error.message}`)
      console.error('Error sending message:', error)
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const validateAndSubmitMessage = (text: string) => {
    if (text.trim()) {
      sendMessage({ text }, { body: { modelId } })
      setInput('')
    }
  }

  return (
    <Panel className={className}>
      <PanelHeader>
        <div className="flex items-center font-mono uppercase font-semibold">
          <MessageCircleIcon className="mr-2 w-4" />
          Chat
        </div>
        <div className="ml-auto text-xs opacity-50 font-mono">[{status}]</div>
      </PanelHeader>

      {/* Messages Area */}
      <div className="flex-1 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground font-mono">
            <p className="flex items-center font-semibold">
              Click and try one of these prompts:
            </p>
            <ul className="p-4 space-y-1 text-center">
              {TEST_PROMPTS.map((prompt, idx) => (
                <li
                  key={idx}
                  className="border border-dashed border-border rounded-sm cursor-pointer py-2 px-4 shadow-sm hover:bg-secondary/50 hover:text-primary"
                  onClick={() => validateAndSubmitMessage(prompt)}
                >
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}
              </div>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      <form
        className="flex space-x-1 p-2 border-t border-primary/18 bg-background items-center"
        onSubmit={async (event) => {
          event.preventDefault()
          validateAndSubmitMessage(input)
        }}
      >
        <ModelSelector
          modelId={modelId}
          onModelChange={(newModelId: string) => {
            setModelId(newModelId)
          }}
        />
        <Input
          className="w-full text-sm border-0 bg-background font-mono rounded-sm"
          disabled={status === 'streaming' || status === 'submitted'}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          value={input}
        />
        <Button type="submit" disabled={status !== 'ready' || !input.trim()}>
          {status === 'streaming' || status === 'submitted' ? (
            <MoonLoader color="currentColor" size={16} />
          ) : (
            <SendIcon className="w-4 h-4" />
          )}
        </Button>
      </form>
    </Panel>
  )
}

const modelParser = createParser({
  parse: (value) => (SUPPORTED_MODELS.includes(value) ? value : DEFAULT_MODEL),
  serialize: (value) => value,
}).withDefault(DEFAULT_MODEL)
