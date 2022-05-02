import { NextApiRequest, NextApiResponse } from 'next'
import { readdir } from 'fs/promises'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    console.log(req.query, process.env.MY_SECRET_TOKEN)
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // get all the paths we want to revalidate
    const dir = process.cwd() + '/pages/joke'
    // we will get the paths of all the files in the directory
    const files = await readdir(dir)
    // remove the extension from the file name
    const paths = files.map((file) => '/joke/' + file.replace('.tsx', ''))

    // revalidate all the paths. Be careful about how many pages you revalidate.
    // Revalidating too many pages can cause a timeout or hit the concurrent limit.
    await Promise.all(paths.map(res.unstable_revalidate))
    // return a success message
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
