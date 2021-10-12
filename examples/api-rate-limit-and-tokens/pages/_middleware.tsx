import type { EdgeRequest, EdgeResponse } from 'next'
import { blockedIp } from '@lib/rules/ip'

export async function middleware(
  req: EdgeRequest,
  res: EdgeResponse,
  next: any
) {
  // Rewrite to /blocked if the IP is blocked
  if (req.url?.pathname === '/am-i-blocked') {
    if (await blockedIp(req, res)) {
      return res.rewrite('/blocked')
    }
  }

  // Trying to access the /blocked page manually is disallowed
  if (req.url?.pathname === '/blocked') {
    return res.redirect('/')
  }

  next()
}
