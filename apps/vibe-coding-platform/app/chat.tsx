'use client'

import type { ChatUIMessage } from '@/components/chat/types'
import { TEST_PROMPTS } from '@/ai/constants'
import { MessageCircleIcon, SendIcon } from 'lucide-react'
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
import { useChat } from '@ai-sdk/react'
import { useLocalStorageValue } from '@/lib/use-local-storage-value'
import { useCallback, useEffect, useRef } from 'react'
import { useSettings } from '@/components/settings/use-settings'
import { useDataStateMapper, useSandboxStore } from './state'
import { toast } from 'sonner'
import { mutate } from 'swr'
import type { DataUIPart } from 'ai'
import type { DataPart } from '@/ai/messages/data-parts'
import { WorkflowChatTransport } from '@workflow/ai'

interface Props {
  className: string
  modelId?: string
}

export function Chat({ className }: Props) {
  const [input, setInput] = useLocalStorageValue('prompt-input')
  const [currentRunId, setCurrentRunId] = useLocalStorageValue(
    'storedWorkflowRunId'
  )
  const [chatHistory, setChatHistory] = useLocalStorageValue('chatHistory')
  const { modelId, reasoningEffort } = useSettings()

  const mapDataToState = useDataStateMapper()
  const mapDataToStateRef = useRef(mapDataToState)

  const { messages, setMessages, sendMessage, status } = useChat<ChatUIMessage>(
    {
      resume: Boolean(currentRunId),
      onToolCall: () => mutate('/api/auth/info'),
      onData: (data: DataUIPart<DataPart>) => mapDataToStateRef.current(data),
      onError: (error) => {
        toast.error(`Communication error with the AI: ${error.message}`)
        console.error('Error sending message:', error)
      },
      transport: new WorkflowChatTransport({
        api: `/api/chat`,
        onChatSendMessage: (response, options) => {
          console.log('onChatSendMessage', response, options)

          setChatHistory(JSON.stringify(options.messages))

          const workflowRunId = response.headers.get('x-workflow-run-id')
          if (!workflowRunId) {
            throw new Error(
              'Workflow run ID not found in "x-workflow-run-id" response header'
            )
          }

          setCurrentRunId(workflowRunId)
        },
        onChatEnd: ({ chatId, chunkIndex }) => {
          console.log('onChatEnd', chatId, chunkIndex)
          // Once the chat stream ends, we can remove the workflow run ID from `localStorage`
          setCurrentRunId('')
        },
        // Configure reconnection to use the stored workflow run ID
        prepareReconnectToStreamRequest: ({ id, api, ...rest }) => {
          console.log('prepareReconnectToStreamRequest', id)
          if (!currentRunId) {
            throw new Error('No active workflow run ID found')
          }
          // Use the workflow run ID instead of the chat ID for reconnection
          return {
            ...rest,
            api: `/api/chat/${encodeURIComponent(currentRunId)}/stream`,
          }
        },
        // Optional: Configure error handling for reconnection attempts
        maxConsecutiveErrors: 5,
      }),
    }
  )
  const { setChatStatus } = useSandboxStore()

  useEffect(() => {
    if (!chatHistory) return
    setMessages(JSON.parse(chatHistory) as ChatUIMessage[])
  }, [setMessages, chatHistory])

  const validateAndSubmitMessage = useCallback(
    (text: string) => {
      if (text.trim()) {
        sendMessage({ text }, { body: { modelId, reasoningEffort } })
        setInput('')
      }
    },
    [sendMessage, modelId, setInput, reasoningEffort]
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
      </PanelHeader>

      {/* Messages Area */}
      {messages.length === 0 ? (
        <div className="flex-1 min-h-0">
          <div className="flex flex-col justify-center items-center h-full font-mono text-sm text-muted-foreground">
            <p className="flex items-center font-semibold">
              Click and try one of these prompts:
            </p>
            <ul className="p-4 space-y-1 text-center">
              {TEST_PROMPTS.map((prompt) => (
                <li
                  key={prompt}
                  className="px-4 py-2 rounded-sm border border-dashed shadow-sm cursor-pointer border-border hover:bg-secondary/50 hover:text-primary"
                  onClick={() => validateAndSubmitMessage(prompt)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      validateAndSubmitMessage(prompt)
                    }
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
          disabled={status === 'streaming' || status === 'submitted'}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          value={input}
        />
        <Button type="submit" disabled={status !== 'ready' || !input.trim()}>
          <SendIcon className="w-4 h-4" />
        </Button>
      </form>
    </Panel>
  )
}
