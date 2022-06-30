const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    'The environment variables UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required.'
  )
}

export async function get(key: string = '') {
  const req = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${key}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  })

  const response: { result: string } = await req.json()
  return response.result === 'true'
}

export async function set(key: string = '', value: string = '') {
  const req = await fetch(`${UPSTASH_REDIS_REST_URL}/set/${key}/${value}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  })

  const response: { result: string } = await req.json()
  return response
}
