// Pure state machine for the chat client. Everything the user sees — the
// message/log list, who's typing, the presence count — is derived by folding
// incoming server frames (plus the local optimistic send) into this state.
//
// Keeping it a pure reducer means useChatSocket just pipes frames in via
// dispatch, and the logic is testable without React or a socket.

import type { ChatMessage, PresenceUser, ServerFrame } from '@/lib/protocol'

export interface Presence {
  count: number
  users: PresenceUser[]
}

/** Messages and system log lines share one ordered list. */
export type ChatItem =
  | { kind: 'message'; msg: ChatMessage }
  | { kind: 'log'; id: string; text: string }

export interface ChatState {
  items: ChatItem[]
  typingUsers: string[]
  presence: Presence | null
  /** Apply the backlog once; on a later reconnect we keep the current view. */
  historyLoaded: boolean
  /** Monotonic counter for locally-generated ids (log lines, optimistic msgs). */
  seq: number
}

export const INITIAL_CHAT_STATE: ChatState = {
  items: [],
  typingUsers: [],
  presence: null,
  historyLoaded: false,
  seq: 0,
}

export type ChatAction =
  | { kind: 'frame'; frame: ServerFrame }
  | { kind: 'optimistic'; msg: Omit<ChatMessage, 'id'> }

function addLog(state: ChatState, text: string): ChatState {
  return {
    ...state,
    items: [...state.items, { kind: 'log', id: `log-${state.seq}`, text }],
    seq: state.seq + 1,
  }
}

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  if (action.kind === 'optimistic') {
    // clientId === ours → rendered as "You". The server excludes the sender
    // from its broadcast, so there's no echoed duplicate to dedupe.
    const msg: ChatMessage = { ...action.msg, id: `local-${state.seq}` }
    return {
      ...state,
      items: [...state.items, { kind: 'message', msg }],
      seq: state.seq + 1,
    }
  }

  const f = action.frame
  switch (f.type) {
    case 'login':
      // Identity is already known client-side; nothing to do.
      return state
    case 'history': {
      if (state.historyLoaded) return state
      if (!f.messages?.length) {
        return addLog({ ...state, historyLoaded: true }, 'Welcome to the chat!')
      }
      return {
        ...state,
        historyLoaded: true,
        items: [
          ...state.items,
          ...f.messages.map((msg) => ({ kind: 'message' as const, msg })),
        ],
      }
    }
    case 'presence':
      return { ...state, presence: { count: f.count, users: f.users ?? [] } }
    case 'new message':
      return {
        ...state,
        items: [...state.items, { kind: 'message', msg: f.message }],
      }
    case 'user joined':
      return addLog(state, `${f.username} joined`)
    case 'user left':
      return {
        ...addLog(state, `${f.username} left`),
        typingUsers: state.typingUsers.filter((n) => n !== f.username),
      }
    case 'typing':
      return state.typingUsers.includes(f.username)
        ? state
        : { ...state, typingUsers: [...state.typingUsers, f.username] }
    case 'stop typing':
      return {
        ...state,
        typingUsers: state.typingUsers.filter((n) => n !== f.username),
      }
    default:
      // parseFrame trusts the wire `type`, so guard against unknown frames.
      return state
  }
}
