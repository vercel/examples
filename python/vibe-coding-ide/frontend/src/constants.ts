declare const process: { env: Record<string, string | undefined> }
const env = process.env

// Normalize API base: supports env with or without '/api' suffix.
// If absolute and path empty -> '<origin>/api'; otherwise preserve path; trims trailing slashes.
export const API_BASE = (() => {
  const raw = (
    env.NEXT_PUBLIC_API_URL ||
    env.NEXT_PUBLIC_API_BASE_URL ||
    ''
  ).trim()
  if (!raw) return '/api'
  try {
    const u = new URL(raw)
    const pathname = u.pathname.replace(/\/+$/, '')
    if (pathname === '' || pathname === '/') return `${u.origin}/api`
    return `${u.origin}${pathname}`
  } catch {
    const trimmed = raw.replace(/\/+$/, '')
    if (trimmed === '' || trimmed === '/') return '/api'
    if (/^\/api(\/|$)/.test(trimmed)) return trimmed
    return trimmed
  }
})()

// Prefer a direct SSE origin to avoid proxy buffering (e.g., Next rewrites can buffer SSE)
// If NEXT_PUBLIC_SSE_ORIGIN is not set, try to infer it from API_BASE when absolute;
// otherwise, in local dev fall back to the backend default port :8081.
export const SSE_ORIGIN = (() => {
  const explicit = (env.NEXT_PUBLIC_SSE_ORIGIN || '').trim()
  if (explicit) return explicit.replace(/\/?$/, '')
  const base = (
    env.NEXT_PUBLIC_API_URL ||
    env.NEXT_PUBLIC_API_BASE_URL ||
    ''
  ).trim()
  if (base) {
    try {
      const u = new URL(base)
      const trimmed = base.replace(/\/?$/, '')
      return trimmed.endsWith('/api') ? trimmed.slice(0, -4) : u.origin
    } catch {
      // ignore
    }
  }
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location
    // If running locally or via LAN/IP, prefer direct backend default port 8081
    const isLocalHost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.local')
    const isPrivateIp = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(
      hostname
    )
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
    if (isLocalHost || isPrivateIp || isIp) {
      return `${protocol}//${hostname}:8081`
    }
  }
  return ''
})()
