/**
 * Wire protocol shared between the browser client and the WebSocket server.
 *
 * Every frame is JSON with a `t` (type) discriminator. Coordinates are
 * normalized to the 0..1 range so cursors map correctly across viewports
 * of different sizes.
 */

/** A connected participant. Identity is assigned by the server on connect. */
export interface Peer {
  id: string
  name: string
  /** A CSS color (hsl) used for the cursor, label, and avatar. */
  color: string
}

/** Messages the client sends to the server. */
export type ClientMessage
  = | { t: 'cursor', x: number, y: number }
    | { t: 'reaction', emoji: string, x: number, y: number }
    | { t: 'ping' }

/** Messages the server sends to the client. */
export type ServerMessage
  = | { t: 'welcome', self: Peer, peers: Peer[] }
    | { t: 'join', peer: Peer }
    | { t: 'leave', id: string }
    | { t: 'cursor', id: string, x: number, y: number }
    | { t: 'reaction', id: string, emoji: string, x: number, y: number }
    | { t: 'pong' }

export const REACTIONS = ['🎉', '❤️', '😮', '👍', '🔥', '✨'] as const
export type Reaction = typeof REACTIONS[number]
