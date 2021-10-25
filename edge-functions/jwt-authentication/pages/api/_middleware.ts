import type { NextFetchEvent } from 'next/server'
import { nanoid } from 'nanoid'
import { verifyAuth } from '@lib/auth'
import { jsonResponse } from '@lib/utils'

export function middleware(event: NextFetchEvent) {
  const url = event.request.nextUrl

  if (url.searchParams.has('edge')) {
    event.respondWith(handler(event))
  }
}

async function handler(event: NextFetchEvent) {
  const resOrPayload = await verifyAuth(event.request)

  return resOrPayload instanceof Response
    ? resOrPayload
    : jsonResponse(200, { nanoid: nanoid(), jwtID: resOrPayload.jti })
}
