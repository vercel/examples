import { kv } from '@vercel/kv'

/** @type {import('./$types').PageLoad} */
export async function load() {
  const pageVisits = await kv.get<number>('pageVisits')
  await kv.set('pageVisits', (pageVisits || 0) + 1)
  const updatedPageVisits = await kv.get('pageVisits')
  return {
    pageVisits: updatedPageVisits,
  }
}
