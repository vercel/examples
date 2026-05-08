import { type NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'

// Delivery route for private blobs.
// Private blob URLs are not directly accessible in the browser.
// This route streams the blob content after authenticating the request.
// See: https://vercel.com/docs/vercel-blob/private-storage
export async function GET(request: NextRequest) {
  // ⚠️ Add your own authentication here.
  // For example: await authRequest(request)

  const pathname = request.nextUrl.searchParams.get('pathname')

  if (!pathname) {
    return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
  }

  const result = await get(pathname, { access: 'private' })

  if (result?.statusCode !== 200) {
    return new NextResponse('Not found', { status: 404 })
  }

  return new NextResponse(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType,
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
