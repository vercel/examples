import { NextResponse } from 'next/server'

export async function GET() {
  const results: Record<string, any> = {}

  // Test multiple endpoints
  const endpoints = [
    { name: 'google', url: 'https://www.google.com' },
    { name: 'vercel', url: 'https://vercel.com' },
    { name: 'api.vercel', url: 'https://api.vercel.com' },
    {
      name: 'gateway.ai.vercel',
      url: 'https://gateway.ai.vercel.com/v1/config',
    },
  ]

  for (const endpoint of endpoints) {
    try {
      const start = Date.now()
      const response = await fetch(endpoint.url, {
        signal: AbortSignal.timeout(5000),
      })
      results[endpoint.name] = {
        status: response.status,
        time: Date.now() - start,
        ok: true,
      }
    } catch (error: any) {
      results[endpoint.name] = {
        error: error.message,
        code: error.cause?.code,
        ok: false,
      }
    }
  }

  return NextResponse.json(results)
}
