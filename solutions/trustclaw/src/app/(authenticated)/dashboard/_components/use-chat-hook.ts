'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import type { UIMessage } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { trpc } from '~/clients/trpc'

export function useChatHook({
  initialMessages,
  streamId,
}: {
  initialMessages: UIMessage[]
  streamId: string | null
}) {
  const utils = trpc.useUtils()
  const seededRef = useRef(false)
  const [isSeeded, setIsSeeded] = useState(false)

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: '/api/chat',
      prepareReconnectToStreamRequest: () => {
        return { api: `/api/chat?streamId=${streamId}` }
      },
    })
  }, [streamId])

  const chat = useChat({
    id: 'chat',
    transport,
    resume: streamId !== null,
    onFinish: () => {
      void utils.trustclaw.getHistory.invalidate()
    },
    onError: () => {
      void utils.trustclaw.getHistory.invalidate()
    },
  })

  // Seed initial messages once on mount. Never pass `messages` as a controlled
  // prop to useChat - it resets internal state on every render, which causes a
  // scroll loop when combined with Virtuoso's followOutput during streaming.
  useEffect(() => {
    if (seededRef.current) return
    seededRef.current = true
    if (initialMessages.length > 0) {
      chat.setMessages(initialMessages)
    }
    setIsSeeded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed once on mount only
  }, [])

  const sendMessageRef = useRef(chat.sendMessage)
  sendMessageRef.current = chat.sendMessage

  const sendMessage = useCallback((text: string) => {
    void sendMessageRef.current({ text })
  }, [])

  const stopRef = useRef(chat.stop)
  stopRef.current = chat.stop

  const stableStop = useCallback(() => {
    void stopRef.current()
  }, [])

  return {
    sendMessage,
    stop: stableStop,
    // Return initialMessages until seeded to avoid flash of empty state
    messages: isSeeded ? chat.messages : initialMessages,
    status: chat.status,
    error: chat.error,
    setMessages: chat.setMessages,
  }
}
