'use client'

import { useCallback } from 'react'
import { Message } from '@/components/Message'
import { JumpArrow } from '@/components/icons'
import { useStickyScroll } from '@/lib/useStickyScroll'
import type { ChatItem } from '@/lib/useChatSocket'

const GROUP_WINDOW = 60_000 // ms: group consecutive messages from same sender

interface Decorated {
  item: ChatItem
  isMe: boolean
  grouped: boolean
}

// Decorate each item with its grouping flag. Grouping breaks on a log line and
// across different senders; "mine" groups together regardless of clientId. This
// is a stateful fold (each item depends on the previous), so it's an explicit
// reduce rather than a map with side effects.
function withGrouping(items: ChatItem[], clientId: string | null): Decorated[] {
  const out: Decorated[] = []
  let prevKey: string | null = null
  let prevTs = 0
  for (const item of items) {
    if (item.kind === 'log') {
      prevKey = null
      out.push({ item, isMe: false, grouped: false })
      continue
    }
    const isMe = item.msg.clientId === clientId
    const key = isMe ? '\0me' : item.msg.clientId
    const grouped =
      prevKey === key && item.msg.server_ts - prevTs < GROUP_WINDOW
    prevKey = key
    prevTs = item.msg.server_ts
    out.push({ item, isMe, grouped })
  }
  return out
}

export function MessageList({
  items,
  clientId,
}: {
  items: ChatItem[]
  clientId: string | null
}) {
  // Stick to the bottom on append, unless the user has scrolled up — in which
  // case surface the jump pill. Own messages always stick. We hand the hook the
  // raw `items` (a stable reference between unrelated renders) so its append
  // effect only fires on real list changes.
  const isOwn = useCallback(
    (item: ChatItem) =>
      item.kind === 'message' && item.msg.clientId === clientId,
    [clientId]
  )
  const { ref, onScroll, jumpVisible, unread, jumpToLatest } = useStickyScroll<
    ChatItem,
    HTMLUListElement
  >(items, isOwn)

  const decorated = withGrouping(items, clientId)

  return (
    <div className="relative flex min-h-0 flex-1">
      {/* No scroll-behavior:smooth on the list — it would make scrollTop writes
          animate async and break the bottom-detection in useStickyScroll. Smooth
          is applied only to the jump button via scrollTo({ behavior }). */}
      <ul
        ref={ref}
        onScroll={onScroll}
        className="m-0 flex flex-1 list-none flex-col gap-2 overflow-y-auto px-4 pt-[1.1rem] pb-2 [overscroll-behavior:contain]"
      >
        {decorated.map(({ item, isMe, grouped }) =>
          item.kind === 'log' ? (
            <li
              key={item.id}
              className="animate-[rise_0.24s_cubic-bezier(0.16,1,0.3,1)_both] self-center rounded-full bg-bubble px-[0.7rem] py-[0.2rem] text-[0.74rem] text-subtle"
            >
              {item.text}
            </li>
          ) : (
            <Message
              key={item.msg.id}
              msg={item.msg}
              isMe={isMe}
              grouped={grouped}
            />
          )
        )}
      </ul>
      {jumpVisible && (
        <button
          onClick={jumpToLatest}
          className="absolute bottom-[0.6rem] left-1/2 inline-flex -translate-x-1/2 animate-[rise_0.2s_ease_both] items-center gap-[0.4rem] rounded-full border border-border-strong bg-surface px-[0.85rem] py-[0.4rem] text-[0.78rem] font-medium text-foreground shadow-[var(--shadow-lift)] backdrop-blur-[12px] hover:border-accent hover:text-accent [&_svg]:size-[15px]"
        >
          <JumpArrow />
          <span>
            {unread > 0
              ? `${unread} new message${unread > 1 ? 's' : ''}`
              : 'Jump to latest'}
          </span>
        </button>
      )}
    </div>
  )
}
