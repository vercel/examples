import type { VercelConfig } from '@vercel/config/v1'
import { writeFileSync } from 'fs'

type VercelRedirect = {
  source: string
  destination: string
  permanent?: boolean
  statusCode?: number
  caseSensitive?: boolean
  query?: boolean
}

type ContentfulEntry = {
  fields: Record<string, any>
}

type ContentfulResponse = {
  items?: ContentfulEntry[]
}

const fallbackRedirects: VercelRedirect[] = [
  { source: '/catalog/fall', destination: '/catalog/fall-2025', statusCode: 302 },
  { source: '/catalog/winter', destination: '/catalog/winter-2025', permanent: true },
  { source: '/catalog/latest', destination: '/catalog/spring-2026', permanent: true },
  { source: '/products/daybreak-pack', destination: '/catalog/limited-edition', statusCode: 302, query: true },
  { source: '/catalog/outlet', destination: '/catalog/archive', statusCode: 308, caseSensitive: false },
]

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`)

async function fetchContentfulRedirects(): Promise<VercelRedirect[] | null> {
  console.log('fetching contentful redirects')
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  if (!spaceId || !accessToken) {
    console.warn('⚠️  Skipping Contentful sync: set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN to pull CMS redirects')
    return null
  }

  const url = new URL(`https://cdn.contentful.com/spaces/${spaceId}/entries`)
  url.searchParams.set('content_type', 'redirect')
  url.searchParams.set('access_token', accessToken)
  url.searchParams.set('limit', '1000')

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Contentful API error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as ContentfulResponse
  const entries = data.items ?? []

  if (entries.length === 0) {
    console.info('ℹ️  No redirects returned by Contentful')
    return []
  }

  return entries.map((entry) => {
    const fields = entry.fields
    const redirect: VercelRedirect = {
      source: normalizePath(fields.source),
      destination: normalizePath(fields.destination),
    }

    if (fields.statusCode !== undefined) redirect.statusCode = Number(fields.statusCode)
    if (fields.permanent !== undefined) redirect.permanent = Boolean(fields.permanent)
    if (fields.caseSensitive !== undefined) redirect.caseSensitive = Boolean(fields.caseSensitive)
    if (fields.preserveQuery !== undefined) redirect.query = Boolean(fields.preserveQuery)

    return redirect
  })
}

const redirectsFromContentful = await fetchContentfulRedirects()
const redirectsToWrite =
  redirectsFromContentful === null
    ? fallbackRedirects
    : redirectsFromContentful.length > 0
      ? redirectsFromContentful
      : fallbackRedirects

writeFileSync(new URL('./generated-redirects.json', import.meta.url), JSON.stringify(redirectsToWrite, null, 2))
console.log(`✓ Bulk redirects ready (${redirectsToWrite.length} rules)`)

export const config: VercelConfig = {
  framework: 'nextjs',
  outputDirectory: '.next',
  bulkRedirectsPath: './generated-redirects.json',
}
