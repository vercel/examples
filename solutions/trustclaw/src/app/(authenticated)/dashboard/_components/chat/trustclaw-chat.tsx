'use client'

import type { UIMessage } from '@ai-sdk/react'
import { trpc } from '~/clients/trpc'
import { TrustClawChatSkeleton } from './trustclaw-chat.skeleton'
import { ChatView } from './chat-view'

export function TrustClawChat() {
  const historyQuery = trpc.trustclaw.getHistory.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  const streamingQuery = trpc.trustclaw.getStreamingMessage.useQuery(
    undefined,
    {
      refetchOnWindowFocus: 'always',
    }
  )

  if (!historyQuery.data || streamingQuery.isLoading) {
    return <TrustClawChatSkeleton />
  }

  const pages = historyQuery.data.pages
  const allHistoryMessages = [...pages].reverse().flatMap((p) => p.messages)

  // Direct mapping - DB content is already UIMessage parts format
  const initialMessages: UIMessage[] = allHistoryMessages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: msg.content as UIMessage['parts'],
  }))

  const streamId = streamingQuery.data?.messageId ?? null

  return (
    <ChatView
      initialMessages={initialMessages}
      streamId={streamId}
      historyPageCount={pages.length}
      fetchOlderMessages={() => void historyQuery.fetchNextPage()}
      hasOlderMessages={historyQuery.hasNextPage ?? false}
      isFetchingOlderMessages={historyQuery.isFetchingNextPage}
    />
  )
}
