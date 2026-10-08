import { NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth-server'
import { isPublishedImageKey } from '@/lib/db'
import { isRemoteUrl, isUserObjectKey } from '@/lib/images'
import { presignGet } from '@/lib/storage'

// Serves a stored image via a short-lived presigned URL.
// Published covers/author photos: allowed after a DB lookup (owner RLS only
// sees published posts). Drafts: allowed only if the JWT `sub` matches the
// `posts/<userId>/` prefix written at upload time. Unknown or remote keys 404.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')
  if (!key || isRemoteUrl(key) || key.includes('..') || key.startsWith('/')) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  const published = await isPublishedImageKey(key)
  if (!published) {
    const userId = await getUserIdFromRequest(request)
    if (!userId || !isUserObjectKey(key, userId))
      return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  const signed = await presignGet(key)
  if (url.searchParams.get('format') === 'json')
    return NextResponse.json({ url: signed })
  return NextResponse.redirect(signed, {
    status: 302,
    headers: { 'cache-control': 'private, max-age=1800' },
  })
}
