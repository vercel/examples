import { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export default function middleware(req: NextRequest) {
  // Only log for visited pages
  if (!PUBLIC_FILE.test(req.nextUrl.pathname)) {
    // We just fire and forget this request as we don't want to block the request until completion
    fetch('https://in.logtail.com', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LOGTAIL_TOKEN}`
      },
      body: JSON.stringify({
        message: 'Log from the edge',
        nested: {
          page: req.nextUrl.href,
          referrer: req.referrer,
          ua: req.ua?.ua,
          geo: req.geo
        }
      })
    })
  }
}
