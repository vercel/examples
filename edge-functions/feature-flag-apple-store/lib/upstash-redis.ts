export async function get(key: string = '') {
  const req = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    },
  })

  const response: { result: string } = await req.json()
  return response.result === 'true'
}

export async function set(key: string = '', value: string = '') {
  const req = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/set/${key}/${value}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    }
  )

  const response: { result: string } = await req.json()
  return response
}
