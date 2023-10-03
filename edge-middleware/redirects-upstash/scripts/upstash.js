const { join } = require('path')
const { writeFile } = require('fs/promises')
const prettier = require('prettier')

async function upstash(args) {
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

  const res = await fetch(`https://${domain}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(args),
  })

  const data = res.headers.get('Content-Type').includes('application/json')
    ? await res.json()
    : await res.text()

  if (!res.ok) {
    throw new Error(
      `Upstash failed with (${res.status}): ${
        typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }`
    )
  }

  return data
}

async function setupUpstash() {
  const redirects = Array.from({ length: 10000 }, (x, i) => ({
    source: `/${i + 1}`,
    destination: `/posts/${i + 1}`,
    permanent: false,
  }))

  // We'll hardcode 1000 of the 10000 redirects, setting up redirects at build-time
  // is a very good strategy to avoid a trip to redis at the edge
  const hardcodedRedirects = redirects
    .slice(0, 1000)
    .reduce((obj, { source, destination, permanent }) => {
      obj[source] = { destination, permanent }
      return obj
    }, {})
  const filePath = join(process.cwd(), 'lib/redirects.json')
  const content = prettier.format(JSON.stringify(hardcodedRedirects), {
    parser: 'json',
  })

  await writeFile(filePath, content)

  if (!process.env.POPULATE_REDIS) {
    console.log('Skipping redis population of redirects')
    return
  }

  // Redis population is something that wouldn't happen on a test script, consider
  // the code below a development step
  try {
    const args = redirects
      .slice(1000)
      .reduce((carry, { source, destination, permanent }) => {
        // We encode the source because the Edge API sends the key in the URL
        // and it has to be encoded
        carry.push(
          encodeURIComponent(source),
          JSON.stringify({ destination, permanent })
        )
        return carry
      }, [])
    const { result } = await upstash([
      'HGET',
      'redirects',
      encodeURIComponent('/10000'),
    ])

    if (!result) {
      console.log(`Adding ${args.length / 2} records to your Redis database`)
      await upstash(['HSET', 'redirects', ...args])
    }
  } catch (error) {
    console.error('Upstash build step failed')
    throw error
  }
}

function withUpstash(nextConfig = {}) {
  const { rewrites } = nextConfig

  nextConfig.rewrites = async (...args) => {
    await setupUpstash()
    return rewrites?.(...args) ?? {}
  }

  return nextConfig
}

module.exports = { withUpstash, setupUpstash }
