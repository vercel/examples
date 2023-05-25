import { simpleRedirects } from '../../redirects'

export const dynamic = 'error'
export const dynamicParams = false

interface Params {
  slug: string[]
}

export function GET(_: Request, { params }: { params: Params }): Response {
  const sourceFromSlug = params.slug.join('/')
  const redirectInfo = simpleRedirects.find(
    (r) => normalizeSource(r.source) === sourceFromSlug
  )
  if (!redirectInfo) {
    throw new Error(`Unexpected redirect ${String(params.slug)}`)
  }
  const status = redirectInfo.statusCode ?? (redirectInfo.permanent ? 308 : 307)
  // Response.redirect does not support relative URLs–but browsers do.
  return new Response(null, {
    status,
    headers: { Location: redirectInfo.destination },
  })
}

export function generateStaticParams(): Params[] {
  const params = simpleRedirects.map((r) => {
    return {
      slug: normalizeSource(r.source).split('/'),
    }
  })
  return params
}

function normalizeSource(source: string): string {
  return (
    source
      .replace(/\\/g, '')
      .replace(/^\/+/, '')
      // Trailing slash syntax. Supported by default for the generated routes.
      .replace(/\{\/\}\?$/, '')
      .replace(/\/+/g, '/')
  )
}
