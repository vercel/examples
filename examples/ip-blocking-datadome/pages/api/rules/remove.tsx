import type { NextApiRequest, NextApiResponse } from 'next'
import { removeRuleById } from '@lib/datadome-ip'

export default async function add(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed. This endpoint only responds to POST',
      },
    })
  }

  const rule_id = req.query.id

  if (!rule_id) {
    return res.status(405).json({
      error: {
        message: 'Incomplete request.',
      },
    })
  }

  try {
    await removeRuleById(rule_id as string)
    return res.status(200).json({
      message: 'Ok',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: {
        message: `An error ocurred, ${err}`,
      },
    })
  }
}
