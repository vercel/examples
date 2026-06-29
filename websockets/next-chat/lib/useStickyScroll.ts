'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'

const NEAR_BOTTOM_PX = 80 // within this of the bottom counts as "at bottom"

export interface StickyScroll<E extends HTMLElement> {
  /** Attach to the scroll container. */
  ref: RefObject<E | null>
  /** Wire to the container's onScroll. */
  onScroll: () => void
  /** Whether the "jump to latest" pill should show. */
  jumpVisible: boolean
  /** Messages that arrived while scrolled away. */
  unread: number
  /** Smooth-scroll to the bottom and clear the pill. */
  jumpToLatest: () => void
}

// Keeps a scroll container pinned to the bottom — but only when the user is
// already there. If they've scrolled up, new items don't yank them down; instead
// an unread count accumulates so the caller can show a "jump to latest" pill.
// Items the caller marks as "own" (e.g. your own chat message) always stick.
//
// Generic over the list and element type, so it has no knowledge of chat. Pass a
// referentially-stable `items` (so the append effect only fires on real changes)
// and a stable `isOwn` (e.g. a useCallback).
export function useStickyScroll<T, E extends HTMLElement = HTMLDivElement>(
  items: readonly T[],
  isOwn: (item: T) => boolean
): StickyScroll<E> {
  const ref = useRef<E>(null)
  const nearBottomRef = useRef(true)
  const prevLenRef = useRef(0)
  const [unread, setUnread] = useState(0)
  const [jumpVisible, setJumpVisible] = useState(false)

  const scrollToBottom = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = el.scrollHeight
    nearBottomRef.current = true
  }, [])

  // Append while respecting the user's scroll position. We capture near-bottom
  // from the latest scroll event (before this render grew the list); if the user
  // was at the bottom — or any newly-added item is "theirs" — we stick, otherwise
  // we surface the jump pill with an unread count.
  useLayoutEffect(() => {
    const added = items.length - prevLenRef.current
    prevLenRef.current = items.length
    if (added <= 0) return

    const fresh = items.slice(items.length - added)
    if (nearBottomRef.current || fresh.some(isOwn)) {
      scrollToBottom()
      setJumpVisible(false)
      setUnread(0)
    } else {
      setUnread((u) => u + added)
      setJumpVisible(true)
    }
  }, [items, isOwn, scrollToBottom])

  // Web fonts reflow the layout after first paint; re-pin to the bottom once
  // they're ready so the initial render doesn't land slightly short.
  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled && nearBottomRef.current) scrollToBottom()
    })
    return () => {
      cancelled = true
    }
  }, [scrollToBottom])

  const onScroll = useCallback(() => {
    const el = ref.current
    if (!el) return
    nearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX
    if (nearBottomRef.current) {
      setJumpVisible(false)
      setUnread(0)
    }
  }, [])

  const jumpToLatest = useCallback(() => {
    const el = ref.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    nearBottomRef.current = true
    setJumpVisible(false)
    setUnread(0)
  }, [])

  return { ref, onScroll, jumpVisible, unread, jumpToLatest }
}
