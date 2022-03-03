import { NextRequest } from 'next/server'

// Regex for public files
const PUBLIC_FILE = /\.(.*)$/

export default function middleware(req: NextRequest) {
  // Only log for visited pages
  if (!PUBLIC_FILE.test(req.nextUrl.pathname)) {
    // We fire and forget this request to avoid blocking the request until completion
    // and let logging occur in the background
    fetch('https://in.logtail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LOGTAIL_TOKEN}`,
      },
      body: JSON.stringify({
        message: 'Log from the edge',
        nested: {
          page: req.nextUrl.href,
          referrer: req.referrer,
          ua: req.ua?.ua,
          geo: req.geo,
        },
      }),
    })
  }
}
