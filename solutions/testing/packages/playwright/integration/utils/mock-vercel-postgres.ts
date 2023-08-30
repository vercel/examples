export function isVercelPostgres(req: Request) {
  return (
    req.url.endsWith('postgres.vercel-storage.com/sql') ||
    req.url.endsWith('localhost/sql')
  )
}

export async function mockVercelPostgres(
  req: Request,
  mocks: Record<string, (params: string[], query: string, req: Request) => any>
) {
  if (!isVercelPostgres(req)) return

  const body: { query: string; params: string[] } = await req.json()
  const mock = mocks[body.query]

  if (!mock) {
    throw new Error(`No mock found for query: "${body.query}"`)
  }

  const output = mock(body.params, body.query, req)
  if (output === null || output === undefined) {
    return output
  }
  if (output instanceof Response) {
    return output
  }
  if (typeof output === 'object') {
    return new Response(JSON.stringify(output), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  return output
}
