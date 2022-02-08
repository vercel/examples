import type { NextApiRequest, NextApiResponse } from 'next'
import nfts from '../../data/nfts.json'

export type NftMeta = {
  alt: string
  href: string
  imageSrc: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<NftMeta[]>
) {
  switch (req.method) {
    case 'GET': {
      const steps = 10

      const { page } = req.query
      if (!page) {
        res.status(200).json(nfts.slice(0, 10))
        return
      }

      const start = Number(page) === 0 ? 0 : Number(page) * steps
      const end = Number(page) === 1 ? steps - 1 : Number(page) * steps - 1

      res.status(200).json(nfts.slice(start, end))
    }
  }
}
