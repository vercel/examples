import { NextResponse } from 'next/server'
import { fetchWithOidc } from '../_lib/proxy-fetch.js'

export const dynamic = 'force-dynamic'

const TARGET_URL =
  'https://fastapi-python-boilerplate-git-kitf-e699b4-kit-fosters-projects.vercel.app/api/data'

export async function GET(request) {
  console.log('[cross-project] request received', {
    url: request.url,
    incomingVercelId: request.headers.get('x-vercel-id'),
    hasOidcToken: request.headers.get('x-vercel-oidc-token') !== null,
  })

  let res, isStaging
  try {
    ;({ res, isStaging } = await fetchWithOidc(TARGET_URL, request))
  } catch (err) {
    console.error('[cross-project] fetch failed', { error: err.message })
    return NextResponse.json({ error: err.message }, { status: 502 })
  }

  const xVercelId = res.headers['x-vercel-id']
  if (res.status >= 200 && res.status < 300) {
    console.log('[cross-project] success', { status: res.status, xVercelId, isStaging })
  } else {
    console.error('[cross-project] upstream error', {
      status: res.status,
      xVercelId,
      isStaging,
      body: res.body,
    })
  }

  return new NextResponse(res.body, {
    status: res.status,
    headers: { 'Content-Type': res.headers['content-type'] || 'application/json' },
  })
}
