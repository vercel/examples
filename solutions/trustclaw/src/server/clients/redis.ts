import Redis from 'ioredis'
import { env } from '~/env'

// ─── Redis Client ────────────────────────────────────────────────────────────

const globalForRedis = globalThis as typeof globalThis & {
  redis: Redis | undefined
  redisSubscriber: Redis | undefined
  redisPublisher: Redis | undefined
}

export function isRedisConfigured(): boolean {
  return !!env.REDIS_URL
}

function createRedis(): Redis {
  if (!env.REDIS_URL) {
    throw new Error('Redis not configured')
  }
  const r = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 3 })
  // ioredis crashes the process on unhandled error events. Surface them in
  // logs instead so connection issues are still visible.
  r.on('error', (err) => {
    console.error('[redis] connection error:', err)
  })
  return r
}

export function getRedis(): Redis | null {
  if (!env.REDIS_URL) return null
  globalForRedis.redis ??= createRedis()
  return globalForRedis.redis
}

/** Dedicated subscriber connection for pub/sub (enters subscriber mode). */
export function getRedisSubscriber(): Redis | null {
  if (!env.REDIS_URL) return null
  globalForRedis.redisSubscriber ??= createRedis()
  return globalForRedis.redisSubscriber
}

/** Dedicated publisher connection for pub/sub. */
export function getRedisPublisher(): Redis | null {
  if (!env.REDIS_URL) return null
  globalForRedis.redisPublisher ??= createRedis()
  return globalForRedis.redisPublisher
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STREAMING_KEY_TTL = 600 // 10 minutes

// ─── Streaming Message Tracker ──────────────────────────────────────────────

export async function setStreamingMessage(
  instanceId: string,
  streamId: string
): Promise<void> {
  const r = getRedis()
  if (!r) return
  await r.set(`streaming:${instanceId}`, streamId, 'EX', STREAMING_KEY_TTL)
}

export async function getStreamingMessage(
  instanceId: string
): Promise<string | null> {
  const r = getRedis()
  if (!r) return null
  return r.get(`streaming:${instanceId}`)
}

export async function clearStreamingMessage(instanceId: string): Promise<void> {
  const r = getRedis()
  if (!r) return
  await r.del(`streaming:${instanceId}`)
}

// ─── Telegram Deduplication ─────────────────────────────────────────────────

const TELEGRAM_DEDUP_TTL = 300 // 5 minutes

/**
 * Attempt to claim a Telegram update for processing.
 * Returns true if this is the first time we've seen this update_id
 * (i.e. we should process it). Returns false if it's a duplicate/retry.
 */
export async function claimTelegramUpdate(updateId: number): Promise<boolean> {
  const r = getRedis()
  if (!r) return true // no dedup available - always claim
  const result = await r.set(
    `telegram-update:${updateId}`,
    '1',
    'EX',
    TELEGRAM_DEDUP_TTL,
    'NX'
  )
  return result === 'OK'
}

// ─── Telegram Active Generation Tracking ──────────────────────────────────

const TELEGRAM_ACTIVE_TTL = 600 // 10 minutes

/**
 * Mark a Telegram update as the active generation for an instance.
 * A newer update arriving will overwrite this, signaling the old one to abort.
 */
export async function setTelegramActive(
  instanceId: string,
  updateId: number
): Promise<void> {
  const r = getRedis()
  if (!r) return
  await r.set(
    `telegram-active:${instanceId}`,
    String(updateId),
    'EX',
    TELEGRAM_ACTIVE_TTL
  )
}

/**
 * Get the currently active Telegram update ID for an instance.
 * Returns null if no active generation.
 */
export async function getTelegramActive(
  instanceId: string
): Promise<number | null> {
  const r = getRedis()
  if (!r) return null
  const val = await r.get(`telegram-active:${instanceId}`)
  return val ? Number(val) : null
}
