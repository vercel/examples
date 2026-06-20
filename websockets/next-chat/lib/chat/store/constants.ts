export const HISTORY_MAX = 50
export const HISTORY_TTL_SECONDS = 60 * 60 // self-expire after 1h of silence

export const STALE_MS = Number(process.env.PRESENCE_STALE_MS) || 20000
export const MAX_PRESENCE_NAMES = 8 // names shipped for the avatar stack
