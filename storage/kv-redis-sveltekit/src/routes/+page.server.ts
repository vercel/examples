import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$env/static/private'
import { createClient } from '@vercel/kv'

/** @type {import('./$types').PageLoad} */
export async function load() {
  const kv = createClient({
    url: KV_REST_API_URL,
    token: KV_REST_API_TOKEN,
  })
  const pageVisits = await kv.get<number>('pageVisits')
  await kv.set('pageVisits', (pageVisits || 0) + 1)
  const updatedPageVisits = await kv.get('pageVisits')

  return {
    pageVisits: updatedPageVisits,
  }
}
