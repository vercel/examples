import type { ChatMessage, PresenceUser } from '@/lib/protocol'
import type { ChatStore, PresenceSnapshot } from './types'
import {
  HISTORY_MAX,
  HISTORY_TTL_SECONDS,
  MAX_PRESENCE_NAMES,
  STALE_MS,
} from './constants'

export class MemoryStore implements ChatStore {
  private history: ChatMessage[] = []
  private presence = new Map<string, { username: string; lastSeen: number }>()

  async recordMessage(msg: ChatMessage): Promise<void> {
    this.history.push(msg)
    if (this.history.length > HISTORY_MAX) this.history.shift()
  }

  async recentMessages(): Promise<ChatMessage[]> {
    const cutoff = Date.now() - HISTORY_TTL_SECONDS * 1000
    return this.history.filter((m) => (m.server_ts ?? 0) >= cutoff)
  }

  async presenceTouch(
    entries: Iterable<[string, { username: string }]>
  ): Promise<void> {
    const now = Date.now()
    for (const [clientId, info] of entries) {
      this.presence.set(clientId, { username: info.username, lastSeen: now })
    }
  }

  async presenceIsOnline(clientId: string): Promise<boolean> {
    const e = this.presence.get(clientId)
    return !!e && e.lastSeen >= Date.now() - STALE_MS
  }

  async presencePruneStale(): Promise<PresenceUser[]> {
    const cutoff = Date.now() - STALE_MS
    const removed: PresenceUser[] = []
    for (const [clientId, e] of this.presence) {
      if (e.lastSeen < cutoff) {
        removed.push({ clientId, username: e.username })
        this.presence.delete(clientId)
      }
    }
    return removed
  }

  async presenceSnapshot(): Promise<PresenceSnapshot> {
    const cutoff = Date.now() - STALE_MS
    const fresh: PresenceUser[] = []
    for (const [clientId, e] of this.presence) {
      if (e.lastSeen >= cutoff) fresh.push({ clientId, username: e.username })
    }
    return { count: fresh.length, users: fresh.slice(0, MAX_PRESENCE_NAMES) }
  }
}
