import { set } from 'lib/feature-flags'

export const config = {
  runtime: 'edge',
}

export default async function OpenStore() {
  try {
    const result = await set('storeClosed', false)

    if (!result) {
      throw new Error(`Something went wrong when updating the Edge Config`)
    }

    return new Response(
      JSON.stringify({ status: 'ok', message: 'Store is now open' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: err instanceof Error ? err.message : err,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
