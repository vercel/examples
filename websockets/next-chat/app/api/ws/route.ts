import { experimental_upgradeWebSocket } from '@vercel/functions'
import type { WebSocket } from 'ws'
import { ChatHub } from '@/lib/chat'

export const dynamic = 'force-dynamic'

// A single hub per Node instance. Stashed on globalThis so Next dev's module
// re-evaluation (HMR) reuses it instead of leaking Redis clients / intervals.
const GLOBAL_KEY = Symbol.for('next-chat.hub')
const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: ChatHub }
// Reuse the existing hub across HMR re-evaluations, or create it once.
const hub = (g[GLOBAL_KEY] ??= new ChatHub())

export function GET() {
  return experimental_upgradeWebSocket((ws: WebSocket) => {
    hub.handleUpgrade(ws)
  })
}
