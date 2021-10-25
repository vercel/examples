import { NextResponse, NextFetchEvent } from 'next/server'

export function middleware(ev: NextFetchEvent) {
  const basicAuth = ev.request.headers.get('authorization')

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1]
    const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')

    if (user === '4dmin' && pwd === 'testpwd123') {
      return ev.respondWith(NextResponse.next())
    }
  }

  ev.respondWith(
    new Response('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  )
}
