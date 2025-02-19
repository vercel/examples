import * as rawEnv from '$env/static/private'
import { createClient } from 'redis'

let client: Awaited<ReturnType<typeof createClient>> | null = null

const getClient = async () => {
  if (!client) {
    client = await createClient({
      url:
        (rawEnv as { REDIS_URL?: string }).REDIS_URL ??
        (rawEnv as { KV_URL?: string }).KV_URL,
    }).connect()
  }
  return client
}

/** @type {import('./$types').PageLoad} */
export async function load() {
  const kv = await getClient()
  const pageVisits = await kv.get('pageVisits')
  await kv.set('pageVisits', Number.parseInt(pageVisits ?? '0', 10) + 1)
  const updatedPageVisits = await kv.get('pageVisits')

  return {
    pageVisits: updatedPageVisits,
  }
}
