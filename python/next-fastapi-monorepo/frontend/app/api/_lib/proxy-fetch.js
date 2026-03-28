import https from 'node:https'

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
        servername: hostname,
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

export async function fetchWithOidc(targetUrl, request) {
  const oidcToken = request.headers.get('x-vercel-oidc-token')
  const incomingVercelId = request.headers.get('x-vercel-id')
  const isStaging = incomingVercelId?.includes('staging')
  const parsed = new URL(targetUrl)

  const outboundHeaders = oidcToken
    ? { 'x-vercel-trusted-oidc-idp-token': oidcToken }
    : {}

  if (isStaging) {
    return { res: await fetchViaProxy(targetUrl, parsed.hostname, outboundHeaders), isStaging }
  }

  const fetchRes = await fetch(targetUrl, { cache: 'no-store', headers: outboundHeaders })
  const body = await fetchRes.text()
  return {
    res: {
      status: fetchRes.status,
      statusMessage: fetchRes.statusText,
      headers: Object.fromEntries(fetchRes.headers),
      body,
    },
    isStaging,
  }
}
