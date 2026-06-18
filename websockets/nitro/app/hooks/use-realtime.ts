import { useCallback, useEffect, useRef, useState } from 'react'
import type { ClientMessage, Peer, ServerMessage } from '../../shared/types/realtime'

export interface RemotePeer extends Peer {
  x: number
  y: number
  /** Whether the cursor has been seen moving (hidden until first move). */
  active: boolean
}

export interface ActiveReaction {
  key: number
  emoji: string
  x: number
  y: number
  color: string
}

export type RealtimeStatus = 'connecting' | 'connected' | 'disconnected'

export interface UseRealtime {
  status: RealtimeStatus
  self: Peer | null
  others: RemotePeer[]
  count: number
  reactions: ActiveReaction[]
  moveCursor: (x: number, y: number) => void
  sendReaction: (emoji: string, x: number, y: number) => void
}

/** Heartbeat cadence, and how long to wait for a pong before treating the socket as dead. */
const HEARTBEAT_INTERVAL = 25_000
const PONG_TIMEOUT = 10_000

/**
 * Maintains a single resilient WebSocket connection to `/api/ws` and exposes
 * reactive presence, cursor, and reaction state. Reconnects with exponential
 * backoff, as recommended for Vercel Functions WebSockets (connections close
 * when the function reaches its max duration).
 */
export function useRealtime(): UseRealtime {
  const [status, setStatus] = useState<RealtimeStatus>('connecting')
  const [self, setSelf] = useState<Peer | null>(null)
  const [others, setOthers] = useState<RemotePeer[]>([])
  const [reactions, setReactions] = useState<ActiveReaction[]>([])

  // Roster lives in a ref (mutated as frames arrive) and is mirrored into the
  // `others` state whenever it changes, so cursor frames don't thrash React.
  const peersRef = useRef(new Map<string, RemotePeer>())
  const selfRef = useRef<Peer | null>(null)

  // Stable callbacks whose implementations are wired up inside the effect.
  const moveCursorRef = useRef<(x: number, y: number) => void>(() => { })
  const sendReactionRef = useRef<(emoji: string, x: number, y: number) => void>(() => { })
  const moveCursor = useCallback((x: number, y: number) => moveCursorRef.current(x, y), [])
  const sendReaction = useCallback((emoji: string, x: number, y: number) => sendReactionRef.current(emoji, x, y), [])

  useEffect(() => {
    let socket: WebSocket | undefined
    let reconnectDelay = 1000
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined
    let closed = false
    let reactionKey = 0

    // Liveness: ping periodically and force a reconnect if the pong never arrives,
    // which catches half-open connections a silent proxy drop wouldn't surface.
    let heartbeatTimer: ReturnType<typeof setInterval> | undefined
    let pongTimer: ReturnType<typeof setTimeout> | undefined

    // Outgoing cursor frames are throttled to one per animation frame.
    let pendingCursor: { x: number, y: number } | undefined
    let rafId: number | undefined

    function syncOthers() {
      setOthers([...peersRef.current.values()])
    }

    function send(msg: ClientMessage) {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg))
      }
    }

    function addReaction(emoji: string, x: number, y: number, color: string) {
      const key = reactionKey++
      setReactions(prev => [...prev, { key, emoji, x, y, color }])
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.key !== key))
      }, 1800)
    }

    function handle(msg: ServerMessage) {
      switch (msg.t) {
        case 'welcome':
          selfRef.current = msg.self
          setSelf(msg.self)
          peersRef.current = new Map(msg.peers.map(p => [p.id, { ...p, x: 0.5, y: 0.5, active: false }]))
          syncOthers()
          break
        case 'join':
          peersRef.current.set(msg.peer.id, { ...msg.peer, x: 0.5, y: 0.5, active: false })
          syncOthers()
          break
        case 'leave':
          if (peersRef.current.delete(msg.id)) syncOthers()
          break
        case 'cursor': {
          const peer = peersRef.current.get(msg.id)
          if (peer) {
            peersRef.current.set(msg.id, { ...peer, x: msg.x, y: msg.y, active: true })
            syncOthers()
          }
          break
        }
        case 'reaction': {
          const peer = peersRef.current.get(msg.id)
          addReaction(msg.emoji, msg.x, msg.y, peer?.color ?? 'var(--primary)')
          break
        }
        case 'pong':
          clearPong()
          break
      }
    }

    function startHeartbeat() {
      stopHeartbeat()
      heartbeatTimer = setInterval(() => {
        send({ t: 'ping' })
        // Expect a pong before the next beat; if none arrives, the socket is dead.
        pongTimer ??= setTimeout(() => socket?.close(), PONG_TIMEOUT)
      }, HEARTBEAT_INTERVAL)
    }

    function clearPong() {
      if (pongTimer) {
        clearTimeout(pongTimer)
        pongTimer = undefined
      }
    }

    function stopHeartbeat() {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer)
        heartbeatTimer = undefined
      }
      clearPong()
    }

    function connect() {
      if (closed) return
      setStatus('connecting')

      const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
      socket = new WebSocket(`${protocol}://${location.host}/api/ws`)

      socket.addEventListener('open', () => {
        reconnectDelay = 1000
        setStatus('connected')
        startHeartbeat()
      })

      socket.addEventListener('message', (event) => {
        try {
          handle(JSON.parse(event.data) as ServerMessage)
        }
        catch {
          // Ignore malformed frames.
        }
      })

      socket.addEventListener('close', () => {
        stopHeartbeat()
        // Intentional close (unmount, or React StrictMode's dev double-invoke):
        // a superseding socket owns the shared state now, so don't clobber it.
        if (closed) return
        setStatus('disconnected')
        selfRef.current = null
        setSelf(null)
        peersRef.current = new Map()
        syncOthers()
        reconnectTimer = setTimeout(connect, reconnectDelay)
        reconnectDelay = Math.min(reconnectDelay * 2, 30000)
      })

      socket.addEventListener('error', () => socket?.close())
    }

    /** Queue a normalized (0..1) cursor position; flushed once per frame. */
    moveCursorRef.current = (x: number, y: number) => {
      pendingCursor = { x, y }
      rafId ??= requestAnimationFrame(() => {
        rafId = undefined
        if (pendingCursor) {
          send({ t: 'cursor', ...pendingCursor })
          pendingCursor = undefined
        }
      })
    }

    sendReactionRef.current = (emoji: string, x: number, y: number) => {
      send({ t: 'reaction', emoji, x, y })
      // Show our own reaction immediately (the server doesn't echo it back).
      addReaction(emoji, x, y, selfRef.current?.color ?? 'var(--primary)')
    }

    connect()

    return () => {
      closed = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (rafId) cancelAnimationFrame(rafId)
      stopHeartbeat()
      socket?.close()
    }
  }, [])

  return {
    status,
    self,
    others,
    count: others.length + (self ? 1 : 0),
    reactions,
    moveCursor,
    sendReaction,
  }
}
