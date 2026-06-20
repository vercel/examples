import type { WebSocket } from 'ws'
import type { ServerFrame } from '@/lib/protocol'

/**
 * Fan-out transport for server frames — the role Socket.IO's adapter played:
 * it owns the set of local sockets and knows how to reach every client,
 * including those connected to other instances. The chat layer depends on this
 * interface only, never on whether Redis happens to be wired.
 */
export interface Broadcaster {
  /** Start tracking a socket as a local delivery target (on connect). */
  register(ws: WebSocket): void
  /** Stop tracking a socket (on close); a no-op for unknown sockets. */
  unregister(ws: WebSocket): void
  /** Send a frame to a single local socket (e.g. login/history to the joiner). */
  send(ws: WebSocket, frame: ServerFrame): void
  /**
   * Deliver a frame to every client everywhere. `exceptWs` skips the sender,
   * which only matters on the instance that owns that socket — peer instances
   * have no reference to it and deliver to all of their locals.
   */
  broadcast(frame: ServerFrame, exceptWs?: WebSocket): void
}
