import type { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { verifyAuth } from '@lib/auth'
import { jsonResponse } from '@lib/utils'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (url.searchParams.has('edge')) {
    const resOrPayload = await verifyAuth(req)

    return resOrPayload instanceof Response
      ? resOrPayload
      : jsonResponse(200, { nanoid: nanoid(), jwtID: resOrPayload.jti })
  }
}
