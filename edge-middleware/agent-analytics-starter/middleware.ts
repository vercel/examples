import { NextResponse, type NextRequest } from 'next/server'
import { trackDocView, posthogAnalytics } from '@apideck/agent-analytics'
import {
  markdownServeDecision,
  markdownHeaders,
  synthesizeMarkdownPointer,
} from '@apideck/agent-analytics/markdown'

const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'http://localhost:3000'

const analytics = posthogAnalytics({
  apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
})

// Map public URLs to pre-built Markdown files under /md/. Extend this as you
// add more content — any path not covered here gets a synthesized pointer
// document so the Accept: text/markdown contract holds site-wide.
function resolveMirrorPath(pathname: string): string | null {
  if (pathname.startsWith('/docs/')) return `/md${pathname}.md`
  return null
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/md/') || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  const decision = markdownServeDecision(req)

  if (decision) {
    // Track every Markdown fetch with the source label (ua-rewrite,
    // md-suffix, accept-header). Errors are swallowed — analytics can
    // never break the response.
    void trackDocView(req, {
      analytics,
      source: decision.reason,
      properties: { site: 'starter' },
    })

    const target = resolveMirrorPath(decision.strippedPath)
    if (target) {
      const url = req.nextUrl.clone()
      url.pathname = target
      const response = NextResponse.rewrite(url)
      for (const [k, v] of Object.entries(markdownHeaders())) {
        response.headers.set(k, v)
      }
      return response
    }

    // No mirror for this path — return a pointer document so agents get
    // something parseable instead of HTML or a 404.
    const body = synthesizeMarkdownPointer({
      origin: ORIGIN,
      pathname: decision.strippedPath,
      llmsTxtUrl: `${ORIGIN}/llms.txt`,
    })
    return new NextResponse(body, {
      status: 200,
      headers: markdownHeaders({ tokens: Math.ceil(body.length / 4) }),
    })
  }

  // Plain HTML response — nothing special to do.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/|md/|api/|favicon\\.ico|.*\\.(?:js|mjs|css|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|eot|map|json|xml)).*)',
  ],
}
