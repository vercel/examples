import { NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth-server'
import { putObject } from '@/lib/storage'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export async function POST(request: Request) {
  // Only signed-in users may upload. The client sends its Neon Auth JWT, which
  // we verify against the project's JWKS.
  const userId = await getUserIdFromRequest(request)
  if (!userId)
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File))
    return NextResponse.json({ error: 'no file' }, { status: 400 })
  const ext = EXT[file.type]
  if (!ext)
    return NextResponse.json(
      { error: 'unsupported image type' },
      { status: 400 }
    )
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: 'file too large' }, { status: 413 })
  // Namespaced by user id so keys never collide across tenants.
  const key = `posts/${userId}/${crypto.randomUUID()}.${ext}`
  await putObject(key, await file.arrayBuffer(), file.type)
  return NextResponse.json({ key })
}
