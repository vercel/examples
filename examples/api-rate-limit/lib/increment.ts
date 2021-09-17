import type { CountFunction } from './rate-limit'

export const increment: CountFunction = async (key, timeframe) => {
  const domain = process.env.UPSTASH_REST_API_DOMAIN
  const token = process.env.UPSTASH_REST_API_KEY

  if (!domain || !token) {
    throw new Error('Missing required Upstash credentials of the REST API')
  }

  const res = await fetch(`https://${domain}/pipeline`, {
    method: 'POST',
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, timeframe],
    ]),
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  const data = res.headers.get('Content-Type')!.includes('application/json')
    ? await res.json()
    : await res.text()

  if (res.ok) {
    return data[0].result
  } else {
    throw new Error(
      `INCR request to Upstash failed with (${res.status}): ${
        typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }`
    )
  }
}

export default increment
