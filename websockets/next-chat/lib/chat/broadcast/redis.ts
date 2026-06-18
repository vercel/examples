import type { Redis } from 'ioredis'
import type { WebSocket } from 'ws'
import { randomUUID } from 'node:crypto'
import type { ServerFrame } from '@/lib/protocol'
import { LocalBroadcaster } from './local'
import { BROADCAST_CHANNEL } from './constants'

/**
 * Multi-instance broadcaster: delivers locally (via LocalBroadcaster) AND
 * publishes each frame so peer instances relay it to their own sockets. A
 * per-instance `origin` tags every publish so we ignore our own messages
 * arriving back over the subscription.
 */
export class RedisBroadcaster extends LocalBroadcaster {
  // Random per-instance id, used to skip our own published broadcasts.
  private readonly origin = randomUUID()

  constructor(private readonly pub: Redis, sub: Redis) {
    super()
    this.wireRelay(sub)
  }

  override broadcast(frame: ServerFrame, exceptWs?: WebSocket): void {
    // Local delivery excludes the sender; the cross-instance copy can't — the
    // sender's socket only lives here, so peers must deliver to all of theirs.
    this.deliverLocal(frame, exceptWs)
    this.publish(frame)
  }

  private publish(frame: ServerFrame): void {
    this.pub
      .publish(
        BROADCAST_CHANNEL,
        JSON.stringify({ origin: this.origin, frame })
      )
      .catch((err: Error) =>
        console.error('[broadcast] publish error:', err.message)
      )
  }

  // Relay frames published by OTHER instances to our local sockets. We skip our
  // own origin because deliverLocal already ran on the publishing instance.
  private wireRelay(sub: Redis): void {
    sub
      .subscribe(BROADCAST_CHANNEL)
      .catch((err) => console.error('[redis] subscribe error:', err.message))
    sub.on('message', (channel, payload) => {
      if (channel !== BROADCAST_CHANNEL) return
      try {
        const { origin, frame } = JSON.parse(payload) as {
          origin: string
          frame: ServerFrame
        }
        if (origin === this.origin) {
          return
        }
        this.deliverLocal(frame)
      } catch (err) {
        console.error('[broadcast] relay error:', (err as Error).message)
      }
    })
  }
}
