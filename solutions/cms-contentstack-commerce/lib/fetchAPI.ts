const API_URL = process.env.API_URL
  ? process.env.API_URL
  : 'https://api.contentstack.io/'

export default async function fetchAPI(
  pathname: string = '',
  options: RequestInit & { data?: any } = {}
) {
  try {
    const res = await fetch(`${API_URL}${pathname}`, {
      ...options,
      headers: {
        ...options.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      ...(options.data ? { body: JSON.stringify(options.data) } : {}),
    })
    const data = await res.json()
    return data
  } catch (e: any) {
    if (e.message === 'cancelled') {
      // Cancelled by browser
      console.log('Request Cancelled by the Browser', e)
    } else {
      console.error('Network Error, CORS or timeout.')
    }
  }
}
