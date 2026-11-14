import { experimental_upgradeWebSocket } from '@vercel/functions'
import type { WebSocket } from 'ws'
import { ChatHub } from '@/lib/chat'

const hub = new ChatHub()

export function GET() {
  return experimental_upgradeWebSocket((ws: WebSocket) => {
    hub.handleUpgrade(ws)
  })
}
