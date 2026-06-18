import type { ChatMessage, PresenceUser } from '@/lib/protocol'

export interface PresenceSnapshot {
  count: number
  users: PresenceUser[]
}

export interface ChatStore {
  /** Append a message to the capped recent-history buffer. */
  recordMessage(msg: ChatMessage): Promise<void>
  /** Recent messages within the history window, oldest → newest. */
  recentMessages(): Promise<ChatMessage[]>
  /** Mark the given clients online "now" (single client on join, all of this
   *  instance's clients on each heartbeat). */
  presenceTouch(
    entries: Iterable<[string, { username: string }]>
  ): Promise<void>
  /** Is this clientId currently within the staleness window? */
  presenceIsOnline(clientId: string): Promise<boolean>
  /** Remove entries that stopped heartbeating; return them so the caller can
   *  announce the departures. */
  presencePruneStale(): Promise<PresenceUser[]>
  /** Online count + a sample of names for the avatar stack. Null signals a
   *  backend error so the caller can skip the broadcast rather than show bad
   *  data. */
  presenceSnapshot(): Promise<PresenceSnapshot | null>
}
