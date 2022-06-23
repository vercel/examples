export default async function handler(request) {
  console.log(request.query)
  return new Response('Hello World!')
}

export const config = {
  runtime: 'experimental-edge',
}
