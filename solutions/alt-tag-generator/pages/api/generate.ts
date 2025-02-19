import { NextApiRequest, NextApiResponse } from 'next'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const image = (req.query.imageUrl as string) || 'https://dub.sh/confpic'

  const output = await replicate.run(
    'salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746',
    {
      input: {
        image,
      },
    }
  )
  return res.json(output)
}
