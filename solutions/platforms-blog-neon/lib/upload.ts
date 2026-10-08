import { getAccessToken } from '@/lib/neon'

export async function uploadImage(image: File): Promise<string> {
  const token = await getAccessToken()
  const body = new FormData()
  body.set('file', image)
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: token ? { authorization: `Bearer ${token}` } : {},
    body,
  })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error ?? 'upload failed')
  }
  const { key } = await res.json()
  return key as string
}
