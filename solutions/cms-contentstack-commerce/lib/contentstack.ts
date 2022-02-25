import createFetch from '@vercel/fetch'
const fetch = createFetch()

const API_URL = `https://cdn.contentstack.io/v3`

if (
  !process.env.CONTENTSTACK_API_KEY ||
  !process.env.CONTENTSTACK_ACCESS_TOKEN
) {
  throw new Error(
    'CONTENTSTACK_API_KEY or CONTENTSTACK_ACCESS_TOKEN Environment variables are not correctly set. '
  )
}

const contentStack = {
  async getEntry(
    contentType = '',
    entryId = '',
    locale = 'en-US'
  ): Promise<Entry | null> {
    // https://www.contentstack.com/docs/developers/apis/content-delivery-api/#get-a-single-entry
    try {
      const cmsEnv = process.env.CONTENTSTACK_ENV ?? process.env.NODE_ENV
      const entryApiUrl = `${API_URL}/content_types/${contentType}/entries/${entryId}?locale=${locale.toLocaleLowerCase()}&environment=${cmsEnv}`
      const res: any = await fetch(entryApiUrl, {
        method: 'GET',
        headers: {
          api_key: process.env.CONTENTSTACK_API_KEY as string,
          access_token: process.env.CONTENTSTACK_ACCESS_TOKEN as string,
        },
      })

      const { entry } = await res.json()
      return entry
    } catch (err) {
      console.log('An Error occurred while trying to fetch an Entry: ', err)
      return null
    }
  },
}

export default contentStack
