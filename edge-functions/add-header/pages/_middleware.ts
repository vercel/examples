import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // You can add and append headers in multiple ways,
  // below we'll explore some common patterns

  // 1. Add a header to the `Headers` interface
  // https://developer.mozilla.org/en-US/docs/Web/API/Headers
  const headers = new Headers({ 'x-custom-1': 'value-1' })
  headers.set('x-custom-2', 'value-2')

  // 2. Add existing headers to a new `Response`
  const res = new Response(null, { headers })

  // 3. Add a header to an existing response
  res.headers.set('x-custom-3', 'value-3')

  // 4. Merge existing headers with new ones in a response
  return new Response(
    'Open the network tab in devtools to see the response headers',
    {
      headers: {
        ...Object.fromEntries(res.headers),
        'x-custom-4': 'value-4',
      },
    }
  )
}
