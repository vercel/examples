export const config = {
  runtime: 'edge',
}

export default async (req: Request) => {
  // Fetch from the backend, but copy the user's authorization cookie into
  // the authorization header.
  const r = await fetch(
    'https://res.cloudinary.com/zeit-inc/image/fetch/https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/next.svg',
    {
      headers: {
        authorization: getCookies(req).get('authorization') || '',
      },
    }
  )
  return new Response(r.body, {
    status: r.status,
    headers: {
      // Allow list of backend headers.
      'content-type': r.headers.get('content-type') || '',
    },
  })
}

function getCookies(req: Request) {
  const cookie = req.headers.get('cookie')
  const cookies = new Map()
  if (!cookie) {
    return cookies
  }
  const pairs = cookie.split(/;\s+/)
  for (const pair of pairs) {
    const parts = pair.trim().split('=')
    cookies.set(parts[0], parts[1])
  }
  return cookies
}
