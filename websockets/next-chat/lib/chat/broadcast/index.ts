import type { Redis } from 'ioredis'
import { LocalBroadcaster } from './local'
import { RedisBroadcaster } from './redis'
import type { Broadcaster } from './types'

export * from './types'

/**
 * Pick the broadcaster once at startup: Redis fan-out when a pub/sub pair is
 * available, else single-instance local delivery. Mirrors createStore().
 */
export function createBroadcaster(
  pub: Redis | null,
  sub: Redis | null
): Broadcaster {
  return pub && sub ? new RedisBroadcaster(pub, sub) : new LocalBroadcaster()
}
