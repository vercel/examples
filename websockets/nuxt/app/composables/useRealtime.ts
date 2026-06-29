import type { ComputedRef, Ref } from 'vue'
import type { ClientMessage, Peer, ServerMessage } from '#shared/types/realtime'

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
  status: Ref<RealtimeStatus>
  self: Ref<Peer | null>
  others: ComputedRef<RemotePeer[]>
  count: ComputedRef<number>
  reactions: Ref<ActiveReaction[]>
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
  const status = ref<RealtimeStatus>('connecting')
  const self = ref<Peer | null>(null)
  const peers = reactive(new Map<string, RemotePeer>())
  const reactions = ref<ActiveReaction[]>([])

  const others = computed(() => [...peers.values()])
  const count = computed(() => peers.size + (self.value ? 1 : 0))

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

  function send(msg: ClientMessage) {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg))
    }
  }

  function addReaction(emoji: string, x: number, y: number, color: string) {
    const key = reactionKey++
    reactions.value.push({ key, emoji, x, y, color })
    setTimeout(() => {
      reactions.value = reactions.value.filter((r: ActiveReaction) => r.key !== key)
    }, 1800)
  }

  function handle(msg: ServerMessage) {
    switch (msg.t) {
      case 'welcome':
        self.value = msg.self
        peers.clear()
        for (const p of msg.peers) {
          peers.set(p.id, { ...p, x: 0.5, y: 0.5, active: false })
        }
        break
      case 'join':
        peers.set(msg.peer.id, { ...msg.peer, x: 0.5, y: 0.5, active: false })
        break
      case 'leave':
        peers.delete(msg.id)
        break
      case 'cursor': {
        const peer = peers.get(msg.id)
        if (peer) {
          peer.x = msg.x
          peer.y = msg.y
          peer.active = true
        }
        break
      }
      case 'reaction': {
        const peer = peers.get(msg.id)
        addReaction(msg.emoji, msg.x, msg.y, peer?.color ?? 'var(--ui-primary)')
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
    status.value = 'connecting'

    const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    socket = new WebSocket(`${protocol}://${location.host}/api/ws`)

    socket.addEventListener('open', () => {
      reconnectDelay = 1000
      status.value = 'connected'
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
      status.value = 'disconnected'
      self.value = null
      peers.clear()
      stopHeartbeat()
      if (closed) return
      reconnectTimer = setTimeout(connect, reconnectDelay)
      reconnectDelay = Math.min(reconnectDelay * 2, 30000)
    })

    socket.addEventListener('error', () => socket?.close())
  }

  /** Queue a normalized (0..1) cursor position; flushed once per frame. */
  function moveCursor(x: number, y: number) {
    pendingCursor = { x, y }
    rafId ??= requestAnimationFrame(() => {
      rafId = undefined
      if (pendingCursor) {
        send({ t: 'cursor', ...pendingCursor })
        pendingCursor = undefined
      }
    })
  }

  function sendReaction(emoji: string, x: number, y: number) {
    send({ t: 'reaction', emoji, x, y })
    // Show our own reaction immediately (the server doesn't echo it back).
    addReaction(emoji, x, y, self.value?.color ?? 'var(--ui-primary)')
  }

  onMounted(connect)

  onBeforeUnmount(() => {
    closed = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    if (rafId) cancelAnimationFrame(rafId)
    stopHeartbeat()
    socket?.close()
  })

  return { status, self, others, count, reactions, moveCursor, sendReaction }
}
