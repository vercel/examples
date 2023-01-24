import { NextApiRequest, NextApiResponse } from 'next'

import api from '../../../../api'

interface Request extends NextApiRequest {
  query: {
    id: string
  }
}

export default async function handler(req: Request, res: NextApiResponse) {
  // If req.method is "POST", add stock, remove it otherwise
  const hasStock = req.method === 'POST'

  // Add or remove stock
  await api.cache.set(req.query.id, hasStock)

  // Return response
  return res.status(200).json({ stock: hasStock })
}
