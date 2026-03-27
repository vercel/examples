import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET() {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: 'BACKEND_URL is not set' },
      { status: 500 }
    )
  }

  let res
  try {
    res = await fetch(`${BACKEND_URL}/status`, { cache: 'no-store' })
  } catch (err) {
    console.error('[direct-fastapi] fetch failed', {
      url: BACKEND_URL,
      error: err.message,
    })
    return NextResponse.json({ error: err.message }, { status: 502 })
  }

  const body = await res.text()

  if (!res.ok) {
    console.error('[direct-fastapi] upstream error', {
      status: res.status,
      url: BACKEND_URL,
    })
  }

  return new NextResponse(body, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
