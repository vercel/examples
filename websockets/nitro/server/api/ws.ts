import { defineWebSocketHandler } from 'nitro'
import { REACTIONS, type ClientMessage, type Peer, type ServerMessage } from '../../shared/types/realtime'
import { createIdentity } from '../utils/identity'

const CHANNEL = 'room'

/** All connected peers, keyed by peer id. */
const peers = new Map<string, Peer>()

/** Clamp an untrusted coordinate into the normalized 0..1 range, or reject it. */
function toUnit(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(Math.max(value, 0), 1)
    : null
}

function send(peer: { send: (data: string) => void }, msg: ServerMessage) {
  peer.send(JSON.stringify(msg))
}

export default defineWebSocketHandler({
  open(peer) {
    const identity = createIdentity()
    peer.context.identity = identity

    peer.subscribe(CHANNEL)

    // Capture the roster of existing peers *before* adding self, so `welcome.peers`
    // excludes the new peer (the client tracks self separately via `welcome.self`).
    const roster = [...peers.values()]
    peers.set(identity.id, identity)

    send(peer, { t: 'welcome', self: identity, peers: roster })
    peer.publish(CHANNEL, JSON.stringify({ t: 'join', peer: identity } satisfies ServerMessage))
  },
  message(peer, message) {
    const identity = peer.context.identity as Peer | undefined
    if (!identity) return

    let msg: ClientMessage
    try {
      msg = JSON.parse(message.text()) as ClientMessage
    }
    catch {
      return
    }

    switch (msg.t) {
      case 'cursor': {
        const x = toUnit(msg.x)
        const y = toUnit(msg.y)
        if (x === null || y === null) return
        peer.publish(CHANNEL, JSON.stringify({ t: 'cursor', id: identity.id, x, y } satisfies ServerMessage))
        break
      }
      case 'reaction': {
        const x = toUnit(msg.x)
        const y = toUnit(msg.y)
        if (x === null || y === null) return
        if (!(REACTIONS as readonly string[]).includes(msg.emoji)) return
        peer.publish(CHANNEL, JSON.stringify({ t: 'reaction', id: identity.id, emoji: msg.emoji, x, y } satisfies ServerMessage))
        break
      }
      case 'ping':
        send(peer, { t: 'pong' })
        break
    }
  },
  close(peer) {
    const identity = peer.context.identity as Peer | undefined
    if (!identity) return
    peers.delete(identity.id)
    peer.publish(CHANNEL, JSON.stringify({ t: 'leave', id: identity.id } satisfies ServerMessage))
  },
  error(peer, error) {
    console.error('[realtime] ws error', peer.id, error)
    const identity = peer.context.identity as Peer | undefined
    if (!identity) return
    peers.delete(identity.id)
    peer.publish(CHANNEL, JSON.stringify({ t: 'leave', id: identity.id } satisfies ServerMessage))
  },
})
