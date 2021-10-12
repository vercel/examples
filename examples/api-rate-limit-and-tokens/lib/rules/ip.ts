import type { EdgeRequest, EdgeResponse } from 'next'
import { upstashRest } from '@lib/upstash'
import { IP_RULES } from './constants'
import getIP from '@lib/get-ip'

export async function blockedIp(req: EdgeRequest, res: EdgeResponse) {
  try {
    const { result } = await upstashRest(['HGET', IP_RULES, getIP(req)])

    if (!result) return false

    const data = JSON.parse(result)

    return data.action === 'block'
  } catch (err) {
    console.error('IP validation failed:', err)
    // If for some reason the upstash call fails
    // we should let requests continue
    return false
  }
}
