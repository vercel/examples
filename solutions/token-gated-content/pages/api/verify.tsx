import type { NextApiRequest, NextApiResponse } from 'next'
import { walletOwnsToken } from '../../contract/verifyToken'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      const { wallet } = JSON.parse(req.body)

      if (!wallet) {
        res.status(400).json({ error: 'Missing wallet' })
        return
      }

      const enoughTokens = await walletOwnsToken(wallet)

      return res.status(200).json({ enoughTokens })

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler
