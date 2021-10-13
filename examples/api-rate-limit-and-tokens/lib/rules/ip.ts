import type { NextFetchEvent } from 'next/server'
import { upstashRest } from '@lib/upstash'
import getIP from '@lib/get-ip'
import { IP_RULES } from './constants'

export async function blockedIp(event: NextFetchEvent) {
  try {
    const { result } = await upstashRest([
      'HGET',
      IP_RULES,
      getIP(event.request),
    ])

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
