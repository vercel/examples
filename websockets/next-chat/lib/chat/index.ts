import type { WebSocket } from 'ws'
import { Redis } from 'ioredis'
import { randomUUID } from 'node:crypto'
import {
  type ChatMessage,
  type ClientFrame,
  MAX_CLIENT_ID_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_USERNAME_LENGTH,
  parseFrame,
} from '@/lib/protocol'
import { type ChatStore, createStore } from '@/lib/chat/store'
import { type Broadcaster, createBroadcaster } from '@/lib/chat/broadcast'

const HEARTBEAT_MS = Number(process.env.PRESENCE_HEARTBEAT_MS) || 8000

interface ConnState {
  username: string | null
  clientId: string | null
}

export class ChatHub {
  readonly broadcaster: Broadcaster
  readonly localClients: Map<
    string,
    { username: string; sockets: Set<WebSocket> }
  >
  readonly store: ChatStore
  heartbeat: ReturnType<typeof setInterval> | null
  heartbeatRunning: boolean

  constructor() {
    const url = process.env.REDIS_URL
    let pub: Redis | null = null
    let sub: Redis | null = null

    if (url) {
      pub = new Redis(url)
      sub = pub.duplicate()
      pub.on('error', (err) => console.error('[redis] pub error:', err.message))
      sub.on('error', (err) => console.error('[redis] sub error:', err.message))
      console.log(
        '[redis] enabled — broadcast fan-out + shared history + presence'
      )
    } else {
      console.log('[redis] REDIS_URL not set — running single-instance')
    }
    this.broadcaster = createBroadcaster(pub, sub)
    this.localClients = new Map()
    this.store = createStore(pub)
    this.heartbeat = null
    this.heartbeatRunning = false
    this.startHeartbeat()
  }

  startHeartbeat() {
    if (this.heartbeat) {
      return
    }
    this.heartbeat = setInterval(async () => {
      if (this.heartbeatRunning) {
        return
      }
      this.heartbeatRunning = true
      try {
        if (this.localClients.size) {
          await this.store.presenceTouch(this.localClients)
        }
        const gone = await this.store.presencePruneStale()
        if (gone.length) {
          for (const { username } of gone) {
            if (username) {
              this.broadcaster.broadcast({ type: 'user left', username })
            }
          }
          await this.broadcastPresence()
        }
      } catch (err) {
        console.error('[presence] heartbeat error:', (err as Error).message)
      } finally {
        this.heartbeatRunning = false
      }
    }, HEARTBEAT_MS)
    this.heartbeat.unref?.()
  }

  async broadcastPresence() {
    const snap = await this.store.presenceSnapshot()
    // null = transient backend error; keep clients' last good view.
    if (snap) {
      this.broadcaster.broadcast({
        type: 'presence',
        count: snap.count,
        users: snap.users,
      })
    }
  }

  async dispatch(ws: WebSocket, conn: ConnState, frame: ClientFrame) {
    switch (frame.type) {
      case 'add user':
        return this.onAddUser(ws, conn, frame)
      case 'new message':
        return this.onNewMessage(ws, conn, frame)
      case 'typing':
        if (conn.username) {
          this.broadcaster.broadcast(
            { type: 'typing', username: conn.username },
            ws
          )
        }
        return
      case 'stop typing':
        if (conn.username) {
          this.broadcaster.broadcast(
            { type: 'stop typing', username: conn.username },
            ws
          )
        }
        return
    }
  }

  async onAddUser(
    ws: WebSocket,
    conn: ConnState,
    frame: Extract<ClientFrame, { type: 'add user' }>
  ) {
    if (conn.username) {
      return
    }

    const username = String(frame.username ?? '')
      .slice(0, MAX_USERNAME_LENGTH)
      .trim()
    if (!username) return
    const clientId =
      String(frame.clientId ?? '').slice(0, MAX_CLIENT_ID_LENGTH) ||
      randomUUID()

    conn.username = username
    conn.clientId = clientId

    let info = this.localClients.get(clientId)
    if (!info) {
      info = { username, sockets: new Set() }
      this.localClients.set(clientId, info)
    }
    info.username = username
    info.sockets.add(ws)

    // Announce a join only if this identity wasn't already online — so a
    // reconnect within the staleness window doesn't flap.
    const wasOnline = await this.store.presenceIsOnline(clientId)
    await this.store.presenceTouch([[clientId, { username }]])

    this.broadcaster.send(ws, {
      type: 'login',
      clientId,
      username,
      server_ts: Date.now(),
    })
    // Recent backlog so the joiner has context, not a blank room.
    this.broadcaster.send(ws, {
      type: 'history',
      messages: await this.store.recentMessages(),
    })
    if (!wasOnline) {
      this.broadcaster.broadcast(
        { type: 'user joined', username, server_ts: Date.now() },
        ws
      )
    }
    await this.broadcastPresence()
  }

  async onNewMessage(
    ws: WebSocket,
    conn: ConnState,
    frame: Extract<ClientFrame, { type: 'new message' }>
  ) {
    if (!conn.username || !conn.clientId) {
      return
    }
    // The client caps + trims before sending, but it's never the source of
    // truth: coerce, trim, and reject empty / over-length payloads.
    const message = String(frame.text ?? '').trim()
    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return
    }

    const msg: ChatMessage = {
      id: randomUUID(),
      clientId: conn.clientId,
      username: conn.username,
      message,
      server_ts: Date.now(),
    }
    await this.store.recordMessage(msg)
    // Exclude the sender — the client renders its own message optimistically.
    this.broadcaster.broadcast({ type: 'new message', message: msg }, ws)
  }

  handleUpgrade(ws: WebSocket) {
    const conn: ConnState = { username: null, clientId: null }
    this.broadcaster.register(ws)

    ws.on('message', (data) => {
      this.handleMessage(ws, conn, data)
    })

    ws.on('close', () => {
      this.handleClose(ws, conn)
    })

    // 'ws' emits 'error' on a broken pipe etc.; a 'close' always follows and does
    // the cleanup. Swallow so it doesn't crash the process.
    ws.on('error', () => {})
  }

  private handleMessage(
    ws: WebSocket,
    conn: ConnState,
    data: WebSocket.RawData
  ) {
    const frame = parseFrame<ClientFrame>(data.toString())
    if (!frame) {
      return
    }
    this.dispatch(ws, conn, frame).catch((err) =>
      console.error('[ws] handler error:', err?.message)
    )
  }

  private handleClose(ws: WebSocket, conn: ConnState) {
    this.broadcaster.unregister(ws)
    const clientId = conn.clientId
    if (!clientId) {
      return
    }
    const info = this.localClients.get(clientId)
    if (!info) {
      return
    }
    info.sockets.delete(ws)
    if (info.sockets.size === 0) {
      // Stop heartbeating this client. We deliberately do NOT remove it from
      // the store here: the staleness window absorbs reconnects (no flap), and
      // the heartbeat prunes + announces the leave if they stay gone.
      this.localClients.delete(clientId)
    }
  }
}
