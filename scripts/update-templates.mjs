import path from 'path'
import fs from 'fs/promises'
import dotenv from 'dotenv'
import log from './lib/log.mjs'
import updateTemplate from './lib/contentful/update-template.mjs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const DIRS = ['edge-functions', 'solutions']

async function updateTemplates() {
  const promises = DIRS.map(async (dirPath) => {
    log(`Updating all templates in ${dirPath}...`)

    const files = await fs.readdir(dirPath)

    await Promise.all(
      files.map(async (fileName) => {
        const examplePath = path.join(dirPath, fileName)
        const isDir = (await fs.lstat(examplePath)).isDirectory()

        if (!isDir) return

        console.log('DUD', examplePath)

        return updateTemplate({ lang: 'en-US', examplePath })
      })
    )
  })

  return Promise.all(promises)
}

updateTemplates().catch((err) => {
  console.error(err)
  process.exit(1)
})
