/**
 * Upstash REST and Edge API utils.
 * Note: We use this lib in multiple demos, feel free to
 * use it in your own projects.
 */
async function upstash({
  url,
  token,
  ...init
}: { url: string; token: string } & RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      ...init.headers,
    },
  })

  const data = res.headers.get('Content-Type')!.includes('application/json')
    ? await res.json()
    : await res.text()

  if (res.ok) {
    return data
  } else {
    throw new Error(
      `Upstash failed with (${res.status}): ${
        typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }`
    )
  }
}

export async function upstashRest(
  args: any[],
  options?: { pipeline: boolean }
) {
  const domain = process.env.UPSTASH_REST_API_DOMAIN
  const token = process.env.UPSTASH_REST_API_TOKEN

  if (!domain || !token) {
    throw new Error('Missing required Upstash credentials of the REST API')
  }

  if (domain.includes('http')) {
    throw new Error(
      "UPSTASH_REST_API_DOMAIN shouldn't include protocol (e.g: your-domain.upstash.io)"
    )
  }

  return upstash({
    token,
    url: `https://${domain}${options?.pipeline ? '/pipeline' : ''}`,
    method: 'POST',
    body: JSON.stringify(args),
  })
}
