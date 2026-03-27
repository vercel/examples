import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const BACKEND_URL = process.env.BACKEND_URL
const STAGING_PROXY_IP = process.env.STAGING_PROXY_IP || '76.76.21.202'

export async function GET(request) {
  console.log('[direct-fastapi] request received', {
    url: request.url,
    referer: request.headers.get('referer'),
    origin: request.headers.get('origin'),
  })

  if (!BACKEND_URL) {
    console.error('[direct-fastapi] BACKEND_URL is not set')
    return NextResponse.json(
      { error: 'BACKEND_URL is not set' },
      { status: 500 }
    )
  }

  const targetUrl = `${BACKEND_URL}/status`
  const oidcToken = request.headers.get('x-vercel-oidc-token')

  console.log('[direct-fastapi] config', {
    targetUrl,
    hasOidcToken: oidcToken !== null,
    oidcTokenPrefix: oidcToken ? `${oidcToken.slice(0, 8)}...` : null,
  })

  const outboundHeaders = oidcToken
    ? { 'x-vercel-trusted-oidc-idp-token': oidcToken }
    : {}

  let fetchUrl = targetUrl
  if (STAGING_PROXY_IP) {
    const parsed = new URL(targetUrl)
    outboundHeaders['host'] = parsed.host
    parsed.hostname = STAGING_PROXY_IP
    fetchUrl = parsed.toString()
    // Disable TLS verification so the staging cert (issued to the hostname) is accepted
    // when connecting directly to the IP — equivalent to --ignore-certificate-errors
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  console.log('[direct-fastapi] fetching', {
    fetchUrl,
    outboundHeaders: Object.keys(outboundHeaders),
    viaProxy: !!STAGING_PROXY_IP,
  })

  let res
  try {
    res = await fetch(fetchUrl, { cache: 'no-store', headers: outboundHeaders })
  } catch (err) {
    console.error('[direct-fastapi] fetch failed', {
      targetUrl,
      error: err.message,
      stack: err.stack,
    })
    return NextResponse.json({ error: err.message }, { status: 502 })
  }

  const body = await res.text()

  if (res.ok) {
    console.log('[direct-fastapi] success', { status: res.status, targetUrl })
  } else {
    console.error('[direct-fastapi] upstream error', {
      status: res.status,
      statusText: res.statusText,
      targetUrl,
      body,
    })
  }

  return new NextResponse(body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
  })
}
