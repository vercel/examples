import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Readable } from 'node:stream'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(readable: Readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const rawBody = buf.toString('utf8')

    res.json({ rawBody })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
