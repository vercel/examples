import { set } from 'lib/upstash-redis'

export const config = {
  runtime: 'experimental-edge',
}

export default async function CloseStore() {
  try {
    const { result } = await set('store-closed', 'true')

    if (result !== 'OK') {
      throw new Error(`Unexpected result from Upstash: ${result}`)
    }

    return new Response(
      JSON.stringify({ status: 'ok', message: 'Store is now closed' }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: err }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
