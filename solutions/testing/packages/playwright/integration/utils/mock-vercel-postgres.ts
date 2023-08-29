export function isVercelPostgres(req: Request) {
  return req.url.endsWith('postgres.vercel-storage.com/sql')
}

export async function mockVercelPostgres(
  req: Request,
  mocks: Record<string, (req: Request) => any>
) {
  if (!isVercelPostgres(req)) return

  req.headers.forEach((v, k) => console.log('HEADER', k, v))

  const body: { query: string; params: string[] } = await req.json()
  const mock = mocks[body.query]

  if (!mock) {
    throw new Error(`No mock found for query: "${body.query}"`)
  }

  return mock(req)
}
