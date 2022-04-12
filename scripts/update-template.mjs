import path from 'path'
import dotenv from 'dotenv'
import updateTemplate from './lib/contentful/update-template.mjs'

// Add the contentful API from `.env.local` to env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const examplePath = process.argv[2]

updateTemplate({
  lang: 'en-US',
  examplePath,
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
