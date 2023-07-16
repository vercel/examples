import fetch, { type RequestInit } from 'node-fetch'

export default function initContentful(accessToken: string) {
  return async function contentful(path: string, fetchOptions?: RequestInit) {
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
        'There was a network error trying to fetch from Contentful:'
      )
      throw err
    }

    const body = await res.json()

    if (res.status === 404) return null
    if (res.status !== 200 && res.status !== 201) {
      throw new ContentfulError(
        `Contentful returned a ${
          res.status
        } status code for \`${path}\` with:\n${JSON.stringify(body, null, 2)}`,
        res.status
      )
    }

    return body
  }
}

class ContentfulError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
