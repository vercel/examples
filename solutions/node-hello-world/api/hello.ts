import type { VercelResponse } from '@vercel/node'

export default async function (res: VercelResponse) {
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}
