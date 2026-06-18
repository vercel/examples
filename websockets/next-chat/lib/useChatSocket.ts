'use client'

import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import {
  MAX_MESSAGE_LENGTH,
  parseFrame,
  type ServerFrame,
} from '@/lib/protocol'
import { loadName, loadOrCreateClientId, saveName } from '@/lib/identity'
import {
  chatReducer,
  INITIAL_CHAT_STATE,
  type ChatItem,
  type Presence,
} from '@/lib/chatReducer'
import {
  useReconnectingSocket,
  type ConnectionState,
} from '@/lib/useReconnectingSocket'

// Re-exported so existing consumers keep importing these from one place.
export type { ChatItem, Presence, ConnectionState }

const TYPING_TIMER = 900 // ms idle before we send "stop typing"

function getWsUrl() {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${proto}://${window.location.host}/api/ws`
}

export interface UseChatSocket {
  clientId: string | null
  username: string | null
  connectionState: ConnectionState
  presence: Presence | null
  items: ChatItem[]
  typingUsers: string[]
  join: (name: string) => void
  sendMessage: (text: string) => void
  notifyTyping: () => void
}

export function useChatSocket(): UseChatSocket {
  const [state, dispatch] = useReducer(chatReducer, INITIAL_CHAT_STATE)
  const [clientId, setClientId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  // Every incoming frame just folds into the reducer.
  const onMessage = useCallback((data: string) => {
    const frame = parseFrame<ServerFrame>(data)
    if (frame) dispatch({ kind: 'frame', frame })
  }, [])
  const { connectionState, send } = useReconnectingSocket(getWsUrl, onMessage)

  const typingRef = useRef(false)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore per-tab identity + any saved nickname (sessionStorage is only
  // readable after mount).
  useEffect(() => {
    const id = loadOrCreateClientId()
    const saved = loadName()
    /* eslint-disable react-hooks/set-state-in-effect --
       Identity comes from sessionStorage, only readable after mount. Deferring
       to this effect also keeps SSR and the first client render in sync (both
       null) so there's no hydration mismatch. */
    setClientId(id)
    if (saved) setUsername(saved)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  // Re-join declaratively: whenever we're connected and have an identity,
  // (re)send 'add user'. This fires on the initial join AND on every reconnect,
  // replacing the old onopen logic and the identity refs it needed. A redundant
  // send on the same socket is a no-op server-side (it guards on state.username).
  useEffect(() => {
    if (connectionState === 'connected' && clientId && username) {
      send(JSON.stringify({ type: 'add user', clientId, username }))
    }
  }, [connectionState, clientId, username, send])

  // Stop the typing timer on unmount.
  useEffect(
    () => () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    },
    []
  )

  const stopTyping = useCallback(() => {
    if (!typingRef.current) return
    typingRef.current = false
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    send(JSON.stringify({ type: 'stop typing' }))
  }, [send])

  const join = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    saveName(trimmed)
    // The re-join effect sends 'add user' once we're connected.
    setUsername(trimmed)
  }, [])

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (
        !trimmed ||
        trimmed.length > MAX_MESSAGE_LENGTH ||
        !clientId ||
        !username
      ) {
        return
      }
      send(JSON.stringify({ type: 'new message', text: trimmed }))
      // Optimistic render; the reducer stamps a local id.
      dispatch({
        kind: 'optimistic',
        msg: { clientId, username, message: trimmed, server_ts: Date.now() },
      })
      stopTyping()
    },
    [send, clientId, username, stopTyping]
  )

  const notifyTyping = useCallback(() => {
    if (connectionState !== 'connected') return
    if (!typingRef.current) {
      typingRef.current = true
      send(JSON.stringify({ type: 'typing' }))
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(stopTyping, TYPING_TIMER)
  }, [connectionState, send, stopTyping])

  return {
    clientId,
    username,
    connectionState,
    presence: state.presence,
    items: state.items,
    typingUsers: state.typingUsers,
    join,
    sendMessage,
    notifyTyping,
  }
}
