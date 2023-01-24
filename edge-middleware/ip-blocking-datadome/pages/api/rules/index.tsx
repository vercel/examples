import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllRules } from '@lib/datadome-ip'

export default async function rules(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed. This endpoint only responds to GET',
      },
    })
  }

  try {
    const rules = await getAllRules()
    return res.status(200).json(rules)
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: {
        message: `An error ocurred, ${err}`,
      },
    })
  }
}
