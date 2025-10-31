export function getUserId(): string {
  if (typeof window === 'undefined') return 'user_local'
  try {
    const KEY = 'nfca_user_id'
    const existing = window.localStorage.getItem(KEY)
    if (existing && existing.trim()) return existing
    const generated = `user_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 10)}`
    window.localStorage.setItem(KEY, generated)
    return generated
  } catch {
    return 'user_local'
  }
}

export function ensureGlobalUserId(): string {
  const id = getUserId()
  try {
    ;(window as unknown as { USER_ID?: string }).USER_ID = id
  } catch {
    // ignore
  }
  return id
}
