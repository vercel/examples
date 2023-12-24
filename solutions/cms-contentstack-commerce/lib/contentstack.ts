import type { Entry } from './types'

const API_URL = `https://cdn.contentstack.io/v3`
const API_KEY = process.env.CONTENTSTACK_API_KEY
const ACCESS_TOKEN = process.env.CONTENTSTACK_ACCESS_TOKEN
const ENV = process.env.CONTENTSTACK_ENV ?? process.env.NODE_ENV

type EntryQuery = {
  entryId: string
  contentType: string
  locale?: string
}

export async function getEntry(
  query: EntryQuery,
  fetchOptions?: RequestInit
): Promise<Entry | undefined> {
  if (!API_KEY || !ACCESS_TOKEN) {
    throw new Error(
      'The CONTENTSTACK_API_KEY or CONTENTSTACK_ACCESS_TOKEN environment variables are not set.'
    )
  }

  // https://www.contentstack.com/docs/developers/apis/content-delivery-api/#get-a-single-entry
  try {
    const { contentType, entryId, locale = 'en-US' } = query
    const entryApiUrl = `${API_URL}/content_types/${contentType}/entries/${entryId}?locale=${locale.toLocaleLowerCase()}&environment=${ENV}`
    const res: any = await fetch(entryApiUrl, {
      method: 'GET',
      ...fetchOptions,
      headers: {
        api_key: API_KEY,
        access_token: ACCESS_TOKEN,
        ...fetchOptions?.headers,
      },
    })
    const { entry } = await res.json()
    return entry
  } catch (err) {
    console.error('An Error occurred while trying to fetch an Entry:', err)
    throw err
  }
}
