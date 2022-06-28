import type { NextApiRequest, NextApiResponse } from 'next'
import { removeRuleById } from '@lib/datadome-ip'
import { BLOCKUA_RULE } from '@lib/constants'

export default async function remove(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed. This endpoint only responds to POST',
      },
    })
  }

  const ruleId = req.query.id

  // The request is invalid if there's no rule to remove of if it's trying
  // to remove the BLOCKUA rule.
  if (!ruleId || ruleId === BLOCKUA_RULE) {
    return res.status(400).json({
      error: { message: 'Invalid request' },
    })
  }

  try {
    await removeRuleById(ruleId as string)
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
