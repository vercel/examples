import createFetch from '@vercel/fetch'

const fetch = createFetch()

export default function initContentful(accessToken) {
  return async function contentful(path, fetchOptions) {
    let res

    try {
      res = await fetch(`https://api.contentful.com${path}`, {
        ...fetchOptions,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...fetchOptions?.headers,
        },
      })
    } catch (err) {
      console.error(
        'There was a network error trying to fetch from Contentful:',
        err
      )
    }

    const body = await res.json()

    if (res.status === 404) return null
    if (res.status !== 200 && res.status !== 201) {
      const error = new Error(
        `Contentful returned a ${
          res.status
        } status code for \`${path}\` with:\n${JSON.stringify(body, null, 2)}`
      )
      error.status = res.status
      throw error
    }

    return body
  }
}
