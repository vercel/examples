import { simpleRedirects } from '../../redirects'

export const dynamic = 'error'

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
  // Response.redirect does not support relative URLs but the `Location` header
  // can be used to indicate a redirect to the browser

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
      // removes all backslashes
      .replace(/\\/g, '')
      // removes all leading slashes
      .replace(/^\/+/, '')
      // Trailing slash syntax. Supported by default for the generated routes.
      .replace(/\{\/\}\?$/, '')
      // replaces all occurrences of one or more slashes with a single slash
      .replace(/\/+/g, '/')
  )
}
