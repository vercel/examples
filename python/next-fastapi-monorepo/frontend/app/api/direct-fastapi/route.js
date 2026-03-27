import { NextResponse } from 'next/server'
import https from 'node:https'

export const dynamic = 'force-dynamic'

const BACKEND_URL = process.env.BACKEND_URL
const STAGING_PROXY_IP = process.env.STAGING_PROXY_IP || '76.76.21.202'

function fetchViaProxy(url, hostname, headers) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const req = https.request(
      {
        hostname: STAGING_PROXY_IP,
        port: 443,
        path: parsed.pathname + parsed.search,
        method: 'GET',
        headers: { ...headers, host: hostname },
        rejectUnauthorized: false,
        servername: hostname, // SNI — tells Vercel's edge which deployment to route to
      },
      (res) => {
        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            body: Buffer.concat(chunks).toString(),
          })
        )
      }
    )
    req.on('error', reject)
    req.end()
  })
}

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
  const parsed = new URL(targetUrl)

  console.log('[direct-fastapi] config', {
    targetUrl,
    hostname: parsed.hostname,
    stagingProxyIp: STAGING_PROXY_IP,
    hasOidcToken: oidcToken !== null,
    oidcTokenPrefix: oidcToken ? `${oidcToken.slice(0, 8)}...` : null,
  })

  const outboundHeaders = oidcToken
    ? { 'x-vercel-trusted-oidc-idp-token': oidcToken }
    : {}

  console.log('[direct-fastapi] fetching via proxy', {
    proxyIp: STAGING_PROXY_IP,
    sni: parsed.hostname,
    path: parsed.pathname,
    outboundHeaders: Object.keys(outboundHeaders),
  })

  let res
  try {
    res = await fetchViaProxy(targetUrl, parsed.hostname, outboundHeaders)
  } catch (err) {
    console.error('[direct-fastapi] fetch failed', {
      targetUrl,
      error: err.message,
      stack: err.stack,
    })
    return NextResponse.json({ error: err.message }, { status: 502 })
  }

  const xVercelId = res.headers['x-vercel-id']
  if (res.status >= 200 && res.status < 300) {
    console.log('[direct-fastapi] success', { status: res.status, targetUrl, xVercelId })
  } else {
    console.error('[direct-fastapi] upstream error', {
      status: res.status,
      statusMessage: res.statusMessage,
      targetUrl,
      xVercelId,
      body: res.body,
    })
  }

  return new NextResponse(res.body, {
    status: res.status,
    headers: { 'Content-Type': res.headers['content-type'] || 'application/json' },
  })
}
