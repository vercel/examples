export default async function handler(request, response) {
  console.log(request)
  return new Response('Hello World!')
}

export const config = {
  runtime: 'experimental-edge',
}
