import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export const config = {
  runtime: 'edge',
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

export default async function handler(req: NextRequest) {
  const image =
    req.nextUrl.searchParams.get('imageUrl') || 'https://dub.sh/confpic'

  const output = await replicate.run(
    'salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746',
    {
      input: {
        image,
      },
    }
  )
  return NextResponse.json(output)
}
