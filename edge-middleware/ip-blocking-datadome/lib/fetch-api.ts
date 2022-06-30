export default async function fetchAPI(path = '/', method = 'GET', body = {}) {
  const API = '/api'
  let err
  let ops: Record<string, any> = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    method,
  }

  if ((body && method === 'POST') || method === 'PATCH') {
    ops.body = JSON.stringify(body)
  }

  try {
    const res = await fetch(`${API}${path}`, ops)
    const data = await res.json()
    return data
  } catch (e: any) {
    if (e.message === 'cancelled') {
      // Cancelled by browser
      console.log('Request Cancelled by the Browser ', e)
      err = e
    } else {
      // Network error, CORS or timeout
      console.error('Network Error, CORS or timeout.')
      // err = isServer ? e : new Error(NETWORK_ERR_MESSAGE);
      // err.code = NETWORK_ERR_CODE;
      // err.status = e ? e.status : null;
    }
  }
}
