import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$env/static/private'
import { Redis } from '@upstash/redis'

/** @type {import('./$types').PageLoad} */
export async function load() {
  const kv = new Redis({
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
