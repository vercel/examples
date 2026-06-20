import type Redis from 'ioredis'
import type { ChatMessage, PresenceUser } from '@/lib/protocol'
import type { ChatStore, PresenceSnapshot } from './types'
import {
  HISTORY_MAX,
  HISTORY_TTL_SECONDS,
  MAX_PRESENCE_NAMES,
  STALE_MS,
} from './constants'

const HISTORY_KEY = 'chat:history'
const PRESENCE_ZKEY = 'presence:online' // ZSET clientId -> last-seen ms
const PRESENCE_HKEY = 'presence:names' // HASH clientId -> username

export class RedisStore implements ChatStore {
  constructor(private readonly redis: Redis) {}

  async recordMessage(msg: ChatMessage): Promise<void> {
    try {
      await this.redis
        .multi()
        .lpush(HISTORY_KEY, JSON.stringify(msg))
        .ltrim(HISTORY_KEY, 0, HISTORY_MAX - 1)
        .expire(HISTORY_KEY, HISTORY_TTL_SECONDS)
        .exec()
    } catch (err) {
      console.error('[history] write error:', (err as Error).message)
    }
  }

  async recentMessages(): Promise<ChatMessage[]> {
    // Only replay the last hour; the capped list can still hold older messages
    // in a long-lived room (the key's TTL expires the whole list after 1h of
    // silence, it doesn't age out individual messages).
    const cutoff = Date.now() - HISTORY_TTL_SECONDS * 1000
    try {
      const items = await this.redis.lrange(HISTORY_KEY, 0, HISTORY_MAX - 1)
      return items
        .map((s) => JSON.parse(s) as ChatMessage)
        .filter((m) => (m.server_ts ?? 0) >= cutoff)
        .reverse()
    } catch (err) {
      console.error('[history] read error:', (err as Error).message)
      return []
    }
  }

  async presenceTouch(
    entries: Iterable<[string, { username: string }]>
  ): Promise<void> {
    const now = Date.now()
    try {
      const pipe = this.redis.multi()
      for (const [clientId, info] of entries) {
        pipe.zadd(PRESENCE_ZKEY, now, clientId)
        pipe.hset(PRESENCE_HKEY, clientId, info.username)
      }
      await pipe.exec()
    } catch (err) {
      console.error('[presence] touch error:', (err as Error).message)
    }
  }

  async presenceIsOnline(clientId: string): Promise<boolean> {
    const cutoff = Date.now() - STALE_MS
    try {
      const score = await this.redis.zscore(PRESENCE_ZKEY, clientId)
      return score != null && Number(score) >= cutoff
    } catch (err) {
      console.error('[presence] online-check error:', (err as Error).message)
      return false // worst case we announce an extra join — never block one
    }
  }

  async presencePruneStale(): Promise<PresenceUser[]> {
    const cutoff = Date.now() - STALE_MS
    try {
      const stale = await this.redis.zrangebyscore(
        PRESENCE_ZKEY,
        '-inf',
        `(${cutoff}`
      )
      if (stale.length === 0) return []
      const names = await this.redis.hmget(PRESENCE_HKEY, ...stale)
      await this.redis
        .multi()
        .zrem(PRESENCE_ZKEY, ...stale)
        .hdel(PRESENCE_HKEY, ...stale)
        .exec()
      return stale.map((clientId, i) => ({
        clientId,
        username: names[i] ?? '',
      }))
    } catch (err) {
      console.error('[presence] prune error:', (err as Error).message)
      return [] // skip this round; the next heartbeat retries
    }
  }

  async presenceSnapshot(): Promise<PresenceSnapshot | null> {
    const cutoff = Date.now() - STALE_MS
    try {
      const count = await this.redis.zcount(PRESENCE_ZKEY, cutoff, '+inf')
      const ids = await this.redis.zrevrangebyscore(
        PRESENCE_ZKEY,
        '+inf',
        cutoff,
        'LIMIT',
        0,
        MAX_PRESENCE_NAMES
      )
      const names = ids.length
        ? await this.redis.hmget(PRESENCE_HKEY, ...ids)
        : []
      return {
        count,
        users: ids.map((clientId, i) => ({
          clientId,
          username: names[i] ?? '',
        })),
      }
    } catch (err) {
      console.error('[presence] snapshot error:', (err as Error).message)
      return null
    }
  }
}
