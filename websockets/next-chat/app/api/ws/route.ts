import { upgradeWebSocket } from '@vercel/functions'
import type { WebSocket } from 'ws'
import { ChatHub } from '@/lib/chat'

const hub = new ChatHub()

export function GET() {
  return upgradeWebSocket((ws: WebSocket) => {
    hub.handleUpgrade(ws)
  })
}
