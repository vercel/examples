import { NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  // Only log for visited pages
  if (req.page) {
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
