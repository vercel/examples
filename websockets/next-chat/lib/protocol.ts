// Wire protocol shared by the client (lib/useChatSocket.ts) and the server
// (lib/chat/index.ts). Every frame is JSON of the form { type, ...payload }.
//
// This replaces Socket.IO's event names with a plain tagged union sent over a
// raw WebSocket. Keeping both ends importing these types is what keeps the
// client and server in sync — a renamed field is a compile error, not a
// silent runtime mismatch.

export const MAX_MESSAGE_LENGTH = 2000 // server-enforced; mirrored on the client
export const MAX_USERNAME_LENGTH = 32
export const MAX_CLIENT_ID_LENGTH = 64

/** A chat message as broadcast and stored in history. */
export interface ChatMessage {
  /** Server-stamped unique id — used as the React key. */
  id: string
  /** Stable per-tab identity of the sender (NOT the nickname). */
  clientId: string
  username: string
  message: string
  /** Epoch ms, stamped by the server when the message is accepted. */
  server_ts: number
}

/** One entry in the presence avatar stack. */
export interface PresenceUser {
  clientId: string
  username: string
}

// ---- Client → server ------------------------------------------------------

export type ClientFrame =
  | { type: 'add user'; clientId: string; username: string }
  | { type: 'new message'; text: string }
  | { type: 'typing' }
  | { type: 'stop typing' }

// ---- Server → client ------------------------------------------------------

export type ServerFrame =
  | { type: 'login'; clientId: string; username: string; server_ts: number }
  | { type: 'history'; messages: ChatMessage[] }
  | { type: 'presence'; count: number; users: PresenceUser[] }
  | { type: 'new message'; message: ChatMessage }
  | { type: 'user joined'; username: string; server_ts: number }
  | { type: 'user left'; username: string }
  | { type: 'typing'; username: string }
  | { type: 'stop typing'; username: string }

/** Parse an incoming WebSocket payload into a typed frame, or null if invalid. */
export function parseFrame<T extends { type: string }>(raw: unknown): T | null {
  if (typeof raw !== 'string') return null
  try {
    const obj = JSON.parse(raw)
    if (obj && typeof obj === 'object' && typeof obj.type === 'string') {
      return obj as T
    }
  } catch {
    /* malformed JSON — ignore */
  }
  return null
}
