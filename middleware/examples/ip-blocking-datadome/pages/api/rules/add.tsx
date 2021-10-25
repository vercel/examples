import type { NextApiRequest, NextApiResponse } from 'next'
import { addIpRule } from '@lib/datadome-ip'

export default async function add(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed. This endpoint only responds to POST',
      },
    })
  }

  const ip = req.body.ip?.trim()
  const rule_response = req.body.rule_response?.trim()

  if (!ip || !rule_response) {
    return res.status(405).json({
      error: {
        message: 'Incomplete request.',
      },
    })
  }

  try {
    const response = await addIpRule(ip, rule_response)
    return res.status(200).json({
      message: `Ok. Rule added. ${JSON.stringify(response)}`,
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
