import type { Redis } from 'ioredis'
import { RedisStore } from './redis'
import { MemoryStore } from './memory'
import type { ChatStore } from './types'

export * from './types'

/** Pick the backend once at startup: Redis when available, else in-memory. */
export function createStore(redis: Redis | null): ChatStore {
  return redis ? new RedisStore(redis) : new MemoryStore()
}
