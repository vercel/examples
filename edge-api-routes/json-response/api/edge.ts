export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req) {
  return new Response(
    JSON.stringify({
      message: 'Hello, world!',
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
}
