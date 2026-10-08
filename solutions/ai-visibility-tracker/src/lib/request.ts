import 'server-only'
import { headers } from 'next/headers'

/** Origin of the current request, e.g. https://tracker.example.com or http://localhost:3000. */
export async function currentOrigin(): Promise<string | null> {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  if (!host) return null
  const proto =
    h.get('x-forwarded-proto') ??
    (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https')
  return `${proto}://${host}`
}
