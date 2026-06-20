// Per-tab identity + nickname persistence.
//
// sessionStorage (not localStorage) keeps these scoped to the tab and clears
// when it closes: a refresh keeps the same clientId (so your own messages stay
// "yours"), while a new tab is a new identity — even with the same nickname.
// All access is guarded so it's safe to call before hydration / in private mode.

const STORAGE_KEY = 'vercel-chat:username'
const CLIENT_ID_KEY = 'vercel-chat:clientId'

function freshId(): string {
  return (
    crypto.randomUUID?.() ??
    `c-${Date.now()}-${Math.random().toString(16).slice(2)}`
  )
}

export function loadOrCreateClientId(): string {
  try {
    let id = sessionStorage.getItem(CLIENT_ID_KEY)
    if (!id) {
      id = freshId()
      sessionStorage.setItem(CLIENT_ID_KEY, id)
    }
    return id
  } catch {
    return freshId() // private mode: in-memory id for this page session
  }
}

export function loadName(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveName(name: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, name)
  } catch {
    /* storage unavailable (private mode) — just skip persistence */
  }
}
