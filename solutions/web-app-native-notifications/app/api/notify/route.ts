// POST /api/notify — put a message on a phone.
//
// The token comes from LAUTHER_TOKEN (set it in Vercel's environment variables)
// or, for the demo page, from the request body for that one call. It is
// forwarded to Lauther and never logged or stored.

const API = 'https://api.lauther.id'

export async function POST(req: Request) {
  const { token: bodyToken, title, message = '', url } = await req.json()
  const token = (bodyToken as string | undefined)?.trim() || process.env.LAUTHER_TOKEN
  if (!token) {
    return Response.json(
      { error: 'No token. Paste one from the Lauther app, or set LAUTHER_TOKEN.' },
      { status: 400 }
    )
  }
  if (!title) return Response.json({ error: 'title is required' }, { status: 400 })

  const res = await fetch(`${API}/v1/push`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, message, ...(url && { url }) }),
  })

  const out = await res.json().catch(() => ({}))
  return Response.json(out, { status: res.ok ? 200 : res.status })
}
