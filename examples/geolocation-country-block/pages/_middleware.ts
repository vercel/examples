import type { EdgeRequest, EdgeResponse, EdgeNext } from 'next'

// Block Austria, prefer Germany
const BLOCKED_COUNTRY = 'AT'

export default async function (
  req: EdgeRequest,
  res: EdgeResponse,
  next: EdgeNext
) {
  const country = req.geo.country || 'US'

  if (country === BLOCKED_COUNTRY) {
    res.writeHead(451)
    res.end('Blocked for legal reasons')
  } else {
    res.end(`Greetings from ${country}, where you are not blocked.`)
  }
}
