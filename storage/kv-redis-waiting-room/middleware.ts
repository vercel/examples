import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME_ID = '__waiting_room_id'
const COOKIE_NAME_TIME = '__waiting_room_last_update_time'
const TOTAL_ACTIVE_USERS = 10
const SESSION_DURATION_SECONDS = 30

export const config = {
  matcher: ['/'],
}

export default async function middleware(request: NextRequest) {
  const userId =
    request.cookies.get(COOKIE_NAME_ID)?.value ?? crypto.randomUUID()
  const size = await kv.dbsize()

  if (size < TOTAL_ACTIVE_USERS || (await kv.get(userId)) === '1') {
    return handleActiveUser(request, userId)
  } else {
    return NextResponse.rewrite(new URL('/waiting-room', request.url))
  }
}

async function handleActiveUser(request: NextRequest, userId: string) {
  const response = new NextResponse()
  const cookies = request.cookies
  const now = Date.now()
  const lastUpdate = cookies.get(COOKIE_NAME_TIME)?.value
  let lastUpdateTime = 0

  if (lastUpdate) lastUpdateTime = parseInt(lastUpdate)
  const diff = now - lastUpdateTime
  const updateInterval = (SESSION_DURATION_SECONDS * 1000) / 2

  if (diff > updateInterval) {
    await kv.setex(userId, SESSION_DURATION_SECONDS, '1')
    response.cookies.set(COOKIE_NAME_TIME, now.toString())
  }

  response.cookies.set(COOKIE_NAME_ID, userId)
  return
}
