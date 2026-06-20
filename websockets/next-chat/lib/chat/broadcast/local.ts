import { WebSocket } from 'ws'
import type { ServerFrame } from '@/lib/protocol'
import type { Broadcaster } from './types'

/**
 * Single-instance broadcaster: delivers only to sockets connected here. Used
 * when REDIS_URL is unset. RedisBroadcaster extends this for cross-instance
 * fan-out, so the local socket bookkeeping lives in exactly one place.
 */
export class LocalBroadcaster implements Broadcaster {
  /** Every connected socket on this instance. */
  protected readonly conns = new Set<WebSocket>()

  register(ws: WebSocket): void {
    this.conns.add(ws)
  }

  unregister(ws: WebSocket): void {
    this.conns.delete(ws)
  }

  send(ws: WebSocket, frame: ServerFrame): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(frame))
    }
  }

  broadcast(frame: ServerFrame, exceptWs?: WebSocket): void {
    this.deliverLocal(frame, exceptWs)
  }

  /** Deliver to every local socket, optionally excluding the sender. */
  protected deliverLocal(frame: ServerFrame, exceptWs?: WebSocket): void {
    const data = JSON.stringify(frame)
    for (const ws of this.conns) {
      if (ws === exceptWs) continue
      if (ws.readyState === WebSocket.OPEN) ws.send(data)
    }
  }
}
