import { createResumableStreamContext } from 'resumable-stream/ioredis'
import {
  getRedisSubscriber,
  getRedisPublisher,
  isRedisConfigured,
} from '~/server/clients/redis'

type StreamContext = ReturnType<typeof createResumableStreamContext>

let _streamContext: StreamContext | null = null

/**
 * Lazily construct the resumable stream context. Returns null if Redis is not
 * configured - basic streaming still works, only mid-stream resume is unavailable.
 */
export function getStreamContext(): StreamContext | null {
  if (!isRedisConfigured()) return null
  if (!_streamContext) {
    const subscriber = getRedisSubscriber()
    const publisher = getRedisPublisher()
    if (!subscriber || !publisher) return null
    _streamContext = createResumableStreamContext({
      waitUntil: null, // server environment - no need for keep-alive
      subscriber,
      publisher,
    })
  }
  return _streamContext
}
