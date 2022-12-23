export const config = {
  runtime: 'edge',
}

// http://localhost:3000/api/edge?email=test@test.com

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  return new Response(email)
}
